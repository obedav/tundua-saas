<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Tundua\RateLimit\FileRateLimitStorage;
use Tundua\RateLimit\RateLimitStorageInterface;
use Tundua\RateLimit\RedisRateLimitStorage;

/**
 * Rate Limiting Middleware
 *
 * Prevents brute force attacks and API abuse by limiting requests per IP/user.
 *
 * Features:
 * - Configurable limits per endpoint
 * - IP-based and user-based rate limiting
 * - Redis as primary storage with file-based fallback (strategy pattern)
 * - Auto-detects Redis availability via REDIS_HOST env var + extension check
 * - Custom limit headers in response
 */
class RateLimitMiddleware
{
    private RateLimitStorageInterface $storage;
    private int $defaultMaxRequests;
    private int $defaultWindowMinutes;
    private array $endpointLimits;

    public function __construct()
    {
        $this->defaultMaxRequests = (int)($_ENV['RATE_LIMIT_MAX_REQUESTS'] ?? 100);
        $this->defaultWindowMinutes = (int)($_ENV['RATE_LIMIT_WINDOW_MINUTES'] ?? 15);

        // Custom limits per endpoint (stricter for auth to prevent brute-force)
        $this->endpointLimits = [
            '/api/auth/login' => ['max' => 5, 'window' => 15],
            '/api/auth/register' => ['max' => 3, 'window' => 60],
            '/api/auth/forgot-password' => ['max' => 3, 'window' => 60],
            '/api/auth/reset-password' => ['max' => 3, 'window' => 60],
            '/api/auth/verify-email' => ['max' => 10, 'window' => 15],
            '/api/auth/resend-verification' => ['max' => 3, 'window' => 60],
            '/api/documents/upload' => ['max' => 20, 'window' => 60],
            '/api/refunds' => ['max' => 5, 'window' => 60],
            '/api/payments/paystack/initialize' => ['max' => 10, 'window' => 15],
            // Public lead form — protect against form-spam bots while staying
            // generous enough for a real user who retries once or twice.
            '/api/v1/leads' => ['max' => 5, 'window' => 15],
        ];

        // Auto-detect storage backend
        $this->storage = $this->createStorage();
    }

    /**
     * Process rate limiting
     */
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        // Check if rate limiting is enabled
        if (!$this->isEnabled()) {
            return $handler->handle($request);
        }

        $identifier = $this->getIdentifier($request);
        $endpoint = $this->getEndpoint($request);

        // Get limits for this endpoint
        $limits = $this->getLimitsForEndpoint($endpoint);
        $maxRequests = $limits['max'];
        $windowMinutes = $limits['window'];
        $windowSeconds = $windowMinutes * 60;

        // Build a storage key: identifier:endpoint_hash
        $key = $this->buildStorageKey($identifier, $endpoint);

        // Check current state
        $state = $this->storage->get($key, $windowSeconds);

        $current = $state['count'];
        $remaining = max(0, $maxRequests - $current);
        $exceeded = $current >= $maxRequests;

        $rateLimitData = [
            'exceeded' => $exceeded,
            'current' => $current,
            'limit' => $maxRequests,
            'remaining' => $remaining,
            'reset' => $state['reset'],
        ];

        // If rate limit exceeded, return 429
        if ($exceeded) {
            return $this->rateLimitExceededResponse($rateLimitData);
        }

        // Record this request (atomic increment)
        $updated = $this->storage->hit($key, $windowSeconds);

        // Refresh data after the hit
        $rateLimitData['current'] = $updated['count'];
        $rateLimitData['remaining'] = max(0, $maxRequests - $updated['count']);
        $rateLimitData['reset'] = $updated['reset'];

        // Continue with request and add rate limit headers
        $response = $handler->handle($request);

        return $this->addRateLimitHeaders($response, $rateLimitData);
    }

    // ------------------------------------------------------------------
    //  Storage factory
    // ------------------------------------------------------------------

    /**
     * Create the appropriate storage backend.
     *
     * Redis is preferred when:
     *   1. The REDIS_HOST env var is set, AND
     *   2. The PHP redis extension is loaded.
     *
     * Falls back to file-based storage otherwise.
     */
    private function createStorage(): RateLimitStorageInterface
    {
        $redisHost = $_ENV['REDIS_HOST'] ?? null;

        if ($redisHost && extension_loaded('redis')) {
            try {
                $port = (int)($_ENV['REDIS_PORT'] ?? 6379);
                $password = $_ENV['REDIS_PASSWORD'] ?? null;
                $prefix = $_ENV['REDIS_PREFIX'] ?? 'tundua:';

                return new RedisRateLimitStorage($redisHost, $port, $password, $prefix);
            } catch (\Exception $e) {
                // Redis connection failed — fall through to file storage
                error_log('[RateLimitMiddleware] Redis unavailable, falling back to file storage: ' . $e->getMessage());
            }
        }

        $storageDir = __DIR__ . '/../../storage/rate_limits';

        return new FileRateLimitStorage($storageDir);
    }

    // ------------------------------------------------------------------
    //  Configuration helpers
    // ------------------------------------------------------------------

    /**
     * Check if rate limiting is enabled
     */
    private function isEnabled(): bool
    {
        return filter_var($_ENV['RATE_LIMIT_ENABLED'] ?? true, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Get unique identifier for rate limiting (IP or user ID)
     */
    private function getIdentifier(Request $request): string
    {
        // Try to get user ID from request (if authenticated)
        $userId = $request->getAttribute('user_id');

        if ($userId) {
            return "user_{$userId}";
        }

        // Fall back to IP address
        $serverParams = $request->getServerParams();
        $ip = $serverParams['REMOTE_ADDR'] ?? 'unknown';

        // Check for proxy headers
        if (isset($serverParams['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $serverParams['HTTP_X_FORWARDED_FOR'])[0];
        } elseif (isset($serverParams['HTTP_X_REAL_IP'])) {
            $ip = $serverParams['HTTP_X_REAL_IP'];
        }

        return "ip_{$ip}";
    }

    /**
     * Get endpoint path for rate limiting
     */
    private function getEndpoint(Request $request): string
    {
        return $request->getUri()->getPath();
    }

    /**
     * Get rate limits for specific endpoint
     */
    private function getLimitsForEndpoint(string $endpoint): array
    {
        if (isset($this->endpointLimits[$endpoint])) {
            return $this->endpointLimits[$endpoint];
        }

        return [
            'max' => $this->defaultMaxRequests,
            'window' => $this->defaultWindowMinutes,
        ];
    }

    /**
     * Build storage key in the format identifier:endpoint_hash
     */
    private function buildStorageKey(string $identifier, string $endpoint): string
    {
        $endpointHash = md5($endpoint);
        return "{$identifier}:{$endpointHash}";
    }

    // ------------------------------------------------------------------
    //  Response helpers
    // ------------------------------------------------------------------

    /**
     * Return rate limit exceeded response
     */
    private function rateLimitExceededResponse(array $rateLimitData): Response
    {
        $response = new \Slim\Psr7\Response();

        $retryAfter = max(0, $rateLimitData['reset'] - time());

        $body = json_encode([
            'success' => false,
            'error' => 'Rate limit exceeded',
            'message' => 'Too many requests. Please try again later.',
            'retry_after' => $retryAfter,
        ]);

        $response->getBody()->write($body);

        return $response
            ->withStatus(429)
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('X-RateLimit-Limit', (string)$rateLimitData['limit'])
            ->withHeader('X-RateLimit-Remaining', '0')
            ->withHeader('X-RateLimit-Reset', (string)$rateLimitData['reset'])
            ->withHeader('Retry-After', (string)$retryAfter);
    }

    /**
     * Add rate limit headers to response
     */
    private function addRateLimitHeaders(Response $response, array $rateLimitData): Response
    {
        return $response
            ->withHeader('X-RateLimit-Limit', (string)$rateLimitData['limit'])
            ->withHeader('X-RateLimit-Remaining', (string)$rateLimitData['remaining'])
            ->withHeader('X-RateLimit-Reset', (string)$rateLimitData['reset']);
    }

    // ------------------------------------------------------------------
    //  Cleanup (file storage only)
    // ------------------------------------------------------------------

    /**
     * Clean up old rate limit files (call periodically via cron).
     *
     * This only applies to file-based storage. Redis keys expire
     * automatically via native TTL.
     */
    public static function cleanup(): int
    {
        return FileRateLimitStorage::cleanup();
    }
}

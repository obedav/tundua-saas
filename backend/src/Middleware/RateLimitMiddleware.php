<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

/**
 * Rate Limiting Middleware
 *
 * Prevents brute force attacks and API abuse by limiting requests per IP/user
 *
 * Features:
 * - Configurable limits per endpoint
 * - IP-based and user-based rate limiting
 * - File-based storage (can be upgraded to Redis)
 * - Custom limit headers in response
 */
class RateLimitMiddleware
{
    private string $storageDir;
    private int $defaultMaxRequests;
    private int $defaultWindowMinutes;
    private array $endpointLimits;

    public function __construct()
    {
        $this->storageDir = __DIR__ . '/../../storage/rate_limits';
        $this->defaultMaxRequests = (int)($_ENV['RATE_LIMIT_MAX_REQUESTS'] ?? 100);
        $this->defaultWindowMinutes = (int)($_ENV['RATE_LIMIT_WINDOW_MINUTES'] ?? 15);

        // Custom limits per endpoint
        $this->endpointLimits = [
            '/api/auth/login' => ['max' => 5, 'window' => 15],
            '/api/auth/register' => ['max' => 3, 'window' => 60],
            '/api/auth/forgot-password' => ['max' => 3, 'window' => 60],
            '/api/auth/reset-password' => ['max' => 5, 'window' => 60],
            '/api/auth/verify-email' => ['max' => 10, 'window' => 15],
        ];

        // Ensure storage directory exists
        if (!is_dir($this->storageDir)) {
            mkdir($this->storageDir, 0755, true);
        }
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

        // Check rate limit
        $rateLimitData = $this->checkRateLimit($identifier, $endpoint, $maxRequests, $windowMinutes);

        // If rate limit exceeded, return 429
        if ($rateLimitData['exceeded']) {
            return $this->rateLimitExceededResponse($rateLimitData);
        }

        // Record this request
        $this->recordRequest($identifier, $endpoint, $windowMinutes);

        // Continue with request and add rate limit headers
        $response = $handler->handle($request);

        return $this->addRateLimitHeaders($response, $rateLimitData);
    }

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
            'window' => $this->defaultWindowMinutes
        ];
    }

    /**
     * Check if rate limit is exceeded
     */
    private function checkRateLimit(string $identifier, string $endpoint, int $maxRequests, int $windowMinutes): array
    {
        $key = $this->getStorageKey($identifier, $endpoint);
        $filePath = $this->getStorageFilePath($key);

        // If file doesn't exist, no requests recorded yet
        if (!file_exists($filePath)) {
            return [
                'exceeded' => false,
                'current' => 0,
                'limit' => $maxRequests,
                'remaining' => $maxRequests,
                'reset' => time() + ($windowMinutes * 60)
            ];
        }

        // Read existing data
        $data = json_decode(file_get_contents($filePath), true);

        if (!$data) {
            return [
                'exceeded' => false,
                'current' => 0,
                'limit' => $maxRequests,
                'remaining' => $maxRequests,
                'reset' => time() + ($windowMinutes * 60)
            ];
        }

        // Check if window has expired
        $now = time();
        if ($now >= $data['reset']) {
            // Window expired, reset
            return [
                'exceeded' => false,
                'current' => 0,
                'limit' => $maxRequests,
                'remaining' => $maxRequests,
                'reset' => $now + ($windowMinutes * 60)
            ];
        }

        // Check if limit exceeded
        $current = $data['count'];
        $remaining = max(0, $maxRequests - $current);
        $exceeded = $current >= $maxRequests;

        return [
            'exceeded' => $exceeded,
            'current' => $current,
            'limit' => $maxRequests,
            'remaining' => $remaining,
            'reset' => $data['reset']
        ];
    }

    /**
     * Record a request
     */
    private function recordRequest(string $identifier, string $endpoint, int $windowMinutes): void
    {
        $key = $this->getStorageKey($identifier, $endpoint);
        $filePath = $this->getStorageFilePath($key);

        $data = [
            'count' => 1,
            'reset' => time() + ($windowMinutes * 60),
            'first_request' => time()
        ];

        if (file_exists($filePath)) {
            $existing = json_decode(file_get_contents($filePath), true);

            if ($existing && time() < $existing['reset']) {
                $data['count'] = $existing['count'] + 1;
                $data['reset'] = $existing['reset'];
                $data['first_request'] = $existing['first_request'];
            }
        }

        file_put_contents($filePath, json_encode($data));
    }

    /**
     * Generate storage key
     */
    private function getStorageKey(string $identifier, string $endpoint): string
    {
        return md5($identifier . '_' . $endpoint);
    }

    /**
     * Get file path for storage
     */
    private function getStorageFilePath(string $key): string
    {
        return $this->storageDir . '/' . $key . '.json';
    }

    /**
     * Return rate limit exceeded response
     */
    private function rateLimitExceededResponse(array $rateLimitData): Response
    {
        $response = new \Slim\Psr7\Response();

        $body = json_encode([
            'success' => false,
            'error' => 'Rate limit exceeded',
            'message' => 'Too many requests. Please try again later.',
            'retry_after' => $rateLimitData['reset'] - time()
        ]);

        $response->getBody()->write($body);

        return $response
            ->withStatus(429)
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('X-RateLimit-Limit', (string)$rateLimitData['limit'])
            ->withHeader('X-RateLimit-Remaining', '0')
            ->withHeader('X-RateLimit-Reset', (string)$rateLimitData['reset'])
            ->withHeader('Retry-After', (string)($rateLimitData['reset'] - time()));
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

    /**
     * Clean up old rate limit files (call periodically via cron)
     */
    public static function cleanup(): int
    {
        $storageDir = __DIR__ . '/../../storage/rate_limits';
        $deleted = 0;

        if (!is_dir($storageDir)) {
            return 0;
        }

        $files = glob($storageDir . '/*.json');
        $now = time();

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);

            // Delete if reset time has passed
            if ($data && $now >= $data['reset']) {
                unlink($file);
                $deleted++;
            }
        }

        return $deleted;
    }
}

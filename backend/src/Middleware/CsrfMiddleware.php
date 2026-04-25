<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

/**
 * CSRF Protection Middleware
 *
 * Validates Origin/Referer headers on state-changing requests (POST, PUT, DELETE, PATCH)
 * to prevent cross-site request forgery attacks.
 *
 * Exempt endpoints: payment webhooks (they use signature verification instead).
 */
class CsrfMiddleware
{
    /**
     * Endpoints exempt from CSRF checks (webhooks use their own signature verification)
     */
    private array $exemptPaths = [
        '/api/v1/auth/login',
        '/api/v1/auth/register',
        '/api/v1/auth/forgot-password',
        '/api/v1/auth/reset-password',
        '/api/v1/auth/resend-verification',
        '/api/v1/auth/refresh',
        '/api/v1/auth/google',
        '/api/v1/payments/paystack/webhook',
        // Public lead capture — unauthenticated form, no session to hijack.
        // Spam is handled by RateLimitMiddleware (5 req / 15 min per IP) +
        // input validation in LeadController.
        '/api/v1/leads',
    ];

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $method = strtoupper($request->getMethod());

        // Only check state-changing methods
        if (!in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'])) {
            return $handler->handle($request);
        }

        $path = $request->getUri()->getPath();

        // Skip exempt paths (webhooks)
        foreach ($this->exemptPaths as $exempt) {
            if (str_starts_with($path, $exempt)) {
                return $handler->handle($request);
            }
        }

        // Validate Origin or Referer header
        if (!$this->isValidOrigin($request)) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid request origin'
            ]));
            return $response
                ->withStatus(403)
                ->withHeader('Content-Type', 'application/json');
        }

        return $handler->handle($request);
    }

    /**
     * Validate that the request Origin or Referer matches allowed origins
     */
    private function isValidOrigin(Request $request): bool
    {
        $allowedOrigins = array_map(
            'trim',
            explode(',', $_ENV['CORS_ORIGIN'] ?? 'http://localhost:3000')
        );

        $origin = $request->getHeaderLine('Origin');
        $referer = $request->getHeaderLine('Referer');

        // If no Origin and no Referer, check for Bearer token auth
        // JWT Bearer tokens are not automatically sent by browsers like cookies,
        // so they inherently protect against CSRF
        $authHeader = $request->getHeaderLine('Authorization');
        if (empty($origin) && empty($referer) && !empty($authHeader)) {
            return true;
        }

        // Check Origin header
        if (!empty($origin)) {
            return in_array($origin, $allowedOrigins);
        }

        // Fall back to Referer header
        if (!empty($referer)) {
            $refererHost = parse_url($referer, PHP_URL_SCHEME) . '://' . parse_url($referer, PHP_URL_HOST);
            $refererPort = parse_url($referer, PHP_URL_PORT);
            if ($refererPort) {
                $refererHost .= ':' . $refererPort;
            }
            return in_array($refererHost, $allowedOrigins);
        }

        // No origin info at all - reject
        return false;
    }
}

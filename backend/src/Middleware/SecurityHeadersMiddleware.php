<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

/**
 * Security Headers Middleware
 *
 * Adds critical security headers to all API responses to mitigate
 * XSS, clickjacking, MIME-sniffing, and downgrade attacks.
 */
class SecurityHeadersMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $response = $handler->handle($request);

        $isProduction = ($_ENV['APP_ENV'] ?? 'production') === 'production';

        // Prevent MIME type sniffing
        $response = $response->withHeader('X-Content-Type-Options', 'nosniff');

        // Prevent clickjacking
        $response = $response->withHeader('X-Frame-Options', 'DENY');

        // XSS protection (legacy browsers)
        $response = $response->withHeader('X-XSS-Protection', '1; mode=block');

        // Prevent information leakage via Referer header
        $response = $response->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Restrict browser features
        $response = $response->withHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        // HSTS - enforce HTTPS (production only)
        if ($isProduction) {
            $response = $response->withHeader(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        // Content Security Policy for API responses
        $response = $response->withHeader(
            'Content-Security-Policy',
            "default-src 'none'; frame-ancestors 'none'"
        );

        // Prevent caching of authenticated responses
        $authHeader = $request->getHeaderLine('Authorization');
        if (!empty($authHeader)) {
            $response = $response->withHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            $response = $response->withHeader('Pragma', 'no-cache');
        }

        return $response;
    }
}

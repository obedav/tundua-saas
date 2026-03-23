<?php

namespace Tundua\Tests\Feature;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;
use Tundua\Middleware\SecurityHeadersMiddleware;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Tests that SecurityHeadersMiddleware sets all required security headers.
 */
class SecurityHeadersTest extends TestCase
{
    private SecurityHeadersMiddleware $middleware;

    protected function setUp(): void
    {
        parent::setUp();

        $this->middleware = new SecurityHeadersMiddleware();
    }

    /**
     * Invoke the middleware with a plain 200 response and return the result.
     */
    private function dispatchRequest(?ServerRequestInterface $request = null): ResponseInterface
    {
        $request ??= (new ServerRequestFactory())->createServerRequest('GET', '/api/test');

        $handler = new class implements RequestHandlerInterface {
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                return (new ResponseFactory())->createResponse(200);
            }
        };

        return ($this->middleware)($request, $handler);
    }

    // =============================================
    //  Individual Header Assertions
    // =============================================

    #[Test]
    public function response_includes_x_content_type_options(): void
    {
        $response = $this->dispatchRequest();

        $this->assertSame('nosniff', $response->getHeaderLine('X-Content-Type-Options'));
    }

    #[Test]
    public function response_includes_x_frame_options(): void
    {
        $response = $this->dispatchRequest();

        $this->assertSame('DENY', $response->getHeaderLine('X-Frame-Options'));
    }

    #[Test]
    public function response_includes_x_xss_protection(): void
    {
        $response = $this->dispatchRequest();

        $this->assertSame('1; mode=block', $response->getHeaderLine('X-XSS-Protection'));
    }

    #[Test]
    public function response_includes_referrer_policy(): void
    {
        $response = $this->dispatchRequest();

        $this->assertSame(
            'strict-origin-when-cross-origin',
            $response->getHeaderLine('Referrer-Policy')
        );
    }

    #[Test]
    public function response_includes_permissions_policy(): void
    {
        $response = $this->dispatchRequest();

        $value = $response->getHeaderLine('Permissions-Policy');
        $this->assertStringContainsString('camera=()', $value);
        $this->assertStringContainsString('microphone=()', $value);
        $this->assertStringContainsString('geolocation=()', $value);
    }

    #[Test]
    public function response_includes_content_security_policy(): void
    {
        $response = $this->dispatchRequest();

        $csp = $response->getHeaderLine('Content-Security-Policy');
        $this->assertStringContainsString("default-src 'none'", $csp);
        $this->assertStringContainsString("frame-ancestors 'none'", $csp);
    }

    #[Test]
    public function response_includes_cross_origin_opener_policy(): void
    {
        $response = $this->dispatchRequest();

        $this->assertSame('same-origin', $response->getHeaderLine('Cross-Origin-Opener-Policy'));
    }

    #[Test]
    public function response_includes_cross_origin_resource_policy(): void
    {
        $response = $this->dispatchRequest();

        $this->assertSame('same-origin', $response->getHeaderLine('Cross-Origin-Resource-Policy'));
    }

    // =============================================
    //  HSTS (environment-dependent)
    // =============================================

    #[Test]
    public function response_includes_hsts_in_production(): void
    {
        $previousEnv = $_ENV['APP_ENV'] ?? null;
        $_ENV['APP_ENV'] = 'production';

        try {
            $response = $this->dispatchRequest();

            $hsts = $response->getHeaderLine('Strict-Transport-Security');
            $this->assertNotEmpty($hsts, 'HSTS header must be present in production');
            $this->assertStringContainsString('max-age=', $hsts);
            $this->assertStringContainsString('includeSubDomains', $hsts);
            $this->assertStringContainsString('preload', $hsts);
        } finally {
            // Restore
            if ($previousEnv === null) {
                unset($_ENV['APP_ENV']);
            } else {
                $_ENV['APP_ENV'] = $previousEnv;
            }
        }
    }

    #[Test]
    public function response_omits_hsts_in_non_production(): void
    {
        $previousEnv = $_ENV['APP_ENV'] ?? null;
        $_ENV['APP_ENV'] = 'testing';

        try {
            $response = $this->dispatchRequest();

            $this->assertEmpty(
                $response->getHeaderLine('Strict-Transport-Security'),
                'HSTS header should not be set outside production'
            );
        } finally {
            if ($previousEnv === null) {
                unset($_ENV['APP_ENV']);
            } else {
                $_ENV['APP_ENV'] = $previousEnv;
            }
        }
    }

    // =============================================
    //  Cache-Control for Authenticated Requests
    // =============================================

    #[Test]
    public function authenticated_request_gets_no_store_cache_control(): void
    {
        $request = (new ServerRequestFactory())
            ->createServerRequest('GET', '/api/test')
            ->withHeader('Authorization', 'Bearer some-token');

        $response = $this->dispatchRequest($request);

        $cacheControl = $response->getHeaderLine('Cache-Control');
        $this->assertStringContainsString('no-store', $cacheControl);
        $this->assertStringContainsString('private', $cacheControl);
        $this->assertSame('no-cache', $response->getHeaderLine('Pragma'));
    }

    #[Test]
    public function unauthenticated_request_does_not_set_cache_control(): void
    {
        $request = (new ServerRequestFactory())
            ->createServerRequest('GET', '/api/test');
        // No Authorization header

        $response = $this->dispatchRequest($request);

        $this->assertEmpty(
            $response->getHeaderLine('Cache-Control'),
            'Cache-Control should not be set for unauthenticated requests'
        );
    }

    // =============================================
    //  Bulk Assertion: All Critical Headers Present
    // =============================================

    #[Test]
    public function all_required_security_headers_are_present(): void
    {
        $_ENV['APP_ENV'] = 'production';

        try {
            $request = (new ServerRequestFactory())
                ->createServerRequest('GET', '/api/test')
                ->withHeader('Authorization', 'Bearer tok');

            $response = $this->dispatchRequest($request);

            $requiredHeaders = [
                'X-Content-Type-Options',
                'X-Frame-Options',
                'X-XSS-Protection',
                'Referrer-Policy',
                'Permissions-Policy',
                'Content-Security-Policy',
                'Cross-Origin-Opener-Policy',
                'Cross-Origin-Resource-Policy',
                'Strict-Transport-Security',
                'Cache-Control',
                'Pragma',
            ];

            foreach ($requiredHeaders as $header) {
                $this->assertNotEmpty(
                    $response->getHeaderLine($header),
                    "Required security header '{$header}' is missing from the response"
                );
            }
        } finally {
            $_ENV['APP_ENV'] = 'testing';
        }
    }
}

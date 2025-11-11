import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Security Headers & Route Protection
 *
 * This runs on EVERY request before reaching your pages.
 * Adds critical security headers to protect against common attacks.
 */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // ============================================================================
  // SECURITY HEADERS - 2025 BEST PRACTICES
  // ============================================================================

  /**
   * Content Security Policy (CSP)
   * Prevents XSS attacks by controlling which resources can load
   *
   * IMPORTANT: Adjust these directives based on your actual needs
   *
   * NOTE: CSP is DISABLED in development to avoid blocking API calls.
   * It will be enforced in production only.
   */
  if (process.env.NODE_ENV === 'production') {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' http://localhost:8000 https://www.google-analytics.com https://pusher.com wss://*.pusher.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
  }
  // CSP is completely disabled in development - no header set at all

  /**
   * Strict-Transport-Security (HSTS)
   * Forces HTTPS for 1 year, including all subdomains
   */
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  /**
   * X-Frame-Options
   * Prevents clickjacking by blocking iframe embedding
   */
  response.headers.set('X-Frame-Options', 'DENY');

  /**
   * X-Content-Type-Options
   * Prevents MIME-type sniffing
   */
  response.headers.set('X-Content-Type-Options', 'nosniff');

  /**
   * Referrer-Policy
   * Controls how much referrer information is shared
   */
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  /**
   * X-DNS-Prefetch-Control
   * Controls DNS prefetching for performance
   */
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  /**
   * Permissions-Policy (formerly Feature-Policy)
   * Disables unnecessary browser features
   */
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  /**
   * X-XSS-Protection
   * Legacy header, but still good for older browsers
   */
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

/**
 * Configure which routes this middleware should run on
 *
 * Currently: Run on all routes except static files and API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

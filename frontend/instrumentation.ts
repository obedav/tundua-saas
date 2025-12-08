/**
 * Next.js Instrumentation File
 *
 * This file is used to run code before the server starts.
 * It's required for proper Sentry initialization.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Server-side initialization
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
      environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] || process.env.NODE_ENV,
      release: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'],

      beforeSend(event, hint) {
        if (process.env.NODE_ENV === 'development') {
          console.error(hint.originalException || hint.syntheticException);
          return null;
        }
        return event;
      },
    });
  }

  // Edge runtime initialization
  if (process.env['NEXT_RUNTIME'] === 'edge') {
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
      environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] || process.env.NODE_ENV,
      release: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'],
    });
  }
}

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Replay configuration for session recording
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
  replaysSessionSampleRate: 0.1, // Capture 10% of all sessions

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Environment
  environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] || process.env.NODE_ENV,

  // Release tracking
  release: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'],

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "atomicFindClose",
    // Network errors
    "NetworkError",
    "Failed to fetch",
    "Load failed",
    // Ignore errors from third-party scripts
    /^Script error\.?$/,
    /^Javascript error: Script error\.? on line 0$/,
  ],

  // Don't send events from localhost in development
  beforeSend(event, hint) {
    if (process.env.NODE_ENV === "development") {
      console.error(hint.originalException || hint.syntheticException);
      return null; // Don't send to Sentry in dev
    }
    return event;
  },
});

'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

/**
 * Global Error Handler for App Router
 *
 * This file is automatically used by Next.js 14+ App Router
 * to catch errors in any route segment.
 *
 * MUST be a Client Component ('use client')
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);

    // TODO: Send to error tracking service
    // if (typeof window !== 'undefined') {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Something went wrong!
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          We encountered an unexpected error. Our team has been automatically notified.
        </p>

        {/* Error Message (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              Development Error Details:
            </h3>
            <pre className="text-xs text-red-700 overflow-auto max-h-40 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </a>
        </div>

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a
              href="/dashboard/support"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

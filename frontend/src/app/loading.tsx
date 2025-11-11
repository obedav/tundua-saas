import { Globe } from 'lucide-react';

/**
 * Global Loading UI
 *
 * Shown automatically by Next.js while route segments are loading
 * Wrapped in Suspense boundary automatically
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Globe className="w-16 h-16 text-blue-600 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Globe className="w-16 h-16 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
        <p className="text-gray-600">Please wait while we prepare your content</p>

        {/* Loading Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

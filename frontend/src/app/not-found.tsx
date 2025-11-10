'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page
 *
 * Automatically shown when a route doesn't exist
 * Can also be manually triggered with notFound() function
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-block relative">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
              404
            </h1>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Search className="w-8 h-8 text-yellow-900" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Maybe you were looking for:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/dashboard"
              className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/applications"
              className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            >
              Applications
            </Link>
            <Link
              href="/dashboard/support"
              className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            >
              Support
            </Link>
          </div>
        </div>

        {/* Support Text */}
        <p className="text-sm text-gray-500 mt-8">
          Still can't find what you're looking for?{' '}
          <Link href="/dashboard/support" className="text-blue-600 hover:underline font-medium">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}

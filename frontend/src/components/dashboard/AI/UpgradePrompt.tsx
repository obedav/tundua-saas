'use client'

/**
 * Upgrade Prompt Component
 *
 * Shown when user reaches their AI generation quota
 * Encourages upgrading to premium for more generations
 */

import Link from 'next/link'

interface UpgradePromptProps {
  quotaResetTime?: string
  featureName?: string
}

export default function UpgradePrompt({
  quotaResetTime,
  featureName = 'AI generation'
}: UpgradePromptProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            You&apos;ve reached your free {featureName} limit
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            {quotaResetTime ? (
              <>Your quota will reset at <strong>{new Date(quotaResetTime).toLocaleTimeString()}</strong>. Upgrade to Premium for unlimited access!</>
            ) : (
              <>Upgrade to Premium for unlimited AI generations and priority processing!</>
            )}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Unlimited</strong> AI generations</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Priority</strong> processing</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Premium</strong> AI models</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Advanced</strong> export options</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/billing"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-md transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Upgrade to Premium
            </Link>
            <Link
              href="/dashboard/billing"
              className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md border border-gray-300 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Small print */}
      {quotaResetTime && (
        <div className="mt-4 pt-4 border-t border-purple-200">
          <p className="text-xs text-gray-600 text-center">
            Or wait for your free quota to reset. We&apos;ll see you at{' '}
            <strong>{new Date(quotaResetTime).toLocaleTimeString()}</strong>!
          </p>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { generateUniversityReportAction, checkAIQuotaAction } from '@/lib/actions/ai-addons'
import type { UniversityReportResponse } from '@/lib/ai-addons-generator'
import { calculateProgress, normalizeGPATo4Scale, convertToUSD } from './university-report-constants'
import { useUniversityReportDraft } from './useUniversityReportDraft'
import FormProgressBar from './FormProgressBar'
import UniversityReportForm from './UniversityReportForm'
import UniversityReportResult from './UniversityReportResult'
import UpgradePrompt from './UpgradePrompt'

export default function UniversityReportGenerator() {
  const draft = useUniversityReportDraft()
  const [loading, setLoading] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<UniversityReportResponse | null>(null)
  const [error, setError] = useState('')
  const [quota, setQuota] = useState<{ remaining: number; resetAt: string } | null>(null)

  useEffect(() => {
    checkAIQuotaAction().then(result => {
      if (result.success && result.data) {
        setQuota({ remaining: result.data.remaining, resetAt: result.data.resetAt })
      }
    })
  }, [])

  const progress = calculateProgress(draft.formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedReport(null)
    try {
      const result = await generateUniversityReportAction({
        ...draft.formData,
        gpa: normalizeGPATo4Scale(draft.formData.gpa as number, draft.gpaScale),
        budget: convertToUSD(draft.formData.budget as number, draft.currency),
      })
      if (!result.success) {
        setError(result.error || 'Failed to generate university report')
        return
      }
      setGeneratedReport(result.data!)
      if (result.meta?.rateLimitRemaining !== undefined) {
        setQuota(prev => ({
          remaining: result.meta!.rateLimitRemaining!,
          resetAt: prev?.resetAt || new Date(Date.now() + 3600000).toISOString(),
        }))
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI University Report Generator</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Get personalized university recommendations based on your academic profile and preferences.
              Our AI analyzes thousands of programs to find your perfect matches.
            </p>
          </div>
          {draft.hasSavedDraft && !generatedReport && (
            <div className="ml-4 flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                draft.draftSaved
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                <svg className={`w-4 h-4 transition-transform ${draft.draftSaved ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {draft.draftSaved ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  )}
                </svg>
                <span className="text-xs font-medium">{draft.draftSaved ? 'Draft saved' : 'Draft loaded'}</span>
              </div>
            </div>
          )}
        </div>
        {quota && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">{quota.remaining}</span> AI generations remaining this hour
              {quota.remaining === 0 && (
                <span className="ml-2 text-xs">Resets at {new Date(quota.resetAt).toLocaleTimeString()}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {!generatedReport && <FormProgressBar progress={progress} />}

      {quota?.remaining === 0 && (
        <UpgradePrompt quotaResetTime={quota.resetAt} featureName="university report generation" />
      )}

      {!generatedReport && (
        <UniversityReportForm
          formData={draft.formData}
          setFormData={draft.setFormData}
          gpaScale={draft.gpaScale}
          setGpaScale={draft.setGpaScale}
          currency={draft.currency}
          setCurrency={draft.setCurrency}
          hasSavedDraft={draft.hasSavedDraft}
          clearDraft={draft.clearDraft}
          loading={loading}
          quota={quota}
          onSubmit={handleSubmit}
        />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {generatedReport && (
        <UniversityReportResult
          report={generatedReport}
          onStartOver={() => { setGeneratedReport(null); setError('') }}
        />
      )}
    </div>
  )
}

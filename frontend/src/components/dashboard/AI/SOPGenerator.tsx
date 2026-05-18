'use client'

import { useState, useEffect } from 'react'
import { generateSOPAction, checkAIQuotaAction } from '@/lib/actions/ai-addons'
import type { SOPGenerationRequest, SOPGenerationResponse } from '@/lib/ai-addons-generator'
import SOPModeSelector from './SOPModeSelector'
import SOPExpressForm from './SOPExpressForm'
import SOPCustomForm from './SOPCustomForm'
import SOPResult from './SOPResult'
import UpgradePrompt from './UpgradePrompt'

const INITIAL_FORM: SOPGenerationRequest = {
  fullName: '', nationality: '', currentEducation: '', gpa: '', workExperience: '',
  targetDegree: '', targetUniversity: '', targetCountry: '',
  academicBackground: '', careerGoals: '', whyThisProgram: '',
  achievements: '', challenges: '', tone: 'balanced', wordCount: 700,
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

export default function SOPGenerator() {
  const [loading, setLoading] = useState(false)
  const [generatedSOP, setGeneratedSOP] = useState<SOPGenerationResponse | null>(null)
  const [error, setError] = useState('')
  const [quota, setQuota] = useState<{ remaining: number; resetAt: string } | null>(null)
  const [mode, setMode] = useState<'express' | 'custom'>('express')
  const [formData, setFormData] = useState<SOPGenerationRequest>(INITIAL_FORM)

  useEffect(() => {
    checkAIQuotaAction().then(result => {
      if (result.success && result.data) {
        setQuota({ remaining: result.data.remaining, resetAt: result.data.resetAt })
      }
    })
  }, [])

  const handleInputChange = (field: keyof SOPGenerationRequest, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const isCustomModeIncomplete =
    mode === 'custom' &&
    (countWords(formData.academicBackground) < 200 ||
      countWords(formData.careerGoals) < 200 ||
      countWords(formData.whyThisProgram) < 200)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedSOP(null)
    try {
      const result = await generateSOPAction(formData)
      if (!result.success) {
        setError(result.error || 'Failed to generate SOP')
        return
      }
      setGeneratedSOP(result.data!)
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI SOP Generator</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate a professional Statement of Purpose using AI. Share your story in your own words, and we&apos;ll transform it into a compelling SOP.
        </p>
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

      {quota?.remaining === 0 && (
        <UpgradePrompt quotaResetTime={quota.resetAt} featureName="SOP generation" />
      )}

      {!generatedSOP && (
        <>
          <SOPModeSelector mode={mode} onModeChange={setMode} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'express' ? (
              <SOPExpressForm formData={formData} onChange={handleInputChange} />
            ) : (
              <SOPCustomForm formData={formData} onChange={handleInputChange} />
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || quota?.remaining === 0 || isCustomModeIncomplete}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating SOP...' : 'Generate SOP'}
              </button>
            </div>
          </form>
        </>
      )}

      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generating Your SOP</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI is crafting your personalized statement...</p>
              <div className="mt-4 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {generatedSOP && (
        <SOPResult
          generatedSOP={generatedSOP}
          onStartOver={() => { setGeneratedSOP(null); setError('') }}
        />
      )}
    </div>
  )
}

'use client'

/**
 * AI-Powered SOP Generator Component
 *
 * Allows users to generate Statement of Purpose using AI
 */

import { useState, useEffect } from 'react'
import { generateSOPAction, checkAIQuotaAction } from '@/lib/actions/ai-addons'
import type { SOPGenerationRequest, SOPGenerationResponse } from '@/lib/ai-addons-generator'
import UpgradePrompt from './UpgradePrompt'

export default function SOPGenerator() {
  const [loading, setLoading] = useState(false)
  const [generatedSOP, setGeneratedSOP] = useState<SOPGenerationResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [quota, setQuota] = useState<{ remaining: number; resetAt: string } | null>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [mode, setMode] = useState<'express' | 'custom'>('express')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState<SOPGenerationRequest>({
    fullName: '',
    nationality: '',
    currentEducation: '',
    gpa: '',
    workExperience: '',
    targetDegree: '',
    targetUniversity: '',
    targetCountry: '',
    academicBackground: '',
    careerGoals: '',
    whyThisProgram: '',
    achievements: '',
    challenges: '',
    tone: 'balanced',
    wordCount: 700,
  })

  // Word count helpers
  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

  const academicWords = countWords(formData.academicBackground)
  const careerWords = countWords(formData.careerGoals)
  const whyProgramWords = countWords(formData.whyThisProgram)

  // Check quota on mount
  useEffect(() => {
    checkAIQuotaAction().then((result) => {
      if (result.success && result.data) {
        setQuota({
          remaining: result.data.remaining,
          resetAt: result.data.resetAt,
        })
      }
    })
  }, [])

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

      // Update quota
      if (result.meta?.rateLimitRemaining !== undefined) {
        setQuota((prev) => ({
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

  const handleInputChange = (field: keyof SOPGenerationRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Toast notification helper
  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Clear field helper
  const clearField = (field: keyof SOPGenerationRequest, wordCount?: number) => {
    if (wordCount && wordCount > 50) {
      if (confirm('Are you sure you want to clear this text?')) {
        handleInputChange(field, '')
      }
    } else {
      handleInputChange(field, '')
    }
  }

  // Quality score to number (for circular progress)
  const getQualityScore = (quality: string): number => {
    switch (quality) {
      case 'excellent': return 95
      case 'good': return 75
      case 'needs-review': return 55
      default: return 70
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">AI SOP Generator</h1>
        <p className="mt-2 text-gray-600">
          Generate a professional Statement of Purpose using AI. Share your story in your own words, and we&apos;ll transform it into a compelling SOP.
        </p>

        {quota && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{quota.remaining}</span> AI generations remaining this hour
              {quota.remaining === 0 && (
                <span className="ml-2 text-xs">
                  Resets at {new Date(quota.resetAt).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Prompt - Shown when quota is 0 */}
      {quota && quota.remaining === 0 && (
        <UpgradePrompt quotaResetTime={quota.resetAt} featureName="SOP generation" />
      )}

      {/* Mode Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Generation Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Express Mode */}
          <button
            type="button"
            onClick={() => setMode('express')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'express'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${mode === 'express' ? 'text-blue-600' : 'text-gray-400'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Express Mode</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Fast
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Quick generation with minimal inputs. AI creates your story from key facts.
                </p>
                <p className="text-xs text-gray-500 mt-2">⏱️ ~2 minutes • 7 fields</p>
              </div>
            </div>
          </button>

          {/* Custom Mode */}
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'custom'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${mode === 'custom' ? 'text-blue-600' : 'text-gray-400'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Custom Mode</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Full control with detailed inputs. You write your story, AI structures and polishes it.
                </p>
                <p className="text-xs text-gray-500 mt-2">⏱️ ~10 minutes • Full detail</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'express' ? (
          /* EXPRESS MODE FORM */
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Essential Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Degree *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.currentEducation}
                      onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Bachelor's in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Degree *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.targetDegree}
                      onChange={(e) => handleInputChange('targetDegree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Master's in Data Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target University *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.targetUniversity}
                      onChange={(e) => handleInputChange('targetUniversity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Stanford University"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.targetCountry}
                      onChange={(e) => handleInputChange('targetCountry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Key Background Points * <span className="text-xs text-gray-500">(3-5 bullet points)</span>
                    </label>
                    {formData.academicBackground && (
                      <button
                        type="button"
                        onClick={() => clearField('academicBackground', countWords(formData.academicBackground))}
                        className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                        title="Clear text"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                      </button>
                    )}
                  </div>
                  <textarea
                    required
                    rows={6}
                    value={formData.academicBackground}
                    onChange={(e) => handleInputChange('academicBackground', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="• Graduated with honors in Computer Science&#10;• Led university robotics team to national competition&#10;• Published research paper on machine learning&#10;• 2 years experience as software engineer&#10;• Passionate about AI and its applications in healthcare"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    List your key achievements, experience, and qualifications. AI will expand these into a compelling narrative.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Career Goal * <span className="text-xs text-gray-500">(1-2 sentences)</span>
                    </label>
                    {formData.careerGoals && (
                      <button
                        type="button"
                        onClick={() => clearField('careerGoals', countWords(formData.careerGoals))}
                        className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                        title="Clear text"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                      </button>
                    )}
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={formData.careerGoals}
                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="I aim to become an AI research scientist developing accessible healthcare solutions for underserved communities."
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* CUSTOM MODE FORM */
          <>
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality *
              </label>
              <input
                type="text"
                required
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nigerian"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Education *
              </label>
              <input
                type="text"
                required
                value={formData.currentEducation}
                onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor's in Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="3.8/4.0"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Experience (Optional)
            </label>
            <input
              type="text"
              value={formData.workExperience}
              onChange={(e) => handleInputChange('workExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="2 years as Software Engineer at XYZ Corp"
            />
          </div>
        </div>

        {/* Target Program */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Degree *
              </label>
              <input
                type="text"
                required
                value={formData.targetDegree}
                onChange={(e) => handleInputChange('targetDegree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Master's in Data Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target University *
              </label>
              <input
                type="text"
                required
                value={formData.targetUniversity}
                onChange={(e) => handleInputChange('targetUniversity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Stanford University"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Country *
              </label>
              <input
                type="text"
                required
                value={formData.targetCountry}
                onChange={(e) => handleInputChange('targetCountry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        {/* Your Story (Most Important Section) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Story</h2>
          <p className="text-sm text-gray-600 mb-4">
            Write in your own words. Be authentic and specific. Minimum 200 words for each section.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Academic Background * <span className="text-xs text-gray-500">({academicWords}/200 words)</span>
                </label>
                {formData.academicBackground && (
                  <button
                    type="button"
                    onClick={() => clearField('academicBackground', academicWords)}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                    title="Clear text"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
              <textarea
                required
                rows={6}
                value={formData.academicBackground}
                onChange={(e) => handleInputChange('academicBackground', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  academicWords < 200 ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about your academic journey, key courses, projects, research experience, etc. What sparked your interest in this field?"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Career Goals * <span className="text-xs text-gray-500">({careerWords}/200 words)</span>
                </label>
                {formData.careerGoals && (
                  <button
                    type="button"
                    onClick={() => clearField('careerGoals', careerWords)}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                    title="Clear text"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
              <textarea
                required
                rows={6}
                value={formData.careerGoals}
                onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  careerWords < 200 ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="What do you want to achieve in your career? Short-term and long-term goals. Be specific."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Why This Program * <span className="text-xs text-gray-500">({whyProgramWords}/200 words)</span>
                </label>
                {formData.whyThisProgram && (
                  <button
                    type="button"
                    onClick={() => clearField('whyThisProgram', whyProgramWords)}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                    title="Clear text"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
              <textarea
                required
                rows={6}
                value={formData.whyThisProgram}
                onChange={(e) => handleInputChange('whyThisProgram', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  whyProgramWords < 200 ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Why this specific program at this university? Mention specific courses, faculty, research opportunities, or unique aspects of the program."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Achievements (Optional)
                </label>
                {formData.achievements && (
                  <button
                    type="button"
                    onClick={() => clearField('achievements')}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                    title="Clear text"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Awards, publications, leadership roles, significant projects, etc."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Challenges Overcome (Optional)
                </label>
                {formData.challenges && (
                  <button
                    type="button"
                    onClick={() => clearField('challenges')}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                    title="Clear text"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Obstacles you've faced and how you overcame them. This adds depth to your story."
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="formal">Formal (Traditional Academic)</option>
                <option value="balanced">Balanced (Recommended)</option>
                <option value="conversational">Conversational (Personal)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Word Count
              </label>
              <input
                type="number"
                min="500"
                max="1000"
                step="50"
                value={formData.wordCount}
                onChange={(e) => handleInputChange('wordCount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

          </>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              loading ||
              quota?.remaining === 0 ||
              (mode === 'custom' && (academicWords < 200 || careerWords < 200 || whyProgramWords < 200))
            }
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating SOP...' : 'Generate SOP'}
          </button>
        </div>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Animated Spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            {/* Loading Text */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your SOP</h3>
              <p className="text-sm text-gray-600">AI is crafting your personalized statement...</p>
              <div className="mt-4 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Generated SOP */}
      {generatedSOP && (
        <div className="space-y-6">
          {/* Quality Score - Circular Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">SOP Quality Score</h2>
            <div className="flex items-center justify-center">
              {/* Circular Progress Chart */}
              <div className="relative inline-flex items-center justify-center">
                <svg className="transform -rotate-90" width="180" height="180">
                  {/* Background circle */}
                  <circle
                    cx="90"
                    cy="90"
                    r="75"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="90"
                    cy="90"
                    r="75"
                    stroke={
                      generatedSOP.estimatedQuality === 'excellent'
                        ? '#10b981'
                        : generatedSOP.estimatedQuality === 'good'
                        ? '#3b82f6'
                        : '#f59e0b'
                    }
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 75}`}
                    strokeDashoffset={`${2 * Math.PI * 75 * (1 - getQualityScore(generatedSOP.estimatedQuality) / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Score text in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-4xl font-bold ${
                    generatedSOP.estimatedQuality === 'excellent' ? 'text-green-600' :
                    generatedSOP.estimatedQuality === 'good' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {getQualityScore(generatedSOP.estimatedQuality)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">out of 100</div>
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    generatedSOP.estimatedQuality === 'excellent' ? 'bg-green-100 text-green-800' :
                    generatedSOP.estimatedQuality === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {generatedSOP.estimatedQuality}
                  </div>
                </div>
              </div>
            </div>
            {/* Score interpretation */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {generatedSOP.estimatedQuality === 'excellent' && (
                  <span className="text-green-700 font-semibold">Excellent! Your SOP is compelling and well-structured. ✨</span>
                )}
                {generatedSOP.estimatedQuality === 'good' && (
                  <span className="text-blue-700 font-semibold">Good! Review suggestions below to make it excellent.</span>
                )}
                {generatedSOP.estimatedQuality === 'needs-review' && (
                  <span className="text-yellow-700 font-semibold">Needs improvement - please review suggestions carefully.</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Word Count:</strong> {generatedSOP.wordCount} words
              </p>
            </div>
          </div>

          {/* SOP Content */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Statement of Purpose</h2>

          {/* Enhanced SOP Display with Formatting */}
          <div className="prose max-w-none">
            <div className="space-y-4">
              {generatedSOP.sop.split('\n\n').map((paragraph, idx) => (
                <div
                  key={idx}
                  className="relative pl-8 pr-4 py-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {/* Paragraph number */}
                  <div className="absolute left-2 top-3 text-xs font-bold text-blue-600 bg-blue-100 w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-wrap">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions Section - Enhanced */}
          {generatedSOP.suggestions.length > 0 && (
            <div className="border-t pt-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💡</span>
                  <h3 className="font-bold text-blue-900 text-lg">Suggestions for Improvement</h3>
                  <span className="ml-auto px-3 py-1 bg-blue-200 text-blue-900 text-xs font-semibold rounded-full">
                    {generatedSOP.suggestions.length} {generatedSOP.suggestions.length === 1 ? 'tip' : 'tips'}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {generatedSOP.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white border border-blue-200 rounded-lg p-3 hover:border-blue-400 transition-all"
                    >
                      <span className="text-blue-600 text-lg mt-0.5">✓</span>
                      <span className="text-sm text-gray-800 flex-1">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3">
            {/* Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                onBlur={() => setTimeout(() => setShowDownloadMenu(false), 200)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDownloadMenu && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[180px] z-10">
                  <button
                    onClick={() => {
                      // Create Word document
                      const htmlContent = `
                        <html xmlns:o='urn:schemas-microsoft-com:office:office'
                              xmlns:w='urn:schemas-microsoft-com:office:word'
                              xmlns='http://www.w3.org/TR/REC-html40'>
                          <head>
                            <meta charset='utf-8'>
                            <title>Statement of Purpose</title>
                            <style>
                              body {
                                font-family: 'Times New Roman', Times, serif;
                                font-size: 12pt;
                                line-height: 2.0;
                                margin: 1in;
                              }
                              p {
                                text-align: justify;
                                margin-bottom: 12pt;
                              }
                            </style>
                          </head>
                          <body>
                            ${generatedSOP.sop.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('')}
                          </body>
                        </html>
                      `
                      const blob = new Blob([htmlContent], { type: 'application/msword' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'statement-of-purpose.doc'
                      a.click()
                      URL.revokeObjectURL(url)
                      setShowDownloadMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Word Document (.doc)
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedSOP.sop], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'statement-of-purpose.txt'
                      a.click()
                      URL.revokeObjectURL(url)
                      setShowDownloadMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Text File (.txt)
                  </button>
                </div>
              )}
            </div>

            {/* Copy Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedSOP.sop)
                showToastNotification('✓ SOP copied to clipboard!')
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>

            {/* Start Over Button */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to start over? This will clear the current SOP.')) {
                  setGeneratedSOP(null)
                  setError('')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors border border-gray-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start Over
            </button>
          </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}

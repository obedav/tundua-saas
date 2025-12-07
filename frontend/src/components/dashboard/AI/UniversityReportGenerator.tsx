'use client'

/**
 * AI-Powered University Report Generator Component
 *
 * Generates personalized university selection report with 10 recommendations
 */

import { useState, useEffect } from 'react'
import { generateUniversityReportAction, checkAIQuotaAction } from '@/lib/actions/ai-addons'
import type { UniversityReportRequest, UniversityReportResponse } from '@/lib/ai-addons-generator'
import UpgradePrompt from './UpgradePrompt'

export default function UniversityReportGenerator() {
  const [loading, setLoading] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<UniversityReportResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [quota, setQuota] = useState<{ remaining: number; resetAt: string } | null>(null)

  // Enhanced form state with GPA scale and currency
  const [gpaScale, setGpaScale] = useState<'4.0' | '10.0' | '100' | 'percentage'>('4.0')
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'>('USD')

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Draft save indicator
  const [draftSaved, setDraftSaved] = useState(false)
  const [hasSavedDraft, setHasSavedDraft] = useState(false)

  // Form state
  const [formData, setFormData] = useState<UniversityReportRequest>({
    field: '',
    degree: '',
    gpa: 0,
    budget: 0,
    country: '',
    priorities: [],
    careerGoal: '',
  })

  // Smart defaults based on user location (timezone)
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const savedGpaScale = localStorage.getItem('universityReportGpaScale')
      const savedCurrency = localStorage.getItem('universityReportCurrency')

      // Only set smart defaults if no saved preferences exist
      if (!savedGpaScale && !savedCurrency) {
        // Detect region from timezone
        if (timezone.includes('America')) {
          // North/South America - likely USA/Canada
          setGpaScale('4.0')
          setCurrency(timezone.includes('Toronto') || timezone.includes('Vancouver') ? 'CAD' : 'USD')
        } else if (timezone.includes('Europe/London') || timezone === 'Europe/Dublin') {
          // UK/Ireland
          setGpaScale('percentage')
          setCurrency('GBP')
        } else if (timezone.includes('Europe')) {
          // Europe (except UK)
          setGpaScale('10.0')
          setCurrency('EUR')
        } else if (timezone.includes('Australia')) {
          // Australia
          setGpaScale('4.0')
          setCurrency('AUD')
        } else if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
          // India
          setGpaScale('10.0')
          setCurrency('USD') // Most Indian students apply to USD-based schools
        } else if (timezone.includes('Asia/Shanghai') || timezone.includes('Asia/Beijing')) {
          // China
          setGpaScale('100')
          setCurrency('USD')
        } else {
          // Default fallback
          setGpaScale('4.0')
          setCurrency('USD')
        }
      }
    } catch (error) {
      console.error('Failed to detect timezone:', error)
    }
  }, [])

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('universityReportDraft')
      const savedGpaScale = localStorage.getItem('universityReportGpaScale')
      const savedCurrency = localStorage.getItem('universityReportCurrency')

      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        setFormData(parsed)
        setHasSavedDraft(true)
      }
      // Override smart defaults if user has saved preferences
      if (savedGpaScale) {
        setGpaScale(savedGpaScale as any)
      }
      if (savedCurrency) {
        setCurrency(savedCurrency as any)
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
  }, [])

  // Auto-save draft to localStorage when form data changes
  useEffect(() => {
    // Only save if at least one field is filled
    const hasData = formData.field || formData.degree || formData['gpa'] > 0 || formData['budget'] > 0

    if (hasData) {
      try {
        localStorage.setItem('universityReportDraft', JSON.stringify(formData))
        localStorage.setItem('universityReportGpaScale', gpaScale)
        localStorage.setItem('universityReportCurrency', currency)
        setDraftSaved(true)
        setHasSavedDraft(true)

        // Hide the "saved" indicator after 2 seconds
        const timer = setTimeout(() => setDraftSaved(false), 2000)
        return () => clearTimeout(timer)
      } catch (error) {
        console.error('Failed to save draft:', error)
        return undefined
      }
    }
    return undefined
  }, [formData, gpaScale, currency])

  // Clear draft function
  const clearDraft = () => {
    if (confirm('Are you sure you want to clear your saved draft? This cannot be undone.')) {
      localStorage.removeItem('universityReportDraft')
      localStorage.removeItem('universityReportGpaScale')
      localStorage.removeItem('universityReportCurrency')
      setFormData({
        field: '',
        degree: '',
        gpa: 0,
        budget: 0,
        country: '',
        priorities: [],
        careerGoal: '',
      })
      setGpaScale('4.0')
      setCurrency('USD')
      setHasSavedDraft(false)
      setDraftSaved(false)
    }
  }

  // Calculate form completion progress
  const calculateProgress = () => {
    const requiredFields = [
      { name: 'Field of Study', filled: !!formData.field },
      { name: 'Degree Level', filled: !!formData.degree },
      { name: 'GPA', filled: formData['gpa'] > 0 },
      { name: 'Budget', filled: formData['budget'] > 0 },
    ]

    const filledCount = requiredFields.filter(f => f.filled).length
    const totalCount = requiredFields.length
    const percentage = Math.round((filledCount / totalCount) * 100)

    return {
      filledCount,
      totalCount,
      percentage,
      isComplete: filledCount === totalCount,
      missingFields: requiredFields.filter(f => !f.filled).map(f => f.name)
    }
  }

  const progress = calculateProgress()

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

  // Convert GPA to 4.0 scale for backend
  const normalizeGPATo4Scale = (gpa: number, scale: typeof gpaScale): number => {
    switch (scale) {
      case '4.0':
        return gpa
      case '10.0':
        return gpa * 0.4
      case '100':
      case 'percentage':
        return gpa * 0.04
      default:
        return gpa
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedReport(null)

    // Convert budget to USD for backend
    const budgetInUSD = convertToUSD(formData['budget'])

    // Normalize GPA to 4.0 scale for backend
    const normalizedGPA = normalizeGPATo4Scale(formData['gpa'], gpaScale)

    try {
      const result = await generateUniversityReportAction({
        ...formData,
        gpa: normalizedGPA, // Send normalized GPA (4.0 scale)
        budget: budgetInUSD, // Send USD amount to backend
      })

      if (!result.success) {
        setError(result.error || 'Failed to generate university report')
        return
      }

      setGeneratedReport(result.data!)

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

  const handleInputChange = (field: keyof UniversityReportRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const togglePriority = (priority: string) => {
    setFormData((prev) => ({
      ...prev,
      priorities: prev.priorities?.includes(priority)
        ? prev.priorities.filter((p) => p !== priority)
        : [...(prev.priorities || []), priority],
    }))
  }

  // Enhanced options data
  const degreeOptions = ['Bachelor\'s', 'Master\'s', 'PhD', 'MBA', 'Other Graduate Program']

  const priorityOptions = [
    { value: 'research', label: 'Research Opportunities' },
    { value: 'location', label: 'Location/Climate' },
    { value: 'ranking', label: 'University Ranking' },
    { value: 'cost', label: 'Affordable Tuition' },
    { value: 'career', label: 'Career Services' },
    { value: 'diversity', label: 'Student Diversity' },
  ]

  const popularCountries = [
    { value: 'United States', label: '🇺🇸 United States', flag: '🇺🇸' },
    { value: 'United Kingdom', label: '🇬🇧 United Kingdom', flag: '🇬🇧' },
    { value: 'Canada', label: '🇨🇦 Canada', flag: '🇨🇦' },
    { value: 'Australia', label: '🇦🇺 Australia', flag: '🇦🇺' },
    { value: 'Germany', label: '🇩🇪 Germany', flag: '🇩🇪' },
    { value: 'France', label: '🇫🇷 France', flag: '🇫🇷' },
    { value: 'Netherlands', label: '🇳🇱 Netherlands', flag: '🇳🇱' },
    { value: 'Switzerland', label: '🇨🇭 Switzerland', flag: '🇨🇭' },
    { value: 'Singapore', label: '🇸🇬 Singapore', flag: '🇸🇬' },
    { value: 'Japan', label: '🇯🇵 Japan', flag: '🇯🇵' },
  ]

  const fieldSuggestions = [
    'Computer Science',
    'Business Administration',
    'Engineering',
    'Medicine',
    'Law',
    'Psychology',
    'Economics',
    'Biology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Data Science',
    'Artificial Intelligence',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Marketing',
    'Finance',
    'Accounting',
    'Nursing',
    'Education',
    'Architecture',
    'Journalism',
    'Political Science',
    'Environmental Science',
  ]

  const gpaScales = [
    { value: '4.0', label: '4.0 Scale (USA)', max: 4.0, placeholder: '3.5' },
    { value: '10.0', label: '10.0 Scale (India/Europe)', max: 10.0, placeholder: '8.5' },
    { value: '100', label: '100 Scale (China)', max: 100, placeholder: '85' },
    { value: 'percentage', label: 'Percentage (UK)', max: 100, placeholder: '75' },
  ]

  const currencies = [
    { value: 'USD', label: '$ USD', symbol: '$', rate: 1.0 },
    { value: 'EUR', label: '€ EUR', symbol: '€', rate: 0.92 },
    { value: 'GBP', label: '£ GBP', symbol: '£', rate: 0.79 },
    { value: 'CAD', label: 'C$ CAD', symbol: 'C$', rate: 1.36 },
    { value: 'AUD', label: 'A$ AUD', symbol: 'A$', rate: 1.53 },
  ]

  // Get max GPA for current scale
  const getMaxGPA = () => {
    const scale = gpaScales.find(s => s.value === gpaScale)
    return scale?.max || 4.0
  }

  // Convert budget to USD for backend
  const convertToUSD = (amount: number) => {
    const currencyData = currencies.find(c => c.value === currency)
    return amount / (currencyData?.rate || 1.0)
  }

  // Validate GPA
  const validateGPA = (value: number) => {
    const maxGPA = getMaxGPA()
    if (value < 0) return 'GPA cannot be negative'
    if (value > maxGPA) return `GPA cannot exceed ${maxGPA} on this scale`
    return ''
  }

  // Validate Budget
  const validateBudget = (value: number) => {
    if (value < 0) return 'Budget cannot be negative'
    if (value < 3000) return 'Tuition budget seems too low. Minimum $3,000/year recommended'
    if (value > 100000) return 'Tuition budget seems very high. Please verify the amount'
    return ''
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">AI University Report Generator</h1>
            <p className="mt-2 text-gray-600">
              Get personalized university recommendations based on your academic profile and preferences.
              Our AI analyzes thousands of programs to find your perfect matches.
            </p>
          </div>

          {/* Draft Save Indicator */}
          {hasSavedDraft && !generatedReport && (
            <div className="ml-4 flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                draftSaved
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <svg
                  className={`w-4 h-4 transition-transform ${draftSaved ? 'scale-110' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {draftSaved ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  )}
                </svg>
                <span className="text-xs font-medium">
                  {draftSaved ? 'Draft saved' : 'Draft loaded'}
                </span>
              </div>
            </div>
          )}
        </div>

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

      {/* Progress Indicator */}
      {!generatedReport && (
        <div className={`rounded-lg shadow p-5 border transition-all duration-500 ${
          progress.isComplete
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                Form Progress
                {progress.isComplete && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-600 text-white rounded-full animate-bounce">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {progress.isComplete ? (
                  <span className="text-green-600 font-medium animate-pulse">✓ All set! Ready to generate your personalized report</span>
                ) : (
                  <span>Complete {progress.totalCount - progress.filledCount} more {progress.totalCount - progress.filledCount === 1 ? 'field' : 'fields'}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold transition-all duration-500 ${
                progress.isComplete ? 'text-green-600 scale-110' : 'text-blue-600'
              }`}>
                {progress.percentage}%
              </div>
              <div className="text-xs text-gray-600">
                {progress.filledCount}/{progress.totalCount} complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                progress.isComplete
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}
              style={{ width: `${progress.percentage}%` }}
            >
              {progress.percentage > 10 && (
                <div className="h-full w-full bg-white/20 animate-pulse" />
              )}
            </div>
          </div>

          {/* Missing Fields Indicator */}
          {!progress.isComplete && progress.missingFields.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-600">Still needed:</span>
              {progress.missingFields.map((field) => (
                <span
                  key={field}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"
                >
                  {field}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Prompt - Shown when quota is 0 */}
      {quota && quota.remaining === 0 && (
        <UpgradePrompt quotaResetTime={quota.resetAt} featureName="university report generation" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Academic Profile */}
        <div className="bg-white rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
              1
            </span>
            Academic Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study *
              </label>
              <input
                type="text"
                required
                list="field-suggestions"
                value={formData.field}
                onChange={(e) => handleInputChange('field', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                placeholder="Type to see suggestions or enter your own..."
                aria-label="Field of Study"
                aria-required="true"
              />
              <datalist id="field-suggestions">
                {fieldSuggestions.map((field) => (
                  <option key={field} value={field} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-gray-500">
                💡 Choose from suggestions or type your own field of study
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree Level *
              </label>
              <select
                required
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select degree level</option>
                {degreeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA Scale *
                </label>
                <select
                  value={gpaScale}
                  onChange={(e) => {
                    setGpaScale(e.target.value as any)
                    setFormData(prev => ({ ...prev, gpa: 0 })) // Reset GPA when scale changes
                    setValidationErrors(prev => ({ ...prev, gpa: '' })) // Clear GPA validation errors
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  aria-label="GPA Scale"
                >
                  {gpaScales.map((scale) => (
                    <option key={scale.value} value={scale.value}>
                      {scale.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your GPA *
                </label>
                <input
                  key={gpaScale} // Force re-render when scale changes
                  type="number"
                  required
                  min="0"
                  max={getMaxGPA()}
                  step={gpaScale === '4.0' || gpaScale === '10.0' ? '0.01' : '1'}
                  value={formData['gpa'] || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    handleInputChange('gpa', value)
                    const error = validateGPA(value)
                    setValidationErrors(prev => ({ ...prev, gpa: error }))
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400 ${
                    validationErrors['gpa'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={gpaScales.find(s => s.value === gpaScale)?.placeholder}
                  aria-label="GPA Value"
                  aria-required="true"
                  aria-invalid={!!validationErrors['gpa']}
                  aria-describedby={validationErrors['gpa'] ? 'gpa-error' : undefined}
                />
                {validationErrors['gpa'] && (
                  <p id="gpa-error" role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors['gpa']}
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  aria-label="Budget Currency"
                >
                  {currencies.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Tuition Budget *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formData['budget'] || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    handleInputChange('budget', value)
                    const error = validateBudget(value)
                    setValidationErrors(prev => ({ ...prev, budget: error }))
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    validationErrors['budget'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="20000"
                  aria-label="Annual Tuition Budget"
                  aria-required="true"
                  aria-invalid={!!validationErrors['budget']}
                />
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>Maximum tuition fees per year (living expenses separate)</span>
                  {formData['budget'] > 0 && currency !== 'USD' && (
                    <span className="font-medium">
                      ≈ ${convertToUSD(formData['budget']).toLocaleString()} USD
                    </span>
                  )}
                </div>
                {validationErrors['budget'] && (
                  <p role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors['budget']}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold">
              2
            </span>
            Preferences
            <span className="text-sm font-normal text-gray-500">(Optional)</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                aria-label="Preferred Country"
              >
                <option value="">Any Country (Worldwide)</option>
                <optgroup label="🌟 Popular Study Destinations">
                  {popularCountries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                💡 Leave as &ldquo;Any Country&rdquo; for worldwide recommendations
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorities (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {priorityOptions.map((priority) => (
                  <label
                    key={priority.value}
                    className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.priorities?.includes(priority.value)}
                      onChange={() => togglePriority(priority.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                <span>Career Goal</span>
                <span className="text-xs font-normal text-gray-500">
                  {formData.careerGoal?.length || 0}/500 characters
                </span>
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={formData.careerGoal}
                onChange={(e) => handleInputChange('careerGoal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Become a data scientist at a tech company, Start my own business, Work in research..."
                aria-label="Career Goal"
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 Tip: Be specific about your 5-10 year career aspirations
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between gap-3">
          {/* Clear Draft Button */}
          {hasSavedDraft && (
            <button
              type="button"
              onClick={clearDraft}
              className="px-4 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Draft
            </button>
          )}

          <div className="flex-1" />

          <button
            type="submit"
            disabled={loading || quota?.remaining === 0 || !formData.field || !formData.degree || !formData['gpa'] || !formData['budget']}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Report...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate University Report
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Generated Report */}
      {generatedReport && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* IMPORTANT DISCLAIMER */}
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-2">⚠️ Important: Verify All Information</h3>
                <div className="text-sm text-amber-800 space-y-1">
                  <p>• <strong>Tuition fees, deposits, and living costs are AI estimates</strong> and may be outdated or inaccurate</p>
                  <p>• <strong>CAS deposits can range from £2,000 to 50% of annual tuition</strong> - contact universities directly</p>
                  <p>• <strong>Always verify current fees on official university websites</strong> before making decisions</p>
                  <p>• Check <a href="https://digital.ucas.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-900">UCAS</a> for official UK university information</p>
                  <p>• This report provides guidance on program fit - NOT guaranteed accurate financial data</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Personalized University Report</h2>
            <p className="mt-2 text-gray-600">{generatedReport.summary}</p>
          </div>

          {/* University Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Universities</h3>
            <div className="space-y-4">
              {generatedReport.recommendations.map((uni, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{uni.name}</h4>
                          <p className="text-sm text-gray-600">{uni.country}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {uni.ranking && (
                          <div>
                            <span className="font-medium text-gray-700">Ranking:</span>
                            <span className="ml-1 text-gray-600">{uni.ranking}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Tuition:</span>
                          <span className="ml-1 text-gray-600">{uni.tuitionRange}</span>
                        </div>
                        {uni.casDeposit && (
                          <div>
                            <span className="font-medium text-gray-700">CAS Deposit:</span>
                            <span className="ml-1 text-gray-600">{uni.casDeposit}</span>
                          </div>
                        )}
                        {uni.livingCosts && (
                          <div>
                            <span className="font-medium text-gray-700">Living Costs:</span>
                            <span className="ml-1 text-gray-600">{uni.livingCosts}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Admission Chance:</span>
                          <span
                            className={`ml-1 font-medium ${
                              uni.admissionProbability === 'high'
                                ? 'text-green-600'
                                : uni.admissionProbability === 'medium'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {uni.admissionProbability.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-700">{uni.reasoning}</p>

                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Program Strengths:</p>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                          {uni.strengths.map((strength, sIdx) => (
                            <li key={sIdx}>{strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700">
                        <strong>Program Fit:</strong> {uni.programFit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Tips */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Admission Tips for Your Profile</h3>
            <ul className="space-y-2">
              {generatedReport.admissionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification Reminder */}
          <div className="border-t pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Next Steps
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Visit each university&apos;s official website to verify current tuition fees</li>
                <li>2. Contact admissions offices directly to confirm CAS deposit requirements</li>
                <li>3. Check scholarship deadlines and application requirements</li>
                <li>4. Visit <a href="https://digital.ucas.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">UCAS</a> for official application information</li>
                <li>5. Consider attending virtual open days to learn more about each program</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => {
                const reportText = `
PERSONALIZED UNIVERSITY REPORT
Generated: ${new Date().toLocaleDateString()}

⚠️ IMPORTANT DISCLAIMER ⚠️
All tuition fees, CAS deposits, and living costs are AI ESTIMATES and may be outdated or inaccurate.
CAS deposits can range from £2,000 to 50% of annual tuition - verify with each university directly.
Always check official university websites and UCAS (https://digital.ucas.com) for current information.
This report provides guidance on program fit - NOT guaranteed accurate financial data.

SUMMARY:
${generatedReport.summary}

UNIVERSITY RECOMMENDATIONS:
${generatedReport.recommendations
  .map(
    (uni, idx) => `
${idx + 1}. ${uni.name} (${uni.country})
   Ranking: ${uni.ranking || 'N/A'}
   Tuition: ${uni.tuitionRange}${uni.casDeposit ? `\n   CAS Deposit: ${uni.casDeposit}` : ''}${uni.livingCosts ? `\n   Living Costs: ${uni.livingCosts}` : ''}
   Admission Probability: ${uni.admissionProbability.toUpperCase()}

   Why This University:
   ${uni.reasoning}

   Program Strengths:
   ${uni.strengths.map((s) => `   - ${s}`).join('\n')}

   Program Fit:
   ${uni.programFit}
`
  )
  .join('\n')}

ADMISSION TIPS:
${generatedReport.admissionTips.map((tip, idx) => `${idx + 1}. ${tip}`).join('\n')}
                `.trim()

                navigator.clipboard.writeText(reportText)
                alert('Report copied to clipboard!')
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
            >
              Copy Report
            </button>
            <button
              onClick={() => {
                const reportText = `
PERSONALIZED UNIVERSITY REPORT
Generated: ${new Date().toLocaleDateString()}

⚠️ IMPORTANT DISCLAIMER ⚠️
All tuition fees, CAS deposits, and living costs are AI ESTIMATES and may be outdated or inaccurate.
CAS deposits can range from £2,000 to 50% of annual tuition - verify with each university directly.
Always check official university websites and UCAS (https://digital.ucas.com) for current information.
This report provides guidance on program fit - NOT guaranteed accurate financial data.

SUMMARY:
${generatedReport.summary}

UNIVERSITY RECOMMENDATIONS:
${generatedReport.recommendations
  .map(
    (uni, idx) => `
${idx + 1}. ${uni.name} (${uni.country})
   Ranking: ${uni.ranking || 'N/A'}
   Tuition: ${uni.tuitionRange}${uni.casDeposit ? `\n   CAS Deposit: ${uni.casDeposit}` : ''}${uni.livingCosts ? `\n   Living Costs: ${uni.livingCosts}` : ''}
   Admission Probability: ${uni.admissionProbability.toUpperCase()}

   Why This University:
   ${uni.reasoning}

   Program Strengths:
   ${uni.strengths.map((s) => `   - ${s}`).join('\n')}

   Program Fit:
   ${uni.programFit}
`
  )
  .join('\n')}

ADMISSION TIPS:
${generatedReport.admissionTips.map((tip, idx) => `${idx + 1}. ${tip}`).join('\n')}
                `.trim()

                const blob = new Blob([reportText], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'university-selection-report.txt'
                a.click()
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Report
            </button>

            {/* Start Over Button */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to start over? This will clear the current report.')) {
                  setGeneratedReport(null)
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
      )}
    </div>
  )
}

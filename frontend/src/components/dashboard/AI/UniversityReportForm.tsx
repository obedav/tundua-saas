'use client'

import { useState } from 'react'
import type { UniversityReportRequest } from '@/lib/ai-addons-generator'
import {
  type GpaScale, type Currency,
  degreeOptions, priorityOptions, popularCountries, fieldSuggestions,
  gpaScales, currencies, getMaxGPA, convertToUSD, validateGPA, validateBudget,
} from './university-report-constants'

interface Props {
  formData: UniversityReportRequest
  setFormData: React.Dispatch<React.SetStateAction<UniversityReportRequest>>
  gpaScale: GpaScale
  setGpaScale: React.Dispatch<React.SetStateAction<GpaScale>>
  currency: Currency
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
  hasSavedDraft: boolean
  clearDraft: () => void
  loading: boolean
  quota: { remaining: number; resetAt: string } | null
  onSubmit: (e: React.FormEvent) => void
}

export default function UniversityReportForm({
  formData, setFormData,
  gpaScale, setGpaScale,
  currency, setCurrency,
  hasSavedDraft, clearDraft,
  loading, quota, onSubmit,
}: Props) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof UniversityReportRequest, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const togglePriority = (priority: string) =>
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities?.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...(prev.priorities || []), priority],
    }))

  const isDisabled = loading || quota?.remaining === 0 || !formData.field || !formData.degree || !(formData.gpa as number) || !(formData.budget as number)

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Academic Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">1</span>
          Academic Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field of Study *</label>
            <input
              type="text"
              required
              list="field-suggestions"
              value={formData.field}
              onChange={(e) => handleInputChange('field', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:bg-gray-700 dark:text-white"
              placeholder="Type to see suggestions or enter your own..."
            />
            <datalist id="field-suggestions">
              {fieldSuggestions.map(field => <option key={field} value={field} />)}
            </datalist>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Choose from suggestions or type your own field of study</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree Level *</label>
            <select
              required
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select degree level</option>
              {degreeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GPA Scale *</label>
              <select
                value={gpaScale}
                onChange={(e) => {
                  setGpaScale(e.target.value as GpaScale)
                  setFormData(prev => ({ ...prev, gpa: 0 }))
                  setValidationErrors(prev => ({ ...prev, gpa: '' }))
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {gpaScales.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your GPA *</label>
              <input
                key={gpaScale}
                type="number"
                required
                min="0"
                max={getMaxGPA(gpaScale)}
                step={gpaScale === '4.0' || gpaScale === '10.0' ? '0.01' : '1'}
                value={(formData.gpa as number) || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  handleInputChange('gpa', value)
                  setValidationErrors(prev => ({ ...prev, gpa: validateGPA(value, gpaScale) }))
                }}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all ${
                  validationErrors['gpa'] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder={gpaScales.find(s => s.value === gpaScale)?.placeholder}
                aria-invalid={!!validationErrors['gpa']}
              />
              {validationErrors['gpa'] && (
                <p role="alert" className="mt-1 text-sm text-red-600 flex items-center gap-1">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency *</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Tuition Budget *</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={(formData.budget as number) || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  handleInputChange('budget', value)
                  setValidationErrors(prev => ({ ...prev, budget: validateBudget(value) }))
                }}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  validationErrors['budget'] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="20000"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Maximum tuition fees per year (living expenses separate)</span>
                {(formData['budget'] as number) > 0 && currency !== 'USD' && (
                  <span className="font-medium">≈ ${convertToUSD(formData['budget'] as number, currency).toLocaleString()} USD</span>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold">2</span>
          Preferences
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Country</label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Any Country (Worldwide)</option>
              <optgroup label="🌟 Popular Study Destinations">
                {popularCountries.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </optgroup>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Leave as &ldquo;Any Country&rdquo; for worldwide recommendations</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priorities (Select all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {priorityOptions.map(priority => (
                <label key={priority.value} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.priorities?.includes(priority.value)}
                    onChange={() => togglePriority(priority.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{priority.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <span>Career Goal</span>
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{formData.careerGoal?.length || 0}/500 characters</span>
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={formData.careerGoal}
              onChange={(e) => handleInputChange('careerGoal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Become a data scientist at a tech company, Start my own business, Work in research..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Tip: Be specific about your 5-10 year career aspirations</p>
          </div>
        </div>
      </div>

      {/* Submit Row */}
      <div className="flex items-center justify-between gap-3">
        {hasSavedDraft && (
          <button
            type="button"
            onClick={clearDraft}
            className="px-4 py-2 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md transition-colors flex items-center gap-2"
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
          disabled={isDisabled}
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
  )
}

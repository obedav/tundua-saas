'use client'

import type { SOPGenerationRequest } from '@/lib/ai-addons-generator'

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

interface Props {
  formData: SOPGenerationRequest
  onChange: (field: keyof SOPGenerationRequest, value: string) => void
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Clear
    </button>
  )
}

export default function SOPExpressForm({ formData, onChange }: Props) {
  const clearField = (field: keyof SOPGenerationRequest, text: string) => {
    if (countWords(text) > 50) {
      if (confirm('Are you sure you want to clear this text?')) onChange(field, '')
    } else {
      onChange(field, '')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Essential Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Degree *</label>
            <input
              type="text"
              required
              value={formData.currentEducation}
              onChange={(e) => onChange('currentEducation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Bachelor's in Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Degree *</label>
            <input
              type="text"
              required
              value={formData.targetDegree}
              onChange={(e) => onChange('targetDegree', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Master's in Data Science"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target University *</label>
            <input
              type="text"
              required
              value={formData.targetUniversity}
              onChange={(e) => onChange('targetUniversity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Stanford University"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country *</label>
            <input
              type="text"
              required
              value={formData.targetCountry}
              onChange={(e) => onChange('targetCountry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="United States"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Background Points * <span className="text-xs text-gray-500">(3-5 bullet points)</span>
            </label>
            {formData.academicBackground && (
              <ClearButton onClick={() => clearField('academicBackground', formData.academicBackground)} />
            )}
          </div>
          <textarea
            required
            rows={6}
            value={formData.academicBackground}
            onChange={(e) => onChange('academicBackground', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="• Graduated with honors in Computer Science&#10;• Led university robotics team to national competition&#10;• Published research paper on machine learning&#10;• 2 years experience as software engineer&#10;• Passionate about AI and its applications in healthcare"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            List your key achievements, experience, and qualifications. AI will expand these into a compelling narrative.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Career Goal * <span className="text-xs text-gray-500">(1-2 sentences)</span>
            </label>
            {formData.careerGoals && (
              <ClearButton onClick={() => clearField('careerGoals', formData.careerGoals)} />
            )}
          </div>
          <textarea
            required
            rows={3}
            value={formData.careerGoals}
            onChange={(e) => onChange('careerGoals', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="I aim to become an AI research scientist developing accessible healthcare solutions for underserved communities."
          />
        </div>
      </div>
    </div>
  )
}

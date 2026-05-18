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

export default function SOPCustomForm({ formData, onChange }: Props) {
  const clearField = (field: keyof SOPGenerationRequest, text?: string) => {
    if (text && countWords(text) > 50) {
      if (confirm('Are you sure you want to clear this text?')) onChange(field, '')
    } else {
      onChange(field, '')
    }
  }

  const academicWords = countWords(formData.academicBackground)
  const careerWords = countWords(formData.careerGoals)
  const whyProgramWords = countWords(formData.whyThisProgram)

  return (
    <>
      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nationality *</label>
            <input
              type="text"
              required
              value={formData.nationality}
              onChange={(e) => onChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nigerian"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Education *</label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GPA (Optional)</label>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => onChange('gpa', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="3.8/4.0"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Work Experience (Optional)</label>
          <input
            type="text"
            value={formData.workExperience}
            onChange={(e) => onChange('workExperience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="2 years as Software Engineer at XYZ Corp"
          />
        </div>
      </div>

      {/* Target Program */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Target Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Country *</label>
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
      </div>

      {/* Your Story */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Story</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Write in your own words. Be authentic and specific. Minimum 200 words for each section.</p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Academic Background * <span className="text-xs text-gray-500">({academicWords}/200 words)</span>
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
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                academicWords < 200 ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Tell us about your academic journey, key courses, projects, research experience, etc. What sparked your interest in this field?"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Career Goals * <span className="text-xs text-gray-500">({careerWords}/200 words)</span>
              </label>
              {formData.careerGoals && (
                <ClearButton onClick={() => clearField('careerGoals', formData.careerGoals)} />
              )}
            </div>
            <textarea
              required
              rows={6}
              value={formData.careerGoals}
              onChange={(e) => onChange('careerGoals', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                careerWords < 200 ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="What do you want to achieve in your career? Short-term and long-term goals. Be specific."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Why This Program * <span className="text-xs text-gray-500">({whyProgramWords}/200 words)</span>
              </label>
              {formData.whyThisProgram && (
                <ClearButton onClick={() => clearField('whyThisProgram', formData.whyThisProgram)} />
              )}
            </div>
            <textarea
              required
              rows={6}
              value={formData.whyThisProgram}
              onChange={(e) => onChange('whyThisProgram', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                whyProgramWords < 200 ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Why this specific program at this university? Mention specific courses, faculty, research opportunities, or unique aspects of the program."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Achievements (Optional)</label>
              {formData.achievements && (
                <ClearButton onClick={() => clearField('achievements')} />
              )}
            </div>
            <textarea
              rows={4}
              value={formData.achievements}
              onChange={(e) => onChange('achievements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Awards, publications, leadership roles, significant projects, etc."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Challenges Overcome (Optional)</label>
              {formData.challenges && (
                <ClearButton onClick={() => clearField('challenges')} />
              )}
            </div>
            <textarea
              rows={4}
              value={formData.challenges}
              onChange={(e) => onChange('challenges', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Obstacles you've faced and how you overcame them. This adds depth to your story."
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tone</label>
            <select
              value={formData.tone}
              onChange={(e) => onChange('tone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="formal">Formal (Traditional Academic)</option>
              <option value="balanced">Balanced (Recommended)</option>
              <option value="conversational">Conversational (Personal)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Word Count</label>
            <input
              type="number"
              min="500"
              max="1000"
              step="50"
              value={formData.wordCount}
              onChange={(e) => onChange('wordCount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </>
  )
}

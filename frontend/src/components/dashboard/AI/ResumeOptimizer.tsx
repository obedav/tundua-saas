'use client'

/**
 * AI-Powered Resume Optimizer Component
 *
 * Optimizes resume/CV using AI for maximum impact
 */

import { useState, useEffect } from 'react'
import { optimizeResumeAction, checkAIQuotaAction } from '@/lib/actions/ai-addons'
import type { ResumeOptimizationRequest, ResumeOptimizationResponse } from '@/lib/ai-addons-generator'
import UpgradePrompt from './UpgradePrompt'
import { Document, Paragraph, HeadingLevel, AlignmentType, Packer } from 'docx'
import { saveAs } from 'file-saver'
import html2pdf from 'html2pdf.js'

export default function ResumeOptimizer() {
  const [loading, setLoading] = useState(false)
  const [optimizedResume, setOptimizedResume] = useState<ResumeOptimizationResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [quota, setQuota] = useState<{ remaining: number; resetAt: string } | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ResumeOptimizationRequest>({
    currentResume: '',
    targetField: '',
    targetLevel: '',
    targetCountry: '',
  })

  // Word count
  const resumeWords = formData.currentResume.trim().split(/\s+/).filter(Boolean).length

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

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showDownloadMenu && !target.closest('.download-dropdown')) {
        setShowDownloadMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDownloadMenu])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOptimizedResume(null)

    try {
      const result = await optimizeResumeAction(formData)

      if (!result.success) {
        setError(result.error || 'Failed to optimize resume')
        return
      }

      setOptimizedResume(result.data!)

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

  const handleInputChange = (field: keyof ResumeOptimizationRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const targetLevelOptions = [
    'Graduate School Application',
    'Entry-level Job (0-2 years)',
    'Mid-level Job (3-5 years)',
    'Senior-level Job (5+ years)',
    'Executive/Leadership Position',
    'Career Change',
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Score background color helper (currently unused)
  // const getScoreBg = (score: number) => {
  //   if (score >= 80) return 'bg-green-100'
  //   if (score >= 60) return 'bg-yellow-100'
  //   return 'bg-red-100'
  // }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Action Verbs': '⚡',
      'Quantification': '📊',
      'Relevance': '🎯',
      'Keywords': '🔑',
      'Structure': '📐',
      'Impact': '💥',
      'Technical Skills': '🛠️',
      'Professional Summary': '📝',
      'Work Experience': '💼',
      'Education': '🎓',
      'Formatting': '✨',
      'ATS Keywords': '🔍',
      'ATS Optimization': '🔍',
      'Clarity': '💡'
    }

    // Check for partial matches
    for (const [key, icon] of Object.entries(icons)) {
      if (category.toLowerCase().includes(key.toLowerCase())) {
        return icon
      }
    }

    return '📌' // Default icon
  }

  // Get priority badge for improvement
  const getPriorityBadge = (category: string, suggestions: string[]) => {
    // High priority: Action verbs, quantification, keywords
    const highPriority = ['action', 'verb', 'quantif', 'keyword', 'metric', 'number']
    // Medium priority: Structure, relevance, clarity
    const mediumPriority = ['structure', 'relevance', 'clarity', 'format', 'organization']

    const categoryLower = category.toLowerCase()
    const hasHighPriority = highPriority.some(word => categoryLower.includes(word))
    const hasMediumPriority = mediumPriority.some(word => categoryLower.includes(word))

    if (hasHighPriority || suggestions.length >= 4) {
      return { label: 'High', color: 'bg-red-100 text-red-700 border-red-300' }
    } else if (hasMediumPriority || suggestions.length >= 2) {
      return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' }
    } else {
      return { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-300' }
    }
  }

  // Confetti animation for high scores
  const triggerConfetti = () => {
    const duration = 2000
    const animationEnd = Date.now() + duration

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Create confetti elements
      for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div')
        confetti.style.position = 'fixed'
        confetti.style.width = '10px'
        confetti.style.height = '10px'
        const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)] || '#26ccff'
        confetti.style.left = Math.random() * window.innerWidth + 'px'
        confetti.style.top = '-10px'
        confetti.style.zIndex = '9999'
        confetti.style.pointerEvents = 'none'
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
        document.body.appendChild(confetti)

        const animation = confetti.animate([
          { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${randomInRange(-100, 100)}px, ${window.innerHeight}px) rotate(${randomInRange(0, 360)}deg)`, opacity: 0 }
        ], {
          duration: randomInRange(2000, 4000),
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        })

        animation.onfinish = () => confetti.remove()
      }
    }, 250)
  }

  // Trigger confetti for high scores
  useEffect(() => {
    if (optimizedResume && optimizedResume.overallScore >= 85) {
      setTimeout(() => triggerConfetti(), 300)
    }
  }, [optimizedResume])

  // Download as Word (.docx)
  const downloadAsWord = async () => {
    if (!optimizedResume) return

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "OPTIMIZED RESUME",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }), // Empty line
          ...optimizedResume.optimizedResume.split('\n').map(line =>
            new Paragraph({ text: line })
          ),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, 'optimized-resume.docx')
  }

  // Download as PDF
  const downloadAsPDF = () => {
    if (!optimizedResume) return

    const element = document.createElement('div')
    element.style.padding = '40px'
    element.style.fontFamily = 'Arial, sans-serif'
    element.style.fontSize = '12px'
    element.style.lineHeight = '1.6'
    element.innerHTML = `
      <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">OPTIMIZED RESUME</h1>
      <pre style="white-space: pre-wrap; font-family: inherit;">${optimizedResume.optimizedResume}</pre>
    `

    const opt = {
      margin: 0.5,
      filename: 'optimized-resume.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    }

    html2pdf().set(opt).from(element).save()
  }

  // Download as TXT
  const downloadAsTXT = () => {
    if (!optimizedResume) return

    const blob = new Blob([optimizedResume.optimizedResume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'optimized-resume.txt'
    a.click()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Resume/CV Optimizer</h1>
        <p className="mt-2 text-gray-600">
          Transform your resume with AI-powered optimization. Get stronger action verbs, quantified achievements, ATS optimization, and industry keywords.
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
        <UpgradePrompt quotaResetTime={quota.resetAt} featureName="resume optimization" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Field *
              </label>
              <input
                type="text"
                required
                value={formData.targetField}
                onChange={(e) => handleInputChange('targetField', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Data Science, Software Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Level *
              </label>
              <select
                required
                value={formData.targetLevel}
                onChange={(e) => handleInputChange('targetLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select target level</option>
                {targetLevelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Country (Optional)
              </label>
              <input
                type="text"
                value={formData.targetCountry}
                onChange={(e) => handleInputChange('targetCountry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., United States, Canada"
              />
            </div>
          </div>
        </div>

        {/* Current Resume */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Resume/CV</h2>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${resumeWords < 100 ? 'text-red-600' : 'text-gray-500'}`}>
                {resumeWords} words (minimum 100)
              </span>
              {resumeWords > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (resumeWords > 50) {
                      if (confirm('Are you sure you want to clear the resume text?')) {
                        handleInputChange('currentResume', '')
                      }
                    } else {
                      handleInputChange('currentResume', '')
                    }
                  }}
                  className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors flex items-center gap-1"
                  title="Clear resume text"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            required
            rows={20}
            value={formData.currentResume}
            onChange={(e) => handleInputChange('currentResume', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              resumeWords < 100 ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Paste your entire resume here. Include all sections: contact info, summary, experience, education, skills, etc.

Example:

John Doe
john.doe@email.com | +1-234-567-8900 | linkedin.com/in/johndoe

SUMMARY
Detail-oriented software engineer with 3 years of experience...

EXPERIENCE
Software Engineer | ABC Tech Corp | Jan 2021 - Present
- Developed and maintained web applications using React and Node.js
- Collaborated with cross-functional teams to deliver features
- Improved system performance by optimizing database queries

EDUCATION
Bachelor of Science in Computer Science
XYZ University | 2020 | GPA: 3.8/4.0

SKILLS
Programming: Python, JavaScript, Java
Frameworks: React, Node.js, Django
..."
          />

          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Paste your entire resume including formatting. The AI will analyze structure, content, and suggest improvements.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || quota?.remaining === 0 || resumeWords < 100 || !formData.targetField || !formData.targetLevel}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Optimizing Resume...' : 'Optimize Resume'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Optimized Resume */}
      {optimizedResume && (
        <div className="space-y-6">
          {/* Quality Score - Circular Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Overall Quality Score</h2>
            <div className="flex items-center justify-center">
              {/* Circular Progress Chart */}
              <div className="relative inline-flex items-center justify-center">
                <svg className="transform -rotate-90" width="200" height="200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke={
                      optimizedResume.overallScore >= 80
                        ? '#10b981'
                        : optimizedResume.overallScore >= 60
                        ? '#f59e0b'
                        : '#ef4444'
                    }
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 85}`}
                    strokeDashoffset={`${2 * Math.PI * 85 * (1 - optimizedResume.overallScore / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Score text in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-5xl font-bold ${getScoreColor(optimizedResume.overallScore)}`}>
                    {optimizedResume.overallScore}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">out of 100</div>
                  {optimizedResume.overallScore >= 85 && (
                    <div className="text-2xl mt-2">🎉</div>
                  )}
                  {optimizedResume.overallScore >= 70 && optimizedResume.overallScore < 85 && (
                    <div className="text-2xl mt-2">👍</div>
                  )}
                </div>
              </div>
            </div>
            {/* Score interpretation */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {optimizedResume.overallScore >= 85 && (
                  <span className="text-green-700 font-semibold">Excellent! Your resume is highly optimized. ✨</span>
                )}
                {optimizedResume.overallScore >= 70 && optimizedResume.overallScore < 85 && (
                  <span className="text-yellow-700 font-semibold">Good! A few improvements will make it excellent.</span>
                )}
                {optimizedResume.overallScore >= 60 && optimizedResume.overallScore < 70 && (
                  <span className="text-yellow-700 font-semibold">Decent, but needs work in key areas below.</span>
                )}
                {optimizedResume.overallScore < 60 && (
                  <span className="text-red-700 font-semibold">Needs significant improvements - focus on high priority items.</span>
                )}
              </p>
            </div>
          </div>

          {/* Improvements - With Icons and Priority Badges */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Improvements</h2>
            <div className="space-y-4">
              {optimizedResume.improvements.map((improvement, idx) => {
                const priority = getPriorityBadge(improvement.category, improvement.suggestions)
                const icon = getCategoryIcon(improvement.category)

                return (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                      priority.label === 'High'
                        ? 'border-red-200 bg-red-50'
                        : priority.label === 'Medium'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <h3 className="font-semibold text-gray-900">{improvement.category}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${priority.color}`}>
                        {priority.label} Priority
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {improvement.suggestions.map((suggestion, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Missing Elements - Enhanced */}
          {optimizedResume.missingElements.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-yellow-900 text-lg">Missing Elements</h3>
                <span className="ml-auto px-3 py-1 bg-yellow-200 text-yellow-900 text-xs font-semibold rounded-full">
                  {optimizedResume.missingElements.length} {optimizedResume.missingElements.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-sm text-yellow-800 mb-4">
                Adding these elements will significantly improve your resume&apos;s impact:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {optimizedResume.missingElements.map((element, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white border border-yellow-200 rounded-lg p-3 hover:border-yellow-400 transition-all"
                  >
                    <span className="text-yellow-600 text-lg mt-0.5">📋</span>
                    <span className="text-sm text-gray-800 flex-1">{element}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimized Resume Display */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Optimized Resume</h2>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showComparison ? 'Hide' : 'Show'} Before/After Comparison
              </button>
            </div>

            {showComparison ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 bg-red-50 p-2 rounded">
                    Before (Original)
                  </h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-xs text-gray-800 bg-gray-50 p-4 rounded border border-gray-200 h-96 overflow-y-auto">
                      {formData.currentResume}
                    </pre>
                  </div>
                </div>

                {/* After */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 bg-green-50 p-2 rounded">
                    After (Optimized)
                  </h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-xs text-gray-800 bg-gray-50 p-4 rounded border border-green-200 h-96 overflow-y-auto">
                      {optimizedResume.optimizedResume}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-6 rounded border border-gray-200">
                  {optimizedResume.optimizedResume}
                </pre>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(optimizedResume.optimizedResume)
                alert('Optimized resume copied to clipboard!')
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Copy Optimized Resume
            </button>
            {/* Download Dropdown */}
            <div className="relative download-dropdown">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDownloadMenu && (
                <div className="absolute bottom-full mb-2 left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      downloadAsWord()
                      setShowDownloadMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-sm text-gray-700 border-b border-gray-100"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Download as Word</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadAsPDF()
                      setShowDownloadMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-gray-700 border-b border-gray-100"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Download as PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadAsTXT()
                      setShowDownloadMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Download as TXT</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>

            {/* Start Over Button */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to start over? This will clear the current resume optimization.')) {
                  setOptimizedResume(null)
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

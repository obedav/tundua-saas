'use client'

import { useState } from 'react'
import type { SOPGenerationResponse } from '@/lib/ai-addons-generator'

interface Props {
  generatedSOP: SOPGenerationResponse
  onStartOver: () => void
}

function getQualityScore(quality: string): number {
  switch (quality) {
    case 'excellent': return 95
    case 'good': return 75
    case 'needs-review': return 55
    default: return 70
  }
}

const QUALITY_COLORS = {
  excellent: { stroke: '#10b981', text: 'text-green-600', badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400', msg: 'text-green-700 dark:text-green-400' },
  good: { stroke: '#3b82f6', text: 'text-blue-600', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400', msg: 'text-blue-700 dark:text-blue-400' },
  'needs-review': { stroke: '#f59e0b', text: 'text-yellow-600', badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400', msg: 'text-yellow-700 dark:text-yellow-400' },
} as const

export default function SOPResult({ generatedSOP, onStartOver }: Props) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const quality = generatedSOP.estimatedQuality as keyof typeof QUALITY_COLORS
  const colors = QUALITY_COLORS[quality] ?? QUALITY_COLORS['good']
  const score = getQualityScore(generatedSOP.estimatedQuality)
  const circumference = 2 * Math.PI * 75

  const downloadDoc = () => {
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Statement of Purpose</title>
<style>body{font-family:'Times New Roman',Times,serif;font-size:12pt;line-height:2.0;margin:1in}p{text-align:justify;margin-bottom:12pt}</style>
</head><body>${generatedSOP.sop.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}</body></html>`
    const url = URL.createObjectURL(new Blob([html], { type: 'application/msword' }))
    const a = document.createElement('a'); a.href = url; a.download = 'statement-of-purpose.doc'; a.click()
    URL.revokeObjectURL(url); setShowDownloadMenu(false)
  }

  const downloadTxt = () => {
    const url = URL.createObjectURL(new Blob([generatedSOP.sop], { type: 'text/plain' }))
    const a = document.createElement('a'); a.href = url; a.download = 'statement-of-purpose.txt'; a.click()
    URL.revokeObjectURL(url); setShowDownloadMenu(false)
  }

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? This will clear the current SOP.')) {
      onStartOver()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Quality Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SOP Quality Score</h2>
        <div className="flex items-center justify-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="transform -rotate-90" width="180" height="180">
              <circle cx="90" cy="90" r="75" stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="90" cy="90" r="75"
                stroke={colors.stroke}
                strokeWidth="10" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - score / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl font-bold ${colors.text}`}>{score}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">out of 100</div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                {generatedSOP.estimatedQuality}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className={`text-sm font-semibold ${colors.msg}`}>
            {quality === 'excellent' && 'Excellent! Your SOP is compelling and well-structured. ✨'}
            {quality === 'good' && 'Good! Review suggestions below to make it excellent.'}
            {quality === 'needs-review' && 'Needs improvement - please review suggestions carefully.'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <strong>Word Count:</strong> {generatedSOP.wordCount} words
          </p>
        </div>
      </div>

      {/* SOP Content + Suggestions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Statement of Purpose</h2>
        <div className="prose max-w-none">
          <div className="space-y-4">
            {generatedSOP.sop.split('\n\n').map((paragraph, idx) => (
              <div
                key={idx}
                className="relative pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="absolute left-2 top-3 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 w-5 h-5 rounded-full flex items-center justify-center">
                  {idx + 1}
                </div>
                <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-wrap">{paragraph}</p>
              </div>
            ))}
          </div>
        </div>

        {generatedSOP.suggestions.length > 0 && (
          <div className="border-t pt-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg">Suggestions for Improvement</h3>
                <span className="ml-auto px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 text-xs font-semibold rounded-full">
                  {generatedSOP.suggestions.length} {generatedSOP.suggestions.length === 1 ? 'tip' : 'tips'}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {generatedSOP.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-3 hover:border-blue-400 transition-all">
                    <span className="text-blue-600 dark:text-blue-400 text-lg mt-0.5">✓</span>
                    <span className="text-sm text-gray-800 dark:text-gray-300 flex-1">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex gap-3">
          {/* Download dropdown */}
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
            {showDownloadMenu && (
              <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[180px] z-10">
                <button onClick={downloadDoc} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Word Document (.doc)
                </button>
                <button onClick={downloadTxt} className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Text File (.txt)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => { navigator.clipboard.writeText(generatedSOP.sop); showToast('✓ SOP copied to clipboard!') }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-md transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>

          <button
            onClick={handleStartOver}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors border border-gray-300 dark:border-gray-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
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

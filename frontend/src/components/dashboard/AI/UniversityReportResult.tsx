'use client'

import type { UniversityReportResponse } from '@/lib/ai-addons-generator'

interface Props {
  report: UniversityReportResponse
  onStartOver: () => void
}

function buildReportText(report: UniversityReportResponse): string {
  return `PERSONALIZED UNIVERSITY REPORT
Generated: ${new Date().toLocaleDateString()}

⚠️ IMPORTANT DISCLAIMER ⚠️
All tuition fees, CAS deposits, and living costs are AI ESTIMATES and may be outdated or inaccurate.
CAS deposits can range from £2,000 to 50% of annual tuition - verify with each university directly.
Always check official university websites and UCAS (https://digital.ucas.com) for current information.
This report provides guidance on program fit - NOT guaranteed accurate financial data.

SUMMARY:
${report.summary}

UNIVERSITY RECOMMENDATIONS:
${report.recommendations.map((uni, idx) => `
${idx + 1}. ${uni.name} (${uni.country})
   Ranking: ${uni.ranking || 'N/A'}
   Tuition: ${uni.tuitionRange}${uni.casDeposit ? `\n   CAS Deposit: ${uni.casDeposit}` : ''}${uni.livingCosts ? `\n   Living Costs: ${uni.livingCosts}` : ''}
   Admission Probability: ${uni.admissionProbability.toUpperCase()}

   Why This University:
   ${uni.reasoning}

   Program Strengths:
   ${uni.strengths.map(s => `   - ${s}`).join('\n')}

   Program Fit:
   ${uni.programFit}
`).join('\n')}

ADMISSION TIPS:
${report.admissionTips.map((tip, idx) => `${idx + 1}. ${tip}`).join('\n')}`.trim()
}

export default function UniversityReportResult({ report, onStartOver }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(buildReportText(report))
    alert('Report copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([buildReportText(report)], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'university-selection-report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? This will clear the current report.')) {
      onStartOver()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-2">⚠️ Important: Verify All Information</h3>
            <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <p>• <strong>Tuition fees, deposits, and living costs are AI estimates</strong> and may be outdated or inaccurate</p>
              <p>• <strong>CAS deposits can range from £2,000 to 50% of annual tuition</strong> - contact universities directly</p>
              <p>• <strong>Always verify current fees on official university websites</strong> before making decisions</p>
              <p>• This report provides guidance on program fit - NOT guaranteed accurate financial data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Personalized University Report</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{report.summary}</p>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended Universities</h3>
        <div className="space-y-4">
          {report.recommendations.map((uni, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">{idx + 1}</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{uni.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{uni.country}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
                {uni.ranking && (
                  <div><span className="font-medium text-gray-700 dark:text-gray-300">Ranking:</span><span className="ml-1 text-gray-600 dark:text-gray-400">{uni.ranking}</span></div>
                )}
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Tuition:</span><span className="ml-1 text-gray-600 dark:text-gray-400">{uni.tuitionRange}</span></div>
                {uni.casDeposit && (
                  <div><span className="font-medium text-gray-700 dark:text-gray-300">CAS Deposit:</span><span className="ml-1 text-gray-600 dark:text-gray-400">{uni.casDeposit}</span></div>
                )}
                {uni.livingCosts && (
                  <div><span className="font-medium text-gray-700 dark:text-gray-300">Living Costs:</span><span className="ml-1 text-gray-600 dark:text-gray-400">{uni.livingCosts}</span></div>
                )}
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Admission Chance:</span>
                  <span className={`ml-1 font-medium ${
                    uni.admissionProbability === 'high' ? 'text-green-600' :
                    uni.admissionProbability === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{uni.admissionProbability.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{uni.reasoning}</p>

              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Program Strengths:</p>
                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                  {uni.strengths.map((strength, sIdx) => <li key={sIdx}>{strength}</li>)}
                </ul>
              </div>

              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-gray-700 dark:text-gray-300">
                <strong>Program Fit:</strong> {uni.programFit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admission Tips */}
      <div className="border-t dark:border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Admission Tips for Your Profile</h3>
        <ul className="space-y-2">
          {report.admissionTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps */}
      <div className="border-t dark:border-gray-700 pt-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Next Steps
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Visit each university&apos;s official website to verify current tuition fees</li>
            <li>2. Contact admissions offices directly to confirm CAS deposit requirements</li>
            <li>3. Check scholarship deadlines and application requirements</li>
            <li>4. Consider attending virtual open days to learn more about each program</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
        >
          Copy Report
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </button>
        <button
          onClick={handleStartOver}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors border border-gray-300 dark:border-gray-600 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start Over
        </button>
      </div>
    </div>
  )
}

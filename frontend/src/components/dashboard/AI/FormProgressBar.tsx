'use client'

interface ProgressData {
  filledCount: number
  totalCount: number
  percentage: number
  isComplete: boolean
  missingFields: string[]
}

interface Props {
  progress: ProgressData
}

export default function FormProgressBar({ progress }: Props) {
  return (
    <div className={`rounded-lg shadow p-5 border transition-all duration-500 ${
      progress.isComplete
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
        : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-700'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Form Progress
            {progress.isComplete && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-green-600 text-white rounded-full animate-bounce">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {progress.isComplete ? (
              <span className="text-green-600 font-medium animate-pulse">✓ All set! Ready to generate your personalized report</span>
            ) : (
              <span>Complete {progress.totalCount - progress.filledCount} more {progress.totalCount - progress.filledCount === 1 ? 'field' : 'fields'}</span>
            )}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold transition-all duration-500 ${progress.isComplete ? 'text-green-600 scale-110' : 'text-blue-600'}`}>
            {progress.percentage}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{progress.filledCount}/{progress.totalCount} complete</div>
        </div>
      </div>

      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out ${
            progress.isComplete ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          }`}
          style={{ width: `${progress.percentage}%` }}
        >
          {progress.percentage > 10 && <div className="h-full w-full bg-white/20 animate-pulse" />}
        </div>
      </div>

      {!progress.isComplete && progress.missingFields.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Still needed:</span>
          {progress.missingFields.map(field => (
            <span
              key={field}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700"
            >
              {field}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

type Mode = 'express' | 'custom'

interface Props {
  mode: Mode
  onModeChange: (mode: Mode) => void
}

export default function SOPModeSelector({ mode, onModeChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Generation Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onModeChange('express')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            mode === 'express'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-1 ${mode === 'express' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Express Mode</h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">Fast</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quick generation with minimal inputs. AI creates your story from key facts.</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">⏱️ ~2 minutes • 7 fields</p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('custom')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            mode === 'custom'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-1 ${mode === 'custom' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Custom Mode</h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full">Recommended</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Full control with detailed inputs. You write your story, AI structures and polishes it.</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">⏱️ ~10 minutes • Full detail</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

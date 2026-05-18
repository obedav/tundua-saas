"use client";

import { AlertCircle, ChevronLeft, ChevronRight, Copy, Loader2, RefreshCw } from "lucide-react";

interface Props {
  coverLetter: string;
  coverLetterLoading: boolean;
  applicantName: string;
  setApplicantName: (v: string) => void;
  applicantJob: string;
  setApplicantJob: (v: string) => void;
  specialCircumstances: string;
  setSpecialCircumstances: (v: string) => void;
  copied: boolean;
  onCopy: () => void;
  onRegenerate: (overrides?: { name?: string; job?: string; circumstances?: string }) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step4CoverLetter({
  coverLetter, coverLetterLoading,
  applicantName, setApplicantName,
  applicantJob, setApplicantJob,
  specialCircumstances, setSpecialCircumstances,
  copied, onCopy, onRegenerate,
  onBack, onNext,
}: Props) {
  return (
    <div>
      <div className="border-l-4 border-violet-500 pl-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI-generated cover letter</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">A personalised draft based on your details — edit before submitting</p>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 mb-5 text-sm text-amber-700 dark:text-amber-300">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>Personalise this letter with your real details before submitting. Fill in all placeholder fields marked with [ ].</span>
      </div>

      {/* macOS-style document viewer */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden mb-6 shadow-md">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
            <div className="h-3 w-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer" />
            <div className="h-3 w-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 text-center">
            <span className="font-mono text-xs text-gray-400 dark:text-gray-500">visa_cover_letter.txt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRegenerate({ name: applicantName, job: applicantJob, circumstances: specialCircumstances })}
              disabled={coverLetterLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              {coverLetterLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              Regenerate
            </button>
            <button
              onClick={onCopy}
              disabled={!coverLetter || coverLetterLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:shadow-none"
            >
              <Copy className="h-3 w-3" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="min-h-[220px] bg-[#fafaf9] dark:bg-gray-50 p-6">
          {coverLetterLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              <p className="text-sm text-gray-500">Generating your cover letter...</p>
            </div>
          ) : (
            <p className="font-serif text-sm text-gray-800 leading-7 whitespace-pre-wrap">
              {coverLetter || "Click Regenerate to generate your letter."}
            </p>
          )}
        </div>
      </div>

      {/* Personalisation form */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-600 p-5 mb-7 bg-gray-50/50 dark:bg-gray-700/20">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Personalise and regenerate</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Your full name</label>
            <input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="e.g. Chukwuemeka Adeyemi"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Your profession</label>
            <input
              type="text"
              value={applicantJob}
              onChange={(e) => setApplicantJob(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Special circumstances to mention</label>
            <input
              type="text"
              value={specialCircumstances}
              onChange={(e) => setSpecialCircumstances(e.target.value)}
              placeholder="e.g. attending sister's graduation, business conference..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onRegenerate({ name: applicantName, job: applicantJob, circumstances: specialCircumstances })}
            disabled={coverLetterLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Apply & Regenerate
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          Ask AI Questions <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

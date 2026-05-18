"use client";

import { Check, ChevronLeft, ChevronRight, Lightbulb, Loader2 } from "lucide-react";
import { DOCUMENT_SECTIONS, TOTAL_DOCS } from "../constants";

interface Props {
  destination: string;
  visaType: string;
  checkedDocs: Set<string>;
  setCheckedDocs: React.Dispatch<React.SetStateAction<Set<string>>>;
  aiTips: string[];
  tipsLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Documents({
  destination, visaType,
  checkedDocs, setCheckedDocs,
  aiTips, tipsLoading,
  onBack, onNext,
}: Props) {
  const checkedCount = checkedDocs.size;
  const progressPct = Math.round((checkedCount / TOTAL_DOCS) * 100);

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  return (
    <div>
      <div className="border-l-4 border-emerald-500 pl-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your document checklist</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Tailored for {destination} — {visaType} visa. Tick items as you gather them.
        </p>
      </div>

      {/* Circular progress */}
      <div className="flex items-center gap-5 mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
        <div className="relative flex-shrink-0 h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-gray-600" />
            <circle
              cx="32" cy="32" r="26" fill="none" stroke="url(#docProgress)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - progressPct / 100)}`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="docProgress" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{progressPct}%</span>
          </div>
        </div>
        <div>
          <div className="text-base font-semibold text-gray-900 dark:text-white">{checkedCount} of {TOTAL_DOCS} ready</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {progressPct === 100
              ? "All documents gathered — you're ready!"
              : `${TOTAL_DOCS - checkedCount} document${TOTAL_DOCS - checkedCount !== 1 ? "s" : ""} still needed`}
          </div>
        </div>
      </div>

      {/* Document sections */}
      {DOCUMENT_SECTIONS.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">{section.title}</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${section.badgeColor}`}>{section.badge}</span>
          </div>
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-700 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {section.docs.map((doc) => {
              const isChecked = checkedDocs.has(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`flex items-start gap-3.5 p-4 transition-colors ${
                    isChecked ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                  }`}
                >
                  <button
                    onClick={() => toggleDoc(doc.id)}
                    className={`mt-0.5 h-6 w-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isChecked
                        ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-transparent scale-110 shadow-md shadow-emerald-500/30"
                        : "border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:scale-105"
                    }`}
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${isChecked ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
                      {doc.name}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{doc.note}</div>
                    <span className={`inline-block text-xs font-semibold mt-1.5 px-2 py-0.5 rounded-full ${
                      doc.required
                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    }`}>
                      {doc.required ? "Required" : "Recommended"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* AI Tips */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 mb-7">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            AI tips for your {destination} {visaType} visa
          </span>
        </div>
        {tipsLoading ? (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating personalised tips...
          </div>
        ) : aiTips.length > 0 ? (
          <ul className="space-y-2">
            {aiTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-amber-700 dark:text-amber-300">
                <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Could not load AI tips. Try refreshing, or continue to the next step.
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          Generate Cover Letter <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

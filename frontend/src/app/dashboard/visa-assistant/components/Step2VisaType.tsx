"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { VISA_TYPES } from "../constants";

interface Props {
  visaType: string;
  setVisaType: (v: string) => void;
  travelPurpose: string;
  setTravelPurpose: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2VisaType({
  visaType, setVisaType,
  travelPurpose, setTravelPurpose,
  onBack, onNext,
}: Props) {
  return (
    <div>
      <div className="border-l-4 border-secondary-500 pl-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">What type of visa?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Select the category that matches your purpose of travel</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {VISA_TYPES.map(({ id, label, sub, icon: Icon }) => {
          const isSelected = visaType === label;
          return (
            <button
              key={id}
              onClick={() => setVisaType(label)}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? "border-primary-500 bg-gradient-to-b from-primary-50 to-secondary-50 dark:from-primary-900/25 dark:to-secondary-900/15 shadow-md shadow-primary-500/15"
                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm"
              }`}
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-br from-primary-500 to-secondary-500 shadow-md shadow-primary-500/30"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${isSelected ? "text-primary-700 dark:text-primary-300" : "text-gray-900 dark:text-white"}`}>
                  {label}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-7">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Brief purpose of travel</label>
        <textarea
          value={travelPurpose}
          onChange={(e) => setTravelPurpose(e.target.value)}
          placeholder="e.g. I plan to visit my brother in London and tour the country for 3 weeks..."
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!visaType}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200"
        >
          Generate Checklist <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

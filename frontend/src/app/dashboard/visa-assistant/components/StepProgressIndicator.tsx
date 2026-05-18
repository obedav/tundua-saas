"use client";

import { Check } from "lucide-react";
import type { StepNumber } from "../constants";
import { STEP_CONFIG } from "../constants";

interface Props {
  step: StepNumber;
  completedSteps: Set<StepNumber>;
  onStepClick: (n: StepNumber) => void;
}

export default function StepProgressIndicator({ step, completedSteps, onStepClick }: Props) {
  return (
    <div className="mb-6">
      {/* Desktop stepper */}
      <div className="hidden sm:flex items-start justify-between relative">
        <div className="absolute top-3.5 left-[4%] right-[4%] h-px bg-gray-200 dark:bg-gray-700" />
        <div
          className="absolute top-3.5 left-[4%] h-px bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700"
          style={{ width: `${((step - 1) / 5) * 92}%` }}
        />
        {STEP_CONFIG.map(({ n, label }) => {
          const isActive = step === n;
          const isDone = completedSteps.has(n) && !isActive;
          return (
            <button
              key={n}
              onClick={() => onStepClick(n)}
              className="flex flex-col items-center gap-2 z-10 group"
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-md shadow-primary-500/30"
                    : isActive
                    ? "bg-white dark:bg-gray-800 border-2 border-primary-500 text-primary-600 dark:text-primary-400 shadow-md shadow-primary-500/20 scale-110"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 group-hover:border-primary-300 group-hover:text-primary-500 transition-colors"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : isDone
                    ? "text-gray-600 dark:text-gray-400"
                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile fallback */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Step {step} of 6 —{" "}
            <span className="text-primary-600 dark:text-primary-400">
              {STEP_CONFIG.find((s) => s.n === step)?.label}
            </span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{step}/6</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700"
            style={{ width: `${((step - 1) / 5) * 100 + 100 / 6}%` }}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Check, ChevronLeft, Info } from "lucide-react";
import { TIMELINE_ITEMS } from "../constants";

interface Props {
  travelDate: string;
  onBack: () => void;
  onReset: () => void;
}

export default function Step6Timeline({ travelDate, onBack, onReset }: Props) {
  return (
    <div>
      <div className="border-l-4 border-secondary-500 pl-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application timeline</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track your progress from preparation to travel day</p>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-7 text-sm text-primary-700 dark:text-primary-300">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          Based on a target travel date in <strong>8 weeks</strong>
          {travelDate ? ` (${new Date(travelDate).toLocaleDateString("en-GB", { day: "numeric", month: "long" })})` : ""}.
        </span>
      </div>

      <div className="relative pl-12 mb-8">
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 dark:bg-gray-700" />
        <div
          className="absolute left-5 top-5 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500 transition-all duration-700"
          style={{ height: `${(1 / TIMELINE_ITEMS.length) * 100}%` }}
        />

        {TIMELINE_ITEMS.map((item, i) => (
          <div key={i} className="relative flex gap-4 mb-7 last:mb-0">
            <div
              className={`absolute -left-7 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-300 ${
                item.status === "done"
                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                  : item.status === "active"
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-100 dark:ring-amber-900/30"
                  : item.status === "target"
                  ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30"
                  : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-400 shadow-sm"
              }`}
            >
              {item.status === "done" ? (
                <Check className="h-5 w-5" />
              ) : item.status === "active" ? (
                <span className="text-base">→</span>
              ) : item.status === "target" ? (
                <span className="text-base">✈</span>
              ) : (
                i + 1
              )}
            </div>

            <div className="pt-1.5">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.date}</div>
              <span
                className={`inline-block text-xs font-semibold mt-1.5 px-2.5 py-0.5 rounded-full ${
                  item.status === "done"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : item.status === "active"
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    : item.status === "target"
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                }`}
              >
                {item.status === "done" ? "Completed" : item.status === "active" ? "In progress" : item.status === "target" ? "Target" : "Upcoming"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="relative rounded-2xl overflow-hidden p-5 mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-600 to-secondary-600" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
          <div>
            <div className="font-bold text-base mb-1">Need expert support?</div>
            <div className="text-sm opacity-80">
              Tundua&apos;s Fellow package includes full visa application support with a dedicated counsellor.
            </div>
          </div>
          <a
            href="mailto:tunduaedu@gmail.com?subject=Fellow Package — Visa Support"
            className="flex-shrink-0 bg-white text-primary-600 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-primary-50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Talk to a human →
          </a>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 text-sm font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Start new application
        </button>
      </div>
    </div>
  );
}

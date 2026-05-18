"use client";

import { Info, ChevronRight } from "lucide-react";
import { POPULAR_DESTINATIONS, ALL_COUNTRIES } from "../constants";

interface Props {
  destination: string;
  setDestination: (v: string) => void;
  travelDate: string;
  setTravelDate: (v: string) => void;
  stayDuration: string;
  setStayDuration: (v: string) => void;
  visitedBefore: string;
  setVisitedBefore: (v: string) => void;
  onNext: () => void;
}

export default function Step1Destination({
  destination, setDestination,
  travelDate, setTravelDate,
  stayDuration, setStayDuration,
  visitedBefore, setVisitedBefore,
  onNext,
}: Props) {
  return (
    <div>
      <div className="border-l-4 border-primary-500 pl-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Where are you going?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Select your destination and travel details</p>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-6 text-sm text-primary-700 dark:text-primary-300">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>Applications are tailored to Nigerian passport holders</span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Popular destinations</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {POPULAR_DESTINATIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setDestination(value)}
            className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
              destination === value
                ? "border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/20 text-primary-700 dark:text-primary-300 shadow-sm shadow-primary-500/10"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-600 dark:hover:text-primary-400 bg-white dark:bg-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Or select any country</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          >
            <option value="">Choose country...</option>
            {ALL_COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Intended travel date</label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Duration of stay</label>
          <select
            value={stayDuration}
            onChange={(e) => setStayDuration(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          >
            {["Less than 1 month", "1–3 months", "3–6 months", "6–12 months", "More than 1 year"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Have you visited before?</label>
          <select
            value={visitedBefore}
            onChange={(e) => setVisitedBefore(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          >
            {["No, first time", "Yes, once", "Yes, multiple times"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!destination}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

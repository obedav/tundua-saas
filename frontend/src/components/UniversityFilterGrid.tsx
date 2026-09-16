'use client';
import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface University {
  name: string;
  slug: string;
  city: string;
  region: string;
  flags: string[];
  note: string;
}

const FILTER_OPTIONS = ["All", "HND accepted", "Low deposit", "Jan intake", "2:2 accepted"] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export default function UniversityFilterGrid({ universities }: { universities: University[] }) {
  const [active, setActive] = useState<FilterOption>("All");

  const displayed = active === "All"
    ? universities
    : universities.filter((u) => u.flags.includes(active));

  return (
    <div>
      {/* Filter row */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              active === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* University cards */}
      {displayed.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">No universities match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayed.map((uni) => (
            <Link
              key={uni.slug}
              href={`/universities/${uni.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between mb-1.5">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{uni.name}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{uni.city}, {uni.region}
              </p>
              <p className="text-xs text-gray-600 mb-3">{uni.note}</p>
              <div className="flex flex-wrap gap-1.5">
                {uni.flags.map((flag) => (
                  <span
                    key={flag}
                    className={`text-xs border rounded-full px-2.5 py-0.5 ${
                      flag === active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      {active !== "All" && displayed.length > 0 && (
        <p className="text-xs text-gray-500 mt-3">{displayed.length} of {universities.length} universities match &ldquo;{active}&rdquo;</p>
      )}
    </div>
  );
}

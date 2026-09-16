'use client';
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  UK_STUDENT_VISA_FEE,
  UK_IHS_ANNUAL_RATE,
  UK_MAINTENANCE_LONDON_MONTHLY,
  UK_MAINTENANCE_OUTSIDE_LONDON_MONTHLY,
  UK_MAINTENANCE_PERIOD_MONTHS,
  UK_MAINTENANCE_LONDON_TOTAL,
  UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL,
  UK_MAINTENANCE_BANK_STATEMENT_DAYS,
} from "@/lib/constants/uk-data";

const COURSE_LENGTHS = [
  { label: "1 year", value: 1 },
  { label: "1.5 years", value: 1.5 },
  { label: "2 years", value: 2 },
  { label: "3 years (PhD)", value: 3 },
] as const;

type CourseLengthValue = 1 | 1.5 | 2 | 3;

export default function ProofOfFundsCalculator() {
  const [courseLength, setCourseLength] = useState<CourseLengthValue>(1);

  const ihsTotal = Math.ceil(UK_IHS_ANNUAL_RATE * courseLength);

  const londonRows = [
    {
      label: `Maintenance — London (£${UK_MAINTENANCE_LONDON_MONTHLY.toLocaleString()} × ${UK_MAINTENANCE_PERIOD_MONTHS} months)`,
      amount: UK_MAINTENANCE_LONDON_TOTAL,
      note: `Must be in bank ≥ ${UK_MAINTENANCE_BANK_STATEMENT_DAYS} days`,
    },
    {
      label: `UK Student Visa fee`,
      amount: UK_STUDENT_VISA_FEE,
      note: "As of 8 April 2026",
    },
    {
      label: `IHS — ${courseLength === 1.5 ? "18 months" : `${courseLength} year${courseLength > 1 ? "s" : ""}`} (£${UK_IHS_ANNUAL_RATE} × ${courseLength})`,
      amount: ihsTotal,
      note: "Paid upfront with visa",
    },
  ];

  const outsideRows = [
    {
      label: `Maintenance — Outside London (£${UK_MAINTENANCE_OUTSIDE_LONDON_MONTHLY.toLocaleString()} × ${UK_MAINTENANCE_PERIOD_MONTHS} months)`,
      amount: UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL,
      note: `Must be in bank ≥ ${UK_MAINTENANCE_BANK_STATEMENT_DAYS} days`,
    },
    {
      label: `UK Student Visa fee`,
      amount: UK_STUDENT_VISA_FEE,
      note: "As of 8 April 2026",
    },
    {
      label: `IHS — ${courseLength === 1.5 ? "18 months" : `${courseLength} year${courseLength > 1 ? "s" : ""}`} (£${UK_IHS_ANNUAL_RATE} × ${courseLength})`,
      amount: ihsTotal,
      note: "Paid upfront with visa",
    },
  ];

  const londonTotal = londonRows.reduce((s, r) => s + r.amount, 0);
  const outsideTotal = outsideRows.reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      {/* Course length toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Select your course length to update the IHS calculation:</p>
        <div className="flex flex-wrap gap-2">
          {COURSE_LENGTHS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setCourseLength(value as CourseLengthValue)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                courseLength === value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          IHS (£{UK_IHS_ANNUAL_RATE}/yr × {courseLength}) = <strong>£{ihsTotal.toLocaleString()}</strong>
        </p>
      </div>

      {/* Calculator grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* London */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">Studying in London</h2>
            <p className="text-sm text-blue-200 mt-0.5">Higher cost of living maintenance requirement</p>
          </div>
          <div className="p-5">
            {londonRows.map((row) => (
              <div key={row.label} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-800">{row.label}</p>
                  {row.note && <p className="text-xs text-gray-500 mt-0.5">{row.note}</p>}
                </div>
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">£{row.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t-2 border-blue-600 flex justify-between">
              <span className="font-bold text-gray-900">Estimated total</span>
              <span className="font-bold text-blue-600 text-lg">£{londonTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Outside London */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-teal-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">Studying Outside London</h2>
            <p className="text-sm text-teal-200 mt-0.5">Lower maintenance requirement than London</p>
          </div>
          <div className="p-5">
            {outsideRows.map((row) => (
              <div key={row.label} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-800">{row.label}</p>
                  {row.note && <p className="text-xs text-gray-500 mt-0.5">{row.note}</p>}
                </div>
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">£{row.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t-2 border-teal-600 flex justify-between">
              <span className="font-bold text-gray-900">Estimated total</span>
              <span className="font-bold text-teal-600 text-lg">£{outsideTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 28-day rule alert */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold mb-1">Important: The 28-day rule</p>
          <p>
            Your maintenance funds (London: £{UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()} / Outside London: £{UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}) must have been in the bank account continuously for at least <strong>{UK_MAINTENANCE_BANK_STATEMENT_DAYS} consecutive days</strong> before the date you submit your visa application. Funds moved in at the last minute will not be accepted.
          </p>
        </div>
      </div>
    </div>
  );
}

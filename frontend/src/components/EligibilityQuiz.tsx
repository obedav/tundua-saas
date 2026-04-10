"use client";

import { useState } from "react";
import { CheckCircle, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { trackEligibilityCheck, trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000";

const BUDGETS = [
  { id: "low", label: "Under ₦2M upfront", short: "Under ₦2M" },
  { id: "mid", label: "₦2M – ₦5M upfront", short: "₦2M–₦5M" },
  { id: "high", label: "Over ₦5M upfront", short: "Over ₦5M" },
];

const COURSES = [
  { id: "business", label: "Business / MBA" },
  { id: "computing", label: "Computing / IT" },
  { id: "nursing", label: "Nursing / Health" },
  { id: "engineering", label: "Engineering" },
  { id: "other", label: "Something else" },
];

interface EligibilityQuizProps {
  source?: string;
  /** Country context — changes quiz copy to match the article destination */
  country?: "uk" | "canada" | "australia";
}

const COUNTRY_LABELS: Record<string, string> = {
  uk: "UK",
  canada: "Canadian",
  australia: "Australian",
};

export function EligibilityQuiz({ source = "blog-eligibility-quiz", country = "uk" }: EligibilityQuizProps) {
  const countryLabel = COUNTRY_LABELS[country] || "UK";
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [budget, setBudget] = useState<typeof BUDGETS[number] | null>(null);
  const [course, setCourse] = useState<typeof COURSES[number] | null>(null);

  const handleBudget = (b: typeof BUDGETS[number]) => {
    setBudget(b);
    setStep(2);
  };

  const handleCourse = (c: typeof COURSES[number]) => {
    setCourse(c);
    setStep(3);
    if (budget) {
      trackEligibilityCheck(budget.id, c.id);
    }
  };

  const buildWhatsAppUrl = () => {
    const message = `Hi Tundua, I just used your eligibility check on the blog.

📊 My situation:
• Destination: ${countryLabel}
• Budget: ${budget?.label}
• Course: ${course?.label}

Can you send me a free shortlist of ${countryLabel} universities I qualify for?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const reset = () => {
    setStep(1);
    setBudget(null);
    setCourse(null);
  };

  return (
    <div className="my-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Free 30-Second Eligibility Check
        </span>
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Which {countryLabel} universities can you actually afford?
          </h3>
          <p className="text-sm text-gray-600 mb-5">
            Answer 2 quick questions and we&apos;ll match you to {countryLabel.toLowerCase()} schools that fit your budget.
          </p>
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Step 1 of 2 — How much can you pay upfront?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                onClick={() => handleBudget(b)}
                className="text-left px-4 py-3 bg-white border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl font-semibold text-sm text-gray-900 transition-all"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-sm text-amber-700 font-medium mb-2">
            ✓ Budget: {budget?.short}
          </p>
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Step 2 of 2 — What do you want to study?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COURSES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCourse(c)}
                className="text-left px-4 py-3 bg-white border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl font-semibold text-sm text-gray-900 transition-all"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && budget && course && (
        <div>
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Good news — you qualify for several {countryLabel} universities
              </h3>
              <p className="text-sm text-gray-700">
                Based on your budget ({budget.short}) and course choice ({course.label}), we have a personalised {countryLabel.toLowerCase()} shortlist ready.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Next step:</strong> Tap below to get your free shortlist on WhatsApp. We&apos;ll send 3–5 universities you qualify for, deposit amounts, and exact next steps — usually within 24 hours.
            </p>
          </div>

          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(source)}
            className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            Get My Free Shortlist on WhatsApp
            <ArrowRight className="w-5 h-5" />
          </a>

          <button
            onClick={reset}
            className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

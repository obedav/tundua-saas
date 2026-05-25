"use client";

import { useEffect, useState } from "react";
import { CheckCircle, MessageCircle, Sparkles, ArrowRight, Mail } from "lucide-react";
import { trackEligibilityCheck, trackFormStep, trackWhatsAppClick, trackQuizImpression, trackLeadFormSubmit } from "@/lib/analytics";

const WHATSAPP_NUMBER = process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000";

type BudgetOption = { id: string; label: string; short: string };
type CourseOption = { id: string; label: string };

// Country-specific budget tiers — reflects real upfront costs in each destination
const BUDGETS_BY_COUNTRY: Record<string, BudgetOption[]> = {
  uk: [
    { id: "low", label: "Under ₦10M upfront", short: "Under ₦10M" },
    { id: "mid", label: "₦10M – ₦20M upfront", short: "₦10M–₦20M" },
    { id: "high", label: "Over ₦20M upfront", short: "Over ₦20M" },
  ],
  canada: [
    { id: "low", label: "Under ₦10M upfront", short: "Under ₦10M" },
    { id: "mid", label: "₦10M – ₦20M upfront", short: "₦10M–₦20M" },
    { id: "high", label: "Over ₦20M upfront", short: "Over ₦20M" },
  ],
  australia: [
    { id: "low", label: "Under ₦10M upfront", short: "Under ₦10M" },
    { id: "mid", label: "₦10M – ₦20M upfront", short: "₦10M–₦20M" },
    { id: "high", label: "Over ₦20M upfront", short: "Over ₦20M" },
  ],
};

const COURSES: CourseOption[] = [
  { id: "business", label: "Business / MBA" },
  { id: "computing", label: "Computing / IT" },
  { id: "nursing", label: "Nursing / Health" },
  { id: "engineering", label: "Engineering" },
  { id: "other", label: "Something else" },
];

interface EligibilityQuizProps {
  source?: string;
  /** Country context — changes quiz copy and budget tiers to match the article destination */
  country?: "uk" | "canada" | "australia";
}

const COUNTRY_LABELS: Record<string, string> = {
  uk: "UK",
  canada: "Canadian",
  australia: "Australian",
};

type EmailState = "idle" | "submitting" | "done" | "error";

export function EligibilityQuiz({ source = "blog-eligibility-quiz", country = "uk" }: EligibilityQuizProps) {
  const countryLabel = COUNTRY_LABELS[country] || "UK";
  const budgets = (BUDGETS_BY_COUNTRY[country] ?? BUDGETS_BY_COUNTRY['uk']) as BudgetOption[];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [budget, setBudget] = useState<BudgetOption | null>(null);
  const [course, setCourse] = useState<CourseOption | null>(null);
  const [emailName, setEmailName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailState, setEmailState] = useState<EmailState>("idle");

  // Fire a quiz_impression event on mount — separate from form_step_completed so
  // the GA4 funnel reads: impression → step1 → step2 → whatsapp_click cleanly.
  useEffect(() => {
    trackQuizImpression(source);
  }, [source]);

  const handleBudget = (b: BudgetOption) => {
    setBudget(b);
    setStep(2);
    trackFormStep(source, 1, `budget:${b.id}`);
  };

  const handleCourse = (c: typeof COURSES[number]) => {
    setCourse(c);
    setStep(3);
    trackFormStep(source, 2, `course:${c.id}`);
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
    setEmailName("");
    setEmailAddress("");
    setEmailState("idle");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailState("submitting");
    try {
      const res = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/v1/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: emailName.trim(),
          email: emailAddress.trim(),
          source: `${source}-email-fallback`,
          budget: budget?.label,
          message: `Course: ${course?.label}. Destination: ${countryLabel}.`,
        }),
      });
      if (!res.ok) throw new Error("api error");
      trackLeadFormSubmit(`${source}-email-fallback`);
      setEmailState("done");
    } catch {
      setEmailState("error");
    }
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
            {budgets.map((b) => (
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
              <strong>Next step:</strong> Get your free shortlist of 3–5 universities you qualify for, {country === "australia" ? "tuition fees, CoE costs," : country === "canada" ? "tuition fees, permit costs," : "deposit amounts,"} and exact next steps — usually within 24 hours.
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

          <div className="mt-4">
            <p className="text-xs text-center text-gray-500 mb-3">Prefer email?</p>
            {emailState === "done" ? (
              <div className="flex items-center gap-2 justify-center bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">Shortlist sent — check your inbox within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  required
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  disabled={emailState === "submitting"}
                  className="inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {emailState === "submitting" ? "Sending…" : "Send"}
                </button>
              </form>
            )}
            {emailState === "error" && (
              <p className="text-xs text-red-600 mt-1 text-center">Something went wrong — try WhatsApp instead.</p>
            )}
          </div>

          <button
            onClick={reset}
            className="w-full mt-4 text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Loader2 } from "lucide-react";
import { trackLeadFormSubmit } from "@/lib/analytics";
import { getUtmPayload } from "@/lib/utm";

const TOOL_META = {
  sop: {
    headline: "Get Your Free AI-Written Statement of Purpose",
    sub: "Enter your details and we'll generate a professional SOP tailored to your profile — instantly.",
    cta: "Generate My SOP",
    source: "ai_sop_gate",
  },
  resume: {
    headline: "Optimize Your Resume with AI — Free",
    sub: "Drop your details below to access the AI Resume Optimizer and stand out from thousands of applicants.",
    cta: "Optimize My Resume",
    source: "ai_resume_gate",
  },
  "university-report": {
    headline: "Get 10 Personalized University Recommendations",
    sub: "Tell us who you are and our AI will match you with the best universities for your profile.",
    cta: "Get My University Report",
    source: "ai_uni_report_gate",
  },
  visa: {
    headline: "Start Your Visa Application — Free",
    sub: "Create your free account to access step-by-step visa guidance, document checklists, and AI-written cover letters.",
    cta: "Start for Free",
    source: "visa_gate",
  },
} as const;

type ToolKey = keyof typeof TOOL_META;

interface AIToolGateModalProps {
  tool: ToolKey;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIToolGateModal({ tool, isOpen, onClose }: AIToolGateModalProps) {
  const router = useRouter();
  const meta = TOOL_META[tool];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setWhatsapp("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env["NEXT_PUBLIC_API_URL"];
      if (apiUrl) {
        await fetch(`${apiUrl}/api/v1/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: whatsapp.trim() || undefined,
            source: meta.source,
            message: `AI tool gate: ${tool}`,
            utm: getUtmPayload(),
          }),
        });
      }
      trackLeadFormSubmit(meta.source);
    } catch {
      // Don't block the user if lead capture fails — proceed to register
    }

    const params = new URLSearchParams({
      email: email.trim().toLowerCase(),
      source: "ai-gate",
      tool,
    });
    router.push(`/auth/register?${params.toString()}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top gradient stripe */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500" />

        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
              100% FREE
            </span>
          </div>

          <h2
            id="gate-modal-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {meta.headline}
          </h2>
          <p className="text-sm text-gray-500 dark:text-stone-400 mb-6">{meta.sub}</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="gate-name" className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="gate-name"
                type="text"
                required
                autoComplete="name"
                placeholder="e.g. Adeola Okafor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="gate-email" className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="gate-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="gate-whatsapp" className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                WhatsApp Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="gate-whatsapp"
                type="tel"
                autoComplete="tel"
                placeholder="+234 800 000 0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up your account…
                </>
              ) : (
                meta.cta
              )}
            </button>

            <p className="text-xs text-center text-gray-400 dark:text-stone-500">
              No spam. We respect your privacy.{" "}
              <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";

interface LeadDetailsFormProps {
  leadId: number;
}

type SubmitState = "idle" | "submitting" | "done" | "error";

const BUDGETS = [
  "Under ₦10M upfront",
  "₦10M – ₦20M upfront",
  "Over ₦20M upfront",
  "Not sure yet",
];

export function LeadDetailsForm({ leadId }: LeadDetailsFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");

    try {
      const res = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/leads/${leadId}/details`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone, budget, message }),
        }
      );
      if (!res.ok) throw new Error("api error");
      setSubmitState("done");
    } catch {
      setSubmitState("error");
    }
  };

  const handleSkip = () => setSubmitState("done");

  if (submitState === "done") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">You&apos;re on the list!</h3>
        <p className="text-gray-600 mb-4">
          We&apos;ll review your details and reach out within 24 hours.
        </p>
        <p className="text-sm text-gray-500">
          Want a faster response?{" "}
          <a
            href={`https://wa.me/${process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000"}?text=${encodeURIComponent("Hi, I just submitted an application on tundua.com")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Chat on WhatsApp
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          You&apos;re in — while we prepare your consultation
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us a little more so we can personalise your shortlist. All fields are optional.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="details-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="details-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="details-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone / WhatsApp
            </label>
            <input
              type="tel"
              id="details-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="details-budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <select
            id="details-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select budget (optional)</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="details-message" className="block text-sm font-medium text-gray-700 mb-1">
            Anything else we should know?
          </label>
          <textarea
            id="details-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="e.g. I'm a nurse looking for a master's programme, ideally with a January intake"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {submitState === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              Something went wrong saving your details — we still have your application.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {submitState === "submitting" ? "Saving…" : "Submit Details"}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="px-6 py-3 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
}

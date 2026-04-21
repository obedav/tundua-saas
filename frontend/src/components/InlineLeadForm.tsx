"use client";

import { useState } from "react";
import { Send, CheckCircle, GraduationCap } from "lucide-react";
import { trackLeadFormSubmit } from "@/lib/analytics";
import { getUtmPayload } from "@/lib/utm";

export function InlineLeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: `${phone.replace(/\s+/g, "")}@whatsapp.lead`,
            phone,
            source: "blog-inline-lead",
            message: "Submitted via blog inline WhatsApp capture form.",
            utm: getUtmPayload(),
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        trackLeadFormSubmit("blog-inline-lead");
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      // Real network/CORS failure — tell the user. Do NOT fake success or fire
      // trackLeadFormSubmit; that's what put ghost leads in GA4 with ₦0 revenue.
      setError("Network error. Please try again or message us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
        <p className="font-semibold text-gray-900 mb-1">We got your details!</p>
        <p className="text-sm text-gray-600">
          Check your WhatsApp — we&apos;ll send your personalised university shortlist within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <GraduationCap className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gray-900">
            Want us to match you to the right university?
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Drop your name and WhatsApp number — we&apos;ll send you a FREE personalised university shortlist within 24 hours.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 ml-0 sm:ml-9">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="+234 WhatsApp number"
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
        >
          <Send className="w-4 h-4" />
          {loading ? "Sending..." : "Get My Free Shortlist"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 mt-2 ml-0 sm:ml-9">{error}</p>
      )}

      <p className="text-xs text-gray-400 mt-2 ml-0 sm:ml-9">
        No spam. We&apos;ll only message you about your university options.
      </p>
    </div>
  );
}

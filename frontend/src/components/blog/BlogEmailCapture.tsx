"use client";

import { useState } from "react";
import { Mail, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { trackLeadFormSubmit } from "@/lib/analytics";
import { getUtmPayload } from "@/lib/utm";

export function BlogEmailCapture() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env["NEXT_PUBLIC_API_URL"]}/api/v1/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "",
            email: email.trim(),
            phone: "",
            source: "blog-email-capture",
            message: "Subscribed via blog email capture.",
            utm: getUtmPayload(),
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        trackLeadFormSubmit("blog-email-capture");
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-10 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
        <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-900">You&apos;re in!</p>
          <p className="text-sm text-gray-600">
            We&apos;ll send you study abroad tips, visa guides, and funding opportunities straight to your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Get study abroad tips in your inbox
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Visa guides, cheapest universities, funding opportunities — delivered free, no spam.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

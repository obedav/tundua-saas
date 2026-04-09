"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { trackLeadFormSubmit } from "@/lib/analytics";

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  budget: string;
  message: string;
}

const COUNTRIES = [
  "United Kingdom",
  "Canada",
  "United States",
  "Australia",
  "Germany",
  "Ireland",
  "Other",
];

const BUDGETS = [
  "Under ₦100,000",
  "₦100,000 - ₦200,000",
  "₦200,000 - ₦500,000",
  "₦500,000+",
  "Not sure yet",
];

export function ApplyForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    country: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: "apply",
            message: `Phone: ${formData.phone}\nCountry: ${formData.country}\nBudget: ${formData.budget}\n\n${formData.message}`,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        trackLeadFormSubmit("apply-page");
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Received!</h3>
        <p className="text-gray-600 mb-4">
          We&apos;ll review your details and contact you within 24 hours.
        </p>
        <p className="text-sm text-gray-500">
          Want faster response?{" "}
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="apply-name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="apply-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="apply-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="apply-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label htmlFor="apply-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            id="apply-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="apply-country" className="block text-sm font-medium text-gray-700 mb-1">
            Country of Interest
          </label>
          <select
            id="apply-country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="apply-budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <select
            id="apply-budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select budget</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="apply-message" className="block text-sm font-medium text-gray-700 mb-1">
          Tell us about your goals <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="apply-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          placeholder="e.g. I want to study nursing in the UK starting September 2026"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        No payment required. We&apos;ll contact you to discuss next steps.
      </p>
    </form>
  );
}

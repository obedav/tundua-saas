"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { trackLeadFormSubmit } from "@/lib/analytics";
import { getUtmPayload } from "@/lib/utm";
import { LeadDetailsForm } from "@/components/LeadDetailsForm";

const COUNTRIES = [
  "United Kingdom",
  "Canada",
  "United States",
  "Australia",
  "Germany",
  "Ireland",
  "Other",
];

function generateStartDates(): string[] {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const now = new Date();
  const dates: string[] = [];
  for (let i = 1; i <= 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    dates.push(`${months[d.getMonth()]} ${d.getFullYear()}`);
  }
  return dates;
}

const START_DATES = generateStartDates();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormData {
  name: string;
  country: string;
  start_date: string;
  contact: string;
}

export function ApplyForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    country: "",
    start_date: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contact = formData.contact.trim();
    if (!contact) {
      setError("Please enter your email or WhatsApp number so we can reach you.");
      return;
    }

    setLoading(true);
    setError("");

    const isEmail = EMAIL_RE.test(contact);
    const contactPayload = isEmail ? { email: contact } : { phone: contact };

    try {
      const response = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            country: formData.country,
            start_date: formData.start_date,
            source: "apply-page",
            utm: getUtmPayload(),
            ...contactPayload,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeadId(data.lead_id);
        trackLeadFormSubmit("apply-page");
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || data?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again, or reach us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (leadId !== null) {
    return <LeadDetailsForm leadId={leadId} />;
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

      <div>
        <label htmlFor="apply-country" className="block text-sm font-medium text-gray-700 mb-1">
          Where do you want to study?
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
        <label htmlFor="apply-start-date" className="block text-sm font-medium text-gray-700 mb-1">
          When do you want to start?
        </label>
        <select
          id="apply-start-date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select intake month</option>
          {START_DATES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="apply-contact" className="block text-sm font-medium text-gray-700 mb-1">
          Email or WhatsApp number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="apply-contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
          placeholder="e.g. you@email.com or +234 800 000 0000"
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
        {loading ? "Submitting..." : "Get Started"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        No payment required. We&apos;ll contact you to discuss next steps.
      </p>
    </form>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle, ArrowRight, Sparkles, Award } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] || "https://tundua.com";

export const metadata: Metadata = {
  title: "Pricing - Study Abroad Application Packages",
  description:
    "Transparent pricing for Tundua's study abroad application packages. Free Seeker plan, Scholar at ₦49,999, and Fellow custom plan. No hidden fees.",
  alternates: {
    canonical: `${APP_URL}/pricing`,
  },
  openGraph: {
    title: "Pricing - Study Abroad Application Packages | Tundua",
    description:
      "Transparent pricing for study abroad application support. Free plan available. Scholar at ₦49,999 one-time.",
    url: `${APP_URL}/pricing`,
  },
};

const PLANS = [
  {
    name: "Seeker",
    price: "Free",
    priceNGN: "₦0",
    description: "Perfect for students exploring their options",
    features: [
      "University Search (5 searches/month)",
      "Document Checklist (1 application draft)",
      "Eligibility Check (1 check/month)",
      "Application Dashboard",
      "University Comparison (up to 3 schools)",
      "Community Forum",
      "Email Support (72hr response)",
    ],
    ctaHref: "/apply",
    ctaLabel: "Get Started Free",
    highlight: false,
    isFree: true,
  },
  {
    name: "Scholar",
    price: "$29.99",
    priceNGN: "₦49,999",
    description: "For serious applicants — all limits removed + human support",
    features: [
      "Unlimited University Search",
      "Unlimited Document Review",
      "Unlimited Eligibility Checks",
      "Essay Review & Editing",
      "Priority Email Support (24hr response)",
      "Deadline Management",
      "University Recommendations",
      "Scholarship Search",
      "Expert Human Support (live counselor)",
    ],
    ctaHref: "/auth/register",
    ctaLabel: "Get Started",
    highlight: true,
    isFree: false,
  },
  {
    name: "Fellow",
    price: "Custom",
    priceNGN: "Custom",
    description: "End-to-end support from application to visa",
    features: [
      "Everything in Scholar",
      "Unlimited Applications",
      "Complete SOP Writing",
      "Full Document Preparation",
      "Visa Application Support",
      "Interview Coaching",
      "Dedicated Account Manager",
      "WhatsApp Priority Support",
      "Pre-departure Orientation",
    ],
    ctaHref: "mailto:hello@tundua.com?subject=Fellow Package Inquiry",
    ctaLabel: "Contact Us",
    highlight: false,
    isFree: false,
    isCustom: true,
  },
];

const FAQS = [
  {
    question: "Is the Seeker plan really free forever?",
    answer: "Yes. The Seeker plan is completely free with no credit card required. You get 5 university searches per month, 1 application draft, and access to the dashboard for as long as you need it.",
  },
  {
    question: "Is the Scholar plan a one-time payment or a subscription?",
    answer: "Scholar is a one-time payment of $29.99 (₦49,999). There are no monthly fees, no renewals, and no hidden charges. You pay once and keep full access.",
  },
  {
    question: "What does the 90-day money-back guarantee cover?",
    answer: "If you are not satisfied with Tundua's service for any reason within 90 days of payment, we will issue a full refund — no questions asked. The guarantee applies to the Scholar plan.",
  },
  {
    question: "What is the difference between Scholar and Fellow?",
    answer: "Scholar gives you unlimited searches, document review, essay editing, and a live counselor. Fellow adds complete done-for-you support: we write your SOP, prepare all documents, handle your visa application, coach you for interviews, and assign a dedicated account manager who stays with you until you depart.",
  },
  {
    question: "Can I upgrade from Seeker to Scholar later?",
    answer: "Yes. You can upgrade at any time from inside your dashboard. All your existing data, documents, and application drafts are preserved when you upgrade.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept card payments via Stripe (USD) and Paystack (NGN). Nigerian bank cards, USSD, and bank transfers are all supported through Paystack. No foreign card is required for NGN payments.",
  },
];

// Offer schema for each paid plan
const offersSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Tundua Study Abroad Application Packages",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Offer",
        name: "Seeker Plan",
        description: "Free study abroad application platform for exploring options",
        price: "0",
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
        url: `${APP_URL}/apply`,
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Offer",
        name: "Scholar Plan",
        description: "Full study abroad application support with expert human counselor",
        price: "49999",
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
        url: `${APP_URL}/auth/register`,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Offer",
        name: "Fellow Plan",
        description: "End-to-end study abroad support from application to visa",
        availability: "https://schema.org/InStock",
        url: `${APP_URL}/contact`,
      },
    },
  ],
});

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />
      <Script
        id="structured-data-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: offersSchema }}
        strategy="beforeInteractive"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Honest Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No hidden fees. No surprise charges. Choose the plan that fits your study abroad journey.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 transition-all ${
                plan.highlight
                  ? "bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-2xl shadow-teal-500/30 scale-105"
                  : "bg-white border-2 border-gray-200 hover:border-primary-300 shadow-lg"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-6 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              {plan.isFree && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-1 rounded-full text-sm font-bold">
                  Free Forever
                </div>
              )}
              {plan.isCustom && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-bold">
                  VIP Service
                </div>
              )}

              <h2 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h2>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                {plan.isCustom ? (
                  <>
                    <div className="text-4xl font-bold text-amber-600">Custom</div>
                    <p className="text-amber-700 mt-1 font-medium">Contact for quote</p>
                  </>
                ) : plan.isFree ? (
                  <>
                    <div className="text-4xl font-bold text-emerald-600">FREE</div>
                    <p className="text-gray-500 mt-1">No credit card required</p>
                  </>
                ) : (
                  <>
                    <div className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </div>
                    <p className={`mt-1 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                      {plan.priceNGN} · One-time payment
                    </p>
                  </>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-green-300" : "text-green-600"}`} />
                    <span className={`text-sm ${plan.highlight ? "text-white" : "text-gray-700"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.isCustom ? (
                <a
                  href={plan.ctaHref}
                  className="block w-full text-center py-4 rounded-full font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl transition-all"
                >
                  {plan.ctaLabel}
                </a>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className={`block w-full text-center py-4 rounded-full font-semibold transition-all hover:shadow-xl ${
                    plan.highlight
                      ? "bg-white text-teal-600 hover:bg-blue-50"
                      : plan.isFree
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      : "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <p className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">90-Day Money-Back Guarantee</h2>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Not satisfied? Get a full refund within 90 days — no questions asked. We stand behind our service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
            >
              Start Free Application <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-full font-semibold hover:border-gray-300 transition-all"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </main>

      <FAQStructuredData faqs={FAQS} />

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

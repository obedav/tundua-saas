import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle, Info } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ProofOfFundsCalculator from "@/components/ProofOfFundsCalculator";
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

export const metadata: Metadata = {
  title: "UK Proof of Funds Calculator 2026 — How Much Money Do I Need for a UK Student Visa?",
  description: `Calculate exactly how much money you need in your bank account for a UK student visa. London students need £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()} (£${UK_MAINTENANCE_LONDON_MONTHLY.toLocaleString()} × ${UK_MAINTENANCE_PERIOD_MONTHS} months). Outside London: £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}. Plus visa fee £${UK_STUDENT_VISA_FEE} and IHS.`,
  alternates: { canonical: "/tools/proof-of-funds-calculator" },
  openGraph: {
    title: "UK Proof of Funds Calculator 2026",
    description: `How much money do you need for a UK student visa? London: £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()}. Outside London: £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}. Free calculator for Nigerian students.`,
    url: "/tools/proof-of-funds-calculator",
    type: "website",
  },
};

const FAQS = [
  {
    question: "How much money do I need in my bank for a UK student visa?",
    answer: `You need £${UK_MAINTENANCE_LONDON_MONTHLY.toLocaleString()} per month for ${UK_MAINTENANCE_PERIOD_MONTHS} months if studying in London (total £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()}), or £${UK_MAINTENANCE_OUTSIDE_LONDON_MONTHLY.toLocaleString()} per month for ${UK_MAINTENANCE_PERIOD_MONTHS} months if studying outside London (total £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}). These funds must have been in your account for at least ${UK_MAINTENANCE_BANK_STATEMENT_DAYS} consecutive days before your visa application.`,
  },
  {
    question: "What is the UK student visa fee in 2026?",
    answer: `The UK Student Visa (Student route) application fee is £${UK_STUDENT_VISA_FEE}. This changed from £524 to £${UK_STUDENT_VISA_FEE} on 8 April 2026. You pay this fee once per application, regardless of how long your course lasts.`,
  },
  {
    question: "What is the Immigration Health Surcharge (IHS)?",
    answer: `The Immigration Health Surcharge (IHS) is £${UK_IHS_ANNUAL_RATE} per year per adult applicant. It gives you access to the NHS during your stay. For a 2-year Master's programme you would pay £${(UK_IHS_ANNUAL_RATE * 2).toLocaleString()}. For a 3-year PhD you would pay £${(UK_IHS_ANNUAL_RATE * 3).toLocaleString()}.`,
  },
  {
    question: "Can my parents' or sponsor's funds count towards UK maintenance?",
    answer: "Yes. If a parent, relative, or official sponsor is funding your studies, their bank statement can be used — provided the funds have been in their account for at least 28 consecutive days, and the statement clearly shows the account holder's name and the account balance. A letter from the sponsor confirming financial support is also typically required.",
  },
];


export default function ProofOfFundsCalculatorPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav items={[{name:"Home",url:"/"},{name:"Tools",url:"/tools/university-finder"},{name:"Proof of Funds Calculator",url:"/tools/proof-of-funds-calculator"}]} />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/university-finder" },
          { name: "Proof of Funds Calculator", url: "/tools/proof-of-funds-calculator" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">UK Visa Cost Calculator — 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            UK Proof of Funds Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate exactly how much money you need in your bank account to qualify for a UK Student Visa — including maintenance funds, visa fee, and the Immigration Health Surcharge.
          </p>
        </div>

        {/* Verified data notice */}
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-900">Figures verified September 2026</p>
            <p className="text-sm text-green-800">
              Maintenance amounts set by UKVI. Visa fee of £{UK_STUDENT_VISA_FEE} applies from 8 April 2026.
              Sources: <a href="https://www.gov.uk/student-visa/money" className="underline" target="_blank" rel="noopener noreferrer">gov.uk/student-visa/money</a> and the{" "}
              <a href="https://www.gov.uk/government/publications/visa-regulations-revised-table" className="underline" target="_blank" rel="noopener noreferrer">Home Office fee schedule</a>.
            </p>
          </div>
        </div>

        <ProofOfFundsCalculator />

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed text-sm">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Ready to find universities within your budget?</h2>
          <p className="text-blue-100 mb-6">See which UK universities have the lowest deposit requirements so you can start studying sooner.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors"
            >
              Find Low-Deposit Universities
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Source note */}
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <p>
            All figures are sourced directly from official UKVI and Home Office guidance. The IHS and visa fee amounts are subject to change — always verify against{" "}
            <a href="https://www.gov.uk/student-visa" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">gov.uk/student-visa</a> before submitting your application. Last verified: September 2026.
          </p>
        </div>
      </main>
    </div>
  );
}

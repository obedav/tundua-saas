import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, AlertCircle } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import {
  UK_STUDENT_VISA_FEE,
  UK_IHS_ANNUAL_RATE,
  UK_MAINTENANCE_LONDON_TOTAL,
  UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL,
  UK_MAINTENANCE_BANK_STATEMENT_DAYS,
  UK_VISA_REFUSAL_RATES,
} from "@/lib/constants/uk-data";

export const metadata: Metadata = {
  title: `UK Student Visa for Nigerians 2026–27 — Requirements, Fees & Process`,
  description: `Complete guide to the UK Student Visa (Student route) for Nigerian applicants: fee £${UK_STUDENT_VISA_FEE}, maintenance requirement £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} (outside London), IHS £${UK_IHS_ANNUAL_RATE}/yr, refusal rate ${UK_VISA_REFUSAL_RATES.NG}%. Updated September 2026.`,
  alternates: { canonical: "/study-in-uk/visa" },
  openGraph: {
    title: "UK Student Visa for Nigerians 2026–27 — Requirements, Fees & Process",
    description: `UK Student Visa guide for Nigerians: £${UK_STUDENT_VISA_FEE} fee, £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} maintenance, ${UK_VISA_REFUSAL_RATES.NG}% refusal rate. Complete process guide.`,
    url: "/study-in-uk/visa",
    type: "article",
  },
};

const FAQS = [
  {
    question: "What is the UK Student Visa fee in 2026?",
    answer: `The UK Student Visa (Student route) fee is £${UK_STUDENT_VISA_FEE}. This increased from £524 to £${UK_STUDENT_VISA_FEE} on 8 April 2026. You pay this once per application. You also pay the Immigration Health Surcharge (IHS) upfront: £${UK_IHS_ANNUAL_RATE} per year. For a 2-year Master's, IHS totals £${(UK_IHS_ANNUAL_RATE * 2).toLocaleString()}.`,
  },
  {
    question: "How much maintenance do I need for a UK Student Visa?",
    answer: `You must show £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} in your bank account for 9 months if studying outside London, or £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()} if studying in London. These funds must have been present in your account for at least ${UK_MAINTENANCE_BANK_STATEMENT_DAYS} consecutive days before your application date.`,
  },
  {
    question: "What is the UK Student Visa refusal rate for Nigerians?",
    answer: `The UK Student Visa refusal rate for Nigerian applicants is approximately ${UK_VISA_REFUSAL_RATES.NG}% (latest published Home Office data). The main reasons for refusal are: insufficient maintenance funds, weak ties to Nigeria, inconsistent or incomplete documents, and poor performance at a credibility interview.`,
  },
  {
    question: "What documents do I need for a UK Student Visa from Nigeria?",
    answer: "Key documents include: a valid CAS (Confirmation of Acceptance for Studies) from your university, bank statements showing your maintenance funds held for 28+ days, academic transcripts and degree certificates, a valid international passport, a tuberculosis (TB) test certificate from an approved clinic, ATAS (Academic Technology Approval Scheme) certificate if required for your course, and English language evidence if not already satisfied by your CAS.",
  },
];

const PROCESS_STEPS = [
  { step: "1", title: "Receive a CAS from your university", detail: "Your university issues a CAS (Confirmation of Acceptance for Studies) number after you accept your offer and pay the initial deposit." },
  { step: "2", title: "Book TB test", detail: "Nigerian applicants must provide a TB (tuberculosis) test certificate from a UKVI-approved clinic in Nigeria. Common clinics: NCDC-approved facilities in Lagos and Abuja." },
  { step: "3", title: "Prepare your bank statements", detail: `Maintenance funds must be present for at least ${UK_MAINTENANCE_BANK_STATEMENT_DAYS} consecutive days. Ensure the correct amount: outside London £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}, London £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()}.` },
  { step: "4", title: "Apply online and pay fees", detail: `Complete the Student Visa application at gov.uk/student-visa. Pay the visa fee (£${UK_STUDENT_VISA_FEE}) and IHS upfront during the application.` },
  { step: "5", title: "Biometric appointment", detail: "Book and attend a biometrics appointment at a UKVCAS or VFS Global centre in Nigeria (Lagos or Abuja) to provide fingerprints and photo." },
  { step: "6", title: "Credibility interview (if requested)", detail: "Some Nigerian applicants are invited for a credibility interview at the British High Commission. Prepare to discuss your course choice, career plans, and financial situation honestly." },
  { step: "7", title: "Decision and BRP collection", detail: "Processing typically takes 3–8 weeks. If approved, collect your BRP (Biometric Residence Permit) upon arrival in the UK." },
];

export default function UKVisaPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK Student Visa", url: "/study-in-uk/visa" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK Student Visa", url: "/study-in-uk/visa" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline">← Study in the UK</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-4">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">Verified September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Student Visa for Nigerian Students (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about the UK Student Visa from Nigeria — fees, maintenance requirements, documents, process timeline, and how to avoid the most common refusal reasons.
          </p>
        </div>

        {/* Key figures */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Visa fee", value: `£${UK_STUDENT_VISA_FEE}`, note: "From Apr 2026" },
            { label: "IHS (per year)", value: `£${UK_IHS_ANNUAL_RATE}`, note: "Paid upfront" },
            { label: "Outside London maintenance", value: `£${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}`, note: "9 months required" },
            { label: "Nigeria refusal rate", value: `${UK_VISA_REFUSAL_RATES.NG}%`, note: "Latest data" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
            </div>
          ))}
        </div>

        {/* Process timeline */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">UK Student Visa process — step by step</h2>
          <ol className="space-y-4">
            {PROCESS_STEPS.map((s) => (
              <li key={s.step} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center flex-shrink-0">{s.step}</span>
                <div>
                  <p className="font-semibold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Common refusal reasons */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-2">Most common UK Student Visa refusal reasons for Nigerians</p>
            <ul className="space-y-1 list-disc list-inside">
              {[
                "Insufficient maintenance funds in bank account (or funds not held for 28 days)",
                "Poor response at credibility interview — weak explanation of course choice or career plans",
                "Inconsistent information between application form and supporting documents",
                "Missing or expired documents (TB test, CAS, transcripts)",
                "Previous visa refusals not disclosed",
              ].map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden" {...(i === 0 ? { open: true } : {})}>
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed text-sm">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Get visa guidance with your application</h2>
          <p className="text-purple-100 mb-5 text-sm">Tundua&apos;s counsellors help you prepare a strong visa application — documents, credibility interview prep, and bank statement guidance.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 font-semibold px-8 py-4 rounded-full hover:bg-purple-50 transition-colors">
            Start My Application <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/tools/proof-of-funds-calculator", label: "UK Proof of Funds Calculator" },
              { href: "/study-in-uk/cost", label: "Full cost of studying in the UK" },
              { href: "/visa", label: "Visa Assistant — AI visa guidance" },
              { href: "/study-in-uk", label: "Back to: Study in the UK" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center gap-2 text-sm text-blue-700 hover:underline">
                  <ArrowRight className="w-3.5 h-3.5" />{link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Globe } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK Universities Accepting WAEC 2027 — Entry Requirements for Nigerians",
  description: "Find UK universities that accept WAEC results for undergraduate and postgraduate admission in 2027. WAEC English, minimum grades required, and how WAEC compares to A-Levels for UK entry.",
  alternates: { canonical: "/study-in-uk/universities-accepting-waec" },
  openGraph: {
    title: "UK Universities Accepting WAEC 2027",
    description: "Which UK universities accept WAEC for admission? Entry requirements, minimum grades, and how WAEC compares to A-Levels.",
    url: "/study-in-uk/universities-accepting-waec",
    type: "article",
  },
};

const FAQS = [
  {
    question: "Do UK universities accept WAEC for admission?",
    answer: "Yes. UK universities accept WAEC (West African Examinations Council) results as evidence of secondary education. For undergraduate entry, WAEC is typically mapped to GCSE or A-Level equivalents by UK institutions. The WAEC grade B or above in 5 subjects (including English and Mathematics) is broadly equivalent to GCSE grades. For English language proficiency specifically, many UK universities accept a WAEC or NECO English Language result at grade B or C4.",
  },
  {
    question: "What WAEC grade is needed for UK university?",
    answer: "For English language purposes, most UK universities require a WAEC English Language result of grade B or C4 minimum. Some universities accept C5 or C6 with additional requirements. For subject-specific entry requirements, universities map WAEC grades against their entry criteria — typically requiring 5 subjects with grades B, B, C, C, C or better for competitive programmes.",
  },
  {
    question: "Can I use WAEC to satisfy the English language requirement for a UK Master's?",
    answer: "WAEC English can satisfy the English language requirement for some UK universities, typically in combination with an MOI (Medium of Instruction) letter for postgraduate applicants who hold a Nigerian degree. Acceptance varies — confirm with the specific university's international admissions office.",
  },
  {
    question: "Is WAEC equivalent to A-Levels for UK university entry?",
    answer: "WAEC SSCE (Senior School Certificate Examination) is broadly comparable to GCSE in the UK. It is not equivalent to A-Levels. For undergraduate entry to UK universities, Nigerian applicants typically need a first degree (undergraduate) from a recognised Nigerian institution, which the university maps to UK degree classifications. Some universities also accept JUPEB (Joint Universities Preliminary Examinations Board) as an A-Level equivalent.",
  },
];

export default function UKWAECPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "WAEC English Accepted", url: "/study-in-uk/universities-accepting-waec" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK Universities Accepting WAEC", url: "/study-in-uk/universities-accepting-waec" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline">← Study in the UK</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">WAEC Eligibility Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Universities Accepting WAEC (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            UK universities accept WAEC results for both undergraduate and postgraduate admission. This guide explains how WAEC is used for English language evidence, subject requirements, and what grades are typically required.
          </p>
        </div>

        {/* Quick reference */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">WAEC at UK universities — quick reference</h2>
          <div className="space-y-3">
            {[
              { ok: true, text: "WAEC English Language (grade B/C4 or better) accepted as English language evidence by many universities" },
              { ok: true, text: "WAEC SSCE results accepted as evidence of secondary education for undergraduate entry" },
              { ok: true, text: "WAEC + Nigerian degree (mapped to 2:1 or 2:2) is a standard entry profile for UK postgraduate programmes" },
              { ok: false, text: "WAEC alone is not equivalent to A-Levels for direct undergraduate entry without a foundation year or degree" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.ok ? "text-green-500" : "text-red-400"}`} />
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
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

        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Find universities that accept your qualifications</h2>
          <p className="text-blue-100 mb-5 text-sm">Enter your WAEC grades, degree, and target programme. Tundua returns universities that will accept your complete profile.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Check My Eligibility <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-uk/without-ielts", label: "UK universities without IELTS" },
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/tools/uk-university-eligibility-checker", label: "UK Eligibility Checker" },
              { href: "/visa", label: "AI Visa Assistant — personalised document checklist" },
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

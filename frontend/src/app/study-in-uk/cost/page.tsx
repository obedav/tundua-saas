import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PoundSterling, Calculator, CheckCircle, AlertCircle, Info } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import {
  UK_STUDENT_VISA_FEE,
  UK_IHS_ANNUAL_RATE,
  UK_MAINTENANCE_LONDON_MONTHLY,
  UK_MAINTENANCE_OUTSIDE_LONDON_MONTHLY,
  UK_MAINTENANCE_LONDON_TOTAL,
  UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL,
  UK_TUITION_LOW_GBP,
  UK_TUITION_HIGH_GBP,
} from "@/lib/constants/uk-data";

export const metadata: Metadata = {
  title: `Cost of Studying in the UK for Nigerian Students 2026–27 | Complete Budget Guide`,
  description: `Full breakdown of the cost of studying in the UK for Nigerians: tuition £${UK_TUITION_LOW_GBP.toLocaleString()}–£${UK_TUITION_HIGH_GBP.toLocaleString()}/yr, maintenance £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} (outside London), visa fee £${UK_STUDENT_VISA_FEE}, IHS £${UK_IHS_ANNUAL_RATE}/yr. Updated September 2026.`,
  alternates: { canonical: "/study-in-uk/cost" },
  openGraph: {
    title: "Cost of Studying in the UK for Nigerian Students 2026–27",
    description: `Tuition £${UK_TUITION_LOW_GBP.toLocaleString()}–£${UK_TUITION_HIGH_GBP.toLocaleString()}/yr · Maintenance £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} · Visa fee £${UK_STUDENT_VISA_FEE}. Complete budget guide for African students.`,
    url: "/study-in-uk/cost",
    type: "article",
  },
};

const FAQS = [
  {
    question: "How much does it cost to study in the UK per year for Nigerian students?",
    answer: `Total annual costs depend on your university and location. Tuition for international postgraduate students typically ranges from £${UK_TUITION_LOW_GBP.toLocaleString()} to £${UK_TUITION_HIGH_GBP.toLocaleString()} per year. Add living costs of £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} for 9 months outside London, or £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()} in London. First-year total (including visa fee and IHS for 2 years) is typically £${(UK_TUITION_LOW_GBP + UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL + UK_STUDENT_VISA_FEE + UK_IHS_ANNUAL_RATE * 2).toLocaleString()}–£${(UK_TUITION_HIGH_GBP + UK_MAINTENANCE_LONDON_TOTAL + UK_STUDENT_VISA_FEE + UK_IHS_ANNUAL_RATE * 2).toLocaleString()} for the first year.`,
  },
  {
    question: "What is the cheapest cost to study in the UK from Nigeria?",
    answer: `The cheapest UK universities for international students charge tuition of around £${UK_TUITION_LOW_GBP.toLocaleString()}–£12,000 per year. Combined with living costs outside London of approximately £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} per 9 months, a budget of around £${(UK_TUITION_LOW_GBP + UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL + UK_STUDENT_VISA_FEE + UK_IHS_ANNUAL_RATE).toLocaleString()} for the first year is achievable at the most affordable institutions.`,
  },
  {
    question: "What is the maintenance requirement for a UK student visa?",
    answer: `You must show £${UK_MAINTENANCE_LONDON_MONTHLY.toLocaleString()} per month for ${9} months (total: £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()}) if studying in London, or £${UK_MAINTENANCE_OUTSIDE_LONDON_MONTHLY.toLocaleString()} per month (total: £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}) if studying outside London. These funds must be in your bank account for at least 28 consecutive days before your visa application.`,
  },
  {
    question: "How much is the UK student visa fee in 2026?",
    answer: `The UK Student Visa fee is £${UK_STUDENT_VISA_FEE}. This increased from £524 to £${UK_STUDENT_VISA_FEE} on 8 April 2026. You also pay the Immigration Health Surcharge (IHS) of £${UK_IHS_ANNUAL_RATE} per year upfront with your visa application.`,
  },
];

const COST_ITEMS = [
  { category: "Tuition", low: UK_TUITION_LOW_GBP, high: UK_TUITION_HIGH_GBP, note: "Per academic year. Varies by university and programme." },
  { category: "Living — Outside London (9 months)", low: UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL, high: UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL, note: "UKVI minimum maintenance requirement." },
  { category: "Living — London (9 months)", low: UK_MAINTENANCE_LONDON_TOTAL, high: UK_MAINTENANCE_LONDON_TOTAL, note: "Higher London rate required by UKVI." },
  { category: "Visa fee", low: UK_STUDENT_VISA_FEE, high: UK_STUDENT_VISA_FEE, note: "One-time fee per application (from April 2026)." },
  { category: "IHS — 2-year Master's", low: UK_IHS_ANNUAL_RATE * 2, high: UK_IHS_ANNUAL_RATE * 2, note: "Immigration Health Surcharge: £776/year, paid upfront." },
  { category: "CAS deposit (initial)", low: 2_000, high: 10_000, note: "University-specific. Low-deposit universities from ~£2,000." },
  { category: "Flights (Lagos–UK)", low: 400, high: 900, note: "Economy return fare estimate." },
];

export default function UKCostPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Cost", url: "/study-in-uk/cost" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Cost of Studying in the UK", url: "/study-in-uk/cost" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            ← Study in the UK
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4">
            <PoundSterling className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Verified September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Cost of Studying in the UK for Nigerian Students (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            A complete breakdown of every cost: tuition, living expenses, visa fee, IHS, and CAS deposit — with figures verified against official sources.
          </p>
        </div>

        {/* Cost breakdown table */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-bold">Full cost breakdown — 2026–27 academic year</h2>
            <p className="text-sm text-blue-200 mt-0.5">Figures verified from UKVI and Home Office sources</p>
          </div>
          <div className="divide-y divide-gray-100">
            {COST_ITEMS.map((item) => (
              <div key={item.category} className="flex items-start justify-between px-6 py-4">
                <div className="flex-1 pr-4">
                  <p className="font-medium text-gray-900">{item.category}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  {item.low === item.high
                    ? <span className="font-bold text-gray-900">£{item.low.toLocaleString()}</span>
                    : <span className="font-bold text-gray-900">£{item.low.toLocaleString()}–£{item.high.toLocaleString()}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verified data notice */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-900">
            Maintenance figures set by UKVI. Visa fee of £{UK_STUDENT_VISA_FEE} applies from 8 April 2026. Tuition range is for international postgraduate. Sources:{" "}
            <a href="https://www.gov.uk/student-visa/money" className="underline" target="_blank" rel="noopener noreferrer">gov.uk/student-visa/money</a>,{" "}
            <a href="https://www.gov.uk/government/publications/visa-regulations-revised-table" className="underline" target="_blank" rel="noopener noreferrer">Home Office fee schedule</a>.
          </p>
        </div>

        {/* CTA to calculator */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Calculator className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Calculate your exact proof of funds</h3>
              <p className="text-sm text-gray-600 mb-3">Use our UK Proof of Funds Calculator to see exactly how much you need in your bank account to qualify for the UK Student Visa.</p>
              <Link href="/tools/proof-of-funds-calculator" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
                Open Proof of Funds Calculator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Low deposit note */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Reduce upfront costs with a low-deposit university</p>
            <p className="mb-2">The CAS deposit (the amount you pay to secure your place before your visa is approved) varies widely — from under £2,000 at some universities to over £10,000 at others. Choosing a low-deposit university can significantly reduce the cash you need upfront.</p>
            <Link href="/study-in-uk/low-deposit" className="font-semibold text-amber-800 hover:underline flex items-center gap-1">
              See UK universities with low deposit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section className="mb-10">
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

        {/* Internal links */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-uk/low-deposit", label: "UK universities with low tuition deposit" },
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/study-in-uk/without-ielts", label: "UK universities without IELTS" },
              { href: "/study-in-uk/visa", label: "UK student visa guide" },
              { href: "/tools/proof-of-funds-calculator", label: "UK Proof of Funds Calculator" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center gap-2 text-sm text-blue-700 hover:underline">
                  <ArrowRight className="w-3.5 h-3.5" />{link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <p>All fees verified September 2026. UKVI figures are subject to change — verify at <a href="https://www.gov.uk/student-visa" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">gov.uk/student-visa</a> before applying. Tundua is not affiliated with UKVI.</p>
        </div>
      </main>
    </div>
  );
}

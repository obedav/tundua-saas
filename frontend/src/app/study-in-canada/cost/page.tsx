import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import {
  CANADA_STUDY_PERMIT_FEE_CAD,
  CANADA_BIOMETRICS_FEE_CAD,
  CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD,
  CANADA_LIVING_FUNDS_QUEBEC_CAD,
  CANADA_MEDICAL_EXAM_FEE_USD,
  CANADA_MEDICAL_XRAY_FEE_USD,
  CANADA_TUITION_GRADUATE_LOW_CAD,
  CANADA_TUITION_GRADUATE_HIGH_CAD,
  CANADA_TUITION_UNDERGRADUATE_LOW_CAD,
  CANADA_TUITION_UNDERGRADUATE_HIGH_CAD,
  CANADA_TOTAL_PROOF_OF_FUNDS_GUIDE_CAD,
} from "@/lib/constants/canada-data";

export const metadata: Metadata = {
  title: `Cost of Studying in Canada 2026–27 — Full Breakdown for Nigerian Students`,
  description: `Full cost breakdown for studying in Canada: study permit CAD $${CANADA_STUDY_PERMIT_FEE_CAD}, living funds CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()}/yr, tuition CAD $${CANADA_TUITION_GRADUATE_LOW_CAD.toLocaleString()}–$${CANADA_TUITION_GRADUATE_HIGH_CAD.toLocaleString()}/yr, medical exam USD $${CANADA_MEDICAL_EXAM_FEE_USD}. Updated September 2026.`,
  alternates: { canonical: "/study-in-canada/cost" },
  openGraph: {
    title: "Cost of Studying in Canada 2026–27 — Full Breakdown",
    description: `Canada study costs for Nigerian students: tuition, living funds, permit fees, medical exam. September 2026.`,
    url: "/study-in-canada/cost",
    type: "article",
  },
};

const FAQS = [
  {
    question: "How much money do I need to show for a Canada study permit?",
    answer: `IRCC requires you to show sufficient funds to cover: (1) your tuition fees for the first year, (2) living expenses of CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()} per year outside Quebec (CAD $${CANADA_LIVING_FUNDS_QUEBEC_CAD.toLocaleString()} for Quebec), and (3) return transportation costs. As a rough total estimate for one year at a graduate level, budget for CAD $${CANADA_TOTAL_PROOF_OF_FUNDS_GUIDE_CAD.toLocaleString()} in accessible funds, though this varies by university tuition.`,
  },
  {
    question: "What is the Canada study permit application fee?",
    answer: `The Canada Study Permit application fee is CAD $${CANADA_STUDY_PERMIT_FEE_CAD}. Most Nigerian applicants also pay CAD $${CANADA_BIOMETRICS_FEE_CAD} for biometrics. These are non-refundable regardless of the outcome.`,
  },
  {
    question: "Do I need a medical exam for a Canada study permit from Nigeria?",
    answer: `Yes. Nigerian passport holders applying for a Canadian study permit are required to undergo an Immigration Medical Examination (IME) at an approved IOM panel physician in Lagos or Abuja. The fee is approximately USD $${CANADA_MEDICAL_EXAM_FEE_USD} for the medical examination, with an additional USD $${CANADA_MEDICAL_XRAY_FEE_USD} for a chest X-ray if required. Medical results are valid for 12 months.`,
  },
  {
    question: "Are tuition fees cheaper in Canada than the UK?",
    answer: `For graduate programmes, Canadian university tuition for international students is comparable to mid-range UK universities — typically CAD $${CANADA_TUITION_GRADUATE_LOW_CAD.toLocaleString()}–$${CANADA_TUITION_GRADUATE_HIGH_CAD.toLocaleString()}/yr vs £10,000–£17,000/yr in the UK. However, Canadian programmes are typically 2 years (vs 1 year in the UK), so the total tuition cost is often higher. Canada's advantage is the PGWP and stronger permanent residency pathway.`,
  },
  {
    question: "Is studying in Canada affordable for Nigerian students?",
    answer: "Canada is a significant financial commitment. The combination of tuition fees (typically 2 years), living costs, study permit fees, biometrics, and medical exam means you need to demonstrate substantial accessible funds. College programmes (diplomas) are typically cheaper than university degree programmes and are a popular route for Nigerian students aiming for PGWP eligibility and PR pathways.",
  },
];

const COST_ITEMS = [
  {
    category: "Application Fees",
    items: [
      { label: "Study Permit application fee", amount: `CAD $${CANADA_STUDY_PERMIT_FEE_CAD}`, note: "Non-refundable" },
      { label: "Biometrics fee", amount: `CAD $${CANADA_BIOMETRICS_FEE_CAD}`, note: "Most Nigerian applicants" },
      { label: "Medical exam (IOM Nigeria)", amount: `USD $${CANADA_MEDICAL_EXAM_FEE_USD}`, note: "Compulsory for Nigeria" },
      { label: "Chest X-ray (if required)", amount: `USD $${CANADA_MEDICAL_XRAY_FEE_USD}`, note: "Additional at IOM" },
    ],
  },
  {
    category: "Tuition (per year)",
    items: [
      { label: "Undergraduate — international", amount: `CAD $${CANADA_TUITION_UNDERGRADUATE_LOW_CAD.toLocaleString()}–$${CANADA_TUITION_UNDERGRADUATE_HIGH_CAD.toLocaleString()}`, note: "Varies widely by province & university" },
      { label: "Graduate (Master's)", amount: `CAD $${CANADA_TUITION_GRADUATE_LOW_CAD.toLocaleString()}–$${CANADA_TUITION_GRADUATE_HIGH_CAD.toLocaleString()}`, note: "Per year; most programmes are 2 years" },
      { label: "College diploma", amount: "CAD $8,000–$18,000", note: "Community colleges" },
    ],
  },
  {
    category: "Living Costs (per year)",
    items: [
      { label: "IRCC minimum living funds — outside Quebec", amount: `CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()}`, note: "Must be demonstrated at permit application" },
      { label: "IRCC minimum living funds — Quebec", amount: `CAD $${CANADA_LIVING_FUNDS_QUEBEC_CAD.toLocaleString()}`, note: "Higher for Quebec" },
      { label: "Typical actual living cost (major city)", amount: "CAD $15,000–$22,000", note: "Toronto/Vancouver higher" },
    ],
  },
];

export default function StudyInCanadaCostPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in Canada", url: "/study-in-canada" },
          { name: "Cost", url: "/study-in-canada/cost" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in Canada", url: "/study-in-canada" },
          { name: "Cost", url: "/study-in-canada/cost" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-canada" className="text-sm text-blue-600 hover:underline">← Study in Canada</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-4">
            <DollarSign className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Full Cost Breakdown — Updated September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Cost of Studying in Canada (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            Full breakdown of Canada study costs for Nigerian and African students: tuition, living expenses, study permit fees, biometrics, and medical examination. All figures sourced from IRCC official guidance.
          </p>
        </div>

        {/* Proof of funds alert */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Proof of funds requirement</p>
            <p>IRCC requires you to demonstrate you can cover tuition + CAD ${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()}/yr living costs + return transport. As a rough guide for 1 year, budget for <strong>CAD ${CANADA_TOTAL_PROOF_OF_FUNDS_GUIDE_CAD.toLocaleString()}</strong> in accessible funds. Funds must be in your (or a sponsor&apos;s) bank account.</p>
          </div>
        </div>

        {/* Cost tables */}
        {COST_ITEMS.map((section) => (
          <section key={section.category} className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">{section.category}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-start justify-between px-6 py-3.5 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    {item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
                  </div>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{item.amount}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Key totals */}
        <section className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-red-600" />
            Estimated total for year 1 (outside Quebec)
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Study permit + biometrics</span>
              <span className="font-semibold text-gray-900">CAD ${(CANADA_STUDY_PERMIT_FEE_CAD + CANADA_BIOMETRICS_FEE_CAD).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Medical exam (approx. in CAD)</span>
              <span className="font-semibold text-gray-900">~CAD $360</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Graduate tuition (lower estimate)</span>
              <span className="font-semibold text-gray-900">CAD ${CANADA_TUITION_GRADUATE_LOW_CAD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">IRCC living funds</span>
              <span className="font-semibold text-gray-900">CAD ${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Flights (estimate)</span>
              <span className="font-semibold text-gray-900">~CAD $1,500</span>
            </div>
            <div className="border-t border-red-300 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-gray-900">Minimum accessible funds (Year 1)</span>
              <span className="font-bold text-red-700">CAD ~$24,000+</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Estimates only. Tuition varies by university and programme. Actual living costs in major Canadian cities exceed IRCC minimums.</p>
        </section>

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

        {/* CTA */}
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Start your Canada application</h2>
          <p className="text-red-100 mb-5 text-sm">Tundua helps Nigerian students navigate the full Canada study process — from university selection to study permit application.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-red-700 font-semibold px-8 py-4 rounded-full hover:bg-red-50 transition-colors">
            Start Free Application <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-red-200">Free to start · No credit card required</p>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-canada", label: "Study in Canada — complete guide" },
              { href: "/study-in-canada/study-permit", label: "Canada study permit guide" },
              { href: "/study-in-uk/cost", label: "Cost of studying in the UK" },
              { href: "/tools/proof-of-funds-calculator", label: "UK Proof of Funds Calculator" },
              { href: "/visa", label: "AI Visa Assistant — Canada study permit checklist" },
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

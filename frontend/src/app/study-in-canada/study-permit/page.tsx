import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, AlertCircle, Globe, Clock } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import {
  CANADA_STUDY_PERMIT_FEE_CAD,
  CANADA_BIOMETRICS_FEE_CAD,
  CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD,
  CANADA_MEDICAL_EXAM_FEE_USD,
  CANADA_STUDY_PERMIT_PROCESSING_WEEKS,
  CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT,
  CANADA_PGWP_MAX_YEARS,
  CANADA_WORK_HOURS_ACADEMIC_SESSION,
} from "@/lib/constants/canada-data";

export const metadata: Metadata = {
  title: `Canada Study Permit Guide 2026 — Nigerian Students | IRCC Requirements`,
  description: `How to apply for a Canada study permit from Nigeria. Fee CAD $${CANADA_STUDY_PERMIT_FEE_CAD} + biometrics CAD $${CANADA_BIOMETRICS_FEE_CAD}. Refusal rate ~${CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT}%. Processing ${CANADA_STUDY_PERMIT_PROCESSING_WEEKS} weeks. Full IRCC requirements.`,
  alternates: { canonical: "/study-in-canada/study-permit" },
  openGraph: {
    title: "Canada Study Permit Guide 2026 — For Nigerian Students",
    description: `IRCC study permit guide: fees, documents, refusal rate ${CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT}%, and timeline for Nigerian applicants. September 2026.`,
    url: "/study-in-canada/study-permit",
    type: "article",
  },
};

const FAQS = [
  {
    question: "How much does a Canada study permit cost from Nigeria?",
    answer: `The Canada Study Permit application fee is CAD $${CANADA_STUDY_PERMIT_FEE_CAD}. Most Nigerian applicants also pay a CAD $${CANADA_BIOMETRICS_FEE_CAD} biometrics fee. You will also need to undergo a compulsory immigration medical examination at IOM Nigeria, which costs approximately USD $${CANADA_MEDICAL_EXAM_FEE_USD}. These fees are non-refundable.`,
  },
  {
    question: "What is the Canada study permit refusal rate for Nigerians?",
    answer: `The study permit refusal rate for Nigerian applicants is approximately ${CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT}% — one of the highest globally. The main reasons for refusal are: insufficient financial evidence, weak ties to Nigeria (the visa officer must be satisfied you will return after studies), incomplete documentation, and failure to meet IRCC's proof-of-funds requirements. Tundua's consultants help applicants prepare strong financial evidence and cover letters.`,
  },
  {
    question: "How long does Canada study permit processing take from Nigeria?",
    answer: `Current IRCC processing time estimates for study permit applications from Nigeria are approximately ${CANADA_STUDY_PERMIT_PROCESSING_WEEKS} weeks. Apply well in advance of your intended start date — most universities require you to have your permit before enrolment. Budget at least 3–4 months from submitting your application to your expected start date.`,
  },
  {
    question: "What documents do I need for a Canada study permit from Nigeria?",
    answer: "Required documents include: (1) Letter of Acceptance from a Designated Learning Institution (DLI), (2) Proof of financial support (bank statements showing tuition + living funds), (3) Valid passport, (4) Biometrics (enrolled at a VFS Global application centre in Nigeria), (5) Immigration Medical Examination results from IOM Lagos or Abuja, (6) Statement of Purpose / study plan, (7) Proof of ties to Nigeria. Some applicants may also need a police clearance certificate.",
  },
  {
    question: "Can I work in Canada while studying?",
    answer: `Yes. International students on a valid study permit can work up to ${CANADA_WORK_HOURS_ACADEMIC_SESSION} hours per week during academic sessions and full time during scheduled breaks. After graduating, eligible graduates can apply for the Post-Graduation Work Permit (PGWP) — valid for up to ${CANADA_PGWP_MAX_YEARS} years — which is the main pathway to Canadian Permanent Residency through Express Entry.`,
  },
];

const REQUIRED_DOCS = [
  "Letter of Acceptance from a Designated Learning Institution (DLI)",
  `Proof of funds: tuition fees + CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()}/yr living expenses`,
  "Valid Nigerian passport (min. 6 months validity beyond study end)",
  "Biometrics enrollment (VFS Global application centre)",
  "Immigration Medical Examination (IOM Lagos or Abuja)",
  "Statement of Purpose / Study plan",
  "Proof of ties to Nigeria (assets, family, employment)",
  "Police Clearance Certificate (if required)",
];

const REFUSAL_REASONS = [
  "Insufficient financial evidence — bank statements not meeting IRCC proof-of-funds",
  "Weak ties to home country — officer not satisfied applicant will return after studies",
  "Incomplete or inconsistent documents",
  "Unconvincing study plan / Statement of Purpose",
  "Gaps in academic or employment history not explained",
  "Medical inadmissibility",
];

const PROCESS_STEPS = [
  { step: "1", title: "Get your Letter of Acceptance", detail: "Apply to and receive an acceptance letter from a Designated Learning Institution (DLI) in Canada." },
  { step: "2", title: "Complete medical exam", detail: `Book and complete your Immigration Medical Examination at IOM Lagos or Abuja. Allow 4–6 weeks for results. Fee: ~USD $${CANADA_MEDICAL_EXAM_FEE_USD}.` },
  { step: "3", title: "Enroll biometrics", detail: "Book and attend a biometrics appointment at a VFS Global application centre. Fee: CAD $${CANADA_BIOMETRICS_FEE_CAD}." },
  { step: "4", title: "Prepare financial documents", detail: `Gather 6 months of bank statements demonstrating you hold tuition fees + CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()} living funds. A sponsor's documents may be accepted with a signed financial sponsorship letter.` },
  { step: "5", title: "Submit online application", detail: `Apply via IRCC's online portal. Application fee: CAD $${CANADA_STUDY_PERMIT_FEE_CAD}. Submit all documents in PDF format.` },
  { step: "6", title: "Wait for processing", detail: `Current processing time from Nigeria is approximately ${CANADA_STUDY_PERMIT_PROCESSING_WEEKS} weeks. Track your application via IRCC's online portal.` },
  { step: "7", title: "Receive decision & travel", detail: "If approved, your Port of Entry (POE) Letter of Introduction is issued. Present this on arrival in Canada. Your actual study permit is stamped at the Canadian port of entry." },
];

export default function CanadaStudyPermitPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in Canada", url: "/study-in-canada" },
          { name: "Study Permit", url: "/study-in-canada/study-permit" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in Canada", url: "/study-in-canada" },
          { name: "Study Permit", url: "/study-in-canada/study-permit" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-canada" className="text-sm text-blue-600 hover:underline">← Study in Canada</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-4">
            <Globe className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-800">IRCC Study Permit Guide — September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Canada Study Permit Guide for Nigerian Students (2026)
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about the Canada Study Permit: fees, required documents, financial evidence, processing times, and how to avoid the common refusal reasons Nigerian applicants face.
          </p>
        </div>

        {/* Key facts grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Permit fee", value: `CAD $${CANADA_STUDY_PERMIT_FEE_CAD}` },
            { label: "Biometrics fee", value: `CAD $${CANADA_BIOMETRICS_FEE_CAD}` },
            { label: "Processing time (NG)", value: `~${CANADA_STUDY_PERMIT_PROCESSING_WEEKS} weeks` },
            { label: "NG refusal rate", value: `~${CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT}%` },
          ].map((fact) => (
            <div key={fact.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">{fact.label}</p>
              <p className="text-base font-bold text-gray-900">{fact.value}</p>
            </div>
          ))}
        </div>

        {/* High refusal rate warning */}
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-900">
            <p className="font-semibold mb-1">~{CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT}% refusal rate — preparation matters</p>
            <p>Nigeria has one of the highest Canada study permit refusal rates globally. Strong financial evidence, clear ties to Nigeria, and a well-written study plan are essential. A weak application is very likely to be refused.</p>
          </div>
        </div>

        {/* Application process */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Application process — step by step
            </h2>
          </div>
          <ol className="divide-y divide-gray-100">
            {PROCESS_STEPS.map((s) => (
              <li key={s.step} className="flex gap-4 px-6 py-4">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{s.title}</p>
                  <p className="text-sm text-gray-600">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Required documents */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Required documents checklist</h2>
          <ul className="space-y-2">
            {REQUIRED_DOCS.map((doc) => (
              <li key={doc} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{doc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Common refusal reasons */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Common reasons Nigerian applicants are refused
          </h2>
          <ul className="space-y-2">
            {REFUSAL_REASONS.map((reason) => (
              <li key={reason} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                <span className="text-sm text-gray-800">{reason}</span>
              </li>
            ))}
          </ul>
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
          <h2 className="text-xl font-bold mb-2">Get expert help with your Canada study permit</h2>
          <p className="text-red-100 mb-5 text-sm">Tundua&apos;s consultants prepare your full study permit application — financial evidence, study plan, and document review — to maximise your approval chances.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-red-700 font-semibold px-8 py-4 rounded-full hover:bg-red-50 transition-colors">
            Start My Canada Application <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-red-200">Free to start · No credit card required</p>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-canada", label: "Study in Canada — complete guide" },
              { href: "/study-in-canada/cost", label: "Cost of studying in Canada 2026" },
              { href: "/study-in-uk/visa", label: "UK Student Visa guide" },
              { href: "/tools/proof-of-funds-calculator", label: "Proof of Funds Calculator" },
              { href: "/visa", label: "AI Visa Assistant — personalised document checklist" },
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

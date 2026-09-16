import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle, Globe, Sparkles } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import {
  CANADA_STUDY_PERMIT_FEE_CAD,
  CANADA_BIOMETRICS_FEE_CAD,
  CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD,
  CANADA_PGWP_MAX_YEARS,
  CANADA_WORK_HOURS_ACADEMIC_SESSION,
  CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT,
  CANADA_TUITION_GRADUATE_LOW_CAD,
  CANADA_TUITION_GRADUATE_HIGH_CAD,
} from "@/lib/constants/canada-data";

export const metadata: Metadata = {
  title: "Study in Canada — Complete Guide for Nigerian & African Students (2026–27)",
  description: `Everything Nigerian and African students need to know about studying in Canada: study permit fee CAD $${CANADA_STUDY_PERMIT_FEE_CAD}, living funds CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()}/yr, tuition CAD $${CANADA_TUITION_GRADUATE_LOW_CAD.toLocaleString()}–$${CANADA_TUITION_GRADUATE_HIGH_CAD.toLocaleString()}/yr, PGWP ${CANADA_PGWP_MAX_YEARS} years. Updated September 2026.`,
  alternates: { canonical: "/study-in-canada" },
  openGraph: {
    title: "Study in Canada — Complete Guide for Nigerian & African Students (2026–27)",
    description: "Canada study guide for Nigerian students: costs, study permit, universities, scholarships, and PGWP. September 2026.",
    url: "/study-in-canada",
    type: "website",
  },
};

const FAQS = [
  {
    question: "How much does it cost to study in Canada for Nigerian students?",
    answer: `Tuition at Canadian universities for international students ranges from approximately CAD $${CANADA_TUITION_GRADUATE_LOW_CAD.toLocaleString()} to $${CANADA_TUITION_GRADUATE_HIGH_CAD.toLocaleString()} per year for postgraduate programmes. You also need to show CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()} in living funds per year for your study permit application, plus tuition fees and transportation costs.`,
  },
  {
    question: "What is the Canada study permit fee?",
    answer: `The Canada Study Permit application fee is CAD $${CANADA_STUDY_PERMIT_FEE_CAD}. In addition, most Nigerian applicants pay CAD $${CANADA_BIOMETRICS_FEE_CAD} for biometrics. The study permit is issued by IRCC (Immigration, Refugees and Citizenship Canada).`,
  },
  {
    question: "Can I work in Canada while studying?",
    answer: `International students on a valid study permit can work up to ${CANADA_WORK_HOURS_ACADEMIC_SESSION} hours per week during academic sessions and full time during scheduled breaks. This applies to both on-campus and off-campus work since the November 2024 IRCC update.`,
  },
  {
    question: "What is the Post-Graduation Work Permit (PGWP) in Canada?",
    answer: `The PGWP allows international graduates to stay and work in Canada after graduation. The duration depends on your programme length — up to a maximum of ${CANADA_PGWP_MAX_YEARS} years. You can work for any employer. After gaining Canadian work experience, many graduates apply for Permanent Residency through Express Entry or Provincial Nominee Programmes.`,
  },
  {
    question: "What is the Canada study permit refusal rate for Nigerians?",
    answer: `The study permit refusal rate for Nigerian applicants is approximately ${CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT}% — significantly higher than for many other nationalities. The main refusal reasons are: insufficient financial evidence, weak ties to Nigeria (IRCC must believe you intend to return), incomplete documents, and inability to demonstrate you can cover tuition + living costs.`,
  },
];

const KEY_FACTS = [
  { label: "Study permit fee", value: `CAD $${CANADA_STUDY_PERMIT_FEE_CAD}` },
  { label: "Biometrics fee", value: `CAD $${CANADA_BIOMETRICS_FEE_CAD}` },
  { label: "Living funds req. (yr)", value: `CAD $${CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD.toLocaleString()}+` },
  { label: "Grad tuition range", value: `CAD $${CANADA_TUITION_GRADUATE_LOW_CAD.toLocaleString()}–$${CANADA_TUITION_GRADUATE_HIGH_CAD.toLocaleString()}` },
  { label: "Work rights (term)", value: `${CANADA_WORK_HOURS_ACADEMIC_SESSION} hrs/week` },
  { label: "PGWP duration", value: `Up to ${CANADA_PGWP_MAX_YEARS} years` },
  { label: "NG refusal rate", value: `~${CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT}%` },
];

const TOPIC_CLUSTERS = [
  {
    icon: GraduationCap,
    title: "Universities",
    links: [
      { label: "Canada universities with low deposit", href: "/study-in-canada/cost" },
      { label: "Canada universities accepting HND", href: "/apply" },
      { label: "Canada universities without IELTS", href: "/apply" },
      { label: "Browse all Canada universities", href: "/universities" },
    ],
  },
  {
    icon: Globe,
    title: "Study Permit",
    links: [
      { label: "Canada Study Permit guide", href: "/study-in-canada/study-permit" },
      { label: "Canada study permit fees 2026", href: "/study-in-canada/cost" },
      { label: "Canada medical exam in Nigeria", href: "/study-in-canada/study-permit" },
      { label: "Canada study permit refusal reasons", href: "/study-in-canada/study-permit" },
    ],
  },
  {
    icon: CheckCircle,
    title: "Costs & Funding",
    links: [
      { label: "Cost of studying in Canada 2026", href: "/study-in-canada/cost" },
      { label: "Canada universities low tuition deposit", href: "/study-in-canada/cost" },
      { label: "Canada scholarships for Nigerians", href: "/apply" },
    ],
  },
];

export default function StudyInCanadaPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in Canada", url: "/study-in-canada" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in Canada", url: "/study-in-canada" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-5">
            <span className="text-lg">🇨🇦</span>
            <span className="text-sm font-semibold text-red-800">Complete Canada Study Guide — Updated September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Study in Canada — Complete Guide<br />
            <span className="text-red-600">for Nigerian &amp; African Students</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Canada is the second most popular destination for Nigerian students after the UK. This guide covers universities, costs, study permit requirements, and the PGWP pathway to Canadian residency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-red-700 transition-colors">
              Start My Canada Application <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/study-in-canada/study-permit" className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold px-8 py-4 rounded-full border-2 border-gray-200 hover:border-red-300 transition-colors">
              <Globe className="w-5 h-5 text-red-500" />
              Study Permit Guide
            </Link>
          </div>
        </div>

        {/* Key facts */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-bold text-gray-900">Key facts — Canada study 2026–27</h2>
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full ml-auto">Verified Sep 2026</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {KEY_FACTS.map((fact) => (
              <div key={fact.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">{fact.label}</p>
                <p className="text-base font-bold text-gray-900">{fact.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Sources: IRCC canada.ca. Tuition range for international postgraduate. Verify official sources before applying.</p>
        </section>

        {/* Topic clusters */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Everything you need to know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TOPIC_CLUSTERS.map((cluster) => (
              <div key={cluster.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center mb-3">
                  <cluster.icon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{cluster.title}</h3>
                <ul className="space-y-2">
                  {cluster.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="flex items-center gap-1.5 text-sm text-blue-700 hover:underline">
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />{link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

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

        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 text-white text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Ready to apply to Canadian universities?</h2>
          <p className="text-red-100 mb-6">Tundua guides Nigerian and African students through every step of the Canada study process.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-red-700 font-semibold px-8 py-4 rounded-full hover:bg-red-50 transition-colors">
            Start Free Application <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-red-200">Free to start · No credit card required</p>
        </div>
      </main>
    </div>
  );
}

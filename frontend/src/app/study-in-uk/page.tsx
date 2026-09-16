import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, GraduationCap, PoundSterling, Globe, FileCheck,
  BookOpen, Users, CheckCircle, Calendar, Award, Sparkles,
} from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import {
  UK_STUDENT_VISA_FEE,
  UK_MAINTENANCE_LONDON_TOTAL,
  UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL,
  UK_TUITION_LOW_GBP,
  UK_TUITION_HIGH_GBP,
  UK_WORK_HOURS_TERM_TIME,
  UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS,
} from "@/lib/constants/uk-data";

export const metadata: Metadata = {
  title: "Study in the UK — Complete Guide for Nigerian & African Students (2026–27)",
  description: `Everything Nigerian and African students need to know about studying in the UK: universities, tuition costs (£${UK_TUITION_LOW_GBP.toLocaleString()}–£${UK_TUITION_HIGH_GBP.toLocaleString()}), visa requirements (fee: £${UK_STUDENT_VISA_FEE}), scholarships, proof of funds, and January 2027 intake deadlines.`,
  alternates: { canonical: "/study-in-uk" },
  openGraph: {
    title: "Study in the UK — Complete Guide for Nigerian & African Students (2026–27)",
    description: "Complete guide to studying in the UK for Nigerian students. Universities, costs, visa, scholarships, and eligibility. Updated September 2026.",
    url: "/study-in-uk",
    type: "website",
  },
};

const FAQS = [
  {
    question: "How much does it cost to study in the UK for Nigerian students?",
    answer: `Tuition for international students at UK universities typically ranges from £${UK_TUITION_LOW_GBP.toLocaleString()} to £${UK_TUITION_HIGH_GBP.toLocaleString()} per year for postgraduate programmes. You also need to budget for living costs, which are approximately £${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()} for 9 months outside London or £${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()} in London. The UK Student Visa fee is £${UK_STUDENT_VISA_FEE}.`,
  },
  {
    question: "Can I study in the UK without IELTS?",
    answer: "Yes. Many UK universities accept alternative English evidence, including a Medium of Instruction (MOI) letter from your degree-awarding institution, WAEC or NECO English results at grade B or C3, Duolingo English Test scores, or completion of a pre-sessional English programme. Requirements vary by university and programme.",
  },
  {
    question: "Which UK universities accept HND for Master's programmes?",
    answer: "A growing number of UK post-92 and modern universities accept HND for postgraduate admission. Commonly cited examples include the University of Sunderland, Teesside University, the University of South Wales, and the University of Portsmouth. An Upper Credit or Distinction grade is usually required. Work experience strengthens your application significantly.",
  },
  {
    question: "When is the January 2027 intake deadline for UK universities?",
    answer: "January 2027 intake deadlines vary by university, but most close applications between October and November 2026. Some universities accept late applications until December. If you are targeting January 2027, your application should ideally be submitted by October 2026 to allow time for offer letters, CAS issuance, and visa processing.",
  },
  {
    question: "What is the Graduate Route (post-study work visa) in the UK?",
    answer: `The Graduate Route allows international students to remain in the UK and work after graduating. Bachelor's and Master's graduates can stay for ${UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS} years. During this time you can work in any job at any skill level and can apply to switch to a Skilled Worker visa if you receive a qualifying job offer.`,
  },
];

const TOPIC_CLUSTERS = [
  {
    icon: PoundSterling,
    title: "Costs & Funding",
    color: "text-green-600",
    bg: "bg-green-50",
    links: [
      { label: "UK Proof of Funds Calculator", href: "/tools/proof-of-funds-calculator" },
      { label: "Cheapest UK universities for Nigerians", href: "/study-in-uk/low-deposit" },
      { label: "UK universities with low tuition deposit", href: "/study-in-uk/low-deposit" },
      { label: "UK scholarships for Nigerian students", href: "/apply" },
    ],
  },
  {
    icon: CheckCircle,
    title: "Eligibility",
    color: "text-blue-600",
    bg: "bg-blue-50",
    links: [
      { label: "UK University Eligibility Checker", href: "/tools/uk-university-eligibility-checker" },
      { label: "UK universities accepting HND", href: "/study-in-uk/universities-accepting-hnd" },
      { label: "UK universities accepting 2:2", href: "/study-in-uk/universities-accepting-2-2" },
      { label: "UK universities without IELTS", href: "/study-in-uk/without-ielts" },
    ],
  },
  {
    icon: Globe,
    title: "Student Visa",
    color: "text-purple-600",
    bg: "bg-purple-50",
    links: [
      { label: "UK Student Visa guide for Nigerians", href: "/visa" },
      { label: "UK visa requirements 2026", href: "/study-in-uk/visa" },
      { label: "UK credibility interview questions", href: "/study-in-uk/visa" },
      { label: "UK visa refusal reasons", href: "/study-in-uk/visa" },
    ],
  },
  {
    icon: Calendar,
    title: "Intakes & Deadlines",
    color: "text-orange-600",
    bg: "bg-orange-50",
    links: [
      { label: "January 2027 intake UK universities", href: "/intakes/january-2027/uk" },
      { label: "UK universities with January intake", href: "/study-in-uk/intakes" },
      { label: "University Finder — search by intake", href: "/tools/university-finder" },
    ],
  },
  {
    icon: FileCheck,
    title: "Application Documents",
    color: "text-teal-600",
    bg: "bg-teal-50",
    links: [
      { label: "AI SOP Generator", href: "/tools/sop-generator" },
      { label: "AI Resume Optimizer", href: "/apply" },
      { label: "UK CAS letter requirements", href: "/study-in-uk/visa" },
      { label: "28-day bank statement rule", href: "/tools/proof-of-funds-calculator" },
    ],
  },
  {
    icon: Award,
    title: "After Acceptance",
    color: "text-amber-600",
    bg: "bg-amber-50",
    links: [
      { label: "UK Graduate Route — post-study work", href: "/visa" },
      { label: "UK Tier 2 Skilled Worker visa", href: "/visa" },
      { label: `Working ${UK_WORK_HOURS_TERM_TIME} hours/week in the UK`, href: "/study-in-uk/visa" },
    ],
  },
];

const KEY_FACTS = [
  { label: "Tuition range", value: `£${UK_TUITION_LOW_GBP.toLocaleString()}–£${UK_TUITION_HIGH_GBP.toLocaleString()}/yr` },
  { label: "London maintenance (9 months)", value: `£${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()}` },
  { label: "Outside London (9 months)", value: `£${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}` },
  { label: "Visa fee (from Apr 2026)", value: `£${UK_STUDENT_VISA_FEE}` },
  { label: "Work rights (term time)", value: `${UK_WORK_HOURS_TERM_TIME} hrs/week` },
  { label: "Graduate Route", value: `${UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS} years post-graduation` },
];

export default function StudyInUKPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Complete UK Study Guide — Updated September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Study in the UK — Complete Guide<br />
            <span className="text-blue-600">for Nigerian &amp; African Students</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Everything you need to find a UK university, understand the visa requirements, calculate your proof of funds, and apply — whether you have a first class, 2:2, HND, or no IELTS score.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools/uk-university-eligibility-checker"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              Check My Eligibility
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tools/university-finder"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold px-8 py-4 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-600" />
              Find My Universities
            </Link>
          </div>
        </div>

        {/* Key facts table */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-bold text-gray-900">Key facts — UK study 2026–27</h2>
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full ml-auto">Verified Sep 2026</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {KEY_FACTS.map((fact) => (
              <div key={fact.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">{fact.label}</p>
                <p className="text-lg font-bold text-gray-900">{fact.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Sources: UKVI gov.uk, Home Office fee schedule. Tuition range for international postgraduate. Verify official sources before applying.</p>
        </section>

        {/* Topic clusters */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Everything you need to know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOPIC_CLUSTERS.map((cluster) => (
              <div key={cluster.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className={`w-9 h-9 ${cluster.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <cluster.icon className={`w-5 h-5 ${cluster.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{cluster.title}</h3>
                <ul className="space-y-2">
                  {cluster.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="flex items-center gap-1.5 text-sm text-blue-700 hover:underline">
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Why study in the UK */}
        <section className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl border border-blue-100 p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Nigerian students choose the UK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "1-year Master's programmes", body: "Unlike the USA or Canada, UK Master's programmes are typically 1 year, reducing total costs and time to graduation." },
              { title: "Graduate Route visa", body: `After graduating, you can stay and work in the UK for ${UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS} years on the Graduate Route — no job offer required.` },
              { title: "HND and 2:2 friendly universities", body: "Many UK universities accept qualifications that would not qualify for graduate school in North America." },
              { title: "January intakes available", body: "Unlike many countries, UK universities commonly offer January starts — giving more flexibility for applications." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ section */}
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

        {/* Apply CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Ready to apply to UK universities?</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Tundua guides Nigerian and African students through every step — from eligibility check to acceptance letter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors"
            >
              Start My UK Application — Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tools/uk-university-eligibility-checker"
              className="inline-flex items-center justify-center gap-2 bg-blue-500/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-500/50 transition-colors border border-white/20"
            >
              <BookOpen className="w-5 h-5" />
              Check My Eligibility First
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">Free to start · No credit card required</p>
        </div>
      </main>
    </div>
  );
}

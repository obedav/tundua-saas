import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, GraduationCap } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK Universities Without IELTS 2027 — Alternatives for Nigerian Students",
  description: "Study in the UK without IELTS. Find UK universities that accept MOI letters, WAEC English, Duolingo, or pre-sessional programmes instead of IELTS. Guide for Nigerian and African students 2026–27.",
  alternates: { canonical: "/study-in-uk/without-ielts" },
  openGraph: {
    title: "UK Universities Without IELTS 2027 — Alternatives for Nigerian Students",
    description: "UK universities that accept MOI letter, WAEC English, or Duolingo instead of IELTS. No-IELTS guide for Nigerian students.",
    url: "/study-in-uk/without-ielts",
    type: "article",
  },
};

const FAQS = [
  {
    question: "Can I study in the UK without IELTS?",
    answer: "Yes. Many UK universities accept alternative English language evidence in place of IELTS. The most common alternatives are: a Medium of Instruction (MOI) letter from your degree-awarding institution confirming you studied in English, WAEC or NECO English results (typically grade B or C3 minimum), Duolingo English Test scores, or successful completion of a pre-sessional English programme. Requirements vary by institution and programme.",
  },
  {
    question: "What is a Medium of Instruction (MOI) letter?",
    answer: "An MOI letter is an official letter from your university confirming that your undergraduate degree was taught entirely in English. It should be on headed paper, signed by a registrar or academic officer, and state the years you studied. Most Nigerian university degrees qualify since instruction is in English — you can usually obtain this letter from your academic registry office.",
  },
  {
    question: "Do UK universities accept WAEC English instead of IELTS?",
    answer: "Some UK universities accept strong WAEC or NECO English Language results (grade B, C4 or better) as evidence of English proficiency for undergraduate entry. For postgraduate entry, acceptance varies — many require either IELTS, an MOI letter, or pre-sessional attendance. Always check the specific programme requirements.",
  },
  {
    question: "What IELTS score is required for a UK Master's?",
    answer: "Most UK Master's programmes require IELTS Academic with an overall band score of 6.0–6.5, with no individual component below 5.5 or 6.0 depending on the university. Business programmes often require 6.5+. Programmes with clinical or language-intensive components (nursing, law, social work) may require 7.0+.",
  },
  {
    question: "Is the Duolingo English Test accepted by UK universities?",
    answer: "A growing number of UK universities now accept Duolingo English Test scores alongside or instead of IELTS. Typical requirements range from 100–115 on the Duolingo scale for programmes equivalent to IELTS 6.0–6.5. However, acceptance is not universal — check with each university before applying.",
  },
];

const ALTERNATIVES = [
  {
    method: "MOI Letter (Medium of Instruction)",
    accepted: "Very widely accepted",
    color: "bg-green-50 border-green-200 text-green-800",
    how: "Obtain from your university's registry office. Should confirm: language of instruction, years studied, and degree title.",
  },
  {
    method: "WAEC / NECO English Language — Grade B or C4",
    accepted: "Accepted at some universities for undergraduate",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    how: "Your WAEC certificate showing English Language grade. Less commonly accepted for postgraduate.",
  },
  {
    method: "Duolingo English Test",
    accepted: "Growing acceptance — verify per university",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    how: "Online test taken from home. Score range: 10–160. Most UK requirements: 100–115.",
  },
  {
    method: "PTE Academic",
    accepted: "Widely accepted as IELTS alternative",
    color: "bg-green-50 border-green-200 text-green-800",
    how: "Computer-based test. Accepted by most UK universities for UKVI purposes. Results available in 48 hours.",
  },
  {
    method: "Pre-sessional English programme",
    accepted: "Always accepted — guaranteed route",
    color: "bg-green-50 border-green-200 text-green-800",
    how: "Complete a 6–12 week English programme at the university before your degree. You receive a conditional offer, complete the English course, then progress directly to your Master's.",
  },
  {
    method: "Previous UK study",
    accepted: "Widely accepted",
    color: "bg-green-50 border-green-200 text-green-800",
    how: "If you have a degree or diploma from a UK institution studied in English, most universities waive the English language requirement.",
  },
];

export default function UKWithoutIELTSPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Without IELTS", url: "/study-in-uk/without-ielts" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK Universities Without IELTS", url: "/study-in-uk/without-ielts" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline">← Study in the UK</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">English Requirements Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Universities Without IELTS (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            You do not always need IELTS to study in the UK. Many universities accept alternatives — including MOI letters, WAEC English, Duolingo, or PTE Academic. This guide explains every option available to Nigerian students.
          </p>
        </div>

        {/* Alternatives table */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">IELTS alternatives accepted by UK universities</h2>
          <div className="space-y-3">
            {ALTERNATIVES.map((alt) => (
              <div key={alt.method} className={`border rounded-xl p-5 ${alt.color}`}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <p className="font-bold">{alt.method}</p>
                  <span className="text-xs font-semibold bg-white/50 px-2 py-1 rounded-full">{alt.accepted}</span>
                </div>
                <p className="text-sm opacity-80">{alt.how}</p>
              </div>
            ))}
          </div>
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

        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Find universities that accept your English evidence</h2>
          <p className="text-blue-100 mb-5 text-sm">Tell Tundua your English qualification — MOI letter, WAEC, Duolingo, or PTE — and we&apos;ll match you with universities that will accept it.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Find My No-IELTS Universities <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-uk/universities-accepting-waec", label: "UK universities accepting WAEC" },
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/study-in-uk/universities-accepting-2-2", label: "UK universities accepting 2:2" },
              { href: "/tools/uk-university-eligibility-checker", label: "UK Eligibility Checker" },
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

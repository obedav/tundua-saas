import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, GraduationCap } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK Universities Accepting 2:2 for Master's 2027 — Full Guide for Nigerians",
  description: "Find UK universities that accept a 2:2 (lower second class) for postgraduate Master's programmes in 2027. Which universities, what courses, and how to strengthen a 2:2 application.",
  alternates: { canonical: "/study-in-uk/universities-accepting-2-2" },
  openGraph: {
    title: "UK Universities Accepting 2:2 for Master's 2027",
    description: "Which UK universities accept 2:2 for postgraduate study? Full guide for Nigerian students with lower second-class degrees.",
    url: "/study-in-uk/universities-accepting-2-2",
    type: "article",
  },
};

const FAQS = [
  {
    question: "Can I get into a UK Master's with a 2:2?",
    answer: "Yes. Most UK universities accept a 2:2 (lower second-class honours) for postgraduate study. The standard entry requirement across UK Master's programmes is a 2:1, but post-92 and many mid-ranking universities accept 2:2 for a wide range of programmes. A strong personal statement, relevant work experience, or professional qualifications can strengthen a 2:2 application.",
  },
  {
    question: "Which UK universities are most likely to accept a 2:2 for Master's?",
    answer: "Post-92 universities (also called modern or new universities) are most likely to accept 2:2 for taught Master's programmes. These include universities in the North of England, the Midlands, Wales, and Scotland. Russell Group universities generally require a 2:1 or first class, though some programmes will consider 2:2 with exceptional work experience.",
  },
  {
    question: "Does a 2:2 from a Nigerian university count the same as a UK 2:2?",
    answer: "UK universities use international grading equivalencies for Nigerian degrees. A second class lower from a Nigerian university typically maps to a UK 2:2. NABTEB and WAEC qualifications are recognised. Some universities may request additional evidence such as your transcript, syllabus, or academic referee letters.",
  },
  {
    question: "How do I strengthen a 2:2 Master's application?",
    answer: "Relevant work experience (2+ years in your field), a compelling personal statement that explains your 2:2 and demonstrates academic improvement or professional growth, and strong references are the most effective ways to strengthen a borderline application. Some universities also offer conditional entry through pre-sessional or foundation programmes.",
  },
];

export default function UK22Page() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Universities Accepting 2:2", url: "/study-in-uk/universities-accepting-2-2" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK Universities Accepting 2:2", url: "/study-in-uk/universities-accepting-2-2" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline">← Study in the UK</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">2:2 Eligibility Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Universities Accepting 2:2 for Master&apos;s (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            Most UK universities accept a 2:2 (lower second-class honours) for postgraduate Master&apos;s programmes. This guide covers what you need to know, which institutions are most flexible, and how to present a strong application.
          </p>
        </div>

        {/* Key facts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">2:2 eligibility — quick reference</h2>
          <div className="space-y-3">
            {[
              { ok: true, text: "Most post-92 (modern) universities accept 2:2 for taught Master's programmes" },
              { ok: true, text: "Many mid-ranking UK universities accept 2:2 with relevant work experience" },
              { ok: true, text: "Some specialised programmes (e.g. MBA, project management) are experience-weighted and 2:2 is standard" },
              { ok: false, text: "Russell Group universities typically require 2:1 minimum for most programmes" },
              { ok: false, text: "Highly competitive programmes (medicine, law, finance) usually require 2:1 or first class" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${item.ok ? "text-green-500" : "text-red-400"}`} />
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

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Check which universities accept your 2:2</h2>
          <p className="text-blue-100 mb-5 text-sm">Tundua matches your degree grade, work experience, and budget against universities that will accept you.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Check My 2:2 Eligibility <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/study-in-uk/universities-accepting-third-class", label: "UK universities accepting third class" },
              { href: "/study-in-uk/without-ielts", label: "UK universities without IELTS" },
              { href: "/tools/uk-university-eligibility-checker", label: "UK Eligibility Checker" },
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

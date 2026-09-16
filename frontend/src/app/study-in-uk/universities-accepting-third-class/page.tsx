import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle, GraduationCap } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK Universities Accepting Third Class Degree for Master's 2027",
  description: "Which UK universities consider a third class (pass) degree for postgraduate admission in 2027? This guide covers entry requirements, how to strengthen your application, and what to expect.",
  alternates: { canonical: "/study-in-uk/universities-accepting-third-class" },
  openGraph: {
    title: "UK Universities Accepting Third Class Degree for Master's 2027",
    description: "Can you do a Master's in the UK with a third class? Which universities consider it and what you need to strengthen your application.",
    url: "/study-in-uk/universities-accepting-third-class",
    type: "article",
  },
};

const FAQS = [
  {
    question: "Can I do a Master's in the UK with a third class degree?",
    answer: "It is possible, but challenging. A small number of UK universities will consider third class applicants on a case-by-case basis, usually for programmes where relevant work experience is weighted heavily alongside academic results. A third class alone is rarely sufficient — a strong personal statement, professional certifications, and 3–5 years of relevant work experience are typically required.",
  },
  {
    question: "Which UK universities accept third class for Master's?",
    answer: "The decision to consider a third class applicant is usually made case-by-case rather than through a published policy. Universities known to be more flexible include some London Metropolitan, post-92, and specialist institutions. The best approach is to contact the admissions office directly, explain your circumstances, and ask whether your profile would be considered.",
  },
  {
    question: "What makes a successful third class Master's application?",
    answer: "A successful application with a third class degree typically includes: 3–5 years of relevant professional experience, a personal statement that directly addresses the grade and demonstrates subsequent growth, professional references who can speak to your current competency, and professional qualifications or certifications where relevant.",
  },
  {
    question: "Is an MBA possible in the UK with a third class?",
    answer: "Yes. MBA programmes are typically the most experience-weighted postgraduate degrees in the UK. Many business schools accept applicants with 3+ years of management experience regardless of degree classification — and some MBA programmes accept applicants without a degree at all if professional experience is sufficiently strong.",
  },
];

export default function UKThirdClassPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Third Class Degree", url: "/study-in-uk/universities-accepting-third-class" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK Universities Accepting Third Class", url: "/study-in-uk/universities-accepting-third-class" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline">← Study in the UK</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-4">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Third Class / Pass — Eligibility Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Universities That Consider Third Class for Master&apos;s (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            A third class degree does not automatically close the door to UK postgraduate study. This guide explains which scenarios give you the best chance of admission and how to present the strongest possible application.
          </p>
        </div>

        {/* Honest assessment */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Honest assessment</p>
            <p>A third class degree is below the standard minimum for most UK Master&apos;s programmes (2:2 or above). Admission is possible but requires a case-by-case application with strong supporting evidence. Set realistic expectations and apply to multiple universities simultaneously.</p>
          </div>
        </div>

        {/* What helps */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What gives a third class applicant the best chance</h2>
          <div className="space-y-3">
            {[
              { ok: true, text: "3–5 years of relevant professional work experience (the single biggest factor)" },
              { ok: true, text: "Professional certifications that demonstrate your competency in the field" },
              { ok: true, text: "A personal statement that directly and honestly addresses your grade and shows progression" },
              { ok: true, text: "Applying to experience-weighted programmes: MBA, Project Management, Business Management" },
              { ok: true, text: "Contacting the admissions team directly before applying to confirm eligibility" },
              { ok: false, text: "Applying without work experience — a third class + no experience is very unlikely to succeed" },
              { ok: false, text: "Applying to research-intensive or highly selective programmes" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.ok ? "text-green-500" : "text-red-400"}`} />
                <p className="text-sm text-gray-700">{item.text}</p>
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
          <h2 className="text-xl font-bold mb-2">Check your eligibility honestly</h2>
          <p className="text-blue-100 mb-5 text-sm">Tundua reviews your full profile — degree, grade, work experience — and tells you which universities are realistic options.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Check My Eligibility <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/study-in-uk/universities-accepting-2-2", label: "UK universities accepting 2:2" },
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

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, AlertCircle, GraduationCap } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK Universities Accepting HND for Master's 2027 — Full List",
  description: "Find UK universities that accept HND (Higher National Diploma) for postgraduate Master's programmes in 2027. Includes entry requirements, courses available, and deposit information for Nigerian students.",
  alternates: { canonical: "/study-in-uk/universities-accepting-hnd" },
  openGraph: {
    title: "UK Universities Accepting HND for Master's 2027",
    description: "Which UK universities accept HND for Master's? Entry requirements, available courses, and deposit figures for Nigerian and African students.",
    url: "/study-in-uk/universities-accepting-hnd",
    type: "article",
  },
};

const FAQS = [
  {
    question: "Can I do a Master's in the UK with an HND?",
    answer: "Yes. A growing number of UK universities accept HND (Higher National Diploma) for entry into postgraduate Master's programmes. An Upper Credit or Distinction is typically required, and relevant work experience significantly strengthens your application. The university will review your full profile — qualification, grade, work experience, and personal statement.",
  },
  {
    question: "Which UK universities accept HND for Master's in 2027?",
    answer: "UK universities known to have accepted HND for Master's programmes include the University of Sunderland, Teesside University, the University of South Wales, the University of Portsmouth, and several other post-92 institutions. Always verify directly with the university's admissions team, as entry policies change each academic year.",
  },
  {
    question: "What grade of HND do I need for a UK Master's?",
    answer: "Most UK universities that accept HND for Master's programmes require an Upper Credit or Distinction. Some may consider Merit grade depending on the programme and the strength of your work experience. A Lower Credit or Pass HND alone is very unlikely to meet the entry requirements for most taught Master's programmes.",
  },
  {
    question: "Can I study an MBA in the UK with an HND?",
    answer: "Yes, some UK universities accept HND plus relevant work experience for MBA programmes. The work experience requirement is typically 2–5 years in a managerial or professional role. Some MBA programmes waive the degree requirement entirely for applicants with significant professional experience.",
  },
  {
    question: "Does having an HND mean I should choose a lower-ranked UK university?",
    answer: "Not necessarily. Post-92 and modern universities are fully accredited UK institutions. Many have strong industry connections, good employment outcomes, and lower tuition fees than Russell Group universities. For many Nigerian students, a post-92 university in the UK is a strong credential that opens doors internationally.",
  },
];

const HND_PROGRAMMES = [
  { programme: "MSc Computer Science / IT", note: "Widely available with HND in IT or related discipline" },
  { programme: "MSc Data Analytics / Data Science", note: "Growing acceptance for HND in quantitative fields" },
  { programme: "MSc Project Management", note: "Common with HND + professional experience" },
  { programme: "MBA", note: "Most flexible — experience-weighted entry" },
  { programme: "MSc Business Management", note: "Accepted at several post-92 universities" },
  { programme: "MSc Engineering Management", note: "Requires HND in engineering discipline" },
  { programme: "MSc Public Health", note: "Some programmes accept health-related HND" },
  { programme: "MSc International Business", note: "Available at a number of modern universities" },
];

export default function UKUniversitiesHNDPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Universities Accepting HND", url: "/study-in-uk/universities-accepting-hnd" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK Universities Accepting HND", url: "/study-in-uk/universities-accepting-hnd" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            ← Study in the UK
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">HND Eligibility Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Universities Accepting HND for Master&apos;s (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            A growing number of UK universities accept Higher National Diploma (HND) for postgraduate admission. This guide covers which universities, what grade you need, and what programmes are available.
          </p>
        </div>

        {/* Key eligibility signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", title: "HND Upper Credit", note: "Typical minimum for most programmes" },
            { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", title: "Work experience", note: "Strengthens borderline applications significantly" },
            { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", title: "HND Lower Credit / Pass", note: "Unlikely to meet requirements without work experience" },
          ].map((item) => (
            <div key={item.title} className={`${item.bg} rounded-xl p-4 border border-current/10`}>
              <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-600 mt-1">{item.note}</p>
            </div>
          ))}
        </div>

        {/* Available programmes */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Programmes commonly available to HND holders</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {HND_PROGRAMMES.map((p) => (
              <div key={p.programme} className="flex items-start gap-3 px-6 py-4">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{p.programme}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Check if you qualify with your HND</h2>
          <p className="text-blue-100 mb-5">Tundua matches your HND grade, work experience, and budget against universities that will accept you — instantly.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Find Universities That Accept My HND <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-blue-200">Free · 30 seconds</p>
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

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-uk/universities-accepting-2-2", label: "UK universities accepting 2:2" },
              { href: "/study-in-uk/universities-accepting-third-class", label: "UK universities accepting third class" },
              { href: "/study-in-uk/without-ielts", label: "UK universities without IELTS" },
              { href: "/study-in-uk/low-deposit", label: "UK universities with low deposit" },
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

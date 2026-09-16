import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle, Calendar } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import { UK_TUITION_LOW_GBP } from "@/lib/constants/uk-data";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "MSc Public Health UK 2027 — Universities, Entry Requirements & January Intake",
  description: `Study MSc Public Health in the UK in 2027. Universities from £${UK_TUITION_LOW_GBP.toLocaleString()}/yr, January and September intakes, HND and 2:2 accepted at some institutions. Guide for Nigerian and African students.`,
  alternates: { canonical: "/masters/public-health/uk" },
  openGraph: {
    title: "MSc Public Health UK 2027 — Universities, Requirements & January Intake",
    description: `MSc Public Health UK guide for Nigerian students: universities, tuition from £${UK_TUITION_LOW_GBP.toLocaleString()}/yr, HND acceptance, January 2027 entry.`,
    url: "/masters/public-health/uk",
    type: "article",
  },
};

const FAQS = [
  {
    question: "Can I study MSc Public Health in the UK with an HND?",
    answer: "Some UK universities with MSc Public Health programmes will consider an HND in a relevant health, science, or social care field, particularly if accompanied by professional work experience in healthcare or public sector roles. Check individual university entry requirements as this is assessed case-by-case.",
  },
  {
    question: "Is MSc Public Health a 1-year course in the UK?",
    answer: "Yes. The standard UK MSc Public Health is a 1-year full-time programme. This is one of the key advantages of UK postgraduate study over North America — completing in one year rather than two significantly reduces total costs.",
  },
  {
    question: "Which UK universities offer MSc Public Health with a January intake?",
    answer: "Some UK universities offer MSc Public Health programmes with January start dates, giving applicants who missed the September cycle an alternative entry point. Verify January availability with each university directly, as programme intake dates change annually.",
  },
  {
    question: "What can I do with an MSc Public Health from a UK university?",
    answer: "An MSc Public Health from a UK university opens roles in: government health policy and planning (Ministry of Health, NCDC, WHO), NGO programme management (MSF, UN agencies), international development roles, public health research, and healthcare management. The UK degree is globally recognised and particularly valued for roles with international organisations.",
  },
  {
    question: "What IELTS score is needed for MSc Public Health in the UK?",
    answer: "Most UK MSc Public Health programmes require IELTS Academic 6.5 overall (no component below 6.0). Some universities accept 6.0 overall for entry with a pre-sessional English course option. MOI letters from Nigerian institutions where instruction was in English are accepted by some programmes.",
  },
];

const PROGRAMME_FEATURES = [
  { title: "Duration", value: "1 year full-time" },
  { title: "Award level", value: "Master of Science (MSc)" },
  { title: "Typical tuition range", value: `£${UK_TUITION_LOW_GBP.toLocaleString()}–£17,000/yr` },
  { title: "Typical IELTS", value: "6.0–6.5 overall" },
  { title: "January intake", value: "Available at selected universities" },
  { title: "September intake", value: "Main entry point" },
];

const PROGRAMME_MODULES = [
  "Epidemiology and research methods",
  "Health policy and management",
  "Global health and international development",
  "Environmental and occupational health",
  "Health promotion and education",
  "Biostatistics",
  "Infectious disease control",
  "Dissertation / research project",
];

const CAREER_OUTCOMES = [
  "Public health officer / researcher",
  "Health policy analyst (government, WHO, UNICEF)",
  "NGO programme manager",
  "Epidemiologist",
  "Healthcare project manager",
  "International development consultant",
];

export default function MscPublicHealthUKPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Universities", url: "/universities" },
          { name: "MSc Public Health UK", url: "/masters/public-health/uk" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Universities", url: "/universities" },
          { name: "MSc Public Health UK", url: "/masters/public-health/uk" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">MSc Programme Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            MSc Public Health in the UK (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            A guide to studying MSc Public Health at a UK university — programme content, universities, entry requirements for Nigerian students, tuition costs, and January 2027 intake options.
          </p>
        </div>

        {/* Programme facts */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Programme at a glance</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {PROGRAMME_FEATURES.map((f) => (
              <div key={f.title} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-gray-600">{f.title}</span>
                <span className="text-sm font-semibold text-gray-900">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modules */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Typical programme modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROGRAMME_MODULES.map((m) => (
              <div key={m} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{m}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Career outcomes */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What you can do with an MSc Public Health from the UK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CAREER_OUTCOMES.map((c) => (
              <div key={c} className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* January 2027 urgency */}
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
          <Calendar className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-orange-900">
            <p className="font-semibold mb-1">January 2027 intake — apply now</p>
            <p>If you want to start MSc Public Health in January 2027, applications should be submitted immediately. Allow 4–6 weeks for offer, CAS, and visa.</p>
            <Link href="/intakes/january-2027/uk" className="font-semibold text-orange-800 hover:underline flex items-center gap-1 mt-1">
              January 2027 UK intake guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
          <h2 className="text-xl font-bold mb-2">Find MSc Public Health universities that accept your profile</h2>
          <p className="text-blue-100 mb-5 text-sm">Tundua matches your degree, IELTS score, and budget against universities offering MSc Public Health in the UK.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Find My MSc Public Health Options <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/intakes/january-2027/uk", label: "January 2027 intake — UK universities" },
              { href: "/study-in-uk/cost", label: "Cost of studying in the UK" },
              { href: "/study-in-uk/without-ielts", label: "UK universities without IELTS" },
              { href: "/tools/sop-generator", label: "AI SOP Generator for UK applications" },
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

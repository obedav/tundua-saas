import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, AlertCircle } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK University Intakes 2027 — January, May & September Start Dates",
  description: "Complete guide to UK university intake dates for 2026–27: January 2027, May 2027, and September 2027 intakes. Application deadlines, which universities accept January starts, and how to apply now.",
  alternates: { canonical: "/study-in-uk/intakes" },
  openGraph: {
    title: "UK University Intakes 2027 — January, May & September Start Dates",
    description: "January 2027 UK university intake guide: deadlines, which universities offer January starts, and how to apply now.",
    url: "/study-in-uk/intakes",
    type: "article",
  },
};

const FAQS = [
  {
    question: "Which UK universities have a January 2027 intake?",
    answer: "Many UK post-92 and modern universities offer January intakes for postgraduate programmes. Universities commonly offering January starts include the University of Sunderland, Teesside University, the University of Portsmouth, the University of West London, and several others. The availability of a January intake varies by programme — not all courses at a given university have both September and January entry points.",
  },
  {
    question: "What is the deadline to apply for January 2027 UK intake?",
    answer: "For January 2027 entry, most UK universities close applications between October and November 2026, though some accept applications until December. To allow time for the university to process your application, issue a CAS letter, and for you to obtain your Student Visa, you should ideally submit by October 2026. If January 2027 is your target, apply immediately.",
  },
  {
    question: "Is September or January intake better for UK universities?",
    answer: "September remains the main intake at most UK universities with the widest course availability and most scholarship options. January is a viable alternative — particularly useful if you missed the September cycle, if you are still finalising funding, or if you need more time to prepare your documents. January starters graduate in the same year as the following September cohort for 1-year Master's programmes.",
  },
  {
    question: "Do UK universities have a May intake?",
    answer: "A smaller number of UK universities offer a May (also called a Spring or April) intake. It is less common than January or September. If you are targeting May 2027, check specific universities directly, as many have limited programme availability for this intake period.",
  },
];

const INTAKE_WINDOWS = [
  {
    intake: "January 2027",
    status: "Apply now",
    statusColor: "bg-red-100 text-red-700 border-red-200",
    bg: "bg-red-50 border-red-200",
    deadlines: "October–November 2026",
    note: "If January 2027 is your target, apply immediately — deadlines close in October–November 2026.",
    courses: ["MSc Computer Science", "MSc Project Management", "MBA", "MSc Data Science", "MSc Public Health"],
  },
  {
    intake: "May 2027",
    status: "Apply from Oct 2026",
    statusColor: "bg-amber-100 text-amber-700 border-amber-200",
    bg: "bg-amber-50 border-amber-200",
    deadlines: "Jan–Feb 2027",
    note: "Limited university availability. Check specific institutions.",
    courses: ["Selected programmes only"],
  },
  {
    intake: "September 2027",
    status: "Apply from Jan 2027",
    statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    bg: "bg-blue-50 border-blue-200",
    deadlines: "March–June 2027 (varies)",
    note: "Main intake with widest course and scholarship availability.",
    courses: ["All disciplines"],
  },
];

export default function UKIntakesPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK University Intakes", url: "/study-in-uk/intakes" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "UK University Intakes", url: "/study-in-uk/intakes" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline">← Study in the UK</Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-4">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">January 2027 deadline approaching — apply now</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK University Intakes 2027 — January, May &amp; September
          </h1>
          <p className="text-lg text-gray-600">
            UK universities offer January, May, and September intakes. If you are targeting January 2027 (which is now the most time-sensitive intake), applications should be submitted by October 2026.
          </p>
        </div>

        {/* Intake timeline cards */}
        <section className="space-y-4 mb-8">
          {INTAKE_WINDOWS.map((intake) => (
            <div key={intake.intake} className={`rounded-2xl border p-5 ${intake.bg}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">{intake.intake}</h2>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${intake.statusColor}`}>{intake.status}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2"><strong>Typical deadlines:</strong> {intake.deadlines}</p>
              <p className="text-sm text-gray-600 mb-3">{intake.note}</p>
              <div className="flex flex-wrap gap-2">
                {intake.courses.map((c) => (
                  <span key={c} className="text-xs bg-white/60 border border-white/40 text-gray-700 rounded px-2 py-1">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* January 2027 CTA */}
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">January 2027 — Apply now</h2>
          <p className="text-red-100 mb-5 text-sm">Universities accepting January 2027 applications are currently open. Don&apos;t miss the window.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-red-700 font-semibold px-8 py-4 rounded-full hover:bg-red-50 transition-colors">
            Apply for January 2027 — Now <ArrowRight className="w-5 h-5" />
          </Link>
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
              { href: "/intakes/january-2027/uk", label: "January 2027 UK universities — full guide" },
              { href: "/study-in-uk/low-deposit", label: "UK universities with low deposit" },
              { href: "/tools/university-finder", label: "University Finder — filter by intake" },
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

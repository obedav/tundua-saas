import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PoundSterling, CheckCircle, Star, Calendar } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK Universities With Low Tuition Deposit 2027 — £2,000–£5,000 CAS Deposits",
  description: "Find UK universities with low initial deposits (CAS deposits from £2,000–£5,000). Compare tuition, deposit, and intake dates. Verified figures for Nigerian and African students applying in 2026–27.",
  alternates: { canonical: "/study-in-uk/low-deposit" },
  openGraph: {
    title: "UK Universities With Low Tuition Deposit 2027",
    description: "UK universities with CAS deposits from £2,000. Compare tuition, deposits, and January/September intakes. For Nigerian and African students.",
    url: "/study-in-uk/low-deposit",
    type: "article",
  },
};

const FAQS = [
  {
    question: "What is a CAS deposit (tuition deposit) for a UK university?",
    answer: "The CAS (Confirmation of Acceptance for Studies) deposit is the upfront payment you make to the university before they issue your CAS letter. You need the CAS letter to apply for your UK Student Visa. The deposit amount varies from as little as £2,000 at some universities to £10,000 or more at others. It is typically deducted from your tuition fee once you arrive.",
  },
  {
    question: "Which UK universities have the lowest tuition deposits?",
    answer: "Several UK universities offer CAS deposits of £2,000–£5,000 for international students. These are mostly post-92 and modern universities outside London, including institutions in the North of England, Wales, and the Midlands. Examples that have historically offered low deposits include the University of Sunderland, Teesside University, and the University of South Wales — though deposit amounts change annually, so always verify with the university directly.",
  },
  {
    question: "Can I study in the UK with a low deposit if I have an HND?",
    answer: "Yes. Many UK universities that accept HND also offer relatively low CAS deposits. This combination — HND acceptance + low deposit — makes certain institutions particularly accessible for Nigerian students. The University of Sunderland and Teesside University have been cited for both. See our guide to UK universities accepting HND for a full list.",
  },
  {
    question: "Does the deposit amount count towards my tuition fee?",
    answer: "In most cases, yes. The CAS deposit is credited against your tuition fee balance when you enrol. So if your tuition is £12,000 and you paid a £3,000 deposit, you owe £9,000 on arrival (or per the university's payment schedule).",
  },
];

const DEPOSIT_BUCKETS = [
  {
    range: "Under £2,000",
    color: "bg-green-100 text-green-800 border-green-200",
    note: "Rare but exists. Usually requires full tuition payment within 4–6 weeks of enrolment.",
  },
  {
    range: "£2,000–£3,000",
    color: "bg-green-50 text-green-700 border-green-200",
    note: "Most accessible tier. Common at post-92 universities in the North and Wales.",
  },
  {
    range: "£3,000–£5,000",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    note: "Mid-range. Widely available at modern universities outside London.",
  },
  {
    range: "£5,000–£10,000",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    note: "Standard range at mid-ranking universities.",
  },
  {
    range: "Over £10,000",
    color: "bg-red-50 text-red-700 border-red-200",
    note: "Common at Russell Group and London universities.",
  },
];

export default function UKLowDepositPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Low Deposit Universities", url: "/study-in-uk/low-deposit" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the UK", url: "/study-in-uk" },
          { name: "Low Deposit Universities", url: "/study-in-uk/low-deposit" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/study-in-uk" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            ← Study in the UK
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4">
            <PoundSterling className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Verified September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Universities With Low Tuition Deposit (2026–27)
          </h1>
          <p className="text-lg text-gray-600">
            Find UK universities that accept international students with CAS deposits of £2,000–£5,000 — making it easier to secure your place and arrange your UK Student Visa without large upfront payments.
          </p>
        </div>

        {/* Budget filter CTA */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-2">Which UK universities can you actually afford?</h2>
          <p className="text-sm text-gray-600 mb-4">Enter your budget to see matched universities with verified deposit and tuition figures.</p>
          <div className="flex flex-wrap gap-3">
            {["Under ₦10M", "₦10M–₦20M", "₦20M–₦35M", "Over ₦35M"].map((b) => (
              <Link
                key={b}
                href="/apply"
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-semibold text-sm rounded-full transition-colors"
              >
                {b}
              </Link>
            ))}
          </div>
        </div>

        {/* Deposit tiers */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">UK university deposit tiers explained</h2>
          <div className="space-y-3">
            {DEPOSIT_BUCKETS.map((bucket) => (
              <div key={bucket.range} className={`flex items-start gap-3 p-4 rounded-xl border ${bucket.color}`}>
                <PoundSterling className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold">{bucket.range}</span>
                  <p className="text-sm mt-0.5 opacity-80">{bucket.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to look for */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What to look for beyond the deposit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Star, title: "Total tuition, not just deposit", body: "A £2,000 deposit at a £22,000/yr university may cost more overall than a £5,000 deposit at a £11,000/yr institution." },
              { icon: Calendar, title: "January vs September intake", body: "Many low-deposit universities offer both January and September intakes — giving you more flexibility." },
              { icon: CheckCircle, title: "HND and 2:2 acceptance", body: "Some low-deposit universities also accept HND or 2:2 — check eligibility before shortlisting." },
              { icon: PoundSterling, title: "Payment plan availability", body: "Some universities allow you to split tuition across instalments after paying the initial deposit." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <item.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Find your low-deposit university matches</h2>
          <p className="text-blue-100 mb-5">Tundua shows you verified deposit figures for each university. Filter by budget, qualification, and intake date.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            See My University Matches <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-blue-200">Free to start · No credit card required</p>
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
              { href: "/study-in-uk/cost", label: "Full cost of studying in the UK" },
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/study-in-uk/intakes", label: "UK university intakes 2027" },
              { href: "/tools/proof-of-funds-calculator", label: "UK Proof of Funds Calculator" },
              { href: "/visa", label: "AI Visa Assistant — UK student visa checklist" },
              { href: "/study-in-uk", label: "Back to: Study in the UK guide" },
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

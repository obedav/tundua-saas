import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle, AlertCircle, GraduationCap, Sparkles } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK University Eligibility Checker — HND, 2:2, Third Class, No IELTS",
  description: "Check which UK universities accept your academic qualifications. See instantly if universities accept HND, 2:2, third class degree, or WAEC English in place of IELTS. Free tool for Nigerian and African students.",
  alternates: { canonical: "/tools/uk-university-eligibility-checker" },
  openGraph: {
    title: "UK University Eligibility Checker — HND, 2:2, Third Class, No IELTS",
    description: "Find out which UK universities accept your qualifications. HND, 2:2, third class, no IELTS. Free eligibility checker for Nigerian students.",
    url: "/tools/uk-university-eligibility-checker",
    type: "website",
  },
};

const FAQS = [
  {
    question: "Can I apply to a UK Master's degree with an HND?",
    answer: "Yes, several UK universities accept HND for postgraduate admission, particularly for taught Master's programmes. Universities such as the University of Sunderland, Teesside University, and the University of South Wales have accepted HND graduates. You may need an Upper Credit or Distinction grade, and some universities require you to have relevant work experience.",
  },
  {
    question: "Which UK universities accept a third class degree?",
    answer: "A number of UK universities will consider applicants with a third class degree for certain Master's programmes, especially if you have significant relevant work experience. The decision is often made case-by-case. Universities known to consider third class degrees include some London Metropolitan and post-92 universities. A strong personal statement explaining your professional experience is essential.",
  },
  {
    question: "Can I get into a UK university without IELTS?",
    answer: "Yes. Many UK universities accept alternative English evidence, including a Medium of Instruction (MOI) letter from your undergraduate university, WAEC or NECO English results (grade B or C3 minimum), or a Duolingo English Test score. Some universities also offer pre-sessional English programmes which allow conditional entry.",
  },
  {
    question: "Do UK universities accept a 2:2 for Master's programmes?",
    answer: "Most UK universities accept a 2:2 (lower second-class honours) for postgraduate study, though some top-ranked institutions require a 2:1 or above. If you have a 2:2, focus on programmes where relevant work experience is valued alongside academic results.",
  },
];

const QUALIFICATION_TIERS = [
  {
    qual: "First Class / Distinction",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    verdict: "Eligible for almost all UK universities",
    note: "Strong applications for Russell Group and top-ranked institutions.",
  },
  {
    qual: "2:1 (Upper Second Class)",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    verdict: "Eligible for most UK universities",
    note: "Standard entry requirement for the majority of UK Master's programmes.",
  },
  {
    qual: "2:2 (Lower Second Class)",
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    verdict: "Eligible for many UK universities",
    note: "Most post-92 and modern universities accept 2:2. Work experience strengthens your application.",
  },
  {
    qual: "HND (Upper Credit or Distinction)",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    verdict: "Accepted by a growing number of UK universities",
    note: "Specialist and modern universities increasingly accept HND. Some may require work experience.",
  },
  {
    qual: "Third Class / Pass Degree",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    verdict: "Accepted by some UK universities case-by-case",
    note: "Strong work experience and a compelling personal statement are essential.",
  },
  {
    qual: "OND only",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    verdict: "Rarely sufficient alone for UK Master's",
    note: "Typically need to combine OND + HND, or OND + relevant PGD. Check with individual universities.",
  },
];

export default function UKEligibilityCheckerPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/university-finder" },
          { name: "UK Eligibility Checker", url: "/tools/uk-university-eligibility-checker" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/university-finder" },
          { name: "UK Eligibility Checker", url: "/tools/uk-university-eligibility-checker" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-5">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Free Eligibility Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            UK University Eligibility Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find out which UK universities will accept your academic qualifications — HND, 2:2, third class, or no IELTS. Instant results, no sign-up required for the basic check.
          </p>
        </div>

        {/* Qualification matrix */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility by qualification</h2>
          <div className="space-y-3">
            {QUALIFICATION_TIERS.map((tier) => (
              <div key={tier.qual} className={`flex items-start gap-4 p-4 rounded-xl border ${tier.bg}`}>
                <tier.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tier.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{tier.qual}</span>
                    <span className={`text-sm font-medium ${tier.color}`}>{tier.verdict}</span>
                  </div>
                  <p className="text-sm text-gray-600">{tier.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — full checker in dashboard */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-10">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">Get Your Personalised University Matches</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Enter your qualification, English score, budget and preferred intake. Tundua returns a shortlist of universities that will accept you — with tuition, deposit and scholarship information included.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors"
          >
            Check My Full Eligibility — Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-blue-200">Takes 30 seconds · No credit card needed</p>
        </div>

        {/* FAQ */}
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

        {/* Internal links */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Related guides &amp; tools
          </p>
          <ul className="space-y-2">
            {[
              { href: "/tools/university-finder", label: "University Finder — search all destinations" },
              { href: "/tools/proof-of-funds-calculator", label: "UK Proof of Funds Calculator" },
              { href: "/study-in-uk", label: "Complete Guide: Study in the UK" },
              { href: "/visa", label: "AI Visa Assistant — check your visa documents" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center gap-2 text-sm text-blue-700 hover:underline">
                  <ArrowRight className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

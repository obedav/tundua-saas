import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "Study in the USA — Guide for Nigerian & African Students (2026–27)",
  description: "Guide to studying in the USA for Nigerian and African students: universities, F-1 student visa, tuition costs, OPT work rights, and STEM extension options.",
  alternates: { canonical: "/study-in-usa" },
  openGraph: {
    title: "Study in the USA — Guide for Nigerian & African Students (2026–27)",
    description: "F-1 visa, tuition costs, OPT rights, and university eligibility for Nigerian students applying to the USA. Updated 2026.",
    url: "/study-in-usa",
    type: "website",
  },
};

const KEY_FACTS = [
  { label: "Student visa", value: "F-1 Visa" },
  { label: "Post-study work (OPT)", value: "12 months (STEM: 36 months)" },
  { label: "Tuition (Master's)", value: "USD $20,000–$60,000/yr" },
  { label: "Programme duration", value: "1.5–2 years" },
  { label: "Intakes", value: "Aug & Jan" },
];

const TOPIC_LINKS = [
  { label: "Study in the UK — complete guide", href: "/study-in-uk" },
  { label: "Study in Canada — complete guide", href: "/study-in-canada" },
  { label: "UK University Eligibility Checker", href: "/tools/uk-university-eligibility-checker" },
  { label: "University Finder", href: "/tools/university-finder" },
];

export default function StudyInUSAPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the USA", url: "/study-in-usa" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study in the USA", url: "/study-in-usa" },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5">
            <span className="text-lg">🇺🇸</span>
            <span className="text-sm font-semibold text-blue-800">Study in the USA — 2026–27</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Study in the USA —<br />
            <span className="text-blue-600">Guide for Nigerian Students</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            The USA is home to world-ranked universities and offers the F-1 student visa with OPT work rights after graduation. We&apos;re building our complete guide to studying in America as a Nigerian student.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors"
          >
            Start My Application — Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Key facts */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">USA study — key facts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {KEY_FACTS.map((fact) => (
              <div key={fact.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">{fact.label}</p>
                <p className="text-sm font-bold text-gray-900">{fact.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Coming soon */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10 text-center">
          <GraduationCap className="w-10 h-10 text-blue-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Full USA guide coming soon</h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            We&apos;re building detailed content for US university applications, F-1 visa requirements, and SEVIS fees. In the meantime, our advisors can help you explore American university options.
          </p>
          <Link href="/apply" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-700 hover:underline">
            Talk to an advisor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related guides */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Explore other destinations</p>
          <ul className="space-y-2">
            {TOPIC_LINKS.map((link) => (
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

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Filter, MapPin, GraduationCap, CheckCircle, Sparkles } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "University Finder — Search UK, Canada, Australia & USA Universities",
  description: "Find universities that match your budget, qualifications and entry requirements. Filter by tuition, deposit, IELTS requirement, HND acceptance, and January or September intake. Free for Nigerian and African students.",
  alternates: { canonical: "/tools/university-finder" },
  openGraph: {
    title: "University Finder — Search UK, Canada & Australia Universities",
    description: "Find universities that accept your qualifications and match your budget. Filter by deposit, IELTS, HND, intake month, and tuition range.",
    url: "/tools/university-finder",
    type: "website",
  },
};

const FILTERS = [
  { label: "Destination", options: ["UK", "Canada", "Australia", "USA", "Ireland", "Germany"] },
  { label: "Qualification", options: ["HND", "Bachelor's 2:2", "Bachelor's Third Class", "OND + PGD", "Bachelor's First Class"] },
  { label: "English requirement", options: ["No IELTS", "IELTS 6.0+", "IELTS 6.5+", "Accepts WAEC English", "Accepts MOI letter"] },
  { label: "Deposit", options: ["Under £2,000", "Under £3,000", "Under £5,000", "Under £10,000"] },
  { label: "Intake", options: ["January 2027", "May 2027", "September 2027"] },
  { label: "Tuition", options: ["Under £12,000", "Under £15,000", "Under £18,000", "Under £25,000"] },
];

export default function UniversityFinderPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav items={[{name:"Home",url:"/"},{name:"Tools",url:"/tools/university-finder"},{name:"University Finder",url:"/tools/university-finder"}]} />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/university-finder" },
          { name: "University Finder", url: "/tools/university-finder" },
        ]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Free University Search Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Find Universities That Match<br />
            <span className="text-blue-600">Your Budget &amp; Qualifications</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Search over 500 universities in the UK, Canada, Australia and the USA. Filter by HND acceptance, IELTS requirements, tuition deposit, and January or September intake — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 mb-8">
            {["HND accepted", "No IELTS options", "Low deposit", "January intake", "Payment plans"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Filter preview grid */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filter universities by what matters to you</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FILTERS.map((filter) => (
              <div key={filter.label} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{filter.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {filter.options.map((opt) => (
                    <span key={opt} className="text-xs bg-white border border-gray-200 text-gray-700 rounded px-2 py-1">{opt}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample results preview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Sample results — HND · Outside London · Under £15,000 · January 2027</p>
            <span className="text-xs text-gray-400">3 of 47 matches</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                name: "University of Sunderland",
                city: "Sunderland, England",
                flags: ["HND accepted", "Low deposit", "Jan intake"],
                tuition: "£12,000/yr",
                deposit: "£2,500",
              },
              {
                name: "Teesside University",
                city: "Middlesbrough, England",
                flags: ["HND accepted", "Low deposit", "Jan intake"],
                tuition: "£13,000/yr",
                deposit: "£3,000",
              },
              {
                name: "University of South Wales",
                city: "Newport, Wales",
                flags: ["HND accepted", "2:2 accepted", "Low deposit"],
                tuition: "£12,500/yr",
                deposit: "£2,000",
              },
            ].map((uni) => (
              <div key={uni.name} className="bg-white rounded-xl border border-gray-200 p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 pointer-events-none" />
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{uni.name}</h3>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{uni.city}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {uni.flags.map((f) => (
                    <span key={f} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5">{f}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span><strong className="text-gray-900">{uni.tuition}</strong> tuition</span>
                  <span><strong className="text-gray-900">{uni.deposit}</strong> deposit</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
            <p className="text-sm text-blue-800 font-medium">Sign up free to see all 47 matches — with IELTS requirements, scholarship info, and application links</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Access the Full University Finder</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Create a free Tundua account to search, filter, compare and shortlist universities. See which ones accept your qualifications, match your budget, and have open intakes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors"
            >
              Start Free — Search Universities
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tools/uk-university-eligibility-checker"
              className="inline-flex items-center justify-center gap-2 bg-blue-500/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-500/50 transition-colors border border-white/20"
            >
              <Sparkles className="w-5 h-5" />
              Check Your Eligibility First
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">Free to start · No credit card required</p>
        </div>

        {/* Supporting content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "500+ universities", body: "UK, Canada, Australia, USA, Ireland and Germany — all in one search." },
            { icon: MapPin, title: "Location & campus filters", body: "Filter by city or region. Some students prefer London; others want a lower cost of living." },
            { icon: CheckCircle, title: "Eligibility matching", body: "See instantly which universities accept your qualification type — HND, 2:2, third class, or OND." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-5">
              <item.icon className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Internal links */}
        <div className="mt-10 bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related tools &amp; guides</p>
          <ul className="space-y-2">
            {[
              { href: "/tools/uk-university-eligibility-checker", label: "UK University Eligibility Checker" },
              { href: "/tools/proof-of-funds-calculator", label: "UK Proof of Funds Calculator" },
              { href: "/tools/sop-generator", label: "AI Statement of Purpose Generator" },
              { href: "/study-in-uk", label: "Complete Guide: Study in the UK" },
              { href: "/study-in-uk", label: "Study guides for African students" },
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

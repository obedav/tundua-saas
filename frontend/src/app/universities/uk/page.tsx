import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle, Search } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import UniversityFilterGrid from "@/components/UniversityFilterGrid";
import {
  UK_TUITION_LOW_GBP,
  UK_TUITION_HIGH_GBP,
  UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS,
} from "@/lib/constants/uk-data";

export const metadata: Metadata = {
  title: `UK Universities for Nigerian Students — Fees, HND & January Intake (2026–27)`,
  description: `Browse UK universities accepting Nigerian and African students. Tuition from £${UK_TUITION_LOW_GBP.toLocaleString()}/yr. Universities accepting HND, 2:2, low deposits, and January 2027 intake. Updated September 2026.`,
  alternates: { canonical: "/universities/uk" },
  openGraph: {
    title: "UK Universities for Nigerian Students — Fees, HND & January Intake",
    description: `UK universities accepting Nigerian students: tuition from £${UK_TUITION_LOW_GBP.toLocaleString()}/yr, HND accepted, low deposit, January 2027 intake. September 2026.`,
    url: "/universities/uk",
    type: "website",
  },
};

const FEATURED_UNIVERSITIES = [
  {
    name: "University of Sunderland",
    slug: "university-of-sunderland",
    city: "Sunderland",
    region: "North East England",
    flags: ["HND accepted", "Low deposit", "Jan intake"],
    note: "Popular with Nigerian students for affordable fees and HND acceptance.",
  },
  {
    name: "Teesside University",
    slug: "teesside-university",
    city: "Middlesbrough",
    region: "North East England",
    flags: ["HND accepted", "Low deposit", "Jan intake"],
    note: "Strong technology and business programmes with January starts.",
  },
  {
    name: "University of South Wales",
    slug: "university-of-south-wales",
    city: "Newport / Cardiff",
    region: "Wales",
    flags: ["HND accepted", "2:2 accepted", "Low deposit"],
    note: "Flexible entry requirements across a wide range of programmes.",
  },
  {
    name: "University of Portsmouth",
    slug: "university-of-portsmouth",
    city: "Portsmouth",
    region: "South England",
    flags: ["2:2 accepted", "Jan intake"],
    note: "Well-regarded for business, computing, and engineering.",
  },
  {
    name: "University of Cumbria",
    slug: "university-of-cumbria",
    city: "Carlisle / London",
    region: "North West England",
    flags: ["Low deposit", "Jan intake"],
    note: "London campus available; healthcare and business popular.",
  },
  {
    name: "University of Worcester",
    slug: "university-of-worcester",
    city: "Worcester",
    region: "West Midlands",
    flags: ["Low deposit", "2:2 accepted"],
    note: "Affordable tuition and flexible entry requirements.",
  },
];

const ELIGIBILITY_FILTERS = [
  { label: "Universities accepting HND", href: "/study-in-uk/universities-accepting-hnd", desc: "HND-friendly postgraduate programmes" },
  { label: "Universities accepting 2:2", href: "/study-in-uk/universities-accepting-2-2", desc: "Second class lower division accepted" },
  { label: "Third class considered", href: "/study-in-uk/universities-accepting-third-class", desc: "With professional experience or merit" },
  { label: "No IELTS options", href: "/study-in-uk/without-ielts", desc: "MOI, WAEC, or Duolingo alternatives" },
  { label: "Low deposit universities", href: "/study-in-uk/low-deposit", desc: "CAS deposit under £2,000–£5,000" },
  { label: "January 2027 intake", href: "/intakes/january-2027/uk", desc: "Universities open for Jan 2027 entry" },
];

const UK_STUDY_FACTS = [
  { label: "Master's duration", value: "1 year full-time" },
  { label: "Tuition range", value: `£${UK_TUITION_LOW_GBP.toLocaleString()}–£${UK_TUITION_HIGH_GBP.toLocaleString()}/yr` },
  { label: "Graduate Route visa", value: `${UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS} years after graduation` },
  { label: "Intakes", value: "September & January" },
];

export default function UKUniversitiesPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav items={[{name:"Home",url:"/"},{name:"Universities",url:"/universities"},{name:"UK Universities",url:"/universities/uk"}]} />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Universities", url: "/universities" },
          { name: "UK Universities", url: "/universities/uk" },
        ]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5">
            <span className="text-lg">🇬🇧</span>
            <span className="text-sm font-semibold text-blue-800">UK Universities — Updated September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            UK Universities for Nigerian<br />
            <span className="text-blue-600">&amp; African Students</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Browse UK universities with verified tuition fees, CAS deposit amounts, HND acceptance, English requirements, and January intake availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/university-finder" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors">
              <Search className="w-5 h-5" /> Search All UK Universities
            </Link>
            <Link href="/tools/uk-university-eligibility-checker" className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold px-8 py-4 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              Check My Eligibility
            </Link>
          </div>
        </div>

        {/* Quick facts */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {UK_STUDY_FACTS.map((fact) => (
              <div key={fact.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">{fact.label}</p>
                <p className="text-sm font-bold text-gray-900">{fact.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility filters */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by your qualification</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ELIGIBILITY_FILTERS.map((filter) => (
              <Link
                key={filter.href}
                href={filter.href}
                className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{filter.label}</span>
                </div>
                <p className="text-xs text-gray-500 pl-5">{filter.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured universities */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Featured UK universities</h2>
            <span className="text-xs text-gray-500">Commonly chosen by Nigerian students</span>
          </div>
          <UniversityFilterGrid universities={FEATURED_UNIVERSITIES} />
        </section>

        {/* Why UK */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Why Nigerian students choose UK universities</h2>
          <ul className="space-y-2">
            {[
              `1-year Master's degrees — lower total tuition cost vs 2-year programmes in Canada/Australia`,
              `Graduate Route visa: work in the UK for ${UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS} years after graduation (any employer)`,
              "September and January intakes — more entry flexibility",
              "Many universities accept HND, 2:2, and WAEC English",
              `Tuition from £${UK_TUITION_LOW_GBP.toLocaleString()}/yr at accessible universities`,
              "English-medium instruction; strong Nigerian alumni networks at most universities",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Find UK universities that match your profile</h2>
          <p className="text-blue-100 mb-6">Enter your qualification, budget, IELTS score, and intake date — Tundua returns verified matches from 500+ UK universities.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Start My UK Application <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-blue-200">Free to start · No credit card required</p>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">UK study guides</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { href: "/study-in-uk", label: "Study in UK — complete guide" },
              { href: "/study-in-uk/cost", label: "Cost of studying in the UK" },
              { href: "/study-in-uk/visa", label: "UK Student Visa guide" },
              { href: "/study-in-uk/intakes", label: "UK university intakes 2026–27" },
              { href: "/intakes/january-2027/uk", label: "January 2027 intake — UK" },
              { href: "/tools/proof-of-funds-calculator", label: "Proof of Funds Calculator" },
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

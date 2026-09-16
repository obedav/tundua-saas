import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, MapPin, GraduationCap } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK & Canada Universities — Fees, Requirements & Deposits for Nigerian Students",
  description: "Browse universities in the UK and Canada with verified tuition fees, CAS deposits, HND acceptance, IELTS requirements, and January intake availability. Built for Nigerian and African students.",
  alternates: { canonical: "/universities" },
  openGraph: {
    title: "UK & Canada Universities — Fees, Deposits & Requirements",
    description: "Browse universities with verified tuition, deposit, HND acceptance and intake information for Nigerian students.",
    url: "/universities",
    type: "website",
  },
};

const FEATURED_UNIVERSITIES = [
  { name: "University of Sunderland", slug: "university-of-sunderland", city: "Sunderland", country: "UK", flags: ["HND", "Low deposit", "Jan intake"] },
  { name: "Teesside University", slug: "teesside-university", city: "Middlesbrough", country: "UK", flags: ["HND", "Low deposit", "Jan intake"] },
  { name: "University of South Wales", slug: "university-of-south-wales", city: "Newport / Cardiff", country: "UK", flags: ["HND", "2:2", "Low deposit"] },
  { name: "University of Portsmouth", slug: "university-of-portsmouth", city: "Portsmouth", country: "UK", flags: ["2:2", "Jan intake"] },
  { name: "University of Cumbria", slug: "university-of-cumbria", city: "Carlisle", country: "UK", flags: ["Low deposit", "Jan intake"] },
  { name: "University of Worcester", slug: "university-of-worcester", city: "Worcester", country: "UK", flags: ["Low deposit", "2:2"] },
  { name: "Brandon University", slug: "brandon-university", city: "Brandon, MB", country: "Canada", flags: ["Low deposit"] },
];

const COUNTRY_HUBS = [
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    href: "/universities/uk",
    stats: "500+ universities · Tuition from £10,000/yr",
    note: "1-year Master's · Graduate Route visa · January intakes",
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    href: "/study-in-canada",
    stats: "Colleges & universities · From CAD $12,000/yr",
    note: "3-year PGWP · Work 24hrs/week · Co-op options",
  },
];

export default function UniversitiesIndexPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Universities", url: "/universities" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Universities", url: "/universities" },
        ]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Verified University Data</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Universities in the UK &amp; Canada
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse universities with verified tuition fees, CAS deposits, HND acceptance, IELTS requirements, and January intake dates — built for Nigerian and African students.
          </p>
        </div>

        {/* Country hubs */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by country</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COUNTRY_HUBS.map((hub) => (
              <Link key={hub.country} href={hub.href} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{hub.flag}</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{hub.country}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">{hub.stats}</p>
                <p className="text-xs text-gray-500">{hub.note}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 font-semibold">
                  Browse universities <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured universities */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Featured universities</h2>
            <span className="text-xs text-gray-500">Commonly searched by Nigerian students</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURED_UNIVERSITIES.map((uni) => (
              <Link key={uni.slug} href={`/universities/${uni.slug}`} className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{uni.name}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{uni.city}, {uni.country}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uni.flags.map((flag) => (
                    <span key={flag} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5">{flag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Search CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Find universities that match your exact profile</h2>
          <p className="text-blue-100 mb-5">Enter your qualification, budget, IELTS score, and target intake. Tundua returns verified matches from 500+ universities.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/university-finder" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
              Search All Universities <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/tools/uk-university-eligibility-checker" className="inline-flex items-center justify-center gap-2 bg-blue-500/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-500/50 transition-colors border border-white/20">
              Check My Eligibility
            </Link>
          </div>
        </div>

        {/* Eligibility quick links */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Browse by eligibility</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/study-in-uk/universities-accepting-2-2", label: "UK universities accepting 2:2" },
              { href: "/study-in-uk/universities-accepting-third-class", label: "UK universities — third class" },
              { href: "/study-in-uk/without-ielts", label: "UK universities without IELTS" },
              { href: "/study-in-uk/low-deposit", label: "UK universities — low deposit" },
              { href: "/intakes/january-2027/uk", label: "January 2027 intake — UK" },
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

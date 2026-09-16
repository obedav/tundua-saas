import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Calendar, CheckCircle, Globe } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { clientEnv } from "@/lib/env";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const revalidate = 3600;
export const dynamicParams = true;

interface UniversityData {
  id: number;
  name: string;
  slug: string;
  country: string;
  city: string;
  overview?: string;
  tuition_min?: number;
  tuition_max?: number;
  deposit_amount?: number;
  has_january_intake?: boolean;
  has_september_intake?: boolean;
  accepts_hnd?: boolean;
  accepts_22?: boolean;
  accepts_third_class?: boolean;
  accepts_waec_english?: boolean;
  ielts_min?: number;
  accepts_moi?: boolean;
  popular_courses?: string[];
  scholarships?: string;
  application_fee?: number;
  verified_at?: string;
  official_website?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getUniversity(slug: string): Promise<UniversityData | null> {
  try {
    const apiUrl = clientEnv.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/v1/universities/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.university || data?.university || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const university = await getUniversity(slug);

  if (!university) {
    return { title: "University Not Found" };
  }

  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] || "https://tundua.com";
  const title = `${university.name} — Fees, Deposit & Requirements for Nigerian Students`;
  const description = [
    `${university.name} in ${university.city}, ${university.country}.`,
    university.tuition_min ? `Tuition from £${university.tuition_min.toLocaleString()}/yr.` : null,
    university.deposit_amount ? `Deposit: £${university.deposit_amount.toLocaleString()}.` : null,
    university.accepts_hnd ? "Accepts HND." : null,
    university.ielts_min ? `IELTS ${university.ielts_min}+.` : null,
    university.has_january_intake ? "January intake available." : null,
  ].filter(Boolean).join(" ");

  return {
    title,
    description,
    alternates: { canonical: `${appUrl}/universities/${slug}` },
    openGraph: {
      title,
      description,
      url: `/universities/${slug}`,
      type: "website",
    },
  };
}

function YesNo({ value }: { value?: boolean }) {
  if (value === undefined) return <span className="text-gray-400 text-sm">—</span>;
  return value
    ? <CheckCircle className="w-5 h-5 text-green-500" />
    : <span className="text-sm text-gray-400">No</span>;
}

export default async function UniversityPage({ params }: PageProps) {
  const { slug } = await params;
  const university = await getUniversity(slug);

  if (!university) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Universities", url: "/universities" },
          { name: "UK", url: "/universities/uk" },
          { name: university.name, url: `/universities/${slug}` },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Universities", url: "/universities" },
          { name: university.name, url: `/universities/${slug}` },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/universities" className="text-sm text-blue-600 hover:underline">← All universities</Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight">{university.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{university.city}, {university.country}</span>
            {university.has_january_intake && (
              <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                <Calendar className="w-3.5 h-3.5" /> January intake
              </span>
            )}
          </div>
          {university.overview && <p className="text-gray-600 mt-3 text-base">{university.overview}</p>}
        </div>

        {/* Key data grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {university.tuition_min && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Tuition</p>
              <p className="text-lg font-bold text-gray-900">
                £{university.tuition_min.toLocaleString()}
                {university.tuition_max && university.tuition_max !== university.tuition_min
                  ? `–£${university.tuition_max.toLocaleString()}`
                  : ""}
                /yr
              </p>
            </div>
          )}
          {university.deposit_amount && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">CAS Deposit</p>
              <p className="text-lg font-bold text-gray-900">£{university.deposit_amount.toLocaleString()}</p>
            </div>
          )}
          {university.ielts_min && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">IELTS minimum</p>
              <p className="text-lg font-bold text-gray-900">{university.ielts_min}</p>
            </div>
          )}
        </div>

        {/* Eligibility matrix */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Academic requirements &amp; acceptance</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: "HND accepted", value: university.accepts_hnd },
              { label: "2:2 accepted", value: university.accepts_22 },
              { label: "Third class considered", value: university.accepts_third_class },
              { label: "WAEC English accepted", value: university.accepts_waec_english },
              { label: "MOI letter accepted", value: university.accepts_moi },
              { label: "January 2027 intake", value: university.has_january_intake },
              { label: "September 2027 intake", value: university.has_september_intake },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-gray-700">{row.label}</span>
                <YesNo value={row.value} />
              </div>
            ))}
          </div>
        </section>

        {/* Popular courses */}
        {university.popular_courses && university.popular_courses.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Popular programmes</h2>
            <div className="flex flex-wrap gap-2">
              {university.popular_courses.map((course) => (
                <span key={course} className="text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-3 py-1">{course}</span>
              ))}
            </div>
          </section>
        )}

        {/* Verified note */}
        {university.verified_at && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-semibold">Data last verified: {new Date(university.verified_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
              {university.official_website && (
                <a href={university.official_website} target="_blank" rel="noopener noreferrer" className="underline flex items-center gap-1 mt-1">
                  <Globe className="w-3.5 h-3.5" /> Official university website
                </a>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Check if you qualify for {university.name}</h2>
          <p className="text-blue-100 mb-5 text-sm">Answer 3 quick questions about your qualification and budget — Tundua tells you if this university is a match.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors">
            Check My Eligibility <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/universities", label: "Browse all universities" },
              { href: "/study-in-uk/low-deposit", label: "UK universities with low deposit" },
              { href: "/study-in-uk/universities-accepting-hnd", label: "UK universities accepting HND" },
              { href: "/intakes/january-2027/uk", label: "January 2027 UK intake guide" },
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

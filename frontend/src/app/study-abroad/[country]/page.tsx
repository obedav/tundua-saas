import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, MessageCircle, Clock, Eye } from "lucide-react";
import { getKnowledgeBaseArticles } from "@/lib/actions/knowledge-base";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { buildSeoTitle } from "@/lib/seo-title";
import { buildGeoMetadata } from "@/lib/geo-metadata";

const WHATSAPP_NUMBER = process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000";

interface CountryConfig {
  name: string;
  adjective: string;
  h1: string;
  metaDescription: string;
  searchTerm: string;
}

// Open/Closed: add a new country by adding one entry here. No new files.
const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  nigeria: {
    name: "Nigeria",
    adjective: "Nigerian",
    h1: "Study Abroad from Nigeria (2026)",
    metaDescription: "The complete guide for Nigerian students studying abroad in 2026 — cheapest UK universities, Canadian study permits, Australian visa costs, and step-by-step application help.",
    searchTerm: "Nigeria",
  },
  ghana: {
    name: "Ghana",
    adjective: "Ghanaian",
    h1: "Study Abroad from Ghana (2026)",
    metaDescription: "The complete guide for Ghanaian students studying abroad in 2026 — UK universities, Canadian study permits, Australian visa requirements, and Tundua application support.",
    searchTerm: "Ghana",
  },
  egypt: {
    name: "Egypt",
    adjective: "Egyptian",
    h1: "Study Abroad from Egypt (2026)",
    metaDescription: "The complete guide for Egyptian students studying abroad in 2026 — UK universities, Canadian study permits, Australian visa requirements, and Tundua application support.",
    searchTerm: "Egypt",
  },
  morocco: {
    name: "Morocco",
    adjective: "Moroccan",
    h1: "Study Abroad from Morocco (2026)",
    metaDescription: "The complete guide for Moroccan students studying abroad in 2026 — UK universities, Canadian study permits, Australian visa requirements, and Tundua application support.",
    searchTerm: "Morocco",
  },
  kenya: {
    name: "Kenya",
    adjective: "Kenyan",
    h1: "Study Abroad from Kenya (2026)",
    metaDescription: "The complete guide for Kenyan students studying abroad in 2026 — UK universities, Canadian study permits, Australian visa requirements, and Tundua application support.",
    searchTerm: "Kenya",
  },
  zambia: {
    name: "Zambia",
    adjective: "Zambian",
    h1: "Study Abroad from Zambia (2026)",
    metaDescription: "The complete guide for Zambian students studying abroad in 2026 — UK universities, Canadian study permits, Australian visa requirements, and Tundua application support.",
    searchTerm: "Zambia",
  },
};

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string | null;
  category: string;
  tags?: string[];
  view_count: number;
  created_at: string;
}

interface PageProps {
  params: Promise<{ country: string }>;
}

export const revalidate = 1800;

// Hard 404 for any slug not returned by generateStaticParams — enforces the whitelist.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(COUNTRY_CONFIG).map((country) => ({ country }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const config = COUNTRY_CONFIG[country];
  if (!config) notFound();

  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'https://tundua.com';
  const metaTitle = buildSeoTitle(config.h1, [config.name]);
  const geo = buildGeoMetadata(country);

  return {
    title: metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `${appUrl}/study-abroad/${country}`,
      ...(geo ? { languages: geo.languages } : {}),
    },
    openGraph: {
      title: metaTitle,
      description: config.metaDescription,
      url: `${appUrl}/study-abroad/${country}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: config.metaDescription,
    },
    ...(geo ? { other: geo.other } : {}),
  };
}

export default async function CountryLandingPage({ params }: PageProps) {
  const { country } = await params;
  const config = COUNTRY_CONFIG[country];
  if (!config) notFound();

  let articles: Article[] = [];
  try {
    const data = await getKnowledgeBaseArticles({ search: config.searchTerm, limit: 12 });
    articles = data?.data?.articles || data?.articles || [];
  } catch {
    // API unavailable — render with empty article list
  }

  const whatsappMessage = `Hi Tundua, I'm a student from ${config.name} looking to study abroad. Can you help me with a free shortlist of universities I qualify for?`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Study Abroad", url: "/blog" },
          { name: config.name, url: `/study-abroad/${country}` },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{config.h1}</h1>
          <p className="text-lg text-gray-600 max-w-2xl">{config.metaDescription}</p>
        </div>

        {/* Primary WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md hover:scale-[1.02] transition-all mb-12"
        >
          <MessageCircle className="w-6 h-6" />
          Get Your Free University Shortlist on WhatsApp
          <ArrowRight className="w-5 h-5" />
        </a>

        {/* Article grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Guides for {config.adjective} Students
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Guides for {config.adjective} students coming soon.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                Get personalised advice on WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {article.featured_image ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={`${process.env['NEXT_PUBLIC_API_URL'] || ''}${article.featured_image}`}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-7 h-7 text-primary-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                        {buildSeoTitle(article.title, article.tags ?? [])}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.view_count} views
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Bottom WhatsApp CTA */}
        <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Start Your Application?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Our advisors have helped hundreds of {config.adjective} students get into top universities. Get your free personalised shortlist — usually within 24 hours.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            Chat With an Advisor on WhatsApp
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-sm text-gray-500 mt-4">Free · No commitment · Response within 24 hours</p>
        </div>
      </main>

      <WhatsAppFloat />

      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

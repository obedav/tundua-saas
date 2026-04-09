import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { BookOpen, Search, ArrowRight, Clock, Eye, Tag, TrendingUp } from "lucide-react";
import { getKnowledgeBaseArticles, getKnowledgeBaseCategories, getFeaturedArticles, getPopularArticles } from "@/lib/actions/knowledge-base";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Study Abroad Blog - Guides, Tips & Rankings (2026)",
  description: "Expert guides on studying abroad from Nigeria. Cheapest UK universities, visa requirements, application tips, and budget guides.",
  alternates: {
    canonical: `${process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'}/blog`,
  },
  keywords: [
    "study abroad blog",
    "cheapest universities UK",
    "study in UK from Nigeria",
    "international student guides",
    "university application tips",
    "study abroad budget guide",
  ],
};

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string | null;
  category: string;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;

  let articles: Article[] = [];
  let categories: string[] = [];
  let featured: Article[] = [];
  let popular: Article[] = [];

  try {
    const [articlesData, categoriesData, featuredData, popularData] = await Promise.allSettled([
      getKnowledgeBaseArticles({ category: params.category, search: params.search, limit: 50 }),
      getKnowledgeBaseCategories(),
      getFeaturedArticles({ limit: 3 }),
      getPopularArticles({ limit: 3 }),
    ]);

    if (articlesData.status === "fulfilled" && articlesData.value) {
      const d = articlesData.value;
      articles = d?.data?.articles || d?.articles || [];
    }
    if (categoriesData.status === "fulfilled" && categoriesData.value) {
      const d = categoriesData.value;
      categories = d?.data?.categories || d?.categories || [];
    }
    if (featuredData.status === "fulfilled" && featuredData.value) {
      const d = featuredData.value;
      featured = d?.data?.articles || d?.articles || [];
    }
    if (popularData.status === "fulfilled" && popularData.value) {
      const d = popularData.value;
      popular = d?.data?.articles || d?.articles || [];
    }
  } catch {
    // API unavailable — page renders with empty state
  }

  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';

  // CollectionPage schema for blog listing
  const collectionSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tundua Blog - Study Abroad Guides & Tips',
    description: 'Expert guides on studying abroad from Nigeria. Cheapest UK universities, visa requirements, and budget guides.',
    url: `${appUrl}/blog`,
    isPartOf: { '@id': `${appUrl}#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 10).map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${appUrl}/blog/${a.slug}`,
        name: a.title,
      })),
    },
  });

  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <Script
        id="structured-data-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: collectionSchema }}
        strategy="afterInteractive"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tundua Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Guides, tips, and insights to help you navigate your study abroad journey.
          </p>
        </div>

        {/* High-intent quick links — points users straight at the most-read articles */}
        {!params.category && !params.search && popular.length > 0 && (
          <div className="mb-10 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-700">
                Most Read by Nigerian Students
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {popular.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group flex items-start gap-2 p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-400 hover:shadow-sm transition-all"
                >
                  <ArrowRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 line-clamp-2">
                    {article.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <form className="flex-1 relative" action="/blog" method="GET">
            {params.category && <input type="hidden" name="category" value={params.category} />}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            />
          </form>
          <div className="flex gap-2 overflow-x-auto">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !params.category ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  params.category === cat ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {!params.category && !params.search && featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  {article.featured_image ? (
                    <div className="relative aspect-video">
                      <Image
                        src={`${process.env['NEXT_PUBLIC_API_URL'] || ''}${article.featured_image}`}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-primary-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full mb-3">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {article.view_count} views
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {params.category ? `${params.category} Articles` : params.search ? `Results for "${params.search}"` : "All Articles"}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                {params.search
                  ? "Try adjusting your search terms."
                  : "Check back soon for new content."}
              </p>
              {(params.search || params.category) && (
                <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium">
                  View all articles
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          <Tag className="w-3 h-3" />
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.view_count} views
                        </span>
                      </div>
                    </div>
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
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0 mt-1 transition-colors" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

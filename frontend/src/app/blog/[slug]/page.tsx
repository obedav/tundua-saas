import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Eye, ThumbsUp, ThumbsDown, Tag, BookOpen, ArrowRight } from "lucide-react";
import { getKnowledgeBaseArticle, getRelatedArticles, getPopularArticles } from "@/lib/actions/knowledge-base";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, BlogPostStructuredData, FAQStructuredData } from "@/components/StructuredData";
import { BlogCTA } from "@/components/BlogCTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { InlineLeadForm } from "@/components/InlineLeadForm";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { EligibilityQuiz } from "@/components/EligibilityQuiz";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { clientEnv } from "@/lib/env";

// ISR: Revalidate every 30 minutes so content stays fresh
export const revalidate = 1800;

// Allow new slugs not in generateStaticParams to be rendered on-demand
export const dynamicParams = true;

/**
 * Pre-render all published blog articles at build time.
 * This is CRITICAL for SEO: Googlebot gets real HTML instead of
 * hitting the API at crawl time (which can fail and cause soft 404s).
 */
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${clientEnv.NEXT_PUBLIC_API_URL}/api/v1/knowledge-base/slugs`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return [];

    const data = await response.json();
    if (data?.success && data?.slugs) {
      return data.slugs.map((item: { slug: string }) => ({
        slug: item.slug,
      }));
    }
  } catch {
    console.error('Failed to fetch slugs for static generation');
  }

  return [];
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string | null;
  category: string;
  tags?: string[];
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string | null;
  category: string;
  created_at: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';
  try {
    const { slug } = await params;
    const data = await getKnowledgeBaseArticle(slug);
    const article: Article | null = data?.data?.article || data?.article || null;

    if (!article) {
      return { title: "Article Not Found | Tundua Blog" };
    }

    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || '';
    const ogImages = article.featured_image
      ? [{ url: `${apiUrl}${article.featured_image}` }]
      : undefined;

    return {
      title: article.title,
      description: article.excerpt || article.title,
      alternates: { canonical: `${appUrl}/blog/${slug}` },
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        type: "article",
        publishedTime: article.created_at,
        modifiedTime: article.updated_at,
        ...(ogImages ? { images: ogImages } : {}),
      },
    };
  } catch {
    return { title: "Blog | Tundua" };
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  let article: Article | null = null;

  try {
    const data = await getKnowledgeBaseArticle(slug);
    article = data?.data?.article || data?.article || null;
  } catch {
    // API unavailable
  }

  if (!article) {
    notFound();
  }

  // Fetch related + popular articles for internal linking
  const [relatedRaw, popularData] = await Promise.all([
    getRelatedArticles(article.category, article.slug, 4),
    getPopularArticles({ limit: 6 }),
  ]);
  const relatedArticles: RelatedArticle[] = relatedRaw || [];
  const popularArticles: RelatedArticle[] = (popularData?.data?.articles || popularData?.articles || [])
    .filter((a: RelatedArticle) => a.slug !== article.slug)
    .slice(0, 4);

  // Extract FAQs from article metadata
  const faqs: FAQ[] = Array.isArray(article.metadata?.['faqs'])
    ? (article.metadata['faqs'] as FAQ[])
    : [];

  const readingTime = getReadingTime(article.content);

  // Derive country from article category for the eligibility quiz
  const categoryLower = article.category.toLowerCase();
  const quizCountry: "uk" | "canada" | "australia" =
    categoryLower.includes("canada") ? "canada" :
    categoryLower.includes("australia") ? "australia" :
    "uk";

  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: article.title, url: `/blog/${article.slug}` },
        ]}
      />
      <BlogPostStructuredData
        article={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          updated_at: article.updated_at,
          published_at: article.created_at,
          featured_image: article.featured_image,
          api_url: process.env['NEXT_PUBLIC_API_URL'] || '',
        }}
      />
      {faqs.length > 0 && <FAQStructuredData faqs={faqs} />}

      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                <Tag className="w-3.5 h-3.5" />
                {article.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight break-words">
              {article.title}
            </h1>

            {/* Featured Snippet Block - direct answer for Google Position #0 */}
            {article.excerpt && (
              <p className="text-base sm:text-lg text-gray-700 bg-primary-50/50 border-l-4 border-primary-500 pl-3 sm:pl-4 py-3 rounded-r-lg mb-4">
                {article.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {article.view_count} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
              <Image
                src={`${process.env['NEXT_PUBLIC_API_URL'] || ''}${article.featured_image}`}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-200 mb-8" />

          {/* Eligibility Quiz - 30s interactive lead capture (highest converting element).
              Single CTA above the fold — no competing form here, since two stacked forms
              feel pushy and dilute attention. */}
          <EligibilityQuiz country={quizCountry} />

          {/* Article Content - rendered as a single block.
              We deliberately do NOT split the HTML to inject a mid-article CTA.
              Splitting at arbitrary tag boundaries can land inside nested wrapper
              divs (e.g. step cards, info boxes, article-level wrappers), producing
              unmatched closing tags. When that broken HTML is injected via
              dangerouslySetInnerHTML, the orphan closing divs close the parent
              <article> early and push everything after them outside the article
              element — visually appearing as duplicated content after the footer. */}
          {/* overflow-x-auto: catches any wide tables/preformatted blocks in the CMS HTML
              so they scroll horizontally instead of forcing the whole article wider on mobile.
              prose-img:max-w-full + prose-table:block: keeps embedded images from busting out
              and forces tables to allow horizontal scroll inside their own container. */}
          <div
            className="prose prose-base sm:prose-lg max-w-none overflow-x-auto prose-headings:text-gray-900 prose-headings:break-words prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:max-w-full prose-img:h-auto"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Post-content CTA — lead magnet + advisor card */}
          <BlogCTA variant="mid" />

          {/* Inline Lead Form - second-chance capture for users who skipped the quiz at the top */}
          <InlineLeadForm />

          {/* Bottom CTA (testimonials + pricing + main CTA) */}
          <BlogCTA variant="banner" />

          {/* FAQ Section - renders visually + powers FAQ schema */}
          {faqs.length > 0 && (
            <section className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
                    {...(index === 0 ? { open: true } : {})}
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                      {faq.question}
                      <ArrowRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                    </summary>
                    <div className="px-5 pb-5 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Helpful Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Was this article helpful?</p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                {article.helpful_count}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <ThumbsDown className="w-4 h-4" />
                {article.not_helpful_count}
              </span>
            </div>
          </div>
        </article>

        {/* Internal Linking - Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-primary-200 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {related.featured_image ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={`${process.env['NEXT_PUBLIC_API_URL'] || ''}${related.featured_image}`}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2">{related.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Articles - cross-category internal linking */}
        {popularArticles.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Guides</h2>
            <ul className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {popularArticles.map((pop) => (
                <li key={pop.id}>
                  <Link
                    href={`/blog/${pop.slug}`}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-900 font-medium hover:text-primary-600 transition-colors line-clamp-1">
                      {pop.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Footer nav — quiet secondary links only. The main CTA already lives in
            the BlogCTA banner above; duplicating Apply Now here just creates noise. */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse more guides
          </Link>
        </div>
      </main>

      <WhatsAppFloat />
      <StickyMobileCTA />
      <ExitIntentPopup />

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

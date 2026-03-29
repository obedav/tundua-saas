import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Eye, ThumbsUp, ThumbsDown, Tag } from "lucide-react";
import { getKnowledgeBaseArticle } from "@/lib/actions/knowledge-base";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, BlogPostStructuredData } from "@/components/StructuredData";

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
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
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
      title: `${article.title} | Tundua Blog`,
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
          category: article.category,
          updated_at: article.updated_at,
          published_at: article.created_at,
        }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                <Tag className="w-3.5 h-3.5" />
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
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

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

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

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Have questions about studying abroad?</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              More Articles
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

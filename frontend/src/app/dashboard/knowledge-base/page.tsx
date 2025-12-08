"use client";

import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { getPopularArticles } from "@/lib/actions/knowledge-base";

interface Article {
  id: number;
  title: string;
  excerpt?: string;
  category: string;
  view_count: number;
  helpful_count: number;
  not_helpful_count?: number;
  updated_at?: string;
}

interface Category {
  name: string;
  icon: any;
  count: number;
  color: string;
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"popular" | "recent">("popular");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch articles
      const articlesResponse = await getPopularArticles({ limit: 50 });

      // Use fallback data if API fails
      const articlesData = articlesResponse.success
        ? (articlesResponse.data?.articles || [])
        : getFallbackArticles();

      setArticles(articlesData);
      setCategories(getCategories());
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
      setArticles(getFallbackArticles());
      setCategories(getCategories());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategories = (): Category[] => [
    { name: "Applications", icon: FileText, count: 24, color: "text-blue-600 bg-blue-50" },
    { name: "Documents", icon: BookOpen, count: 18, color: "text-green-600 bg-green-50" },
    { name: "Payments", icon: HelpCircle, count: 12, color: "text-purple-600 bg-purple-50" },
    { name: "Add-Ons", icon: ExternalLink, count: 15, color: "text-orange-600 bg-orange-50" },
  ];

  const getFallbackArticles = (): Article[] => [
    {
      id: 1,
      title: "How to Submit a Complete Application",
      excerpt: "Learn the step-by-step process of submitting your study abroad application.",
      category: "Applications",
      view_count: 1245,
      helpful_count: 98,
      updated_at: "2025-12-01",
    },
    {
      id: 2,
      title: "Understanding Document Requirements",
      excerpt: "Complete guide to all documents needed for your application.",
      category: "Documents",
      view_count: 987,
      helpful_count: 95,
      updated_at: "2025-11-28",
    },
    {
      id: 3,
      title: "Payment Methods & Processing Times",
      excerpt: "All you need to know about payments and refunds.",
      category: "Payments",
      view_count: 856,
      helpful_count: 92,
      updated_at: "2025-11-25",
    },
    {
      id: 4,
      title: "Tracking Your Application Status",
      excerpt: "Monitor your application progress in real-time.",
      category: "Applications",
      view_count: 743,
      helpful_count: 89,
      updated_at: "2025-11-22",
    },
    {
      id: 5,
      title: "What's Included in Each Service Tier",
      excerpt: "Compare Standard, Premium, and Concierge packages.",
      category: "Services",
      view_count: 621,
      helpful_count: 91,
      updated_at: "2025-11-20",
    },
  ];

  const calculateHelpfulPercentage = (article: Article) => {
    const total = article.helpful_count + (article.not_helpful_count || 0);
    if (total === 0) return 0;
    return Math.round((article.helpful_count / total) * 100);
  };

  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.view_count - a.view_count;
      } else {
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-primary-100">
          Find answers to common questions and learn how to use Tundua effectively
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "popular" | "recent")}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 ${
                  viewMode === "grid"
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600" />
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.name)
                }
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500">{category.count} articles</p>
                </div>
              </button>
            );
          })}
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedCategory || "All"} Articles ({filteredArticles.length})
        </h2>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No articles found matching your search.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <a
                key={article.id}
                href={`/dashboard/knowledge-base/${article.id}`}
                className="block p-5 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                    {article.category}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {article.view_count} views
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {calculateHelpfulPercentage(article)}% helpful
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <a
                key={article.id}
                href={`/dashboard/knowledge-base/${article.id}`}
                className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Updated {article.updated_at}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 mb-1">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {article.view_count} views
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {calculateHelpfulPercentage(article)}% helpful
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Can&apos;t find what you&apos;re looking for?
        </h3>
        <p className="text-gray-600 mb-4">
          Our support team is here to help you with any questions.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/dashboard/support"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Contact Support
          </a>
          <a
            href="/dashboard/help"
            className="px-6 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:border-gray-400 transition-colors"
          >
            Browse Help Center
          </a>
        </div>
      </div>
    </div>
  );
}

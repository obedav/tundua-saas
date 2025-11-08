"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, FileText, HelpCircle, ExternalLink, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface Article {
  id: number;
  title: string;
  category: string;
  view_count: number;
  helpful_count: number;
  not_helpful_count?: number;
}

export default function KnowledgeBaseWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularArticles();
  }, []);

  const fetchPopularArticles = async () => {
    try {
      const response = await apiClient.getPopularArticles({ limit: 5 });
      const articles = response.data.articles || [];

      setPopularArticles(articles);
    } catch (error) {
      console.error("Error fetching popular articles:", error);
      // Fallback to sample data if API fails
      setPopularArticles([
        {
          id: 1,
          title: "How to Submit a Complete Application",
          category: "Applications",
          view_count: 1245,
          helpful_count: 98,
        },
        {
          id: 2,
          title: "Understanding Document Requirements",
          category: "Documents",
          view_count: 987,
          helpful_count: 95,
        },
        {
          id: 3,
          title: "Payment Methods & Processing Times",
          category: "Payments",
          view_count: 856,
          helpful_count: 92,
        },
        {
          id: 4,
          title: "Tracking Your Application Status",
          category: "Applications",
          view_count: 743,
          helpful_count: 89,
        },
        {
          id: 5,
          title: "What's Included in Each Service Tier",
          category: "Services",
          view_count: 621,
          helpful_count: 91,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Applications", icon: FileText, count: 24, color: "text-blue-600 bg-blue-50" },
    { name: "Documents", icon: BookOpen, count: 18, color: "text-green-600 bg-green-50" },
    { name: "Payments", icon: HelpCircle, count: 12, color: "text-purple-600 bg-purple-50" },
    { name: "Add-Ons", icon: ExternalLink, count: 15, color: "text-orange-600 bg-orange-50" },
  ];

  const filteredArticles = popularArticles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateHelpfulPercentage = (article: Article) => {
    const total = article.helpful_count + (article.not_helpful_count || 0);
    if (total === 0) return 0;
    return Math.round((article.helpful_count / total) * 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
        </div>
        <a
          href="/dashboard/help"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.name}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${category.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category.count} articles</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Popular Articles */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Articles</h3>
        <div className="space-y-2">
          {filteredArticles.map((article) => (
            <a
              key={article.id}
              href={`/dashboard/help/articles/${article.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 mb-1">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{article.category}</span>
                    <span>{article.view_count} views</span>
                    <span className="text-green-600">{calculateHelpfulPercentage(article)}% helpful</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 flex-shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <a
            href="/dashboard/help/contact"
            className="text-center py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            Contact Support
          </a>
          <a
            href="/dashboard/help/video-tutorials"
            className="text-center py-2 px-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-sm font-medium text-primary-700 transition-colors"
          >
            Video Tutorials
          </a>
        </div>
      </div>
    </div>
  );
}

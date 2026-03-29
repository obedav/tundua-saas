"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  ArrowLeft,
  Save,
  X,
  Loader2,
  Image,
} from "lucide-react";
import {
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  uploadBlogImage,
} from "@/lib/actions/admin-knowledge-base";
import type { KnowledgeBaseArticle } from "@/types/api";

type ViewMode = "list" | "editor";

interface EditorState {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  category: string;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
}

const emptyEditor: EditorState = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featured_image: null,
  category: "",
  tags: [],
  is_published: false,
  is_featured: false,
};

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function KnowledgeBaseEditor() {
  const [view, setView] = useState<ViewMode>("list");
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Editor
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (searchQuery) params['search'] = searchQuery;
      if (statusFilter !== "all") params['status'] = statusFilter;
      if (categoryFilter !== "all") params['category'] = categoryFilter;

      const data = await getAdminArticles(params);
      if (data?.success) {
        setArticles(data.articles);
      }
    } catch {
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [error]);

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  const handleNewArticle = () => {
    setEditor(emptyEditor);
    setTagInput("");
    setView("editor");
  };

  const handleEdit = (article: KnowledgeBaseArticle) => {
    setEditor({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || "",
      featured_image: article.featured_image || null,
      category: article.category || "",
      tags: article.tags || [],
      is_published: article.is_published,
      is_featured: article.is_featured,
    });
    setTagInput("");
    setView("editor");
  };

  const handleSave = async (publish?: boolean) => {
    if (!editor.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);

    const data = {
      title: editor.title,
      slug: editor.slug || undefined,
      content: editor.content,
      excerpt: editor.excerpt,
      featured_image: editor.featured_image,
      category: editor.category || "General",
      tags: editor.tags,
      is_published: publish !== undefined ? publish : editor.is_published,
      is_featured: editor.is_featured,
    };

    try {
      let result;
      if (editor.id) {
        result = await updateArticle(editor.id, data);
      } else {
        result = await createArticle(data);
      }

      if (result.success) {
        setSuccessMessage(
          editor.id ? "Article updated successfully" : "Article created successfully"
        );
        setView("list");
        fetchArticles();
      } else {
        setError(result.error || "Failed to save article");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteArticle(id);
      if (result.success) {
        setSuccessMessage("Article deleted successfully");
        setDeleteConfirmId(null);
        fetchArticles();
      } else {
        setError(result.error || "Failed to delete article");
      }
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleTogglePublish = async (article: KnowledgeBaseArticle) => {
    try {
      const result = await updateArticle(article.id, {
        is_published: !article.is_published,
      });
      if (result.success) {
        setSuccessMessage(
          article.is_published ? "Article unpublished" : "Article published"
        );
        fetchArticles();
      } else {
        setError(result.error || "Failed to update article");
      }
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleToggleFeatured = async (article: KnowledgeBaseArticle) => {
    try {
      const result = await updateArticle(article.id, {
        is_featured: !article.is_featured,
      });
      if (result.success) {
        fetchArticles();
      }
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleImageDownload = async () => {
    if (!imageUrl.trim()) return;
    setUploadingImage(true);
    try {
      const result = await uploadBlogImage(imageUrl.trim());
      if (result.success && result.image_url) {
        setEditor({ ...editor, featured_image: result.image_url });
        setImageUrl("");
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setEditor({ ...editor, featured_image: null });
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !editor.tags.includes(tag)) {
      setEditor({ ...editor, tags: [...editor.tags, tag] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditor({ ...editor, tags: editor.tags.filter((t) => t !== tag) });
  };

  // ==================== LIST VIEW ====================
  if (view === "list") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Knowledge Base Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage blog articles and help content
            </p>
          </div>
          <button
            onClick={handleNewArticle}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Article
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Articles Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-16">
              <BookOpen className="h-16 w-16 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-lg font-medium">No articles found</p>
              <p className="text-sm mt-1">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first article to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Title
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Category
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Views
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Featured
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          /blog/{article.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            article.is_published
                              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                          }`}
                        >
                          {article.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                        {article.view_count}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(article)}
                          className="inline-flex"
                          title={
                            article.is_featured
                              ? "Remove from featured"
                              : "Mark as featured"
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${
                              article.is_featured
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                        {new Date(article.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(article)}
                            className="p-1.5 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                            title={
                              article.is_published ? "Unpublish" : "Publish"
                            }
                          >
                            {article.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(article.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Article
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this article? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== EDITOR VIEW ====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("list")}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editor.id ? "Edit Article" : "New Article"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
              {editor.is_published ? "Published" : "Draft"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editor.is_published && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              Publish
            </button>
          )}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {editor.is_published ? "Update" : "Save Draft"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editor.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setEditor({
                  ...editor,
                  title: newTitle,
                  // Auto-generate slug only for new articles
                  ...(!editor.id && !editor.slug
                    ? { slug: generateSlug(newTitle) }
                    : {}),
                });
              }}
              onBlur={() => {
                if (!editor.slug && editor.title) {
                  setEditor({ ...editor, slug: generateSlug(editor.title) });
                }
              }}
              placeholder="Article title"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                /blog/
              </span>
              <input
                type="text"
                value={editor.slug}
                onChange={(e) =>
                  setEditor({ ...editor, slug: generateSlug(e.target.value) })
                }
                placeholder="article-slug"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content (HTML)
            </label>
            <textarea
              value={editor.content}
              onChange={(e) =>
                setEditor({ ...editor, content: e.target.value })
              }
              placeholder="Write your article content here... HTML tags are supported."
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Excerpt
            </label>
            <textarea
              value={editor.excerpt}
              onChange={(e) =>
                setEditor({ ...editor, excerpt: e.target.value })
              }
              placeholder="Brief summary of the article (shown in article cards)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              value={editor.category}
              onChange={(e) =>
                setEditor({ ...editor, category: e.target.value })
              }
              placeholder="e.g. Study Abroad Tips"
              list="categories-datalist"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {categories.length > 0 && (
              <datalist id="categories-datalist">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
            {editor.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {editor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            {editor.featured_image ? (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img
                    src={`${process.env['NEXT_PUBLIC_API_URL'] || ''}${editor.featured_image}`}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 mb-2">
                  <Image className="h-8 w-8" />
                  <span className="text-xs">No image set</span>
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL (Unsplash, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleImageDownload}
                  disabled={uploadingImage || !imageUrl.trim()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Download &amp; Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Publish Settings */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Settings
            </h3>

            {/* Featured Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Featured
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={editor.is_featured}
                  onChange={(e) =>
                    setEditor({ ...editor, is_featured: e.target.checked })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    editor.is_featured
                      ? "bg-amber-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${
                      editor.is_featured
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </label>

            {/* Published Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Published
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {editor.is_published
                    ? "Visible to public"
                    : "Saved as draft"}
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={editor.is_published}
                  onChange={(e) =>
                    setEditor({ ...editor, is_published: e.target.checked })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    editor.is_published
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${
                      editor.is_published
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

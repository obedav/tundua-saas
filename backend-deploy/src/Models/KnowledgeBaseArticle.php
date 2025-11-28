<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class KnowledgeBaseArticle extends Model
{
    protected $table = 'knowledge_base_articles';

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'category',
        'tags',
        'author_id',
        'is_published',
        'is_featured',
        'view_count',
        'helpful_count',
        'not_helpful_count',
        'metadata'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'view_count' => 'integer',
        'helpful_count' => 'integer',
        'not_helpful_count' => 'integer',
        'tags' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'published_at' => 'datetime'
    ];

    /**
     * Get all published articles
     */
    public static function getPublishedArticles(?string $category = null, ?string $search = null, int $limit = 50): array
    {
        try {
            $query = self::where('is_published', true);

            if ($category) {
                $query->where('category', $category);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                      ->orWhere('content', 'LIKE', "%{$search}%")
                      ->orWhere('excerpt', 'LIKE', "%{$search}%");
                });
            }

            return $query
                ->orderBy('is_featured', 'DESC')
                ->orderBy('view_count', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting knowledge base articles: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get article by ID or slug
     */
    public static function getByIdOrSlug($identifier): ?self
    {
        try {
            if (is_numeric($identifier)) {
                return self::where('id', $identifier)->where('is_published', true)->first();
            }
            return self::where('slug', $identifier)->where('is_published', true)->first();
        } catch (\Exception $e) {
            error_log("Error getting article: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get popular articles
     */
    public static function getPopularArticles(int $limit = 5): array
    {
        try {
            return self::where('is_published', true)
                ->orderBy('view_count', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting popular articles: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get featured articles
     */
    public static function getFeaturedArticles(int $limit = 3): array
    {
        try {
            return self::where('is_published', true)
                ->where('is_featured', true)
                ->orderBy('published_at', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting featured articles: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get articles by category
     */
    public static function getByCategory(string $category, int $limit = 20): array
    {
        try {
            return self::where('is_published', true)
                ->where('category', $category)
                ->orderBy('view_count', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting articles by category: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Increment view count
     */
    public static function incrementViews(int $id): bool
    {
        try {
            $article = self::find($id);
            if ($article) {
                $article->increment('view_count');
                return true;
            }
            return false;
        } catch (\Exception $e) {
            error_log("Error incrementing views: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Mark as helpful
     */
    public static function markHelpful(int $id, bool $isHelpful = true): bool
    {
        try {
            $article = self::find($id);
            if ($article) {
                if ($isHelpful) {
                    $article->increment('helpful_count');
                } else {
                    $article->increment('not_helpful_count');
                }
                return true;
            }
            return false;
        } catch (\Exception $e) {
            error_log("Error marking article helpful: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all categories
     */
    public static function getCategories(): array
    {
        try {
            return self::where('is_published', true)
                ->distinct()
                ->pluck('category')
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting categories: " . $e->getMessage());
            return [];
        }
    }
}

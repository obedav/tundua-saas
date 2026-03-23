<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\KnowledgeBaseArticle;

class KnowledgeBaseController
{
    /**
     * Get all published articles
     * GET /api/knowledge-base
     */
    public function getArticles(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $category = $queryParams['category'] ?? null;
            $search = $queryParams['search'] ?? null;
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 50;

            $articles = KnowledgeBaseArticle::getPublishedArticles($category, $search, $limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'articles' => $articles,
                'count' => count($articles)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting articles: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get article by ID or slug
     * GET /api/knowledge-base/{id}
     */
    public function getArticle(Request $request, Response $response, array $args): Response
    {
        try {
            $identifier = $args['id'];

            $article = KnowledgeBaseArticle::getByIdOrSlug($identifier);

            if (!$article) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Article not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Increment view count
            KnowledgeBaseArticle::incrementViews($article->id);

            $response->getBody()->write(json_encode([
                'success' => true,
                'article' => $article
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting article: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get popular articles
     * GET /api/knowledge-base/popular
     */
    public function getPopular(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 5;

            $articles = KnowledgeBaseArticle::getPopularArticles($limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'articles' => $articles,
                'count' => count($articles)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting popular articles: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get featured articles
     * GET /api/knowledge-base/featured
     */
    public function getFeatured(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 3;

            $articles = KnowledgeBaseArticle::getFeaturedArticles($limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'articles' => $articles,
                'count' => count($articles)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting featured articles: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get categories
     * GET /api/knowledge-base/categories
     */
    public function getCategories(Request $request, Response $response): Response
    {
        try {
            $categories = KnowledgeBaseArticle::getCategories();

            $response->getBody()->write(json_encode([
                'success' => true,
                'categories' => $categories,
                'count' => count($categories)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting categories: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get published slugs (for sitemap)
     * GET /api/knowledge-base/slugs
     */
    public function getPublishedSlugs(Request $request, Response $response): Response
    {
        try {
            $slugs = KnowledgeBaseArticle::getPublishedSlugs();

            $response->getBody()->write(json_encode([
                'success' => true,
                'slugs' => $slugs,
                'count' => count($slugs)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting published slugs: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all articles for admin (includes unpublished)
     * GET /api/admin/knowledge-base
     */
    public function getAllArticles(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $category = $queryParams['category'] ?? null;
            $search = $queryParams['search'] ?? null;
            $status = $queryParams['status'] ?? null;
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 50;

            $articles = KnowledgeBaseArticle::getAllArticlesAdmin($category, $search, $status, $limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'articles' => $articles,
                'count' => count($articles)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting admin articles: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create a new article
     * POST /api/admin/knowledge-base
     */
    public function createArticle(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            if (empty($data['title'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Title is required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Auto-generate slug from title if not provided
            $slug = !empty($data['slug'])
                ? $this->generateSlug($data['slug'])
                : $this->generateSlug($data['title']);

            // Ensure slug is unique
            $slug = $this->ensureUniqueSlug($slug);

            $isPublished = isset($data['is_published']) && $data['is_published'];

            $article = new KnowledgeBaseArticle();
            $article->title = $data['title'];
            $article->slug = $slug;
            $article->content = $data['content'] ?? '';
            $article->excerpt = $data['excerpt'] ?? '';
            $article->category = $data['category'] ?? 'General';
            $article->tags = isset($data['tags']) ? (is_array($data['tags']) ? $data['tags'] : json_decode($data['tags'], true)) : [];
            $article->is_published = $isPublished;
            $article->is_featured = isset($data['is_featured']) && $data['is_featured'];
            $article->author_id = $request->getAttribute('user_id');
            $article->view_count = 0;
            $article->helpful_count = 0;
            $article->not_helpful_count = 0;

            if ($isPublished) {
                $article->published_at = now();
            }

            $article->save();

            $response->getBody()->write(json_encode([
                'success' => true,
                'article' => $article->toArray(),
                'message' => 'Article created successfully'
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error creating article: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update an article
     * PUT /api/admin/knowledge-base/{id}
     */
    public function updateArticle(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];
            $data = $request->getParsedBody();

            $article = KnowledgeBaseArticle::find($id);
            if (!$article) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Article not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            if (isset($data['title'])) {
                $article->title = $data['title'];
            }
            if (isset($data['slug'])) {
                $newSlug = $this->generateSlug($data['slug']);
                if ($newSlug !== $article->slug) {
                    $newSlug = $this->ensureUniqueSlug($newSlug, $id);
                }
                $article->slug = $newSlug;
            }
            if (isset($data['content'])) {
                $article->content = $data['content'];
            }
            if (isset($data['excerpt'])) {
                $article->excerpt = $data['excerpt'];
            }
            if (isset($data['category'])) {
                $article->category = $data['category'];
            }
            if (isset($data['tags'])) {
                $article->tags = is_array($data['tags']) ? $data['tags'] : json_decode($data['tags'], true);
            }
            if (isset($data['is_featured'])) {
                $article->is_featured = (bool)$data['is_featured'];
            }
            if (isset($data['is_published'])) {
                $wasPublished = $article->is_published;
                $article->is_published = (bool)$data['is_published'];

                // Set published_at on first publish
                if (!$wasPublished && $article->is_published && !$article->published_at) {
                    $article->published_at = now();
                }
            }

            $article->save();

            $response->getBody()->write(json_encode([
                'success' => true,
                'article' => $article->toArray(),
                'message' => 'Article updated successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error updating article: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete an article
     * DELETE /api/admin/knowledge-base/{id}
     */
    public function deleteArticle(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];

            $article = KnowledgeBaseArticle::find($id);
            if (!$article) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Article not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $article->delete();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Article deleted successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error deleting article: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Generate URL-safe slug from string
     */
    private function generateSlug(string $text): string
    {
        $slug = strtolower(trim($text));
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        return trim($slug, '-');
    }

    /**
     * Ensure slug is unique
     */
    private function ensureUniqueSlug(string $slug, ?int $excludeId = null): string
    {
        $original = $slug;
        $counter = 1;

        while (true) {
            $query = KnowledgeBaseArticle::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            if (!$query->exists()) {
                break;
            }
            $slug = $original . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Mark article as helpful/not helpful
     * POST /api/knowledge-base/{id}/feedback
     */
    public function markHelpful(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];
            $data = $request->getParsedBody();
            $isHelpful = isset($data['helpful']) && $data['helpful'] === true;

            $success = KnowledgeBaseArticle::markHelpful($id, $isHelpful);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Article not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Thank you for your feedback'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error marking article helpful: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\KnowledgeBaseArticle;
use Tundua\Services\InternalLinkService;

class KnowledgeBaseController
{
    public function __construct(
        private readonly InternalLinkService $internalLinkService,
    ) {}

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
            $country = $queryParams['country'] ?? null;
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 50;

            $articles = KnowledgeBaseArticle::getPublishedArticles($category, $search, $limit, $country);

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

            // Build the serialisable array first so we can overwrite content
            // without touching the model (no risk of accidental persistence).
            $articleData = $article->toArray();

            // One DB query fetches all published candidates; inject() skips the
            // current slug automatically so we never self-link.
            $candidates = KnowledgeBaseArticle::getLinkCandidates();
            $articleData['content'] = $this->internalLinkService->inject(
                (string)($articleData['content'] ?? ''),
                $candidates,
                (string)$article->slug,
            );

            $response->getBody()->write(json_encode([
                'success' => true,
                'article' => $articleData,
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
     * Track a real user page view — called client-side only so bots and ISR
     * revalidations never inflate the count.
     * POST /api/knowledge-base/{id}/view
     */
    public function trackView(Request $request, Response $response, array $args): Response
    {
        try {
            $article = KnowledgeBaseArticle::getByIdOrSlug($args['id']);

            if (!$article) {
                $response->getBody()->write(json_encode(['success' => false]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $article->increment('view_count');

            $response->getBody()->write(json_encode(['success' => true]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error tracking view: " . $e->getMessage());
            $response->getBody()->write(json_encode(['success' => false]));
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
            $article->featured_image = $data['featured_image'] ?? null;
            $article->category = $data['category'] ?? 'General';
            $article->tags = isset($data['tags']) ? (is_array($data['tags']) ? $data['tags'] : json_decode($data['tags'], true)) : [];
            $article->is_published = $isPublished;
            $article->is_featured = isset($data['is_featured']) && $data['is_featured'];
            $article->country_target = isset($data['country_target']) && $data['country_target'] !== ''
                ? strtolower(trim((string)$data['country_target']))
                : null;
            $article->author_id = $request->getAttribute('user_id');
            $article->view_count = 0;
            $article->helpful_count = 0;
            $article->not_helpful_count = 0;

            if ($isPublished) {
                $article->published_at = date('Y-m-d H:i:s');
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
                'error' => 'Create error: ' . $e->getMessage()
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
            if (isset($data['featured_image'])) {
                $article->featured_image = $data['featured_image'];
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
                    $article->published_at = date('Y-m-d H:i:s');
                }
            }
            if (array_key_exists('country_target', $data)) {
                $article->country_target = $data['country_target'] !== '' && $data['country_target'] !== null
                    ? strtolower(trim((string)$data['country_target']))
                    : null;
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
                'error' => 'Update error: ' . $e->getMessage()
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
     * Validate a remote URL for safe outbound fetch (SSRF prevention).
     * Returns ['valid' => true, 'ip' => ..., 'host' => ..., 'port' => ...]
     * or      ['valid' => false, 'error' => '...']
     */
    private function validateRemoteUrl(string $url): array
    {
        $parsed = parse_url($url);
        $scheme = strtolower($parsed['scheme'] ?? '');
        $host   = $parsed['host'] ?? '';

        if (!in_array($scheme, ['http', 'https'], true) || $host === '') {
            return ['valid' => false, 'error' => 'Invalid URL: only http and https are allowed'];
        }

        $port = $parsed['port'] ?? ($scheme === 'https' ? 443 : 80);

        // Resolve to IPv4 — gethostbyname returns the input unchanged on failure
        $ip = gethostbyname($host);
        if ($ip === $host && !filter_var($host, FILTER_VALIDATE_IP)) {
            return ['valid' => false, 'error' => 'Could not resolve host'];
        }

        // Block loopback and private/reserved ranges
        $isPublicIp = filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        );

        if ($isPublicIp === false) {
            return ['valid' => false, 'error' => 'Requests to private or reserved IP addresses are not allowed'];
        }

        // Explicit localhost guard (covers hostnames that resolve to loopback)
        if (in_array($ip, ['127.0.0.1', '0.0.0.0'], true) || strtolower($host) === 'localhost') {
            return ['valid' => false, 'error' => 'Requests to localhost are not allowed'];
        }

        return ['valid' => true, 'ip' => $ip, 'host' => $host, 'port' => $port];
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
     * Download an image from URL and store locally
     * POST /api/admin/knowledge-base/upload-image
     */
    public function downloadImage(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            if (empty($data['image_url'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'image_url is required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $imageUrl = $data['image_url'];

            // Download image using cURL
            if (!function_exists('curl_init')) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'cURL is not available on this server'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            // Validate URL and resolve hostname before making the request (SSRF prevention)
            $urlValidation = $this->validateRemoteUrl($imageUrl);
            if (!$urlValidation['valid']) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => $urlValidation['error']
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $ch = curl_init($imageUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); // No redirects — prevents redirect-based SSRF
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP | CURLPROTO_HTTPS);
            // Pin the pre-resolved IP to prevent DNS rebinding between our check and curl's request
            curl_setopt($ch, CURLOPT_RESOLVE, [
                "{$urlValidation['host']}:{$urlValidation['port']}:{$urlValidation['ip']}"
            ]);
            $imageContent = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($imageContent === false || $httpCode !== 200) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to download image. HTTP ' . $httpCode . ($curlError ? ': ' . $curlError : '')
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Validate size (<= 5MB)
            if (strlen($imageContent) > 5 * 1024 * 1024) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Image exceeds maximum size of 5MB'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Validate content type using finfo
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($imageContent);

            $allowedTypes = [
                'image/jpeg' => 'jpg',
                'image/png'  => 'png',
                'image/webp' => 'webp',
                'image/gif'  => 'gif',
            ];

            if (!isset($allowedTypes[$mimeType])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid image type. Allowed: jpg, png, webp, gif'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $extension = $allowedTypes[$mimeType];

            // Blog images are public content — save under public/uploads so Apache
            // serves them directly. The private storage/ dir is outside the web root.
            $storageDir = dirname(__DIR__, 2) . '/public/uploads/blog-images';
            if (!is_dir($storageDir)) {
                mkdir($storageDir, 0755, true);
            }

            $filename = uniqid('blog_') . '_' . time() . '.' . $extension;
            $filePath = $storageDir . '/' . $filename;

            file_put_contents($filePath, $imageContent);
            chmod($filePath, 0644);

            $response->getBody()->write(json_encode([
                'success' => true,
                'image_url' => '/uploads/blog-images/' . $filename
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error downloading image: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Upload image file directly
     * POST /api/admin/knowledge-base/upload-image-file
     */
    public function uploadImageFile(Request $request, Response $response): Response
    {
        try {
            $uploadedFiles = $request->getUploadedFiles();

            if (empty($uploadedFiles['file'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'No file uploaded'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $uploadedFile = $uploadedFiles['file'];

            if ($uploadedFile->getError() !== UPLOAD_ERR_OK) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'File upload failed'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            if ($uploadedFile->getSize() > 5 * 1024 * 1024) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Image exceeds maximum size of 5MB'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $imageContent = (string) $uploadedFile->getStream();

            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($imageContent);

            $allowedTypes = [
                'image/jpeg' => 'jpg',
                'image/png'  => 'png',
                'image/webp' => 'webp',
                'image/gif'  => 'gif',
            ];

            if (!isset($allowedTypes[$mimeType])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid image type. Allowed: jpg, png, webp, gif'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $extension = $allowedTypes[$mimeType];

            $storageDir = dirname(__DIR__, 2) . '/public/uploads/blog-images';
            if (!is_dir($storageDir)) {
                mkdir($storageDir, 0755, true);
            }

            $filename = uniqid('blog_') . '_' . time() . '.' . $extension;
            $filePath = $storageDir . '/' . $filename;

            file_put_contents($filePath, $imageContent);
            chmod($filePath, 0644);

            $response->getBody()->write(json_encode([
                'success' => true,
                'image_url' => '/uploads/blog-images/' . $filename
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error uploading image file: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
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

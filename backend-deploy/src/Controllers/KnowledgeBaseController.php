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

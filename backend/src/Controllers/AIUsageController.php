<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\AIUsageLog;

/**
 * AI Usage Controller
 *
 * Handles AI usage tracking and analytics endpoints
 */
class AIUsageController
{
    /**
     * Track AI usage
     * POST /api/ai/usage
     */
    public function trackUsage(Request $request, Response $response): Response
    {
        try {
            $body = $request->getParsedBody();

            // Validate required fields
            $requiredFields = ['user_id', 'action_type', 'tokens_input', 'tokens_output', 'cost_usd', 'duration_ms'];
            foreach ($requiredFields as $field) {
                if (!isset($body[$field])) {
                    $response->getBody()->write(json_encode([
                        'success' => false,
                        'error' => "Missing required field: {$field}"
                    ]));
                    return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
                }
            }

            // Create usage log
            $usageId = AIUsageLog::create([
                'user_id' => (int) $body['user_id'],
                'action_type' => $body['action_type'],
                'tokens_input' => (int) $body['tokens_input'],
                'tokens_output' => (int) $body['tokens_output'],
                'cost_usd' => (float) $body['cost_usd'],
                'duration_ms' => (int) $body['duration_ms'],
                'success' => isset($body['success']) ? (bool) $body['success'] : true,
                'error_message' => $body['error_message'] ?? null,
                'metadata' => isset($body['metadata']) ? json_encode($body['metadata']) : null,
            ]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'usage_id' => $usageId,
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error tracking AI usage: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to track usage'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's AI usage statistics
     * GET /api/ai/usage/stats?period=day|week|month
     */
    public function getStats(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();
            $period = $queryParams['period'] ?? 'month';

            $stats = AIUsageLog::getUserStats($userId, $period);

            $response->getBody()->write(json_encode([
                'success' => true,
                'stats' => $stats,
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting AI stats: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to get statistics'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's AI quota status
     * GET /api/ai/usage/quota
     */
    public function getQuota(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            // Get usage in the last hour (matching rate limit window)
            $usageLastHour = AIUsageLog::getUserUsageCount($userId, '1 hour');

            // Default quota: 10 requests per hour (can be upgraded based on user tier)
            $limit = 10;
            $remaining = max(0, $limit - $usageLastHour);
            $resetAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            $response->getBody()->write(json_encode([
                'success' => true,
                'quota' => [
                    'used' => $usageLastHour,
                    'limit' => $limit,
                    'remaining' => $remaining,
                    'resetAt' => $resetAt,
                ],
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting AI quota: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to get quota'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get recent AI usage logs (admin only)
     * GET /api/admin/ai/usage
     */
    public function getRecentUsage(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 100;
            $offset = isset($queryParams['offset']) ? (int)$queryParams['offset'] : 0;

            $logs = AIUsageLog::getRecent($limit, $offset);
            $totalCost = AIUsageLog::getTotalCost();

            $response->getBody()->write(json_encode([
                'success' => true,
                'logs' => $logs,
                'count' => count($logs),
                'totalCost' => $totalCost,
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting recent usage: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to get usage logs'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get AI usage analytics (admin only)
     * GET /api/admin/ai/analytics
     */
    public function getAnalytics(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $period = $queryParams['period'] ?? '30 days';

            $analytics = AIUsageLog::getAnalytics($period);

            $response->getBody()->write(json_encode([
                'success' => true,
                'analytics' => $analytics,
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting AI analytics: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to get analytics'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

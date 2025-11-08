<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\Activity;

class ActivityController
{
    /**
     * Get user's activity
     * GET /api/activity
     */
    public function getUserActivity(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 50;

            $activities = Activity::getUserActivity($userId, $limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'activities' => $activities,
                'count' => count($activities)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting activity: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get activity for specific entity
     * GET /api/activity/{entity_type}/{entity_id}
     */
    public function getEntityActivity(Request $request, Response $response, array $args): Response
    {
        try {
            $entityType = $args['entity_type'];
            $entityId = (int) $args['entity_id'];
            $queryParams = $request->getQueryParams();
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 50;

            $activities = Activity::getByEntity($entityType, $entityId, $limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'activities' => $activities,
                'count' => count($activities)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting entity activity: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get recent activity (admin only)
     * GET /api/admin/activity
     */
    public function getRecentActivity(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 100;

            $activities = Activity::getRecentActivity($limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'activities' => $activities,
                'count' => count($activities)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting recent activity: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

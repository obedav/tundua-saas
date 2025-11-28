<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\Notification;

class NotificationController
{
    /**
     * Get user's notifications
     * GET /api/notifications
     */
    public function getUserNotifications(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();
            $unreadOnly = isset($queryParams['unread']) && $queryParams['unread'] === 'true';
            $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 50;

            $notifications = Notification::getUserNotifications($userId, $unreadOnly, $limit);
            $unreadCount = Notification::getUnreadCount($userId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
                'count' => count($notifications)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting notifications: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/{id}/read
     */
    public function markAsRead(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');

            $success = Notification::markAsRead($id, $userId);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Notification not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Notification marked as read'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error marking notification as read: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/read-all
     */
    public function markAllAsRead(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            Notification::markAllAsRead($userId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error marking all notifications as read: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete notification
     * DELETE /api/notifications/{id}
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');

            $success = Notification::deleteNotification($id, $userId);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Notification not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Notification deleted'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error deleting notification: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get unread count
     * GET /api/notifications/unread-count
     */
    public function getUnreadCount(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $count = Notification::getUnreadCount($userId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'count' => $count
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting unread count: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

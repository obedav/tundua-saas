<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\Application;
use Tundua\Models\Notification;
use Illuminate\Database\Capsule\Manager as DB;

class DashboardController
{
    /**
     * Get dashboard stats with trends
     * GET /api/dashboard/stats
     */
    public function getStats(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            // Get current stats
            $stats = Application::getStatistics($userId);

            // Get stats from last month for trend calculation
            $lastMonthStart = date('Y-m-d', strtotime('-1 month'));
            $lastMonthEnd = date('Y-m-d', strtotime('-1 day'));

            $lastMonthTotal = Application::where('user_id', $userId)
                ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
                ->count();

            $lastMonthPending = Application::where('user_id', $userId)
                ->whereIn('status', ['submitted', 'under_review', 'in_progress'])
                ->whereBetween('updated_at', [$lastMonthStart, $lastMonthEnd])
                ->count();

            $lastMonthApproved = Application::where('user_id', $userId)
                ->where('status', 'approved')
                ->whereBetween('approved_at', [$lastMonthStart, $lastMonthEnd])
                ->count();

            $lastMonthSpent = Application::where('user_id', $userId)
                ->where('payment_status', 'paid')
                ->whereBetween('paid_at', [$lastMonthStart, $lastMonthEnd])
                ->sum('total_amount');

            // Calculate trends (percentage change)
            $trends = [
                'applications' => $lastMonthTotal > 0
                    ? round((($stats['total'] - $lastMonthTotal) / $lastMonthTotal) * 100, 1)
                    : 0,
                'pending' => $lastMonthPending > 0
                    ? round((($stats['submitted'] - $lastMonthPending) / $lastMonthPending) * 100, 1)
                    : 0,
                'approved' => $lastMonthApproved > 0
                    ? round((($stats['completed'] - $lastMonthApproved) / $lastMonthApproved) * 100, 1)
                    : 0,
                'spending' => $lastMonthSpent > 0
                    ? round((($stats['total_revenue'] - $lastMonthSpent) / $lastMonthSpent) * 100, 1)
                    : 0
            ];

            $response->getBody()->write(json_encode([
                'success' => true,
                'stats' => [
                    'total_applications' => $stats['total'],
                    'pending_applications' => $stats['submitted'],
                    'approved_applications' => $stats['completed'],
                    'rejected_applications' => $stats['cancelled'],
                    'total_spent' => $stats['total_revenue']
                ],
                'trends' => $trends
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting dashboard stats: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get dashboard overview (stats + recent activity + notifications)
     * GET /api/dashboard/overview
     */
    public function getOverview(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            // Get stats
            $stats = Application::getStatistics($userId);

            // Get recent applications
            $recentApplications = Application::getByUserId($userId);
            $recentApplications = array_slice($recentApplications, 0, 5);

            // Get unread notifications count
            $unreadNotifications = Notification::getUnreadCount($userId);

            // Get quick summary
            $hasActiveApplications = Application::where('user_id', $userId)
                ->whereIn('status', ['submitted', 'under_review', 'in_progress'])
                ->exists();

            $hasPendingPayments = Application::where('user_id', $userId)
                ->where('payment_status', 'pending')
                ->where('status', 'payment_pending')
                ->exists();

            $response->getBody()->write(json_encode([
                'success' => true,
                'overview' => [
                    'stats' => [
                        'total_applications' => $stats['total'],
                        'pending_applications' => $stats['submitted'],
                        'approved_applications' => $stats['completed'],
                        'total_spent' => $stats['total_revenue']
                    ],
                    'recent_applications' => $recentApplications,
                    'unread_notifications' => $unreadNotifications,
                    'alerts' => [
                        'has_active_applications' => $hasActiveApplications,
                        'has_pending_payments' => $hasPendingPayments
                    ]
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting dashboard overview: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

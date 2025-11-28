<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Database\Database;

class AnalyticsController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Get comprehensive analytics
     * GET /api/admin/analytics
     */
    public function getAnalytics(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $period = $queryParams['period'] ?? '30'; // days

            $analytics = [
                'overview' => $this->getOverviewStats(),
                'revenue' => $this->getRevenueStats($period),
                'conversion' => $this->getConversionStats(),
                'service_tiers' => $this->getServiceTierDistribution(),
                'top_destinations' => $this->getTopDestinations(10),
                'top_universities' => $this->getTopUniversities(10),
                'refunds' => $this->getRefundStats(),
                'payment_methods' => $this->getPaymentMethodStats(),
                'recent_activity' => $this->getRecentActivity(20),
            ];

            $response->getBody()->write(json_encode([
                'success' => true,
                'analytics' => $analytics
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get overview statistics
     */
    private function getOverviewStats(): array
    {
        $stats = [];

        // Total applications
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM applications");
        $stats['total_applications'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

        // Applications by status
        $stmt = $this->db->query("
            SELECT status, COUNT(*) as count
            FROM applications
            GROUP BY status
        ");
        $statusCounts = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $stats['by_status'] = array_column($statusCounts, 'count', 'status');

        // Total users
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM users");
        $stats['total_users'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

        // Total revenue
        $stmt = $this->db->query("
            SELECT SUM(amount) as total
            FROM payments
            WHERE status = 'completed'
        ");
        $stats['total_revenue'] = (float)($stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0);

        // This month applications
        $stmt = $this->db->query("
            SELECT COUNT(*) as count
            FROM applications
            WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
        ");
        $stats['applications_this_month'] = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

        // This month revenue
        $stmt = $this->db->query("
            SELECT SUM(amount) as total
            FROM payments
            WHERE status = 'completed'
            AND MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
        ");
        $stats['revenue_this_month'] = (float)($stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0);

        // Pending documents
        $stmt = $this->db->query("
            SELECT COUNT(*) as count
            FROM documents
            WHERE status = 'pending' OR status = 'under_review'
        ");
        $stats['pending_documents'] = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

        return $stats;
    }

    /**
     * Get revenue statistics with time series
     */
    private function getRevenueStats(int $days = 30): array
    {
        // Daily revenue for the period
        $stmt = $this->db->prepare("
            SELECT
                DATE(created_at) as date,
                SUM(amount) as revenue,
                COUNT(*) as transactions
            FROM payments
            WHERE status = 'completed'
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ");
        $stmt->execute([$days]);
        $dailyRevenue = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // Calculate growth
        $currentPeriod = array_sum(array_column($dailyRevenue, 'revenue'));

        $stmt = $this->db->prepare("
            SELECT SUM(amount) as revenue
            FROM payments
            WHERE status = 'completed'
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            AND created_at < DATE_SUB(CURDATE(), INTERVAL ? DAY)
        ");
        $stmt->execute([$days * 2, $days]);
        $previousPeriod = (float)($stmt->fetch(\PDO::FETCH_ASSOC)['revenue'] ?? 1);

        $growth = $previousPeriod > 0
            ? (($currentPeriod - $previousPeriod) / $previousPeriod) * 100
            : 0;

        return [
            'daily' => $dailyRevenue,
            'total' => $currentPeriod,
            'average_per_day' => $currentPeriod / $days,
            'growth_percentage' => round($growth, 2),
        ];
    }

    /**
     * Get conversion funnel statistics
     */
    private function getConversionStats(): array
    {
        // Total visitors (you'd track this separately)
        // For now, use registered users
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM users");
        $totalUsers = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

        // Started applications
        $stmt = $this->db->query("
            SELECT COUNT(DISTINCT user_id) as count FROM applications
        ");
        $startedApps = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

        // Completed applications (paid)
        $stmt = $this->db->query("
            SELECT COUNT(DISTINCT a.user_id) as count
            FROM applications a
            JOIN payments p ON a.id = p.application_id
            WHERE p.status = 'completed'
        ");
        $completedApps = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

        // Approved applications
        $stmt = $this->db->query("
            SELECT COUNT(DISTINCT user_id) as count
            FROM applications
            WHERE status = 'approved' OR status = 'completed'
        ");
        $approvedApps = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

        return [
            'registered_users' => $totalUsers,
            'started_applications' => $startedApps,
            'completed_payments' => $completedApps,
            'approved_applications' => $approvedApps,
            'conversion_rate' => $totalUsers > 0 ? round(($completedApps / $totalUsers) * 100, 2) : 0,
            'approval_rate' => $completedApps > 0 ? round(($approvedApps / $completedApps) * 100, 2) : 0,
        ];
    }

    /**
     * Get service tier distribution
     */
    private function getServiceTierDistribution(): array
    {
        $stmt = $this->db->query("
            SELECT
                service_tier_name as name,
                COUNT(*) as count,
                SUM(total_amount) as revenue
            FROM applications
            WHERE payment_status = 'completed'
            GROUP BY service_tier_name
            ORDER BY count DESC
        ");

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Get top destinations
     */
    private function getTopDestinations(int $limit = 10): array
    {
        $stmt = $this->db->prepare("
            SELECT
                destination_country as country,
                COUNT(*) as count,
                SUM(total_amount) as revenue
            FROM applications
            WHERE destination_country IS NOT NULL
            GROUP BY destination_country
            ORDER BY count DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Get top universities
     */
    private function getTopUniversities(int $limit = 10): array
    {
        // Assuming universities are stored as JSON array
        // This is a simplified version
        $stmt = $this->db->prepare("
            SELECT
                universities,
                destination_country,
                COUNT(*) as count
            FROM applications
            WHERE universities IS NOT NULL
            GROUP BY universities
            ORDER BY count DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Get refund statistics
     */
    private function getRefundStats(): array
    {
        $stmt = $this->db->query("
            SELECT
                status,
                COUNT(*) as count,
                SUM(refund_amount) as total_amount
            FROM refunds
            GROUP BY status
        ");
        $byStatus = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $stmt = $this->db->query("
            SELECT
                COUNT(*) as total,
                SUM(refund_amount) as total_amount,
                AVG(business_days_remaining) as avg_days_remaining
            FROM refunds
            WHERE status = 'approved'
        ");
        $approved = $stmt->fetch(\PDO::FETCH_ASSOC);

        return [
            'by_status' => $byStatus,
            'approved_count' => (int)($approved['total'] ?? 0),
            'total_refund_amount' => (float)($approved['total_amount'] ?? 0),
            'avg_days_remaining' => round((float)($approved['avg_days_remaining'] ?? 0), 1),
        ];
    }

    /**
     * Get payment method distribution
     */
    private function getPaymentMethodStats(): array
    {
        $stmt = $this->db->query("
            SELECT
                payment_method,
                COUNT(*) as count,
                SUM(amount) as revenue
            FROM payments
            WHERE status = 'completed'
            GROUP BY payment_method
            ORDER BY count DESC
        ");

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Get recent activity
     */
    private function getRecentActivity(int $limit = 20): array
    {
        $stmt = $this->db->prepare("
            SELECT
                action,
                description,
                created_at,
                entity_type,
                entity_id
            FROM activity_log
            ORDER BY created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Get revenue chart data
     * GET /api/admin/analytics/revenue-chart
     */
    public function getRevenueChart(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $period = $queryParams['period'] ?? 'daily'; // daily, weekly, monthly
            $days = (int)($queryParams['days'] ?? 30);

            $data = [];

            if ($period === 'daily') {
                $stmt = $this->db->prepare("
                    SELECT
                        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                        SUM(amount) as revenue,
                        COUNT(*) as count
                    FROM payments
                    WHERE status = 'completed'
                    AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                    GROUP BY DATE(created_at)
                    ORDER BY date ASC
                ");
                $stmt->execute([$days]);
                $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $data
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

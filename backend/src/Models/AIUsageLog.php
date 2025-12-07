<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * AI Usage Log Model
 *
 * Tracks AI API usage for cost monitoring, analytics, and billing
 */
class AIUsageLog extends Model
{
    protected $table = 'ai_usage_logs';

    protected $fillable = [
        'user_id',
        'action_type',
        'tokens_input',
        'tokens_output',
        'cost_usd',
        'duration_ms',
        'success',
        'error_message',
        'metadata'
    ];

    protected $casts = [
        'tokens_input' => 'integer',
        'tokens_output' => 'integer',
        'cost_usd' => 'float',
        'duration_ms' => 'integer',
        'success' => 'boolean',
        'metadata' => 'array',
        'created_at' => 'datetime'
    ];

    // Disable updated_at since schema doesn't have it
    const UPDATED_AT = null;

    /**
     * Get user's usage statistics for a period
     */
    public static function getUserStats(int $userId, string $period = 'month'): array
    {
        try {
            $interval = match($period) {
                'day' => '1 DAY',
                'week' => '7 DAY',
                'month' => '30 DAY',
                default => '30 DAY'
            };

            $stats = self::where('user_id', $userId)
                ->where('created_at', '>=', DB::raw("NOW() - INTERVAL {$interval}"))
                ->selectRaw('
                    COUNT(*) as total_requests,
                    SUM(tokens_input + tokens_output) as total_tokens,
                    SUM(cost_usd) as total_cost_usd,
                    AVG(duration_ms) as average_duration,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_requests
                ')
                ->first();

            if (!$stats) {
                return [
                    'totalRequests' => 0,
                    'totalTokens' => 0,
                    'totalCostUSD' => 0,
                    'averageDuration' => 0,
                    'successRate' => 100,
                ];
            }

            return [
                'totalRequests' => (int) $stats->total_requests,
                'totalTokens' => (int) $stats->total_tokens,
                'totalCostUSD' => round((float) $stats->total_cost_usd, 4),
                'averageDuration' => round((float) $stats->average_duration, 0),
                'successRate' => $stats->total_requests > 0
                    ? round((($stats->successful_requests / $stats->total_requests) * 100), 2)
                    : 100,
            ];
        } catch (\Exception $e) {
            error_log("Error getting user AI stats: " . $e->getMessage());
            return [
                'totalRequests' => 0,
                'totalTokens' => 0,
                'totalCostUSD' => 0,
                'averageDuration' => 0,
                'successRate' => 100,
            ];
        }
    }

    /**
     * Get user's usage count in a time period (for rate limiting)
     */
    public static function getUserUsageCount(int $userId, string $period = '1 hour'): int
    {
        try {
            $interval = match($period) {
                '1 hour' => '1 HOUR',
                '1 day' => '1 DAY',
                '1 week' => '7 DAY',
                default => '1 HOUR'
            };

            return self::where('user_id', $userId)
                ->where('created_at', '>=', DB::raw("NOW() - INTERVAL {$interval}"))
                ->count();
        } catch (\Exception $e) {
            error_log("Error getting user usage count: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get recent usage logs (admin)
     */
    public static function getRecent(int $limit = 100, int $offset = 0): array
    {
        try {
            return self::orderBy('created_at', 'DESC')
                ->limit($limit)
                ->offset($offset)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting recent usage: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get total AI cost (admin)
     */
    public static function getTotalCost(string $period = '30 days'): float
    {
        try {
            $interval = match($period) {
                '1 day' => '1 DAY',
                '7 days' => '7 DAY',
                '30 days' => '30 DAY',
                'all' => null,
                default => '30 DAY'
            };

            $query = self::query();

            if ($interval) {
                $query->where('created_at', '>=', DB::raw("NOW() - INTERVAL {$interval}"));
            }

            $total = $query->sum('cost_usd');

            return round((float) $total, 4);
        } catch (\Exception $e) {
            error_log("Error getting total cost: " . $e->getMessage());
            return 0.0;
        }
    }

    /**
     * Get AI analytics (admin)
     */
    public static function getAnalytics(string $period = '30 days'): array
    {
        try {
            $interval = match($period) {
                '1 day' => '1 DAY',
                '7 days' => '7 DAY',
                '30 days' => '30 DAY',
                default => '30 DAY'
            };

            // Overall stats
            $overall = self::where('created_at', '>=', DB::raw("NOW() - INTERVAL {$interval}"))
                ->selectRaw('
                    COUNT(*) as total_requests,
                    SUM(tokens_input + tokens_output) as total_tokens,
                    SUM(cost_usd) as total_cost,
                    AVG(duration_ms) as avg_duration,
                    COUNT(DISTINCT user_id) as unique_users,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful
                ')
                ->first();

            // By action type
            $byAction = self::where('created_at', '>=', DB::raw("NOW() - INTERVAL {$interval}"))
                ->select('action_type')
                ->selectRaw('
                    COUNT(*) as count,
                    SUM(tokens_input + tokens_output) as tokens,
                    SUM(cost_usd) as cost
                ')
                ->groupBy('action_type')
                ->orderBy('count', 'DESC')
                ->get()
                ->toArray();

            // Top users
            $topUsers = self::where('created_at', '>=', DB::raw("NOW() - INTERVAL {$interval}"))
                ->select('user_id')
                ->selectRaw('
                    COUNT(*) as requests,
                    SUM(tokens_input + tokens_output) as tokens,
                    SUM(cost_usd) as cost
                ')
                ->groupBy('user_id')
                ->orderBy('cost', 'DESC')
                ->limit(10)
                ->get()
                ->toArray();

            return [
                'overall' => [
                    'totalRequests' => (int) $overall->total_requests,
                    'totalTokens' => (int) $overall->total_tokens,
                    'totalCost' => round((float) $overall->total_cost, 4),
                    'averageDuration' => round((float) $overall->avg_duration, 0),
                    'uniqueUsers' => (int) $overall->unique_users,
                    'successRate' => $overall->total_requests > 0
                        ? round((($overall->successful / $overall->total_requests) * 100), 2)
                        : 100,
                ],
                'byAction' => $byAction,
                'topUsers' => $topUsers,
            ];
        } catch (\Exception $e) {
            error_log("Error getting AI analytics: " . $e->getMessage());
            return [
                'overall' => [],
                'byAction' => [],
                'topUsers' => [],
            ];
        }
    }

    /**
     * Create usage log entry
     */
    public static function logUsage(array $data): ?int
    {
        try {
            $log = self::create($data);
            return $log->id;
        } catch (\Exception $e) {
            error_log("Error logging AI usage: " . $e->getMessage());
            return null;
        }
    }
}

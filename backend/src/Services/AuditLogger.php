<?php

namespace Tundua\Services;

use Illuminate\Database\Capsule\Manager as DB;

/**
 * Audit Logger Service
 *
 * Logs sensitive operations for security, compliance, and debugging
 *
 * Features:
 * - Log user actions (login, logout, profile changes, etc.)
 * - Log admin actions (user management, status changes, etc.)
 * - Log payment operations
 * - Query audit logs
 * - Automatic cleanup of old logs
 */
class AuditLogger
{
    // Event types
    const EVENT_USER_REGISTER = 'user.register';
    const EVENT_USER_LOGIN = 'user.login';
    const EVENT_USER_LOGOUT = 'user.logout';
    const EVENT_USER_LOGIN_FAILED = 'user.login.failed';
    const EVENT_USER_EMAIL_VERIFIED = 'user.email.verified';
    const EVENT_USER_PASSWORD_RESET_REQUESTED = 'user.password.reset_requested';
    const EVENT_USER_PASSWORD_RESET = 'user.password.reset';
    const EVENT_USER_PROFILE_UPDATED = 'user.profile.updated';
    const EVENT_USER_DELETED = 'user.deleted';

    const EVENT_ADMIN_USER_UPDATED = 'admin.user.updated';
    const EVENT_ADMIN_USER_SUSPENDED = 'admin.user.suspended';
    const EVENT_ADMIN_USER_ACTIVATED = 'admin.user.activated';
    const EVENT_ADMIN_APPLICATION_STATUS_CHANGED = 'admin.application.status_changed';

    const EVENT_PAYMENT_INITIATED = 'payment.initiated';
    const EVENT_PAYMENT_COMPLETED = 'payment.completed';
    const EVENT_PAYMENT_FAILED = 'payment.failed';
    const EVENT_REFUND_REQUESTED = 'refund.requested';
    const EVENT_REFUND_PROCESSED = 'refund.processed';

    const EVENT_APPLICATION_CREATED = 'application.created';
    const EVENT_APPLICATION_SUBMITTED = 'application.submitted';
    const EVENT_APPLICATION_UPDATED = 'application.updated';
    const EVENT_APPLICATION_DELETED = 'application.deleted';

    const EVENT_DOCUMENT_UPLOADED = 'document.uploaded';
    const EVENT_DOCUMENT_VERIFIED = 'document.verified';
    const EVENT_DOCUMENT_REJECTED = 'document.rejected';

    /**
     * Log an event
     */
    public static function log(
        string $eventType,
        ?int $userId = null,
        ?array $metadata = null,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): bool {
        try {
            // Get IP and User Agent if not provided
            if (!$ipAddress) {
                $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
                if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                    $ipAddress = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
                }
            }

            if (!$userAgent) {
                $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
            }

            DB::table('audit_logs')->insert([
                'event_type' => $eventType,
                'user_id' => $userId,
                'metadata' => $metadata ? json_encode($metadata) : null,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            return true;

        } catch (\Exception $e) {
            error_log("Audit log failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Log user registration
     */
    public static function logUserRegister(int $userId, string $email): void
    {
        self::log(self::EVENT_USER_REGISTER, $userId, [
            'email' => $email
        ]);
    }

    /**
     * Log successful login
     */
    public static function logUserLogin(int $userId, string $email): void
    {
        self::log(self::EVENT_USER_LOGIN, $userId, [
            'email' => $email
        ]);
    }

    /**
     * Log failed login attempt
     */
    public static function logLoginFailed(string $email, string $reason = 'invalid_credentials'): void
    {
        self::log(self::EVENT_USER_LOGIN_FAILED, null, [
            'email' => $email,
            'reason' => $reason
        ]);
    }

    /**
     * Log logout
     */
    public static function logUserLogout(int $userId): void
    {
        self::log(self::EVENT_USER_LOGOUT, $userId);
    }

    /**
     * Log email verification
     */
    public static function logEmailVerified(int $userId, string $email): void
    {
        self::log(self::EVENT_USER_EMAIL_VERIFIED, $userId, [
            'email' => $email
        ]);
    }

    /**
     * Log password reset request
     */
    public static function logPasswordResetRequested(string $email): void
    {
        self::log(self::EVENT_USER_PASSWORD_RESET_REQUESTED, null, [
            'email' => $email
        ]);
    }

    /**
     * Log password reset
     */
    public static function logPasswordReset(int $userId, string $email): void
    {
        self::log(self::EVENT_USER_PASSWORD_RESET, $userId, [
            'email' => $email
        ]);
    }

    /**
     * Log profile update
     */
    public static function logProfileUpdated(int $userId, array $changedFields): void
    {
        self::log(self::EVENT_USER_PROFILE_UPDATED, $userId, [
            'changed_fields' => $changedFields
        ]);
    }

    /**
     * Log admin action - user updated
     */
    public static function logAdminUserUpdated(int $adminId, int $targetUserId, array $changes): void
    {
        self::log(self::EVENT_ADMIN_USER_UPDATED, $adminId, [
            'target_user_id' => $targetUserId,
            'changes' => $changes
        ]);
    }

    /**
     * Log admin action - user suspended
     */
    public static function logAdminUserSuspended(int $adminId, int $targetUserId, int $minutes): void
    {
        self::log(self::EVENT_ADMIN_USER_SUSPENDED, $adminId, [
            'target_user_id' => $targetUserId,
            'duration_minutes' => $minutes
        ]);
    }

    /**
     * Log payment initiated
     */
    public static function logPaymentInitiated(int $userId, float $amount, string $currency, int $applicationId): void
    {
        self::log(self::EVENT_PAYMENT_INITIATED, $userId, [
            'amount' => $amount,
            'currency' => $currency,
            'application_id' => $applicationId
        ]);
    }

    /**
     * Log payment completed
     */
    public static function logPaymentCompleted(int $userId, float $amount, string $currency, string $paymentReference): void
    {
        self::log(self::EVENT_PAYMENT_COMPLETED, $userId, [
            'amount' => $amount,
            'currency' => $currency,
            'payment_reference' => $paymentReference
        ]);
    }

    /**
     * Log payment failed
     */
    public static function logPaymentFailed(int $userId, float $amount, string $reason): void
    {
        self::log(self::EVENT_PAYMENT_FAILED, $userId, [
            'amount' => $amount,
            'reason' => $reason
        ]);
    }

    /**
     * Log application created
     */
    public static function logApplicationCreated(int $userId, int $applicationId, string $referenceNumber): void
    {
        self::log(self::EVENT_APPLICATION_CREATED, $userId, [
            'application_id' => $applicationId,
            'reference_number' => $referenceNumber
        ]);
    }

    /**
     * Log document uploaded
     */
    public static function logDocumentUploaded(int $userId, int $documentId, string $documentType): void
    {
        self::log(self::EVENT_DOCUMENT_UPLOADED, $userId, [
            'document_id' => $documentId,
            'document_type' => $documentType
        ]);
    }

    /**
     * Get audit logs for a user
     */
    public static function getUserLogs(int $userId, int $limit = 50): array
    {
        try {
            return DB::table('audit_logs')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Failed to get user logs: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get audit logs by event type
     */
    public static function getLogsByEventType(string $eventType, int $limit = 100): array
    {
        try {
            return DB::table('audit_logs')
                ->where('event_type', $eventType)
                ->orderBy('created_at', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Failed to get logs by event type: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get recent logs
     */
    public static function getRecentLogs(int $limit = 100): array
    {
        try {
            return DB::table('audit_logs')
                ->orderBy('created_at', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Failed to get recent logs: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get logs for specific IP address
     */
    public static function getLogsByIP(string $ipAddress, int $limit = 100): array
    {
        try {
            return DB::table('audit_logs')
                ->where('ip_address', $ipAddress)
                ->orderBy('created_at', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Failed to get logs by IP: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Search audit logs
     */
    public static function searchLogs(array $filters, int $page = 1, int $perPage = 50): array
    {
        try {
            $query = DB::table('audit_logs');

            if (isset($filters['user_id'])) {
                $query->where('user_id', $filters['user_id']);
            }

            if (isset($filters['event_type'])) {
                $query->where('event_type', $filters['event_type']);
            }

            if (isset($filters['ip_address'])) {
                $query->where('ip_address', $filters['ip_address']);
            }

            if (isset($filters['date_from'])) {
                $query->where('created_at', '>=', $filters['date_from']);
            }

            if (isset($filters['date_to'])) {
                $query->where('created_at', '<=', $filters['date_to']);
            }

            $total = $query->count();

            $logs = $query
                ->orderBy('created_at', 'DESC')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get()
                ->toArray();

            return [
                'logs' => $logs,
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'total_pages' => ceil($total / $perPage)
            ];

        } catch (\Exception $e) {
            error_log("Failed to search logs: " . $e->getMessage());
            return [
                'logs' => [],
                'total' => 0,
                'page' => 1,
                'per_page' => $perPage,
                'total_pages' => 0
            ];
        }
    }

    /**
     * Clean up old audit logs (call via cron)
     * Default: Keep logs for 90 days
     */
    public static function cleanup(int $daysToKeep = 90): int
    {
        try {
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$daysToKeep} days"));

            return DB::table('audit_logs')
                ->where('created_at', '<', $cutoffDate)
                ->delete();

        } catch (\Exception $e) {
            error_log("Failed to cleanup audit logs: " . $e->getMessage());
            return 0;
        }
    }
}

<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $table = 'activity_log';

    protected $fillable = [
        'user_id',
        'entity_type',
        'entity_id',
        'action',
        'description',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'request_method',
        'request_url'
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime'
    ];

    // Disable updated_at since schema doesn't have it
    const UPDATED_AT = null;

    /**
     * Get user's activity
     */
    public static function getUserActivity(int $userId, ?int $limit = 50): array
    {
        try {
            return self::where('user_id', $userId)
                ->orderBy('created_at', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting user activity: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Log activity
     */
    public static function logActivity(array $data): ?self
    {
        try {
            return self::create($data);
        } catch (\Exception $e) {
            error_log("Error logging activity: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Log application creation
     */
    public static function logApplicationCreated(int $userId, int $applicationId, string $referenceNumber): ?self
    {
        return self::logActivity([
            'user_id' => $userId,
            'entity_type' => 'application',
            'entity_id' => $applicationId,
            'action' => 'created',
            'description' => "Created application {$referenceNumber}"
        ]);
    }

    /**
     * Log application submission
     */
    public static function logApplicationSubmitted(int $userId, int $applicationId, string $referenceNumber): ?self
    {
        return self::logActivity([
            'user_id' => $userId,
            'entity_type' => 'application',
            'entity_id' => $applicationId,
            'action' => 'submitted',
            'description' => "Submitted application {$referenceNumber} for payment"
        ]);
    }

    /**
     * Log application status change
     */
    public static function logApplicationStatusChange(int $userId, int $applicationId, string $oldStatus, string $newStatus, string $referenceNumber): ?self
    {
        return self::logActivity([
            'user_id' => $userId,
            'entity_type' => 'application',
            'entity_id' => $applicationId,
            'action' => 'status_changed',
            'description' => "Application {$referenceNumber} status changed from {$oldStatus} to {$newStatus}",
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $newStatus]
        ]);
    }

    /**
     * Log document upload
     */
    public static function logDocumentUploaded(int $userId, int $documentId, string $documentName, int $applicationId): ?self
    {
        return self::logActivity([
            'user_id' => $userId,
            'entity_type' => 'document',
            'entity_id' => $documentId,
            'action' => 'uploaded',
            'description' => "Uploaded document: {$documentName}",
            'new_values' => ['application_id' => $applicationId, 'document_name' => $documentName]
        ]);
    }

    /**
     * Log payment completed
     */
    public static function logPaymentCompleted(int $userId, int $paymentId, float $amount, string $currency = 'USD'): ?self
    {
        return self::logActivity([
            'user_id' => $userId,
            'entity_type' => 'payment',
            'entity_id' => $paymentId,
            'action' => 'completed',
            'description' => "Payment of {$currency} {$amount} completed successfully",
            'new_values' => ['amount' => $amount, 'currency' => $currency]
        ]);
    }

    /**
     * Log add-on purchase
     */
    public static function logAddonPurchased(int $userId, int $addonOrderId, string $addonName, float $amount): ?self
    {
        return self::logActivity([
            'user_id' => $userId,
            'entity_type' => 'addon_order',
            'entity_id' => $addonOrderId,
            'action' => 'purchased',
            'description' => "Purchased add-on service: {$addonName}",
            'new_values' => ['addon_name' => $addonName, 'amount' => $amount]
        ]);
    }

    /**
     * Get activity by entity
     */
    public static function getByEntity(string $entityType, int $entityId, ?int $limit = 50): array
    {
        try {
            return self::where('entity_type', $entityType)
                ->where('entity_id', $entityId)
                ->orderBy('created_at', 'DESC')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting activity by entity: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get recent activity (admin)
     */
    public static function getRecentActivity(?int $limit = 100): array
    {
        try {
            return self::orderBy('created_at', 'DESC')
                ->limit($limit)
                ->with('user:id,first_name,last_name,email')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting recent activity: " . $e->getMessage());
            return [];
        }
    }

    /**
     * User relationship
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

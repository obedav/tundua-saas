<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'type',
        'channel',
        'template_name',
        'subject',
        'message',
        'data',
        'status',
        'sent_at',
        'delivered_at',
        'failed_at',
        'error_message',
        'opened',
        'opened_at',
        'clicked',
        'clicked_at',
        'priority',
        'related_entity_type',
        'related_entity_id'
    ];

    protected $casts = [
        'data' => 'array',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'failed_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
        'opened' => 'boolean',
        'clicked' => 'boolean',
        'created_at' => 'datetime'
    ];

    // Disable updated_at since schema doesn't have it
    const UPDATED_AT = null;

    /**
     * Get user's notifications
     */
    public static function getUserNotifications(int $userId, ?bool $unreadOnly = false, int $limit = 50): array
    {
        try {
            $query = self::where('user_id', $userId)
                ->where('channel', 'in_app')
                ->orderBy('created_at', 'DESC');

            if ($unreadOnly) {
                $query->where('opened', false);
            }

            return $query->limit($limit)->get()->toArray();
        } catch (\Exception $e) {
            error_log("Error getting notifications: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Create in-app notification
     */
    public static function createInAppNotification(array $data): ?self
    {
        try {
            $data['channel'] = 'in_app';
            $data['status'] = 'sent'; // In-app notifications are instantly "sent"
            $data['sent_at'] = now();
            $data['delivered_at'] = now();
            $data['opened'] = false;
            $data['clicked'] = false;

            return self::create($data);
        } catch (\Exception $e) {
            error_log("Error creating notification: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Mark notification as read
     */
    public static function markAsRead(int $id, int $userId): bool
    {
        try {
            $notification = self::where('id', $id)
                ->where('user_id', $userId)
                ->first();

            if (!$notification) {
                return false;
            }

            return $notification->update([
                'opened' => true,
                'opened_at' => now()
            ]);
        } catch (\Exception $e) {
            error_log("Error marking notification as read: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Mark all notifications as read
     */
    public static function markAllAsRead(int $userId): bool
    {
        try {
            return self::where('user_id', $userId)
                ->where('channel', 'in_app')
                ->where('opened', false)
                ->update([
                    'opened' => true,
                    'opened_at' => now()
                ]);
        } catch (\Exception $e) {
            error_log("Error marking all notifications as read: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete notification
     */
    public static function deleteNotification(int $id, int $userId): bool
    {
        try {
            $notification = self::where('id', $id)
                ->where('user_id', $userId)
                ->first();

            if (!$notification) {
                return false;
            }

            return $notification->delete();
        } catch (\Exception $e) {
            error_log("Error deleting notification: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get unread count
     */
    public static function getUnreadCount(int $userId): int
    {
        try {
            return self::where('user_id', $userId)
                ->where('channel', 'in_app')
                ->where('opened', false)
                ->count();
        } catch (\Exception $e) {
            error_log("Error getting unread count: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Create notification for application status change
     */
    public static function notifyApplicationStatus(int $userId, int $applicationId, string $status, string $referenceNumber): ?self
    {
        $statusMessages = [
            'submitted' => [
                'type' => 'application_submitted',
                'title' => 'Application Submitted',
                'message' => "Your application {$referenceNumber} has been submitted successfully."
            ],
            'under_review' => [
                'type' => 'application_under_review',
                'title' => 'Application Under Review',
                'message' => "Your application {$referenceNumber} is now under review by our team."
            ],
            'approved' => [
                'type' => 'application_approved',
                'title' => 'Application Approved',
                'message' => "Congratulations! Your application {$referenceNumber} has been approved."
            ],
            'rejected' => [
                'type' => 'application_rejected',
                'title' => 'Application Status Update',
                'message' => "Your application {$referenceNumber} requires attention. Please check your dashboard."
            ],
            'documents_requested' => [
                'type' => 'documents_requested',
                'title' => 'Documents Required',
                'message' => "Additional documents are required for application {$referenceNumber}."
            ]
        ];

        if (!isset($statusMessages[$status])) {
            return null;
        }

        $config = $statusMessages[$status];

        return self::createInAppNotification([
            'user_id' => $userId,
            'type' => $config['type'],
            'subject' => $config['title'],
            'message' => $config['message'],
            'priority' => ($status === 'approved' || $status === 'documents_requested') ? 'high' : 'normal',
            'related_entity_type' => 'application',
            'related_entity_id' => $applicationId,
            'data' => [
                'reference_number' => $referenceNumber,
                'action_url' => "/dashboard/applications/{$applicationId}"
            ]
        ]);
    }

    /**
     * Create notification for payment
     */
    public static function notifyPayment(int $userId, int $paymentId, string $status, float $amount): ?self
    {
        $statusMessages = [
            'completed' => [
                'type' => 'payment_completed',
                'title' => 'Payment Confirmed',
                'message' => "Your payment of \${$amount} has been processed successfully."
            ],
            'failed' => [
                'type' => 'payment_failed',
                'title' => 'Payment Failed',
                'message' => "Your payment of \${$amount} could not be processed. Please try again."
            ]
        ];

        if (!isset($statusMessages[$status])) {
            return null;
        }

        $config = $statusMessages[$status];

        return self::createInAppNotification([
            'user_id' => $userId,
            'type' => $config['type'],
            'subject' => $config['title'],
            'message' => $config['message'],
            'priority' => 'high',
            'related_entity_type' => 'payment',
            'related_entity_id' => $paymentId,
            'data' => [
                'amount' => $amount,
                'action_url' => "/dashboard/billing"
            ]
        ]);
    }
}

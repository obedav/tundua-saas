<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class AddonOrder extends Model
{
    protected $table = 'addon_orders';

    protected $fillable = [
        'application_id',
        'addon_service_id',
        'user_id',
        'quantity',
        'price_at_purchase',
        'total_amount',
        'status',
        'assigned_to',
        'started_at',
        'completed_at',
        'fulfillment_notes',
        'deliverable_url',
        'delivered_at'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price_at_purchase' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'delivered_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get user's purchased add-ons
     */
    public static function getUserAddons(int $userId, ?string $status = null): array
    {
        try {
            $query = self::where('user_id', $userId)
                ->with(['addonService', 'application:id,reference_number'])
                ->orderBy('created_at', 'DESC');

            if ($status) {
                $query->where('status', $status);
            }

            return $query->get()->toArray();
        } catch (\Exception $e) {
            error_log("Error getting user add-ons: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Purchase add-on service
     */
    public static function purchaseAddon(array $data): ?self
    {
        try {
            // Get add-on service to get current price
            $addonService = AddonService::find($data['addon_service_id']);

            if (!$addonService || !$addonService->is_active) {
                return null;
            }

            $quantity = $data['quantity'] ?? 1;
            $totalAmount = $addonService->price * $quantity;

            $orderData = [
                'application_id' => $data['application_id'],
                'addon_service_id' => $data['addon_service_id'],
                'user_id' => $data['user_id'],
                'quantity' => $quantity,
                'price_at_purchase' => $addonService->price,
                'total_amount' => $totalAmount,
                'status' => 'pending'
            ];

            $order = self::create($orderData);

            // Log activity
            Activity::logAddonPurchased(
                $data['user_id'],
                $order->id,
                $addonService->name,
                $totalAmount
            );

            // Create notification
            Notification::createInAppNotification([
                'user_id' => $data['user_id'],
                'type' => 'addon_purchased',
                'subject' => 'Add-On Service Purchased',
                'message' => "You have successfully purchased: {$addonService->name}",
                'priority' => 'normal',
                'related_entity_type' => 'addon_order',
                'related_entity_id' => $order->id,
                'data' => [
                    'addon_name' => $addonService->name,
                    'amount' => $totalAmount,
                    'action_url' => '/dashboard/addons'
                ]
            ]);

            return $order;
        } catch (\Exception $e) {
            error_log("Error purchasing add-on: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get add-on order by ID
     */
    public static function getById(int $id, ?int $userId = null): ?self
    {
        try {
            $query = self::where('id', $id)->with(['addonService', 'application']);

            if ($userId) {
                $query->where('user_id', $userId);
            }

            return $query->first();
        } catch (\Exception $e) {
            error_log("Error getting add-on order: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get add-ons for application
     */
    public static function getByApplication(int $applicationId): array
    {
        try {
            return self::where('application_id', $applicationId)
                ->with('addonService')
                ->orderBy('created_at', 'DESC')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting application add-ons: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Update order status (admin)
     */
    public static function updateOrderStatus(int $id, string $status, ?array $additionalData = []): bool
    {
        try {
            $order = self::find($id);

            if (!$order) {
                return false;
            }

            $updateData = array_merge(['status' => $status], $additionalData);

            // Set timestamps based on status
            switch ($status) {
                case 'in_progress':
                    $updateData['started_at'] = now();
                    break;
                case 'completed':
                    $updateData['completed_at'] = now();
                    if (!isset($updateData['delivered_at'])) {
                        $updateData['delivered_at'] = now();
                    }
                    break;
            }

            return $order->update($updateData);
        } catch (\Exception $e) {
            error_log("Error updating add-on order status: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all add-on orders (admin)
     */
    public static function getAllOrders(?string $status = null, int $page = 1, int $perPage = 20): array
    {
        try {
            $query = self::with(['addonService', 'application', 'user:id,first_name,last_name,email']);

            if ($status) {
                $query->where('status', $status);
            }

            $total = $query->count();
            $orders = $query
                ->orderBy('created_at', 'DESC')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get()
                ->toArray();

            return [
                'orders' => $orders,
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'total_pages' => ceil($total / $perPage)
            ];
        } catch (\Exception $e) {
            error_log("Error getting all add-on orders: " . $e->getMessage());
            return [
                'orders' => [],
                'total' => 0,
                'page' => 1,
                'per_page' => $perPage,
                'total_pages' => 0
            ];
        }
    }

    /**
     * Relationships
     */
    public function addonService()
    {
        return $this->belongsTo(AddonService::class, 'addon_service_id');
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}

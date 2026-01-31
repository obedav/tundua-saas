<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    protected $table = 'discount_codes';

    protected $fillable = [
        'code',
        'description',
        'percentage',
        'max_uses',
        'used_count',
        'min_amount',
        'max_discount',
        'starts_at',
        'expires_at',
        'is_active'
    ];

    protected $casts = [
        'percentage' => 'integer',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'min_amount' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Validate and get discount code
     */
    public static function validate(string $code, ?float $orderAmount = null): array
    {
        try {
            $code = strtoupper(trim($code));
            $discountCode = self::where('code', $code)->first();

            if (!$discountCode) {
                return [
                    'valid' => false,
                    'code' => $code,
                    'percentage' => 0,
                    'description' => 'Invalid discount code'
                ];
            }

            // Check if active
            if (!$discountCode->is_active) {
                return [
                    'valid' => false,
                    'code' => $code,
                    'percentage' => 0,
                    'description' => 'This discount code is no longer active'
                ];
            }

            // Check if started
            if ($discountCode->starts_at && $discountCode->starts_at->isFuture()) {
                return [
                    'valid' => false,
                    'code' => $code,
                    'percentage' => 0,
                    'description' => 'This discount code is not yet active'
                ];
            }

            // Check if expired
            if ($discountCode->expires_at && $discountCode->expires_at->isPast()) {
                return [
                    'valid' => false,
                    'code' => $code,
                    'percentage' => 0,
                    'description' => 'This discount code has expired'
                ];
            }

            // Check usage limit
            if ($discountCode->max_uses !== null && $discountCode->used_count >= $discountCode->max_uses) {
                return [
                    'valid' => false,
                    'code' => $code,
                    'percentage' => 0,
                    'description' => 'This discount code has reached its usage limit'
                ];
            }

            // Check minimum amount
            if ($orderAmount !== null && $discountCode->min_amount !== null && $orderAmount < $discountCode->min_amount) {
                return [
                    'valid' => false,
                    'code' => $code,
                    'percentage' => 0,
                    'description' => 'Order amount is below the minimum required for this code'
                ];
            }

            return [
                'valid' => true,
                'code' => $code,
                'percentage' => $discountCode->percentage,
                'description' => $discountCode->description,
                'max_discount' => $discountCode->max_discount
            ];
        } catch (\Exception $e) {
            error_log("Error validating discount code: " . $e->getMessage());
            return [
                'valid' => false,
                'code' => $code,
                'percentage' => 0,
                'description' => 'Error validating discount code'
            ];
        }
    }

    /**
     * Increment usage count
     */
    public static function incrementUsage(string $code): bool
    {
        try {
            $discountCode = self::where('code', strtoupper(trim($code)))->first();
            if ($discountCode) {
                $discountCode->increment('used_count');
                return true;
            }
            return false;
        } catch (\Exception $e) {
            error_log("Error incrementing discount code usage: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all active discount codes (admin)
     */
    public static function getActiveCodes(): array
    {
        try {
            return self::where('is_active', true)
                ->where(function ($query) {
                    $query->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                })
                ->orderBy('code', 'ASC')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting discount codes: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Create discount code (admin)
     */
    public static function createCode(array $data): ?self
    {
        try {
            $data['code'] = strtoupper(trim($data['code']));
            return self::create($data);
        } catch (\Exception $e) {
            error_log("Error creating discount code: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Seed default discount codes
     */
    public static function seedDefaultCodes(): void
    {
        $codes = [
            [
                'code' => 'WELCOME10',
                'description' => '10% off first application',
                'percentage' => 10,
                'max_uses' => null,
                'is_active' => true
            ],
            [
                'code' => 'EARLY20',
                'description' => 'Early bird 20% discount',
                'percentage' => 20,
                'max_uses' => 100,
                'is_active' => true
            ],
            [
                'code' => 'STUDENT15',
                'description' => '15% student discount',
                'percentage' => 15,
                'max_uses' => null,
                'is_active' => true
            ]
        ];

        foreach ($codes as $code) {
            $existing = self::where('code', $code['code'])->first();
            if (!$existing) {
                self::create($code);
            }
        }
    }
}

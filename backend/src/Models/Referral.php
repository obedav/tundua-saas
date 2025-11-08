<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    protected $table = 'referrals';

    protected $fillable = [
        'referrer_user_id',
        'referred_email',
        'referred_user_id',
        'referral_code',
        'status',
        'reward_type',
        'reward_amount',
        'reward_currency',
        'reward_claimed',
        'reward_claimed_at',
        'signed_up_at',
        'converted_at',
        'conversion_value',
        'referral_source',
        'metadata'
    ];

    protected $casts = [
        'reward_amount' => 'decimal:2',
        'conversion_value' => 'decimal:2',
        'reward_claimed' => 'boolean',
        'signed_up_at' => 'datetime',
        'converted_at' => 'datetime',
        'reward_claimed_at' => 'datetime',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Generate unique referral code
     */
    public static function generateReferralCode(int $userId): string
    {
        $prefix = 'TUN';
        $uniqueId = strtoupper(substr(md5($userId . time()), 0, 8));
        return "{$prefix}-{$uniqueId}";
    }

    /**
     * Create referral
     */
    public static function createReferral(int $referrerUserId, string $referredEmail, string $source = 'direct_link'): ?self
    {
        try {
            // Check if already referred
            $existing = self::where('referrer_user_id', $referrerUserId)
                ->where('referred_email', $referredEmail)
                ->first();

            if ($existing) {
                return $existing;
            }

            $code = self::generateReferralCode($referrerUserId);

            return self::create([
                'referrer_user_id' => $referrerUserId,
                'referred_email' => $referredEmail,
                'referral_code' => $code,
                'status' => 'pending',
                'referral_source' => $source,
                'reward_type' => 'discount',
                'reward_amount' => 50.00,
                'reward_currency' => 'USD'
            ]);
        } catch (\Exception $e) {
            error_log("Error creating referral: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get user's referrals
     */
    public static function getUserReferrals(int $userId): array
    {
        try {
            return self::where('referrer_user_id', $userId)
                ->orderBy('created_at', 'DESC')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting referrals: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get referral stats
     */
    public static function getReferralStats(int $userId): array
    {
        try {
            $referrals = self::where('referrer_user_id', $userId)->get();

            $stats = [
                'total_referrals' => $referrals->count(),
                'pending' => $referrals->where('status', 'pending')->count(),
                'signed_up' => $referrals->where('status', 'signed_up')->count(),
                'converted' => $referrals->where('status', 'converted')->count(),
                'total_rewards_earned' => 0,
                'total_rewards_claimed' => 0,
                'total_rewards_pending' => 0,
                'conversion_rate' => 0
            ];

            foreach ($referrals as $referral) {
                if ($referral->status === 'converted' || $referral->status === 'rewarded') {
                    $stats['total_rewards_earned'] += $referral->reward_amount;

                    if ($referral->reward_claimed) {
                        $stats['total_rewards_claimed'] += $referral->reward_amount;
                    } else {
                        $stats['total_rewards_pending'] += $referral->reward_amount;
                    }
                }
            }

            if ($stats['total_referrals'] > 0) {
                $stats['conversion_rate'] = round(($stats['converted'] / $stats['total_referrals']) * 100, 1);
            }

            return $stats;
        } catch (\Exception $e) {
            error_log("Error getting referral stats: " . $e->getMessage());
            return [
                'total_referrals' => 0,
                'pending' => 0,
                'signed_up' => 0,
                'converted' => 0,
                'total_rewards_earned' => 0,
                'total_rewards_claimed' => 0,
                'total_rewards_pending' => 0,
                'conversion_rate' => 0
            ];
        }
    }

    /**
     * Mark referral as signed up
     */
    public static function markAsSignedUp(string $email, int $referredUserId): bool
    {
        try {
            $referral = self::where('referred_email', $email)
                ->where('status', 'pending')
                ->first();

            if (!$referral) {
                return false;
            }

            return $referral->update([
                'referred_user_id' => $referredUserId,
                'status' => 'signed_up',
                'signed_up_at' => now()
            ]);
        } catch (\Exception $e) {
            error_log("Error marking referral as signed up: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Mark referral as converted (first purchase)
     */
    public static function markAsConverted(int $referredUserId, float $conversionValue): bool
    {
        try {
            $referral = self::where('referred_user_id', $referredUserId)
                ->whereIn('status', ['pending', 'signed_up'])
                ->first();

            if (!$referral) {
                return false;
            }

            $updated = $referral->update([
                'status' => 'converted',
                'converted_at' => now(),
                'conversion_value' => $conversionValue
            ]);

            if ($updated) {
                // Create notification for referrer
                Notification::createInAppNotification([
                    'user_id' => $referral->referrer_user_id,
                    'type' => 'referral_converted',
                    'subject' => 'Referral Reward Earned!',
                    'message' => "Your referral has made their first purchase! You've earned \${$referral->reward_amount} in rewards.",
                    'priority' => 'high',
                    'related_entity_type' => 'referral',
                    'related_entity_id' => $referral->id,
                    'data' => [
                        'reward_amount' => $referral->reward_amount,
                        'action_url' => '/dashboard/referrals'
                    ]
                ]);
            }

            return $updated;
        } catch (\Exception $e) {
            error_log("Error marking referral as converted: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Claim reward
     */
    public static function claimReward(int $id, int $userId): bool
    {
        try {
            $referral = self::where('id', $id)
                ->where('referrer_user_id', $userId)
                ->where('status', 'converted')
                ->where('reward_claimed', false)
                ->first();

            if (!$referral) {
                return false;
            }

            return $referral->update([
                'reward_claimed' => true,
                'reward_claimed_at' => now(),
                'status' => 'rewarded'
            ]);
        } catch (\Exception $e) {
            error_log("Error claiming reward: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Relationships
     */
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_user_id');
    }

    public function referredUser()
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }
}

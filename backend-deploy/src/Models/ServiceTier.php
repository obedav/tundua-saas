<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceTier extends Model
{
    protected $table = 'service_tiers';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'base_price',
        'price_usd',
        'is_custom_pricing',
        'billing_type',
        'features',
        'max_universities',
        'includes_essay_review',
        'includes_sop_writing',
        'includes_visa_support',
        'includes_interview_coaching',
        'support_level',
        'is_active',
        'is_featured',
        'sort_order'
    ];

    protected $casts = [
        'features' => 'array',
        'base_price' => 'decimal:2',
        'price_usd' => 'decimal:2',
        'is_custom_pricing' => 'boolean',
        'max_universities' => 'integer',
        'includes_essay_review' => 'boolean',
        'includes_sop_writing' => 'boolean',
        'includes_visa_support' => 'boolean',
        'includes_interview_coaching' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get all active service tiers
     */
    public static function getActiveTiers(): array
    {
        try {
            return self::where('is_active', true)
                ->orderBy('sort_order', 'ASC')
                ->orderBy('base_price', 'ASC')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting service tiers: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get service tier by ID
     */
    public static function getById(int $id): ?self
    {
        try {
            return self::find($id);
        } catch (\Exception $e) {
            error_log("Error getting service tier: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get service tier by slug
     */
    public static function getBySlug(string $slug): ?self
    {
        try {
            return self::where('slug', $slug)->first();
        } catch (\Exception $e) {
            error_log("Error getting service tier: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Create service tier (admin)
     */
    public static function createTier(array $data): ?self
    {
        try {
            return self::create($data);
        } catch (\Exception $e) {
            error_log("Error creating service tier: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Update service tier (admin)
     */
    public static function updateTier(int $id, array $data): bool
    {
        try {
            $tier = self::find($id);

            if (!$tier) {
                return false;
            }

            $tier->update($data);
            return true;
        } catch (\Exception $e) {
            error_log("Error updating service tier: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete service tier (admin)
     */
    public static function deleteTier(int $id): bool
    {
        try {
            $tier = self::find($id);

            if (!$tier) {
                return false;
            }

            return $tier->delete();
        } catch (\Exception $e) {
            error_log("Error deleting service tier: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Seed default service tiers (Seeker, Scholar, Fellow)
     * Currency: NGN for Nigeria, USD for international users
     */
    public static function seedDefaultTiers(): void
    {
        $tiers = [
            // Seeker - Free tier for new users to explore
            [
                'name' => 'Seeker',
                'slug' => 'seeker',
                'description' => 'Perfect for students exploring their options',
                'base_price' => 0.00,
                'price_usd' => 0.00,
                'is_custom_pricing' => false,
                'billing_type' => 'one_time',
                'features' => json_encode([
                    'University Search' => '5 searches per month',
                    'Document Checklist' => '1 application draft',
                    'Basic Eligibility Check' => '1 check per month',
                    'Application Dashboard' => 'Track your progress',
                    'University Comparison' => 'Compare up to 3 schools',
                    'Community Forum' => 'Connect with other students',
                    'Email Support' => 'Response within 72 hours'
                ]),
                'max_universities' => 1,
                'includes_essay_review' => false,
                'includes_sop_writing' => false,
                'includes_visa_support' => false,
                'includes_interview_coaching' => false,
                'support_level' => 'Community',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 1
            ],
            // Scholar - Paid tier with full access
            [
                'name' => 'Scholar',
                'slug' => 'scholar',
                'description' => 'For serious applicants - All limitations removed with expert human support',
                'base_price' => 49999.00,
                'price_usd' => 29.99,
                'is_custom_pricing' => false,
                'billing_type' => 'one_time',
                'features' => json_encode([
                    'Unlimited University Search' => 'Explore any school instantly',
                    'Unlimited Document Review' => 'Get feedback on all documents',
                    'Unlimited Eligibility Checks' => 'Check requirements freely',
                    'Application Dashboard' => 'Full progress tracking',
                    'Essay Review & Editing' => 'Professional feedback on essays',
                    'Priority Email Support' => 'Response within 24 hours',
                    'Deadline Management' => 'Never miss a deadline',
                    'University Recommendations' => 'Personalized school suggestions',
                    'Scholarship Search' => 'Find funding opportunities',
                    'Expert Human Support' => 'Live counselor guidance'
                ]),
                'max_universities' => 5,
                'includes_essay_review' => true,
                'includes_sop_writing' => false,
                'includes_visa_support' => false,
                'includes_interview_coaching' => false,
                'support_level' => 'Priority Email',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2
            ],
            // Fellow - Premium tier with full visa support
            [
                'name' => 'Fellow',
                'slug' => 'fellow',
                'description' => 'Complete end-to-end support from application to visa - Your dedicated study abroad partner',
                'base_price' => 0.00,
                'price_usd' => 0.00,
                'is_custom_pricing' => true,
                'billing_type' => 'one_time',
                'features' => json_encode([
                    'Everything in Scholar' => 'All Scholar features included',
                    'Unlimited Applications' => 'Apply to as many schools as you want',
                    'Complete SOP Writing' => 'Professional statement of purpose',
                    'Full Document Preparation' => 'End-to-end document support',
                    'Visa Application Support' => 'Complete visa guidance',
                    'Interview Coaching' => 'Mock interviews & preparation',
                    'Dedicated Account Manager' => 'Your personal counselor',
                    'WhatsApp Priority Support' => 'Instant messaging access',
                    'Scholarship & Funding Help' => 'Maximize your funding',
                    'Pre-departure Orientation' => 'Prepare for your journey',
                    'Accommodation Assistance' => 'Help finding housing'
                ]),
                'max_universities' => 99,
                'includes_essay_review' => true,
                'includes_sop_writing' => true,
                'includes_visa_support' => true,
                'includes_interview_coaching' => true,
                'support_level' => 'Dedicated Manager',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3
            ]
        ];

        // Clear existing tiers and insert new ones
        self::query()->delete();

        foreach ($tiers as $tier) {
            self::create($tier);
        }
    }
}

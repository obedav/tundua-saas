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
     * Seed default service tiers
     */
    public static function seedDefaultTiers(): void
    {
        $tiers = [
            [
                'name' => 'Standard Package',
                'slug' => 'standard',
                'description' => 'Perfect for students applying to a few universities',
                'base_price' => 299.00,
                'features' => json_encode([
                    '3 university applications',
                    'Basic document review',
                    'Email support',
                    'Application tracking dashboard',
                    'Status updates via email'
                ]),
                'max_universities' => 3,
                'includes_essay_review' => false,
                'includes_sop_writing' => false,
                'includes_visa_support' => false,
                'includes_interview_coaching' => false,
                'support_level' => 'Email',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 1
            ],
            [
                'name' => 'Premium Package',
                'slug' => 'premium',
                'description' => 'Most popular choice for serious applicants',
                'base_price' => 599.00,
                'features' => json_encode([
                    '5 university applications',
                    'Essay review & editing',
                    'Document verification',
                    'Priority email support',
                    'Application tracking dashboard',
                    'Dedicated counselor guidance',
                    'University selection assistance'
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
            [
                'name' => 'Concierge Package',
                'slug' => 'concierge',
                'description' => 'Complete end-to-end application support',
                'base_price' => 999.00,
                'features' => json_encode([
                    '8 university applications',
                    'Complete essay writing service',
                    'Full document preparation',
                    'Visa application assistance',
                    'Interview coaching (2 sessions)',
                    'Dedicated personal counselor',
                    'Priority 24/7 support',
                    'Scholarship search assistance',
                    'Post-admission support'
                ]),
                'max_universities' => 8,
                'includes_essay_review' => true,
                'includes_sop_writing' => true,
                'includes_visa_support' => true,
                'includes_interview_coaching' => true,
                'support_level' => 'Priority 24/7',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3
            ]
        ];

        foreach ($tiers as $tier) {
            // Check if tier already exists
            $existing = self::where('slug', $tier['slug'])->first();
            if (!$existing) {
                self::create($tier);
            }
        }
    }
}

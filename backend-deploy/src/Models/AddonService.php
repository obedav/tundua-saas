<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class AddonService extends Model
{
    protected $table = 'addon_services';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'category',
        'delivery_time_days',
        'is_active',
        'is_featured',
        'sort_order',
        'metadata'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'delivery_time_days' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get all active add-on services
     */
    public static function getActiveAddons(?string $category = null): array
    {
        try {
            $query = self::where('is_active', true);

            if ($category) {
                $query->where('category', $category);
            }

            return $query
                ->orderBy('sort_order', 'ASC')
                ->orderBy('name', 'ASC')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            error_log("Error getting add-on services: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get add-on by ID
     */
    public static function getById(int $id): ?self
    {
        try {
            return self::find($id);
        } catch (\Exception $e) {
            error_log("Error getting add-on service: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get add-on by slug
     */
    public static function getBySlug(string $slug): ?self
    {
        try {
            return self::where('slug', $slug)->first();
        } catch (\Exception $e) {
            error_log("Error getting add-on service: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get add-ons by IDs
     */
    public static function getByIds(array $ids): array
    {
        try {
            return self::whereIn('id', $ids)->get()->toArray();
        } catch (\Exception $e) {
            error_log("Error getting add-on services: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Create add-on service (admin)
     */
    public static function createAddon(array $data): ?self
    {
        try {
            return self::create($data);
        } catch (\Exception $e) {
            error_log("Error creating add-on service: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Update add-on service (admin)
     */
    public static function updateAddon(int $id, array $data): bool
    {
        try {
            $addon = self::find($id);

            if (!$addon) {
                return false;
            }

            $addon->update($data);
            return true;
        } catch (\Exception $e) {
            error_log("Error updating add-on service: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete add-on service (admin)
     */
    public static function deleteAddon(int $id): bool
    {
        try {
            $addon = self::find($id);

            if (!$addon) {
                return false;
            }

            return $addon->delete();
        } catch (\Exception $e) {
            error_log("Error deleting add-on service: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Seed default add-on services
     */
    public static function seedDefaultAddons(): void
    {
        $addons = [
            [
                'name' => 'Statement of Purpose (SOP) Writing',
                'slug' => 'sop-writing',
                'description' => 'Professional SOP writing by experienced counselors with 2 rounds of revisions',
                'price' => 25000.00,
                'category' => 'documents',
                'delivery_time_days' => 5,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
                'metadata' => json_encode(['includes_revisions' => 2])
            ],
            [
                'name' => 'Letter of Recommendation (LOR) Editing',
                'slug' => 'lor-editing',
                'description' => 'Professional editing and formatting of your recommendation letters',
                'price' => 12000.00,
                'category' => 'documents',
                'delivery_time_days' => 3,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 2,
                'metadata' => json_encode(['per_letter' => true])
            ],
            [
                'name' => 'Resume/CV Optimization',
                'slug' => 'resume-optimization',
                'description' => 'Optimize your resume/CV for international university applications',
                'price' => 15000.00,
                'category' => 'documents',
                'delivery_time_days' => 3,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3,
                'metadata' => json_encode(['includes_cover_letter' => false])
            ],
            [
                'name' => 'Scholarship Search & Application Assistance',
                'slug' => 'scholarship-search',
                'description' => 'Find and apply to relevant scholarships (minimum 5 opportunities)',
                'price' => 20000.00,
                'category' => 'planning',
                'delivery_time_days' => 7,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 4,
                'metadata' => json_encode(['minimum_scholarships' => 5])
            ],
            [
                'name' => 'Interview Coaching Session',
                'slug' => 'interview-coaching',
                'description' => 'One-on-one 60-minute mock interview with detailed feedback',
                'price' => 35000.00,
                'category' => 'coaching',
                'delivery_time_days' => 1,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 5,
                'metadata' => json_encode(['duration_minutes' => 60, 'sessions' => 1])
            ],
            [
                'name' => 'Visa Application Support',
                'slug' => 'visa-support',
                'description' => 'Complete visa application assistance with interview preparation',
                'price' => 45000.00,
                'category' => 'support',
                'delivery_time_days' => 10,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 6,
                'metadata' => json_encode(['includes_interview_prep' => true])
            ],
            [
                'name' => 'Document Translation (Per Page)',
                'slug' => 'document-translation',
                'description' => 'Certified translation of academic documents',
                'price' => 8000.00,
                'category' => 'documents',
                'delivery_time_days' => 3,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 7,
                'metadata' => json_encode(['per_page' => true, 'certified' => true])
            ],
            [
                'name' => 'IELTS/TOEFL Preparation Course',
                'slug' => 'english-test-prep',
                'description' => '4-week intensive online test preparation (20 hours total)',
                'price' => 65000.00,
                'category' => 'coaching',
                'delivery_time_days' => 28,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 8,
                'metadata' => json_encode(['weeks' => 4, 'hours_per_week' => 5])
            ],
            [
                'name' => 'University Selection Report',
                'slug' => 'university-selection',
                'description' => 'Personalized report with 10 university recommendations based on your profile',
                'price' => 18000.00,
                'category' => 'planning',
                'delivery_time_days' => 5,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 9,
                'metadata' => json_encode(['universities_recommended' => 10])
            ],
            [
                'name' => 'Financial Aid Consulting',
                'slug' => 'financial-aid',
                'description' => 'Expert guidance on financial aid and scholarship applications',
                'price' => 30000.00,
                'category' => 'planning',
                'delivery_time_days' => 7,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 10,
                'metadata' => json_encode(['includes_fafsa_help' => true])
            ],
            [
                'name' => 'Post-Landing Support (30 Days)',
                'slug' => 'post-landing',
                'description' => '30-day support for settling into your destination country',
                'price' => 28000.00,
                'category' => 'support',
                'delivery_time_days' => 30,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 11,
                'metadata' => json_encode(['duration_days' => 30])
            ],
            [
                'name' => 'Accommodation Booking Assistance',
                'slug' => 'accommodation',
                'description' => 'Help finding and booking verified student accommodation',
                'price' => 15000.00,
                'category' => 'support',
                'delivery_time_days' => 5,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 12,
                'metadata' => json_encode(['includes_verification' => true])
            ],
            [
                'name' => 'Flight Booking Assistance',
                'slug' => 'flight-booking',
                'description' => 'Find and compare best deals on international flights',
                'price' => 10000.00,
                'category' => 'support',
                'delivery_time_days' => 2,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 13,
                'metadata' => json_encode(['includes_travel_insurance' => false])
            ]
        ];

        foreach ($addons as $addon) {
            // Check if addon already exists
            $existing = self::where('slug', $addon['slug'])->first();
            if (!$existing) {
                self::create($addon);
            }
        }
    }
}

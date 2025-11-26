<?php

use Phinx\Seed\AbstractSeed;

/**
 * Addon Services Seeder
 * Seeds the addon_services table with default add-on services
 */
class AddonServicesSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     */
    public function run(): void
    {
        $data = [
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
                'metadata' => json_encode(['includes_revisions' => 2]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['per_letter' => true]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['includes_cover_letter' => false]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['minimum_scholarships' => 5]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['duration_minutes' => 60, 'sessions' => 1]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['includes_interview_prep' => true]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['per_page' => true, 'certified' => true]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['weeks' => 4, 'hours_per_week' => 5]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['universities_recommended' => 10]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['includes_fafsa_help' => true]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['duration_days' => 30]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['includes_verification' => true]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'metadata' => json_encode(['includes_travel_insurance' => false]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];

        $addonServices = $this->table('addon_services');
        $addonServices->insert($data)->saveData();

        $this->output->writeln('<info>Addon services seeded successfully!</info>');
    }
}

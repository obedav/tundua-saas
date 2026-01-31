<?php

use Phinx\Seed\AbstractSeed;

/**
 * Service Tiers Seeder
 * Seeds the service_tiers table with Seeker (Free), Scholar ($29.99), and Fellow (Custom) packages
 * Supports multi-currency pricing (NGN for Nigeria, USD for international)
 * Nigerian users can switch to USD if preferred
 */
class ServiceTiersSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     */
    public function run(): void
    {
        // First, clear existing tiers
        $this->execute('DELETE FROM service_tiers');

        $data = [
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
                'sort_order' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'sort_order' => 2,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
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
                'sort_order' => 3,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];

        $serviceTiers = $this->table('service_tiers');
        $serviceTiers->insert($data)->saveData();

        $this->output->writeln('<info>Service tiers (Seeker, Scholar, Fellow) seeded successfully!</info>');
    }
}

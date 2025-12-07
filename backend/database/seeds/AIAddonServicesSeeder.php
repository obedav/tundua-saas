<?php

use Phinx\Seed\AbstractSeed;

/**
 * AI-Powered Addon Services Seeder
 *
 * Adds AI-powered variants of popular addon services:
 * - Faster delivery (instant to 24 hours)
 * - Lower pricing (60-70% cheaper)
 * - Automated generation using Claude AI
 */
class AIAddonServicesSeeder extends AbstractSeed
{
    public function run(): void
    {
        $data = [
            //=================================================================
            // AI-POWERED DOCUMENT SERVICES
            //=================================================================

            // 1. AI SOP Generation (was ₦25,000, now ₦8,000)
            [
                'name' => 'AI-Powered SOP Generation',
                'slug' => 'ai-sop-generation',
                'description' => '⚡ INSTANT: AI-generated Statement of Purpose based on your narrative. Share your story in your own words, and our AI transforms it into a compelling SOP. Includes 2 AI revision rounds.',
                'price' => 8000.00,
                'category' => 'documents',
                'delivery_time_days' => 0, // Instant (minutes)
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'instant_delivery' => true,
                    'includes_revisions' => 2,
                    'word_count_range' => '600-800',
                    'model' => 'Claude 3.5 Sonnet',
                    'upgrade_available' => 'sop-writing', // Can upgrade to human-written
                    'upgrade_price' => 17000, // Difference
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],

            // 2. AI Resume Optimization (was ₦15,000, now ₦5,000)
            [
                'name' => 'AI Resume/CV Optimization',
                'slug' => 'ai-resume-optimization',
                'description' => '⚡ INSTANT: AI-powered resume optimization with action verbs, quantified achievements, ATS optimization, and industry keywords. Get a professional resume in minutes.',
                'price' => 5000.00,
                'category' => 'documents',
                'delivery_time_days' => 0, // Instant
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'instant_delivery' => true,
                    'includes_improvement_report' => true,
                    'quality_score' => true,
                    'model' => 'Claude 3.5 Sonnet',
                    'upgrade_available' => 'resume-optimization',
                    'upgrade_price' => 10000,
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],

            // 3. AI University Selection Report (was ₦18,000, now ₦5,000)
            [
                'name' => 'AI University Selection Report',
                'slug' => 'ai-university-report',
                'description' => '⚡ INSTANT: Personalized AI-generated report with 10 university recommendations tailored to your profile, budget, and goals. Includes admission probability analysis and program fit assessment.',
                'price' => 5000.00,
                'category' => 'planning',
                'delivery_time_days' => 0, // Instant
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 3,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'instant_delivery' => true,
                    'universities_recommended' => 10,
                    'includes_admission_probability' => true,
                    'includes_ranking_data' => true,
                    'includes_tuition_estimates' => true,
                    'model' => 'Claude 3.5 Sonnet',
                    'upgrade_available' => 'university-selection',
                    'upgrade_price' => 13000,
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],

            //=================================================================
            // HYBRID SERVICES (AI + HUMAN REVIEW)
            //=================================================================

            // 4. AI SOP + Human Review (Middle tier)
            [
                'name' => 'AI SOP with Expert Review',
                'slug' => 'ai-sop-reviewed',
                'description' => '🤝 BEST VALUE: AI-generated SOP reviewed and refined by expert counselors. Get AI speed with human expertise. 24-hour delivery with 2 revision rounds.',
                'price' => 15000.00,
                'category' => 'documents',
                'delivery_time_days' => 1,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 4,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'human_review' => true,
                    'includes_revisions' => 2,
                    'delivery_hours' => 24,
                    'model' => 'Claude 3.5 Sonnet',
                    'expert_review_time_hours' => 4,
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],

            // 5. AI Resume + Human Review
            [
                'name' => 'AI Resume with Professional Review',
                'slug' => 'ai-resume-reviewed',
                'description' => '🤝 AI-optimized resume reviewed by professional resume writers. Get the best of both worlds. 24-hour delivery.',
                'price' => 10000.00,
                'category' => 'documents',
                'delivery_time_days' => 1,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 5,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'human_review' => true,
                    'delivery_hours' => 24,
                    'model' => 'Claude 3.5 Sonnet',
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],

            //=================================================================
            // BUNDLE PACKAGES
            //=================================================================

            // 6. Complete Application Package (AI)
            [
                'name' => 'Complete Application Package (AI)',
                'slug' => 'ai-complete-package',
                'description' => '💎 BUNDLE DEAL: AI-generated SOP + Resume + University Report. Save ₦3,000! Everything you need for your application in one package.',
                'price' => 15000.00, // Was ₦18,000 (₦8k + ₦5k + ₦5k), now ₦15k
                'category' => 'documents',
                'delivery_time_days' => 0,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 6,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'instant_delivery' => true,
                    'bundle' => true,
                    'includes' => ['SOP', 'Resume', 'University Report'],
                    'savings' => 3000,
                    'model' => 'Claude 3.5 Sonnet',
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],

            // 7. Premium Application Package (AI + Human)
            [
                'name' => 'Premium Application Package (AI + Human Review)',
                'slug' => 'ai-premium-package',
                'description' => '👑 PREMIUM: AI-generated SOP + Resume + University Report, all reviewed by experts. Premium quality at 50% less than traditional services.',
                'price' => 32000.00, // Individual: ₦15k + ₦10k + ₦5k + review
                'category' => 'documents',
                'delivery_time_days' => 2,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 7,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'human_review' => true,
                    'bundle' => true,
                    'includes' => ['SOP + Review', 'Resume + Review', 'University Report'],
                    'delivery_hours' => 48,
                    'model' => 'Claude 3.5 Sonnet',
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],

            //=================================================================
            // AI-ASSISTED SERVICES (Human work aided by AI)
            //=================================================================

            // 8. Smart Document Review (AI-Assisted)
            [
                'name' => 'Smart Document Review',
                'slug' => 'ai-document-review',
                'description' => '🔍 Upload your SOP, resume, or essays for instant AI analysis. Get detailed feedback on structure, grammar, impact, and suggestions for improvement.',
                'price' => 3000.00,
                'category' => 'documents',
                'delivery_time_days' => 0,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 8,
                'metadata' => json_encode([
                    'ai_powered' => true,
                    'instant_delivery' => true,
                    'feedback_categories' => [
                        'Structure',
                        'Grammar',
                        'Impact',
                        'Clarity',
                        'Relevance'
                    ],
                    'model' => 'Claude 3.5 Sonnet',
                ]),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
        ];

        $this->table('addon_services')->insert($data)->saveData();
    }
}

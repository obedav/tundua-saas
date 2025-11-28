<?php

use Phinx\Seed\AbstractSeed;

/**
 * Service Tiers Seeder
 * Seeds the service_tiers table with default packages
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
        $data = [
            [
                'name' => 'Basic Package',
                'slug' => 'basic',
                'description' => 'Perfect starter package for budget-conscious students',
                'base_price' => 89000.00,
                'features' => json_encode([
                    '3 university applications',
                    'Basic document review',
                    'Email support (48hr response)',
                    'Application tracking dashboard',
                    'Status updates via email',
                    'University comparison tool'
                ]),
                'max_universities' => 3,
                'includes_essay_review' => false,
                'includes_sop_writing' => false,
                'includes_visa_support' => false,
                'includes_interview_coaching' => false,
                'support_level' => 'Email',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Standard Package',
                'slug' => 'standard',
                'description' => 'Most popular choice - best value for money',
                'base_price' => 149000.00,
                'features' => json_encode([
                    '5 university applications',
                    'Essay review & editing (1 round)',
                    'Document verification & formatting',
                    'Priority email support (24hr response)',
                    'Application tracking dashboard',
                    'Dedicated counselor guidance',
                    'University selection assistance',
                    'Deadline reminders & alerts'
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
            [
                'name' => 'Premium Package',
                'slug' => 'premium',
                'description' => 'Complete application support with extra benefits',
                'base_price' => 249000.00,
                'features' => json_encode([
                    '8 university applications',
                    'Complete essay writing & review (2 rounds)',
                    'Full document preparation & verification',
                    'Basic visa application guidance',
                    'Interview preparation tips',
                    'Dedicated personal counselor',
                    'WhatsApp priority support',
                    'Scholarship search assistance',
                    'Post-admission settlement guide',
                    'Application fee negotiation tips'
                ]),
                'max_universities' => 8,
                'includes_essay_review' => true,
                'includes_sop_writing' => true,
                'includes_visa_support' => true,
                'includes_interview_coaching' => false,
                'support_level' => 'WhatsApp Priority',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];

        $serviceTiers = $this->table('service_tiers');
        $serviceTiers->insert($data)->saveData();

        $this->output->writeln('<info>Service tiers seeded successfully!</info>');
    }
}

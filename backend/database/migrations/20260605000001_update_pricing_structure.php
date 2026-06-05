<?php

use Phinx\Migration\AbstractMigration;

class UpdatePricingStructure extends AbstractMigration
{
    public function up(): void
    {
        // 1. Scholar: ₦49,999 / $29.99  →  ₦75,000 / $49, billing_type one_time → yearly
        $this->execute("
            UPDATE service_tiers
            SET base_price   = 75000.00,
                price_usd    = 49.00,
                billing_type = 'yearly',
                updated_at   = NOW()
            WHERE slug = 'scholar'
        ");

        // 2. Fellow: custom / $0  →  ₦500,000 / $315, fixed price
        //    sort_order bumped 3 → 4 to make room for Application Support
        $this->execute("
            UPDATE service_tiers
            SET base_price        = 500000.00,
                price_usd         = 315.00,
                is_custom_pricing = FALSE,
                sort_order        = 4,
                updated_at        = NOW()
            WHERE slug = 'fellow'
        ");

        // 3. New: Application Support  ₦250,000 / $159
        $this->execute("
            INSERT INTO service_tiers (
                name, slug, description,
                base_price, price_usd, is_custom_pricing, billing_type,
                features,
                max_universities,
                includes_essay_review, includes_sop_writing,
                includes_visa_support, includes_interview_coaching,
                support_level, is_active, is_featured, sort_order,
                created_at, updated_at
            ) VALUES (
                'Application Support',
                'application-support',
                'We handle your application from start to offer letter',
                250000.00, 159.00, FALSE, 'one_time',
                '{\"Everything in Scholar\":\"All Scholar features included\",\"Dedicated counselor assigned\":\"Personal counselor for your application\",\"University shortlist\":\"Up to 5 schools\",\"Full document preparation\":\"End-to-end document support\",\"Application submission on your behalf\":\"We submit for you\",\"Offer letter management\":\"We manage your offer\",\"WhatsApp support\":\"Direct WhatsApp access\",\"Payment plan available\":\"50% now, 50% on offer letter\"}',
                5,
                TRUE, FALSE, FALSE, FALSE,
                'Dedicated Counselor',
                TRUE, TRUE, 3,
                NOW(), NOW()
            )
        ");

        // 4. New: Premium Concierge  ₦1,000,000 / $625
        $this->execute("
            INSERT INTO service_tiers (
                name, slug, description,
                base_price, price_usd, is_custom_pricing, billing_type,
                features,
                max_universities,
                includes_essay_review, includes_sop_writing,
                includes_visa_support, includes_interview_coaching,
                support_level, is_active, is_featured, sort_order,
                created_at, updated_at
            ) VALUES (
                'Premium Concierge',
                'premium-concierge',
                'For complex cases that need personal expert attention',
                1000000.00, 625.00, FALSE, 'one_time',
                '{\"Everything in Fellow\":\"All Fellow features included\",\"Multiple country applications\":\"Apply to multiple countries\",\"Complex profile handling\":\"3rd class degree, study gaps, prior visa refusals\",\"Dedicated personal advisor\":\"Direct line to senior advisor\",\"Unlimited application attempts\":\"No limit on attempts\",\"Family package available\":\"Bring your family\",\"Direct WhatsApp to senior counselor\":\"Senior counselor direct access\"}',
                99,
                TRUE, TRUE, TRUE, TRUE,
                'Senior Personal Advisor',
                TRUE, FALSE, 5,
                NOW(), NOW()
            )
        ");
    }

    public function down(): void
    {
        // Remove new tiers
        $this->execute("DELETE FROM service_tiers WHERE slug IN ('application-support', 'premium-concierge')");

        // Restore Scholar to original prices
        $this->execute("
            UPDATE service_tiers
            SET base_price   = 49999.00,
                price_usd    = 29.99,
                billing_type = 'one_time',
                updated_at   = NOW()
            WHERE slug = 'scholar'
        ");

        // Restore Fellow to custom pricing
        $this->execute("
            UPDATE service_tiers
            SET base_price        = 0.00,
                price_usd         = 0.00,
                is_custom_pricing = TRUE,
                sort_order        = 3,
                updated_at        = NOW()
            WHERE slug = 'fellow'
        ");
    }
}

<?php

use Phinx\Migration\AbstractMigration;

/**
 * Partner Commission Tracking
 * Track commissions from ApplyBoard, Edvoy, BPP Education and other partners
 */
class CreatePartnerCommissionsTable extends AbstractMigration
{
    public function change()
    {
        // Partners table - ApplyBoard, Edvoy, BPP Education, etc.
        $partners = $this->table('partners');
        $partners
            ->addColumn('name', 'string', ['limit' => 100])
            ->addColumn('slug', 'string', ['limit' => 50])
            ->addColumn('website', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('commission_type', 'enum', [
                'values' => ['fixed', 'percentage', 'tiered'],
                'default' => 'fixed'
            ])
            ->addColumn('default_commission_amount', 'decimal', [
                'precision' => 10,
                'scale' => 2,
                'default' => 0
            ])
            ->addColumn('commission_currency', 'string', ['limit' => 3, 'default' => 'GBP'])
            ->addColumn('notes', 'text', ['null' => true])
            ->addColumn('is_active', 'boolean', ['default' => true])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', [
                'default' => 'CURRENT_TIMESTAMP',
                'update' => 'CURRENT_TIMESTAMP'
            ])
            ->addIndex(['slug'], ['unique' => true])
            ->create();

        // Seed default partners
        $this->execute("
            INSERT INTO partners (name, slug, website, commission_type, default_commission_amount, commission_currency, notes) VALUES
            ('ApplyBoard', 'applyboard', 'https://www.applyboard.com', 'tiered', 250.00, 'GBP', 'Commission varies by institution and program'),
            ('Edvoy', 'edvoy', 'https://www.edvoy.com', 'tiered', 200.00, 'GBP', 'Commission varies by institution'),
            ('BPP Education', 'bpp', 'https://www.bpp.com', 'fixed', 300.00, 'GBP', 'Direct partnership - higher commission rates')
        ");

        // Partner commissions tracking table
        $commissions = $this->table('partner_commissions');
        $commissions
            ->addColumn('application_id', 'integer', ['signed' => false])
            ->addColumn('user_id', 'integer', ['signed' => false])
            ->addColumn('partner_id', 'integer', ['signed' => false])
            ->addColumn('university_name', 'string', ['limit' => 255])
            ->addColumn('program_name', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('intake_year', 'string', ['limit' => 10, 'null' => true])
            ->addColumn('intake_month', 'string', ['limit' => 20, 'null' => true])
            ->addColumn('status', 'enum', [
                'values' => ['pending', 'submitted_to_partner', 'offer_received', 'student_enrolled', 'commission_pending', 'commission_paid', 'rejected', 'cancelled'],
                'default' => 'pending'
            ])
            // Tuition tracking for 10% commission calculation
            ->addColumn('tuition_fee', 'decimal', [
                'precision' => 12,
                'scale' => 2,
                'null' => true
            ])
            ->addColumn('tuition_currency', 'string', ['limit' => 3, 'default' => 'USD'])
            ->addColumn('commission_percentage', 'decimal', [
                'precision' => 5,
                'scale' => 2,
                'default' => 10.00  // Default 10% commission
            ])
            ->addColumn('expected_commission', 'decimal', [
                'precision' => 12,
                'scale' => 2,
                'null' => true
            ])
            ->addColumn('actual_commission', 'decimal', [
                'precision' => 12,
                'scale' => 2,
                'null' => true
            ])
            ->addColumn('commission_currency', 'string', ['limit' => 3, 'default' => 'USD'])
            ->addColumn('partner_reference', 'string', ['limit' => 100, 'null' => true])
            ->addColumn('offer_letter_url', 'string', ['limit' => 500, 'null' => true])
            ->addColumn('submitted_at', 'timestamp', ['null' => true])
            ->addColumn('offer_received_at', 'timestamp', ['null' => true])
            ->addColumn('enrolled_at', 'timestamp', ['null' => true])
            ->addColumn('commission_received_at', 'timestamp', ['null' => true])
            ->addColumn('notes', 'text', ['null' => true])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', [
                'default' => 'CURRENT_TIMESTAMP',
                'update' => 'CURRENT_TIMESTAMP'
            ])
            ->addForeignKey('application_id', 'applications', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('partner_id', 'partners', 'id', ['delete' => 'RESTRICT'])
            ->addIndex(['status'])
            ->addIndex(['partner_id', 'status'])
            ->addIndex(['user_id'])
            ->create();

        // Add partner_id to applications table for quick reference
        $this->table('applications')
            ->addColumn('assigned_partner_id', 'integer', ['signed' => false, 'null' => true, 'after' => 'service_tier_id'])
            ->addForeignKey('assigned_partner_id', 'partners', 'id', ['delete' => 'SET_NULL'])
            ->update();

        // ============================================
        // AGENT REFERRAL SYSTEM
        // For traditional agents who refer students to Tundua
        // ============================================

        $referralAgents = $this->table('referral_agents');
        $referralAgents
            ->addColumn('name', 'string', ['limit' => 100])
            ->addColumn('email', 'string', ['limit' => 255])
            ->addColumn('phone', 'string', ['limit' => 50, 'null' => true])
            ->addColumn('company_name', 'string', ['limit' => 200, 'null' => true])
            ->addColumn('referral_code', 'string', ['limit' => 20])
            ->addColumn('commission_percentage', 'decimal', [
                'precision' => 5,
                'scale' => 2,
                'default' => 5.00  // 5% of your commission goes to referring agent
            ])
            ->addColumn('bank_name', 'string', ['limit' => 100, 'null' => true])
            ->addColumn('bank_account_number', 'string', ['limit' => 50, 'null' => true])
            ->addColumn('bank_account_name', 'string', ['limit' => 100, 'null' => true])
            ->addColumn('total_referrals', 'integer', ['default' => 0])
            ->addColumn('total_conversions', 'integer', ['default' => 0])
            ->addColumn('total_earned', 'decimal', [
                'precision' => 12,
                'scale' => 2,
                'default' => 0
            ])
            ->addColumn('is_active', 'boolean', ['default' => true])
            ->addColumn('notes', 'text', ['null' => true])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', [
                'default' => 'CURRENT_TIMESTAMP',
                'update' => 'CURRENT_TIMESTAMP'
            ])
            ->addIndex(['referral_code'], ['unique' => true])
            ->addIndex(['email'], ['unique' => true])
            ->create();

        // Track which users came from which agent
        $this->table('users')
            ->addColumn('referred_by_agent_id', 'integer', ['signed' => false, 'null' => true])
            ->addColumn('referral_code_used', 'string', ['limit' => 20, 'null' => true])
            ->addForeignKey('referred_by_agent_id', 'referral_agents', 'id', ['delete' => 'SET_NULL'])
            ->update();

        // Agent referral payouts
        $agentPayouts = $this->table('agent_referral_payouts');
        $agentPayouts
            ->addColumn('referral_agent_id', 'integer', ['signed' => false])
            ->addColumn('partner_commission_id', 'integer', ['signed' => false])
            ->addColumn('user_id', 'integer', ['signed' => false])
            ->addColumn('commission_amount', 'decimal', [
                'precision' => 12,
                'scale' => 2
            ])
            ->addColumn('currency', 'string', ['limit' => 3, 'default' => 'NGN'])
            ->addColumn('status', 'enum', [
                'values' => ['pending', 'approved', 'paid', 'rejected'],
                'default' => 'pending'
            ])
            ->addColumn('paid_at', 'timestamp', ['null' => true])
            ->addColumn('payment_reference', 'string', ['limit' => 100, 'null' => true])
            ->addColumn('notes', 'text', ['null' => true])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', [
                'default' => 'CURRENT_TIMESTAMP',
                'update' => 'CURRENT_TIMESTAMP'
            ])
            ->addForeignKey('referral_agent_id', 'referral_agents', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('partner_commission_id', 'partner_commissions', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE'])
            ->addIndex(['status'])
            ->addIndex(['referral_agent_id'])
            ->create();
    }
}

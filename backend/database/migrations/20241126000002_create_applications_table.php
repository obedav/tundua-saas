<?php

use Phinx\Migration\AbstractMigration;

class CreateApplicationsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('applications');

        $table->addColumn('reference_number', 'string', ['limit' => 50, 'null' => false])
              ->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('applicant_name', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('applicant_email', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('applicant_phone', 'string', ['limit' => 20, 'null' => true])
              ->addColumn('first_name', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('last_name', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('date_of_birth', 'date', ['null' => true])
              ->addColumn('nationality', 'string', ['limit' => 3, 'null' => true])
              ->addColumn('passport_number', 'string', ['limit' => 50, 'null' => true])
              ->addColumn('current_country', 'string', ['limit' => 3, 'null' => true])
              ->addColumn('current_city', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('highest_education', 'string', ['limit' => 50, 'null' => true])
              ->addColumn('field_of_study', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('institution_name', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('graduation_year', 'integer', ['null' => true])
              ->addColumn('gpa', 'decimal', ['precision' => 4, 'scale' => 2, 'null' => true])
              ->addColumn('gpa_scale', 'decimal', ['precision' => 4, 'scale' => 2, 'null' => true])
              ->addColumn('english_test_type', 'string', ['limit' => 50, 'null' => true])
              ->addColumn('english_test_score', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true])
              ->addColumn('destination_country', 'string', ['limit' => 3, 'null' => true])
              ->addColumn('universities', 'json', ['null' => true])
              ->addColumn('program_type', 'string', ['limit' => 50, 'null' => true])
              ->addColumn('intended_major', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('intake_season', 'string', ['limit' => 20, 'null' => true])
              ->addColumn('intake_year', 'integer', ['null' => true])
              ->addColumn('service_tier_id', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('service_tier_name', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('base_price', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 0])
              ->addColumn('addon_services', 'json', ['null' => true])
              ->addColumn('addon_total', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 0])
              ->addColumn('documents_complete', 'boolean', ['default' => false])
              ->addColumn('subtotal', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 0])
              ->addColumn('tax_amount', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 0])
              ->addColumn('discount_amount', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 0])
              ->addColumn('total_amount', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 0])
              ->addColumn('currency', 'string', ['limit' => 3, 'default' => 'NGN'])
              ->addColumn('payment_status', 'enum', ['values' => ['pending', 'paid', 'failed', 'refunded'], 'default' => 'pending'])
              ->addColumn('payment_id', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('paid_at', 'timestamp', ['null' => true])
              ->addColumn('status', 'enum', [
                  'values' => ['draft', 'payment_pending', 'submitted', 'under_review', 'in_progress', 'completed', 'rejected', 'cancelled', 'expired'],
                  'default' => 'draft'
              ])
              ->addColumn('current_step', 'integer', ['default' => 1])
              ->addColumn('completion_percentage', 'integer', ['default' => 0])
              ->addColumn('assigned_to', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('admin_notes', 'text', ['null' => true])
              ->addColumn('internal_notes', 'text', ['null' => true])
              ->addColumn('rejection_reason', 'text', ['null' => true])
              ->addColumn('submitted_at', 'timestamp', ['null' => true])
              ->addColumn('reviewed_at', 'timestamp', ['null' => true])
              ->addColumn('approved_at', 'timestamp', ['null' => true])
              ->addColumn('completed_at', 'timestamp', ['null' => true])
              ->addColumn('cancelled_at', 'timestamp', ['null' => true])
              ->addColumn('auto_delete_at', 'timestamp', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['reference_number'], ['unique' => true])
              ->addIndex(['user_id'])
              ->addIndex(['status'])
              ->addIndex(['payment_status'])
              ->addIndex(['destination_country'])
              ->addIndex(['created_at'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->create();
    }
}

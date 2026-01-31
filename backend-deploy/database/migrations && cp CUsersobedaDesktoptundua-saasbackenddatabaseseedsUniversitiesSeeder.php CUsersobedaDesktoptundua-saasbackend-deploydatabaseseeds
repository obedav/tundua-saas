<?php

use Phinx\Migration\AbstractMigration;

/**
 * Universities Table
 * Stores universities available through partner platforms (ApplyBoard, Edvoy, BPP)
 * Focus: UK, Canada, Australia, USA
 */
class CreateUniversitiesTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('universities');
        $table
            ->addColumn('name', 'string', ['limit' => 255])
            ->addColumn('slug', 'string', ['limit' => 255])
            ->addColumn('country', 'string', ['limit' => 50])
            ->addColumn('city', 'string', ['limit' => 100])
            ->addColumn('state_province', 'string', ['limit' => 100, 'null' => true])
            ->addColumn('logo_url', 'string', ['limit' => 500, 'null' => true])
            ->addColumn('website_url', 'string', ['limit' => 500, 'null' => true])
            ->addColumn('description', 'text', ['null' => true])

            // Rankings
            ->addColumn('ranking', 'integer', ['null' => true, 'comment' => 'QS/Times world ranking'])
            ->addColumn('ranking_source', 'string', ['limit' => 50, 'null' => true])

            // Tuition fees (annual, in local currency)
            ->addColumn('tuition_min', 'decimal', ['precision' => 12, 'scale' => 2, 'null' => true])
            ->addColumn('tuition_max', 'decimal', ['precision' => 12, 'scale' => 2, 'null' => true])
            ->addColumn('currency', 'string', ['limit' => 3, 'default' => 'USD'])

            // Admission requirements
            ->addColumn('acceptance_rate', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true])
            ->addColumn('min_gpa', 'decimal', ['precision' => 3, 'scale' => 2, 'null' => true])
            ->addColumn('min_ielts', 'decimal', ['precision' => 3, 'scale' => 1, 'null' => true])
            ->addColumn('min_toefl', 'integer', ['null' => true])
            ->addColumn('min_pte', 'integer', ['null' => true])

            // Platform availability
            ->addColumn('available_on_applyboard', 'boolean', ['default' => false])
            ->addColumn('available_on_edvoy', 'boolean', ['default' => false])
            ->addColumn('available_on_studygroup', 'boolean', ['default' => false])
            ->addColumn('available_on_adventus', 'boolean', ['default' => false])
            ->addColumn('available_on_bpp', 'boolean', ['default' => false])

            // Commission rates (percentage of first year tuition)
            ->addColumn('applyboard_commission', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true])
            ->addColumn('edvoy_commission', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true])
            ->addColumn('studygroup_commission', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true])
            ->addColumn('adventus_commission', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true])
            ->addColumn('bpp_commission', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true])

            // Processing times (days)
            ->addColumn('applyboard_processing_days', 'integer', ['null' => true])
            ->addColumn('edvoy_processing_days', 'integer', ['null' => true])
            ->addColumn('studygroup_processing_days', 'integer', ['null' => true])
            ->addColumn('adventus_processing_days', 'integer', ['null' => true])
            ->addColumn('bpp_processing_days', 'integer', ['null' => true])

            // Intake periods (JSON array: ["September", "January", "May"])
            ->addColumn('intake_periods', 'json', ['null' => true])

            // Program types offered (JSON array)
            ->addColumn('program_levels', 'json', ['null' => true, 'comment' => '["Bachelor", "Master", "PhD", "Diploma"]'])

            // Popular fields (JSON array)
            ->addColumn('popular_fields', 'json', ['null' => true])

            // Flags
            ->addColumn('popular', 'boolean', ['default' => false])
            ->addColumn('featured', 'boolean', ['default' => false])
            ->addColumn('is_active', 'boolean', ['default' => true])

            // Timestamps
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', [
                'default' => 'CURRENT_TIMESTAMP',
                'update' => 'CURRENT_TIMESTAMP'
            ])

            // Indexes
            ->addIndex(['slug'], ['unique' => true])
            ->addIndex(['country'])
            ->addIndex(['is_active'])
            ->addIndex(['popular'])
            ->addIndex(['available_on_applyboard'])
            ->addIndex(['available_on_edvoy'])
            ->create();
    }
}

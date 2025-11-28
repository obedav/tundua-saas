<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create service_tiers table
 * Stores service tier packages (Basic, Standard, Premium)
 */
class CreateServiceTiersTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('service_tiers');

        $table->addColumn('name', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('slug', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('description', 'text', ['null' => true])
              ->addColumn('base_price', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => false])
              ->addColumn('features', 'json', ['null' => true])
              ->addColumn('max_universities', 'integer', ['signed' => false, 'null' => false, 'default' => 3])
              ->addColumn('includes_essay_review', 'boolean', ['default' => false])
              ->addColumn('includes_sop_writing', 'boolean', ['default' => false])
              ->addColumn('includes_visa_support', 'boolean', ['default' => false])
              ->addColumn('includes_interview_coaching', 'boolean', ['default' => false])
              ->addColumn('support_level', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('is_active', 'boolean', ['default' => true])
              ->addColumn('is_featured', 'boolean', ['default' => false])
              ->addColumn('sort_order', 'integer', ['default' => 0])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['slug'], ['unique' => true])
              ->addIndex(['is_active'])
              ->addIndex(['is_featured'])
              ->addIndex(['sort_order'])
              ->create();
    }
}

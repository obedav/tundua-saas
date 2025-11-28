<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create addon_services table
 * Stores available add-on services (SOP writing, visa support, etc.)
 */
class CreateAddonServicesTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('addon_services');

        $table->addColumn('name', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('slug', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('description', 'text', ['null' => true])
              ->addColumn('price', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => false])
              ->addColumn('category', 'string', ['limit' => 100, 'null' => true, 'comment' => 'documents, planning, coaching, support'])
              ->addColumn('delivery_time_days', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('is_active', 'boolean', ['default' => true])
              ->addColumn('is_featured', 'boolean', ['default' => false])
              ->addColumn('sort_order', 'integer', ['default' => 0])
              ->addColumn('metadata', 'json', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['slug'], ['unique' => true])
              ->addIndex(['category'])
              ->addIndex(['is_active'])
              ->addIndex(['is_featured'])
              ->addIndex(['sort_order'])
              ->create();
    }
}

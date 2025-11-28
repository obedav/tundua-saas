<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create addon_orders table
 * Tracks purchases of add-on services by users
 */
class CreateAddonOrdersTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('addon_orders');

        $table->addColumn('application_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('addon_service_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('quantity', 'integer', ['signed' => false, 'default' => 1])
              ->addColumn('price_at_purchase', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => false])
              ->addColumn('total_amount', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => false])
              ->addColumn('status', 'enum', [
                  'values' => ['pending', 'in_progress', 'completed', 'cancelled'],
                  'default' => 'pending'
              ])
              ->addColumn('assigned_to', 'integer', ['signed' => false, 'null' => true, 'comment' => 'Admin user ID'])
              ->addColumn('started_at', 'timestamp', ['null' => true])
              ->addColumn('completed_at', 'timestamp', ['null' => true])
              ->addColumn('fulfillment_notes', 'text', ['null' => true])
              ->addColumn('deliverable_url', 'string', ['limit' => 500, 'null' => true])
              ->addColumn('delivered_at', 'timestamp', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['application_id'])
              ->addIndex(['addon_service_id'])
              ->addIndex(['user_id'])
              ->addIndex(['status'])
              ->addIndex(['assigned_to'])
              ->addIndex(['created_at'])
              ->addForeignKey('application_id', 'applications', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->addForeignKey('addon_service_id', 'addon_services', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->addForeignKey('assigned_to', 'users', 'id', ['delete' => 'SET_NULL', 'update' => 'CASCADE'])
              ->create();
    }
}

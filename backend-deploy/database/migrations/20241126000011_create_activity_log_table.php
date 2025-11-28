<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create activity_log table
 * Tracks user activities for activity feed
 */
class CreateActivityLogTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('activity_log');

        $table->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('entity_type', 'string', ['limit' => 50, 'null' => true, 'comment' => 'application, document, payment, etc.'])
              ->addColumn('entity_id', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('action', 'string', ['limit' => 100, 'null' => false, 'comment' => 'created, updated, deleted, submitted'])
              ->addColumn('description', 'text', ['null' => false])
              ->addColumn('old_values', 'json', ['null' => true])
              ->addColumn('new_values', 'json', ['null' => true])
              ->addColumn('ip_address', 'string', ['limit' => 45, 'null' => true])
              ->addColumn('user_agent', 'text', ['null' => true])
              ->addColumn('request_method', 'string', ['limit' => 10, 'null' => true])
              ->addColumn('request_url', 'string', ['limit' => 500, 'null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['user_id'])
              ->addIndex(['entity_type', 'entity_id'])
              ->addIndex(['action'])
              ->addIndex(['created_at'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->create();
    }
}

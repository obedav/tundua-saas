<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create notifications table
 * Stores in-app, email, and SMS notifications
 */
class CreateNotificationsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('notifications');

        $table->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('type', 'string', ['limit' => 100, 'null' => false, 'comment' => 'application_submitted, payment_completed, etc.'])
              ->addColumn('channel', 'enum', [
                  'values' => ['in_app', 'email', 'sms'],
                  'default' => 'in_app'
              ])
              ->addColumn('template_name', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('subject', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('message', 'text', ['null' => false])
              ->addColumn('data', 'json', ['null' => true])
              ->addColumn('status', 'enum', [
                  'values' => ['pending', 'sent', 'delivered', 'failed'],
                  'default' => 'pending'
              ])
              ->addColumn('sent_at', 'timestamp', ['null' => true])
              ->addColumn('delivered_at', 'timestamp', ['null' => true])
              ->addColumn('failed_at', 'timestamp', ['null' => true])
              ->addColumn('error_message', 'text', ['null' => true])
              ->addColumn('opened', 'boolean', ['default' => false])
              ->addColumn('opened_at', 'timestamp', ['null' => true])
              ->addColumn('clicked', 'boolean', ['default' => false])
              ->addColumn('clicked_at', 'timestamp', ['null' => true])
              ->addColumn('priority', 'enum', [
                  'values' => ['low', 'normal', 'high'],
                  'default' => 'normal'
              ])
              ->addColumn('related_entity_type', 'string', ['limit' => 50, 'null' => true, 'comment' => 'application, payment, document'])
              ->addColumn('related_entity_id', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['user_id'])
              ->addIndex(['type'])
              ->addIndex(['channel'])
              ->addIndex(['status'])
              ->addIndex(['opened'])
              ->addIndex(['priority'])
              ->addIndex(['created_at'])
              ->addIndex(['related_entity_type', 'related_entity_id'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->create();
    }
}

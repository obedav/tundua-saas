<?php

use Phinx\Migration\AbstractMigration;

class CreateAuditLogsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('audit_logs', ['id' => 'id', 'primary_key' => ['id']]);

        $table->addColumn('event_type', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('user_id', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('metadata', 'json', ['null' => true])
              ->addColumn('ip_address', 'string', ['limit' => 45, 'null' => true])
              ->addColumn('user_agent', 'text', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['user_id'])
              ->addIndex(['event_type'])
              ->addIndex(['ip_address'])
              ->addIndex(['created_at'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'SET_NULL', 'update' => 'CASCADE'])
              ->create();
    }
}

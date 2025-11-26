<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create users table
 */
class CreateUsersTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('users');

        $table->addColumn('uuid', 'string', ['limit' => 36, 'null' => false])
              ->addColumn('email', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('password_hash', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('first_name', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('last_name', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('phone', 'string', ['limit' => 20, 'null' => true])
              ->addColumn('role', 'enum', ['values' => ['user', 'admin', 'super_admin'], 'default' => 'user'])
              ->addColumn('email_verified', 'boolean', ['default' => false])
              ->addColumn('email_verification_token', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('email_verification_expires', 'datetime', ['null' => true])
              ->addColumn('password_reset_token', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('password_reset_expires', 'datetime', ['null' => true])
              ->addColumn('login_attempts', 'integer', ['default' => 0])
              ->addColumn('locked_until', 'datetime', ['null' => true])
              ->addColumn('last_login', 'datetime', ['null' => true])
              ->addColumn('referral_code', 'string', ['limit' => 50, 'null' => true])
              ->addColumn('google_id', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('avatar_url', 'string', ['limit' => 500, 'null' => true])
              ->addColumn('timezone', 'string', ['limit' => 50, 'null' => true, 'default' => 'UTC'])
              ->addColumn('language', 'string', ['limit' => 10, 'null' => true, 'default' => 'en'])
              ->addColumn('notification_preferences', 'json', ['null' => true])
              ->addColumn('is_active', 'boolean', ['default' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['uuid'], ['unique' => true])
              ->addIndex(['email'], ['unique' => true])
              ->addIndex(['referral_code'], ['unique' => true])
              ->addIndex(['google_id'])
              ->addIndex(['role'])
              ->addIndex(['email_verified'])
              ->addIndex(['is_active'])
              ->addIndex(['created_at'])
              ->create();
    }
}

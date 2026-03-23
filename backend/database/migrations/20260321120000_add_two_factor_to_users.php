<?php

use Phinx\Migration\AbstractMigration;

class AddTwoFactorToUsers extends AbstractMigration
{
    /**
     * Add two-factor authentication columns to users table
     */
    public function change()
    {
        $table = $this->table('users');

        $table->addColumn('two_factor_secret', 'string', [
            'limit' => 255,
            'null' => true,
            'default' => null,
            'after' => 'password_hash',
            'comment' => 'Encrypted TOTP secret (base32)',
        ]);

        $table->addColumn('two_factor_enabled', 'boolean', [
            'default' => false,
            'after' => 'two_factor_secret',
        ]);

        $table->addColumn('two_factor_recovery_codes', 'text', [
            'null' => true,
            'default' => null,
            'after' => 'two_factor_enabled',
            'comment' => 'JSON array of hashed recovery codes',
        ]);

        $table->addColumn('two_factor_confirmed_at', 'timestamp', [
            'null' => true,
            'default' => null,
            'after' => 'two_factor_recovery_codes',
        ]);

        $table->update();
    }
}

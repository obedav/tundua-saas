<?php

use Phinx\Migration\AbstractMigration;

/**
 * Ensure the email column on leads is nullable.
 *
 * The original create_leads_table migration defined email as NOT NULL.
 * Migration 20260623000001_leads_add_start_date already changes this, but
 * if that migration was not deployed to production before the apply-page
 * form began routing phone-only submissions (email = null), every phone-only
 * lead creation fails with:
 *   SQLSTATE[23000]: Integrity constraint violation: 1048 Column 'email' cannot be null
 *
 * This migration is idempotent — running it when email is already nullable is safe.
 */
class LeadsEnsureEmailNullable extends AbstractMigration
{
    public function change(): void
    {
        $this->table('leads')
            ->changeColumn('email', 'string', ['limit' => 255, 'null' => true, 'default' => null])
            ->update();
    }
}

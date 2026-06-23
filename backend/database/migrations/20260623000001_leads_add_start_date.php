<?php

use Phinx\Migration\AbstractMigration;

/**
 * Add start_date column and make email nullable.
 *
 * The initial lead form now only requires name, country, and start_date.
 * Email is collected in the post-submission details step and is no longer
 * required at lead creation time.
 */
class LeadsAddStartDate extends AbstractMigration
{
    public function change(): void
    {
        $this->table('leads')
            ->changeColumn('email', 'string', ['limit' => 255, 'null' => true, 'default' => null])
            ->changeColumn('source', 'string', ['limit' => 100, 'null' => true, 'default' => null])
            ->addColumn('start_date', 'string', [
                'limit'  => 50,
                'null'   => true,
                'after'  => 'country',
                'comment' => 'Intended study start month/year e.g. "September 2026"',
            ])
            ->update();
    }
}

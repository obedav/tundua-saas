<?php

use Phinx\Migration\AbstractMigration;

class FixCountryFieldLengths extends AbstractMigration
{
    /**
     * Fix country/nationality field lengths to accommodate full country names
     * The original migration used VARCHAR(3) for ISO codes, but the frontend
     * sends full country names like "Nigeria" or "United Kingdom"
     */
    public function change()
    {
        $table = $this->table('applications');

        // Change nationality from VARCHAR(3) to VARCHAR(100)
        $table->changeColumn('nationality', 'string', ['limit' => 100, 'null' => true]);

        // Change current_country from VARCHAR(3) to VARCHAR(100)
        $table->changeColumn('current_country', 'string', ['limit' => 100, 'null' => true]);

        // Change destination_country from VARCHAR(3) to VARCHAR(100)
        $table->changeColumn('destination_country', 'string', ['limit' => 100, 'null' => true]);

        $table->update();
    }
}

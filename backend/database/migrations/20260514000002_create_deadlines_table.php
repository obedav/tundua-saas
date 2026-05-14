<?php

use Phinx\Migration\AbstractMigration;

class CreateDeadlinesTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('deadlines');

        $table->addColumn('university_name', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('country', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('intake', 'string', ['limit' => 20, 'null' => false])
              ->addColumn('intake_year', 'integer', ['null' => false])
              ->addColumn('deadline_date', 'date', ['null' => false])
              ->addColumn('program_type', 'enum', ['values' => ['undergraduate', 'postgraduate', 'all'], 'default' => 'all'])
              ->addColumn('notes', 'string', ['limit' => 500, 'null' => true])
              ->addColumn('is_active', 'boolean', ['default' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['country'])
              ->addIndex(['deadline_date'])
              ->addIndex(['is_active'])
              ->create();
    }
}

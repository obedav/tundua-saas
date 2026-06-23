<?php

use Phinx\Migration\AbstractMigration;

class LeadsAddLeadScore extends AbstractMigration
{
    public function change(): void
    {
        $this->table('leads')
            ->addColumn('lead_score', 'integer', [
                'null'    => false,
                'default' => 0,
                'after'   => 'status',
                'comment' => 'Priority score set by LeadScoringService on creation and on country/start_date update. Higher = hotter lead.',
            ])
            ->addIndex(['lead_score'])
            ->update();
    }
}

<?php

use Phinx\Migration\AbstractMigration;

class AddOfferReceivedToApplicationsStatus extends AbstractMigration
{
    public function up()
    {
        // Add approved and offer_received to the status enum, and offer_received_at timestamp
        $this->execute("
            ALTER TABLE applications
            MODIFY COLUMN status ENUM(
                'draft', 'payment_pending', 'submitted', 'under_review',
                'in_progress', 'approved', 'offer_received', 'completed',
                'rejected', 'cancelled', 'expired'
            ) NOT NULL DEFAULT 'draft'
        ");

        $table = $this->table('applications');
        $table->addColumn('offer_received_at', 'timestamp', ['null' => true, 'after' => 'approved_at'])
              ->update();
    }

    public function down()
    {
        $table = $this->table('applications');
        $table->removeColumn('offer_received_at')->update();

        $this->execute("
            ALTER TABLE applications
            MODIFY COLUMN status ENUM(
                'draft', 'payment_pending', 'submitted', 'under_review',
                'in_progress', 'completed', 'rejected', 'cancelled', 'expired'
            ) NOT NULL DEFAULT 'draft'
        ");
    }
}

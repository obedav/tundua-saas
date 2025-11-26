<?php

use Phinx\Migration\AbstractMigration;

class CreatePaymentsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('payments');

        $table->addColumn('reference', 'string', ['limit' => 100, 'null' => false])
              ->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('application_id', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('amount', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => false])
              ->addColumn('currency', 'string', ['limit' => 3, 'default' => 'NGN'])
              ->addColumn('payment_method', 'enum', ['values' => ['stripe', 'paystack', 'bank_transfer'], 'null' => false])
              ->addColumn('status', 'enum', [
                  'values' => ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
                  'default' => 'pending'
              ])
              ->addColumn('provider_payment_id', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('provider_customer_id', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('provider_response', 'json', ['null' => true])
              ->addColumn('failure_reason', 'text', ['null' => true])
              ->addColumn('refund_amount', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => true])
              ->addColumn('refund_reason', 'text', ['null' => true])
              ->addColumn('refunded_at', 'timestamp', ['null' => true])
              ->addColumn('metadata', 'json', ['null' => true])
              ->addColumn('ip_address', 'string', ['limit' => 45, 'null' => true])
              ->addColumn('user_agent', 'text', ['null' => true])
              ->addColumn('completed_at', 'timestamp', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['reference'], ['unique' => true])
              ->addIndex(['user_id'])
              ->addIndex(['application_id'])
              ->addIndex(['status'])
              ->addIndex(['payment_method'])
              ->addIndex(['provider_payment_id'])
              ->addIndex(['created_at'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->addForeignKey('application_id', 'applications', 'id', ['delete' => 'SET_NULL', 'update' => 'CASCADE'])
              ->create();
    }
}

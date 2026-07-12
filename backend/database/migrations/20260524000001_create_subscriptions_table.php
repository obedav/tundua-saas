<?php

use Phinx\Migration\AbstractMigration;

class CreateSubscriptionsTable extends AbstractMigration
{
    public function change()
    {
        // Add subscription columns to users
        $users = $this->table('users');
        $users->addColumn('subscription_plan', 'enum', [
                  'values' => ['free', 'scholar', 'fellow'],
                  'default' => 'free',
                  'after' => 'is_active',
              ])
              ->addColumn('subscription_expires_at', 'datetime', [
                  'null' => true,
                  'after' => 'subscription_plan',
              ])
              ->addIndex(['subscription_plan'])
              ->update();

        // Subscriptions table
        $table = $this->table('subscriptions');
        $table->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('plan', 'enum', ['values' => ['scholar', 'fellow'], 'default' => 'scholar'])
              ->addColumn('paystack_subscription_code', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('paystack_customer_code', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('email_token', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('status', 'enum', [
                  'values' => ['active', 'non_renewing', 'cancelled', 'expired'],
                  'default' => 'active',
              ])
              ->addColumn('amount', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => false])
              ->addColumn('currency', 'string', ['limit' => 3, 'default' => 'NGN'])
              ->addColumn('next_payment_date', 'datetime', ['null' => true])
              ->addColumn('cancelled_at', 'datetime', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['user_id'])
              ->addIndex(['paystack_subscription_code'], ['unique' => true])
              ->addIndex(['status'])
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->create();
    }
}

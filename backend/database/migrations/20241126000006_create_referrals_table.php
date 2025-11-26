<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create referrals table
 * Manages referral program tracking and rewards
 */
class CreateReferralsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('referrals');

        $table->addColumn('referrer_user_id', 'integer', ['signed' => false, 'null' => false, 'comment' => 'User who made the referral'])
              ->addColumn('referred_email', 'string', ['limit' => 255, 'null' => false, 'comment' => 'Email of referred person'])
              ->addColumn('referred_user_id', 'integer', ['signed' => false, 'null' => true, 'comment' => 'User ID once they sign up'])
              ->addColumn('referral_code', 'string', ['limit' => 50, 'null' => false, 'comment' => 'Unique referral code'])
              ->addColumn('status', 'enum', [
                  'values' => ['pending', 'signed_up', 'converted', 'rewarded'],
                  'default' => 'pending'
              ])
              ->addColumn('reward_type', 'string', ['limit' => 50, 'default' => 'discount', 'comment' => 'discount, cash, credit'])
              ->addColumn('reward_amount', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 10000.00])
              ->addColumn('reward_currency', 'string', ['limit' => 3, 'default' => 'NGN'])
              ->addColumn('reward_claimed', 'boolean', ['default' => false])
              ->addColumn('reward_claimed_at', 'timestamp', ['null' => true])
              ->addColumn('signed_up_at', 'timestamp', ['null' => true])
              ->addColumn('converted_at', 'timestamp', ['null' => true, 'comment' => 'When referred user made their first purchase'])
              ->addColumn('conversion_value', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => true, 'comment' => 'Value of first purchase'])
              ->addColumn('referral_source', 'string', ['limit' => 100, 'null' => true, 'comment' => 'email, social, direct_link'])
              ->addColumn('metadata', 'json', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['referrer_user_id'])
              ->addIndex(['referred_email'])
              ->addIndex(['referred_user_id'])
              ->addIndex(['referral_code'], ['unique' => true])
              ->addIndex(['status'])
              ->addIndex(['created_at'])
              ->addForeignKey('referrer_user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
              ->addForeignKey('referred_user_id', 'users', 'id', ['delete' => 'SET_NULL', 'update' => 'CASCADE'])
              ->create();
    }
}

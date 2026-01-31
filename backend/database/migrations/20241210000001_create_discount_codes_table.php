<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create discount_codes table
 * Stores discount/promo codes for pricing
 */
class CreateDiscountCodesTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('discount_codes');

        $table->addColumn('code', 'string', ['limit' => 50, 'null' => false])
              ->addColumn('description', 'string', ['limit' => 255, 'null' => true])
              ->addColumn('percentage', 'integer', ['signed' => false, 'null' => false, 'comment' => 'Discount percentage (1-100)'])
              ->addColumn('max_uses', 'integer', ['signed' => false, 'null' => true, 'comment' => 'Maximum number of times code can be used (null = unlimited)'])
              ->addColumn('used_count', 'integer', ['signed' => false, 'default' => 0])
              ->addColumn('min_amount', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => true, 'comment' => 'Minimum order amount for code to apply'])
              ->addColumn('max_discount', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => true, 'comment' => 'Maximum discount amount'])
              ->addColumn('starts_at', 'timestamp', ['null' => true])
              ->addColumn('expires_at', 'timestamp', ['null' => true])
              ->addColumn('is_active', 'boolean', ['default' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['code'], ['unique' => true])
              ->addIndex(['is_active'])
              ->addIndex(['expires_at'])
              ->create();
    }
}

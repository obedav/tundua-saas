<?php

use Phinx\Migration\AbstractMigration;

/**
 * Add multi-currency pricing support to service_tiers table
 * Adds USD pricing column and custom pricing flag for Enterprise tier
 */
class AddMultiCurrencyPricing extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('service_tiers');

        // Add USD price column (base_price remains as NGN price)
        $table->addColumn('price_usd', 'decimal', [
            'precision' => 10,
            'scale' => 2,
            'null' => true,
            'default' => null,
            'after' => 'base_price'
        ]);

        // Add flag for custom/quote-based pricing (Elite tier)
        $table->addColumn('is_custom_pricing', 'boolean', [
            'default' => false,
            'after' => 'price_usd'
        ]);

        // Add billing type (one_time, monthly, yearly)
        $table->addColumn('billing_type', 'string', [
            'limit' => 20,
            'default' => 'one_time',
            'after' => 'is_custom_pricing'
        ]);

        $table->update();
    }
}

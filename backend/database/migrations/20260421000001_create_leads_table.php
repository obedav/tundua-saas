<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create leads table.
 *
 * Captures submissions from public funnel forms (apply, blog inline form, exit-intent)
 * before a user creates an account. Separate from `users` on purpose — most leads
 * never convert, and mixing them into `users` would pollute auth queries and stats.
 */
class CreateLeadsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('leads');

        $table
            ->addColumn('name', 'string', ['limit' => 120, 'null' => false])
            ->addColumn('email', 'string', ['limit' => 255, 'null' => false])
            ->addColumn('phone', 'string', ['limit' => 50, 'null' => true])
            ->addColumn('country', 'string', ['limit' => 100, 'null' => true])
            ->addColumn('budget', 'string', ['limit' => 100, 'null' => true])
            ->addColumn('message', 'text', ['null' => true])

            // Which surface generated this lead. Used for funnel analysis and to
            // tell the admin email which form the person filled in.
            ->addColumn('source', 'string', ['limit' => 100, 'null' => false])

            // Attribution — captured at landing time, persisted in localStorage,
            // sent with the submission. Mandatory before spending on paid traffic.
            ->addColumn('utm_source', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('utm_medium', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('utm_campaign', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('utm_term', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('utm_content', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('gclid', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('fbclid', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('landing_page', 'string', ['limit' => 500, 'null' => true])
            ->addColumn('referrer', 'string', ['limit' => 500, 'null' => true])

            // Audit context — helps spot spam bursts from a single IP.
            ->addColumn('ip_address', 'string', ['limit' => 45, 'null' => true])
            ->addColumn('user_agent', 'text', ['null' => true])

            // Simple CRM state machine. Start as `new`, admin moves forward.
            ->addColumn('status', 'enum', [
                'values'  => ['new', 'contacted', 'qualified', 'converted', 'lost'],
                'default' => 'new',
            ])
            ->addColumn('notes', 'text', ['null' => true, 'comment' => 'Internal notes from the advisor working the lead'])

            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])

            ->addIndex(['email'])
            ->addIndex(['source'])
            ->addIndex(['status'])
            ->addIndex(['created_at'])
            ->addIndex(['utm_source', 'utm_campaign'])
            ->create();
    }
}

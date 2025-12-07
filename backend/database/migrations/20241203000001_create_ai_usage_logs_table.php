<?php

use Phinx\Migration\AbstractMigration;

/**
 * AI Usage Logs Migration
 *
 * Tracks AI API usage for:
 * - Cost monitoring and budgeting
 * - User analytics and insights
 * - Rate limiting and quota enforcement
 * - Future billing integration
 */
class CreateAiUsageLogsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('ai_usage_logs', ['id' => 'id', 'primary_key' => ['id']]);

        $table->addColumn('user_id', 'integer', ['signed' => false, 'null' => false])
              ->addColumn('action_type', 'string', ['limit' => 50, 'null' => false, 'comment' => 'form_suggestions, check_documents, application_tips, etc.'])
              ->addColumn('tokens_input', 'integer', ['signed' => false, 'null' => false, 'default' => 0, 'comment' => 'Input tokens used'])
              ->addColumn('tokens_output', 'integer', ['signed' => false, 'null' => false, 'default' => 0, 'comment' => 'Output tokens generated'])
              ->addColumn('cost_usd', 'decimal', ['precision' => 10, 'scale' => 6, 'null' => false, 'default' => 0, 'comment' => 'Cost in USD'])
              ->addColumn('duration_ms', 'integer', ['signed' => false, 'null' => false, 'default' => 0, 'comment' => 'Response time in milliseconds'])
              ->addColumn('success', 'boolean', ['null' => false, 'default' => true, 'comment' => 'Whether request succeeded'])
              ->addColumn('error_message', 'text', ['null' => true, 'comment' => 'Error details if failed'])
              ->addColumn('metadata', 'json', ['null' => true, 'comment' => 'Additional context (model, timestamp, etc.)'])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])

              // Indexes for performance
              ->addIndex(['user_id'])
              ->addIndex(['action_type'])
              ->addIndex(['created_at'])
              ->addIndex(['success'])
              ->addIndex(['user_id', 'created_at'], ['name' => 'user_date_idx'])

              // Foreign key
              ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])

              ->create();
    }
}

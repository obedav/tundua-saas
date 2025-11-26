<?php

use Phinx\Migration\AbstractMigration;

/**
 * Create knowledge_base_articles table
 * Stores help center and documentation articles
 */
class CreateKnowledgeBaseArticlesTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('knowledge_base_articles', ['id' => 'id', 'primary_key' => 'id', 'signed' => false]);

        $table->addColumn('title', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('slug', 'string', ['limit' => 255, 'null' => false])
              ->addColumn('content', 'text', ['null' => false, 'limit' => \Phinx\Db\Adapter\MysqlAdapter::TEXT_LONG])
              ->addColumn('excerpt', 'text', ['null' => true])
              ->addColumn('category', 'string', ['limit' => 100, 'null' => true])
              ->addColumn('tags', 'json', ['null' => true])
              ->addColumn('author_id', 'integer', ['signed' => false, 'null' => true])
              ->addColumn('is_published', 'boolean', ['default' => false])
              ->addColumn('is_featured', 'boolean', ['default' => false])
              ->addColumn('view_count', 'integer', ['signed' => false, 'default' => 0])
              ->addColumn('helpful_count', 'integer', ['signed' => false, 'default' => 0])
              ->addColumn('not_helpful_count', 'integer', ['signed' => false, 'default' => 0])
              ->addColumn('metadata', 'json', ['null' => true])
              ->addColumn('published_at', 'timestamp', ['null' => true])
              ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
              ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
              ->addIndex(['slug'], ['unique' => true])
              ->addIndex(['category'])
              ->addIndex(['is_published'])
              ->addIndex(['is_featured'])
              ->addIndex(['published_at'])
              ->addIndex(['view_count'])
              ->addForeignKey('author_id', 'users', 'id', ['delete' => 'SET_NULL', 'update' => 'CASCADE'])
              ->create();
    }
}

<?php

use Phinx\Migration\AbstractMigration;

class AddCountryTargetToKnowledgeBaseArticles extends AbstractMigration
{
    public function change(): void
    {
        $this->table('knowledge_base_articles')
            ->addColumn('country_target', 'string', [
                'limit'   => 50,
                'null'    => true,
                'after'   => 'category',
                'comment' => 'ISO-style origin country slug (nigeria, ghana, etc.) for audience-targeted articles. NULL means relevant to all.',
            ])
            ->addIndex(['country_target'])
            ->update();
    }
}

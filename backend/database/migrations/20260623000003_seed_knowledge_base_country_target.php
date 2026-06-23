<?php

use Phinx\Migration\AbstractMigration;

class SeedKnowledgeBaseCountryTarget extends AbstractMigration
{
    private const COUNTRY_PATTERNS = [
        'nigeria'      => ['%nigerian%', '%nigeria%'],
        'ghana'        => ['%ghanaian%', '%ghana%'],
        'kenya'        => ['%kenyan%', '%kenya%'],
        'egypt'        => ['%egyptian%', '%egypt%'],
        'morocco'      => ['%moroccan%', '%morocco%'],
        'zambia'       => ['%zambian%', '%zambia%'],
        'uganda'       => ['%ugandan%', '%uganda%'],
        'tanzania'     => ['%tanzanian%', '%tanzania%'],
        'south-africa' => ['%south african%', '%south africa%'],
    ];

    public function up(): void
    {
        foreach (self::COUNTRY_PATTERNS as $country => $patterns) {
            $conditions = array_map(
                static fn(string $p): string => "LOWER(title) LIKE '{$p}'",
                $patterns
            );
            $where = implode(' OR ', $conditions);
            $this->execute(
                "UPDATE knowledge_base_articles
                 SET country_target = '{$country}'
                 WHERE ({$where})
                   AND country_target IS NULL
                   AND is_published = 1"
            );
        }
    }

    public function down(): void
    {
        // The column-adding migration's rollback drops the column entirely,
        // so there is nothing to undo here independently.
    }
}

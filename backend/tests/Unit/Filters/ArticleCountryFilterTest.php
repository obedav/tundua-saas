<?php

namespace Tundua\Tests\Unit\Filters;

use Illuminate\Database\Capsule\Manager as Capsule;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Tundua\Filters\ArticleCountryFilter;
use Tundua\Models\KnowledgeBaseArticle;

class ArticleCountryFilterTest extends TestCase
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        $capsule = new Capsule();
        $capsule->addConnection([
            'driver'   => 'sqlite',
            'database' => ':memory:',
            'prefix'   => '',
        ]);
        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }

    protected function setUp(): void
    {
        parent::setUp();

        Capsule::schema()->dropIfExists('knowledge_base_articles');
        Capsule::schema()->create('knowledge_base_articles', static function ($table): void {
            $table->increments('id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->boolean('is_published')->default(false);
            $table->string('country_target', 50)->nullable();
            $table->timestamps();
        });

        KnowledgeBaseArticle::create([
            'title'          => 'Cheapest UK Universities for Nigerian Students',
            'slug'           => 'uk-universities-nigerian',
            'is_published'   => true,
            'country_target' => 'nigeria',
        ]);

        KnowledgeBaseArticle::create([
            'title'          => 'How to Get a Ghana Study Permit',
            'slug'           => 'ghana-study-permit',
            'is_published'   => true,
            'country_target' => 'ghana',
        ]);

        KnowledgeBaseArticle::create([
            'title'          => 'How to Upload Documents Correctly',
            'slug'           => 'document-upload-guide',
            'is_published'   => true,
            'country_target' => null,
        ]);
    }

    #[Test]
    public function articles_with_ghana_country_target_appear_in_ghana_filter(): void
    {
        $filter  = new ArticleCountryFilter();
        $results = $filter->apply(KnowledgeBaseArticle::where('is_published', true), 'ghana')->get();

        $slugs = $results->pluck('slug')->toArray();

        $this->assertContains('ghana-study-permit', $slugs);
        $this->assertNotContains('uk-universities-nigerian', $slugs);
        $this->assertNotContains('document-upload-guide', $slugs);
    }
}

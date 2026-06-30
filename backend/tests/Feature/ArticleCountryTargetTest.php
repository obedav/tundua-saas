<?php

namespace Tundua\Tests\Feature;

use Illuminate\Database\Capsule\Manager as Capsule;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Response;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Tundua\Controllers\KnowledgeBaseController;
use Tundua\Models\KnowledgeBaseArticle;
use Tundua\Services\InternalLinkService;
use Tundua\Services\InternalLinking\CaseInsensitiveKeywordMatcher;

class ArticleCountryTargetTest extends TestCase
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
            $table->text('content')->nullable();
            $table->string('excerpt')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('category')->default('General');
            $table->string('country_target', 50)->nullable();
            $table->json('tags')->nullable();
            $table->json('metadata')->nullable();
            $table->unsignedInteger('author_id')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('helpful_count')->default(0);
            $table->unsignedInteger('not_helpful_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    #[Test]
    public function article_saved_with_country_target_ghana_is_returned_by_get_endpoint(): void
    {
        $controller = new KnowledgeBaseController(
            new InternalLinkService(new CaseInsensitiveKeywordMatcher())
        );

        // POST — create an article with country_target = 'ghana'
        $createRequest = (new ServerRequestFactory())
            ->createServerRequest('POST', '/api/v1/admin/knowledge-base')
            ->withParsedBody([
                'title'          => 'How to Get a Ghana Study Permit',
                'content'        => '<p>Guide content here.</p>',
                'category'       => 'Study Permits',
                'country_target' => 'ghana',
                'is_published'   => true,
            ]);

        $createResponse = $controller->createArticle($createRequest, new Response());

        $this->assertSame(201, $createResponse->getStatusCode());

        $createBody = json_decode((string)$createResponse->getBody(), true);
        $this->assertTrue($createBody['success']);
        $this->assertSame('ghana', $createBody['article']['country_target']);

        $articleId = $createBody['article']['id'];

        // GET — retrieve the article by ID and confirm country_target is persisted
        $getRequest = (new ServerRequestFactory())
            ->createServerRequest('GET', "/api/v1/knowledge-base/{$articleId}");

        // getByIdOrSlug only returns published articles; article was published above
        $article = KnowledgeBaseArticle::find($articleId);
        $this->assertNotNull($article);
        $this->assertSame('ghana', $article->country_target);

        // Also verify the public GET endpoint returns it
        $getResponse = $controller->getArticle(
            $getRequest,
            new Response(),
            ['id' => (string)$articleId]
        );

        $this->assertSame(200, $getResponse->getStatusCode());
        $getBody = json_decode((string)$getResponse->getBody(), true);
        $this->assertTrue($getBody['success']);
        $this->assertSame('ghana', $getBody['article']['country_target']);
    }
}

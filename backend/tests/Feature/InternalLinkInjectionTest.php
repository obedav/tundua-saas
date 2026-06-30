<?php

namespace Tundua\Tests\Feature;

use Illuminate\Database\Capsule\Manager as Capsule;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Response;
use Tundua\Controllers\KnowledgeBaseController;
use Tundua\Models\KnowledgeBaseArticle;
use Tundua\Services\InternalLinkService;
use Tundua\Services\InternalLinking\CaseInsensitiveKeywordMatcher;

/**
 * Verifies that getArticle() enriches the body HTML with up to 3 contextual
 * internal links sourced from a single candidate query.
 *
 * Uses an SQLite in-memory database — no network, no external DB required.
 */
class InternalLinkInjectionTest extends TestCase
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

    private function makeController(): KnowledgeBaseController
    {
        return new KnowledgeBaseController(
            new InternalLinkService(new CaseInsensitiveKeywordMatcher())
        );
    }

    private function makeArticle(string $slug, string $content, array $tags, bool $published = true): KnowledgeBaseArticle
    {
        $a = new KnowledgeBaseArticle();
        $a->title       = $slug;
        $a->slug        = $slug;
        $a->content     = $content;
        $a->category    = 'General';
        $a->tags        = $tags;
        $a->is_published = $published;
        $a->save();
        return $a;
    }

    #[Test]
    public function get_article_injects_link_when_body_contains_candidate_keyword(): void
    {
        // Candidate article: its tag "student visa" appears in the current article's body.
        $this->makeArticle(
            'uk-student-visa',
            '<p>Everything about UK visas.</p>',
            ['student visa', 'uk'],
        );

        // Current article: body contains "student visa" — a keyword from the candidate.
        $this->makeArticle(
            'how-to-study-abroad',
            '<p>Learn how to get a student visa for the UK today.</p>',
            ['study abroad'],
        );

        $request = (new ServerRequestFactory())
            ->createServerRequest('GET', '/api/v1/knowledge-base/how-to-study-abroad');

        $response = $this->makeController()->getArticle(
            $request,
            new Response(),
            ['id' => 'how-to-study-abroad'],
        );

        $this->assertSame(200, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $this->assertTrue($body['success']);

        $content = $body['article']['content'];

        // The keyword "student visa" must be wrapped with a link to the candidate.
        $this->assertStringContainsString('<a href="/blog/uk-student-visa">student visa</a>', $content);

        // The current article must never link to itself.
        $this->assertStringNotContainsString('/blog/how-to-study-abroad', $content);
    }

    #[Test]
    public function get_article_returns_body_unchanged_when_no_keyword_matches(): void
    {
        $this->makeArticle('visa-tips', '<p>Visa tips here.</p>', ['visa tips']);

        $this->makeArticle(
            'scholarships-guide',
            '<p>Find scholarships for your studies.</p>',
            ['scholarships'],
        );

        $request = (new ServerRequestFactory())
            ->createServerRequest('GET', '/api/v1/knowledge-base/scholarships-guide');

        $response = $this->makeController()->getArticle(
            $request,
            new Response(),
            ['id' => 'scholarships-guide'],
        );

        $this->assertSame(200, $response->getStatusCode());

        $body = json_decode((string)$response->getBody(), true);
        $content = $body['article']['content'];

        // "visa tips" does not appear in the scholarships body — no link injected.
        $this->assertStringNotContainsString('<a ', $content);
        $this->assertSame('<p>Find scholarships for your studies.</p>', $content);
    }

    #[Test]
    public function get_article_never_injects_more_than_three_links(): void
    {
        // Four candidates whose keywords all appear in the current body.
        $this->makeArticle('a-article', '<p>a article.</p>', ['alpha']);
        $this->makeArticle('b-article', '<p>b article.</p>', ['beta']);
        $this->makeArticle('c-article', '<p>c article.</p>', ['gamma']);
        $this->makeArticle('d-article', '<p>d article.</p>', ['delta']);

        $this->makeArticle(
            'current-article',
            '<p>alpha beta gamma delta all appear here.</p>',
            [],
        );

        $request = (new ServerRequestFactory())
            ->createServerRequest('GET', '/api/v1/knowledge-base/current-article');

        $response = $this->makeController()->getArticle(
            $request,
            new Response(),
            ['id' => 'current-article'],
        );

        $body    = json_decode((string)$response->getBody(), true);
        $content = $body['article']['content'];

        // Count injected <a> tags — must not exceed 3.
        $this->assertSame(3, substr_count($content, '<a href='));
    }

    #[Test]
    public function get_article_returns_unchanged_body_when_candidate_is_unpublished(): void
    {
        // Unpublished article — must never appear as a candidate.
        $this->makeArticle('draft-article', '<p>Draft.</p>', ['student visa'], false);

        $this->makeArticle(
            'published-article',
            '<p>Learn about the student visa process.</p>',
            ['process'],
        );

        $request = (new ServerRequestFactory())
            ->createServerRequest('GET', '/api/v1/knowledge-base/published-article');

        $response = $this->makeController()->getArticle(
            $request,
            new Response(),
            ['id' => 'published-article'],
        );

        $body    = json_decode((string)$response->getBody(), true);
        $content = $body['article']['content'];

        // "student visa" keyword belongs to an unpublished article — no link.
        $this->assertStringNotContainsString('<a ', $content);
    }
}

<?php

namespace Tundua\Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Tundua\Services\InternalLinkService;
use Tundua\Services\InternalLinking\CaseInsensitiveKeywordMatcher;

class InternalLinkServiceTest extends TestCase
{
    private InternalLinkService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InternalLinkService(new CaseInsensitiveKeywordMatcher());
    }

    private function makeCandidate(string $slug, array $keywords): array
    {
        return ['slug' => $slug, 'url' => '/blog/' . $slug, 'keywords' => $keywords];
    }

    // ── Self-link prevention ──────────────────────────────────────────────────

    #[Test]
    public function it_does_not_link_a_page_to_itself(): void
    {
        $body = '<p>Cheapest universities in the UK for Nigerian students</p>';

        $candidates = [
            $this->makeCandidate('cheapest-uk-universities', ['Cheapest universities']),
        ];

        $result = $this->service->inject($body, $candidates, 'cheapest-uk-universities');

        $this->assertStringNotContainsString('<a href=', $result);
    }

    // ── Max 3 links ───────────────────────────────────────────────────────────

    #[Test]
    public function it_injects_exactly_three_links_when_more_than_three_candidates_match(): void
    {
        $body = '<p>Study in UK and Canada and Australia and Germany and Ireland</p>';

        $candidates = [
            $this->makeCandidate('uk-guide',        ['UK']),
            $this->makeCandidate('canada-guide',    ['Canada']),
            $this->makeCandidate('australia-guide', ['Australia']),
            $this->makeCandidate('germany-guide',   ['Germany']),
            $this->makeCandidate('ireland-guide',   ['Ireland']),
        ];

        $result = $this->service->inject($body, $candidates, 'current-article');

        $this->assertSame(3, substr_count($result, '<a href='));
    }

    // ── No duplicate targets ──────────────────────────────────────────────────

    #[Test]
    public function it_injects_at_most_one_link_per_target_slug(): void
    {
        // Same slug passed twice with different matching keywords
        $body = '<p>Learn about UK universities and British higher education abroad</p>';

        $candidates = [
            ['slug' => 'uk-guide', 'url' => '/blog/uk-guide', 'keywords' => ['UK universities']],
            ['slug' => 'uk-guide', 'url' => '/blog/uk-guide', 'keywords' => ['British higher education']],
        ];

        $result = $this->service->inject($body, $candidates, 'other-article');

        $this->assertSame(1, substr_count($result, 'href="/blog/uk-guide"'));
    }

    // ── Happy path ────────────────────────────────────────────────────────────

    #[Test]
    public function it_wraps_a_matched_keyword_in_an_anchor_tag(): void
    {
        $body = '<p>How to apply for a UK student visa in 2026</p>';

        $candidates = [
            $this->makeCandidate('uk-student-visa', ['UK student visa']),
        ];

        $result = $this->service->inject($body, $candidates, 'other-article');

        $this->assertStringContainsString(
            '<a href="/blog/uk-student-visa">UK student visa</a>',
            $result
        );
    }

    // ── No nesting inside existing anchors ───────────────────────────────────

    #[Test]
    public function it_does_not_nest_a_link_inside_an_existing_anchor(): void
    {
        $body = '<p>See our <a href="/existing">UK student visa guide</a> for details</p>';

        $candidates = [
            $this->makeCandidate('uk-student-visa', ['UK student visa']),
        ];

        $result = $this->service->inject($body, $candidates, 'other-article');

        $this->assertStringNotContainsString('href="/blog/uk-student-visa"', $result);
    }
}

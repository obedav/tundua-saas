<?php

namespace Tundua\Services;

use Tundua\Services\InternalLinking\KeywordMatcherInterface;

class InternalLinkService
{
    public function __construct(
        private readonly KeywordMatcherInterface $matcher,
        private readonly int $maxLinks = 3,
    ) {}

    /**
     * Inject up to $maxLinks contextual internal links into $body.
     *
     * Usable for both blog articles and knowledge-base pages — pass the
     * current page's slug as $currentSlug to prevent self-linking.
     *
     * @param string $body        HTML article body
     * @param array  $candidates  [['slug'=>string, 'url'=>string, 'keywords'=>string[]], ...]
     * @param string $currentSlug Slug of the page being rendered
     * @return string             Body with links injected
     */
    public function inject(string $body, array $candidates, string $currentSlug): string
    {
        $eligible = array_values(
            array_filter($candidates, static fn(array $c): bool => $c['slug'] !== $currentSlug)
        );

        $matches = $this->matcher->findMatches($body, $eligible);

        $selected = [];
        $seen = [];

        foreach ($matches as $match) {
            if (isset($seen[$match['slug']]) || count($selected) >= $this->maxLinks) {
                continue;
            }
            $seen[$match['slug']] = true;
            $selected[] = $match;
        }

        return $this->applyLinks($body, $selected);
    }

    private function applyLinks(string $body, array $selected): string
    {
        foreach ($selected as $match) {
            $pattern  = '/<a\b[^>]*>.*?<\/a>|(' . preg_quote($match['keyword'], '/') . ')/is';
            $url      = htmlspecialchars($match['url'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $replaced = false;

            $body = preg_replace_callback(
                $pattern,
                static function (array $m) use ($url, &$replaced): string {
                    // Group 1 is set only when the keyword branch matched (not the <a> branch)
                    if (!empty($m[1]) && !$replaced) {
                        $replaced = true;
                        return '<a href="' . $url . '">' . $m[1] . '</a>';
                    }
                    return $m[0];
                },
                $body
            ) ?? $body;
        }

        return $body;
    }
}

<?php

namespace Tundua\Services\InternalLinking;

class CaseInsensitiveKeywordMatcher implements KeywordMatcherInterface
{
    public function findMatches(string $body, array $candidates): array
    {
        // Remove existing <a>...</a> blocks so we never match text inside them
        $searchable = preg_replace('/<a\b[^>]*>.*?<\/a>/is', '', $body) ?? $body;

        $matches = [];

        foreach ($candidates as $candidate) {
            foreach ($candidate['keywords'] as $keyword) {
                if ($keyword === '') {
                    continue;
                }

                $pos = stripos($searchable, $keyword);

                if ($pos !== false) {
                    $matches[] = [
                        'slug'    => $candidate['slug'],
                        'url'     => $candidate['url'],
                        'keyword' => $keyword,
                        'offset'  => $pos,
                    ];
                    break; // First matching keyword wins for this candidate
                }
            }
        }

        // Sort by position so earlier-in-article links are preferred when capping at 3
        usort($matches, static fn(array $a, array $b): int => $a['offset'] - $b['offset']);

        return $matches;
    }
}

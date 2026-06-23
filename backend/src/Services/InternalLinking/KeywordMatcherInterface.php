<?php

namespace Tundua\Services\InternalLinking;

interface KeywordMatcherInterface
{
    /**
     * Scan $body for the first matching keyword for each candidate.
     *
     * Implementations must not search inside existing <a> tags.
     * Only the first matching keyword per candidate should be returned.
     *
     * @param string $body       HTML article body
     * @param array  $candidates Each element: ['slug' => string, 'url' => string, 'keywords' => string[]]
     * @return array             Sorted by earliest occurrence ascending:
     *                           [['slug'=>string, 'url'=>string, 'keyword'=>string, 'offset'=>int], ...]
     */
    public function findMatches(string $body, array $candidates): array;
}

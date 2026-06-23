<?php

namespace Tundua\Scoring;

/**
 * LeadScoringRules — the single place where scoring rules are declared.
 *
 * Open/Closed: to add a new rule, add one entry to the array returned by all().
 * LeadScoringService never needs editing.
 *
 * Each rule is an array with:
 *   name   string   — identifier (for logging/debugging)
 *   points int      — added to the score when test returns true
 *   test   \Closure — receives the lead data array, returns bool
 */
class LeadScoringRules
{
    public static function all(): array
    {
        return [
            [
                'name'   => 'origin_nigeria',
                'points' => 10,
                'test'   => static function (array $d): bool {
                    return strtolower(trim((string)($d['country'] ?? ''))) === 'nigeria';
                },
            ],
            [
                'name'   => 'origin_africa_expansion',
                'points' => 15,
                'test'   => static function (array $d): bool {
                    return in_array(
                        strtolower(trim((string)($d['country'] ?? ''))),
                        ['ghana', 'egypt', 'morocco', 'kenya', 'zambia'],
                        true
                    );
                },
            ],
            [
                'name'   => 'destination_uk_canada',
                'points' => 10,
                'test'   => static function (array $d): bool {
                    $page = strtolower((string)($d['landing_page'] ?? ''));
                    $ref  = strtolower((string)($d['referrer'] ?? ''));
                    // Match path segments to avoid false positives (e.g. '/truck' vs '/uk')
                    foreach (['/uk', 'canada', 'united-kingdom'] as $term) {
                        if (str_contains($page, $term) || str_contains($ref, $term)) {
                            return true;
                        }
                    }
                    return false;
                },
            ],
            [
                'name'   => 'start_date_within_six_months',
                'points' => 10,
                'test'   => static function (array $d): bool {
                    $raw = trim((string)($d['start_date'] ?? ''));
                    if ($raw === '') {
                        return false;
                    }
                    // Start dates are stored as "Month YYYY" e.g. "September 2026"
                    $date = \DateTime::createFromFormat('F Y', $raw);
                    if ($date === false) {
                        return false;
                    }
                    $date->modify('first day of this month')->setTime(0, 0, 0);
                    $cutoff = new \DateTime('+6 months');
                    return $date <= $cutoff;
                },
            ],
            [
                'name'   => 'referrer_blog',
                'points' => 5,
                'test'   => static function (array $d): bool {
                    return str_contains((string)($d['referrer'] ?? ''), '/blog/');
                },
            ],
        ];
    }
}

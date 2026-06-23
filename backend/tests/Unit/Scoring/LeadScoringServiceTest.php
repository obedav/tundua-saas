<?php

namespace Tundua\Tests\Unit\Scoring;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Tundua\Scoring\LeadScoringRules;
use Tundua\Services\LeadScoringService;

class LeadScoringServiceTest extends TestCase
{
    // Blank lead data — no field should trigger any rule.
    private const BLANK = ['country' => '', 'start_date' => '', 'landing_page' => '', 'referrer' => ''];

    private static function ruleByName(string $name): array
    {
        foreach (LeadScoringRules::all() as $rule) {
            if ($rule['name'] === $name) {
                return [$rule];
            }
        }
        throw new \InvalidArgumentException("Rule '{$name}' not found in LeadScoringRules::all()");
    }

    #[Test]
    public function nigeria_country_scores_10(): void
    {
        $service = new LeadScoringService(self::ruleByName('origin_nigeria'));

        $this->assertSame(10, $service->calculate(['country' => 'Nigeria']));
        $this->assertSame(10, $service->calculate(['country' => 'NIGERIA']), 'case-insensitive match');
        $this->assertSame(10, $service->calculate(['country' => ' Nigeria ']), 'trims whitespace');
        $this->assertSame(0,  $service->calculate(['country' => 'Ghana']), 'Ghana does not match Nigeria rule');
        $this->assertSame(0,  $service->calculate(['country' => '']), 'empty country scores 0');
    }

    #[Test]
    public function africa_expansion_countries_each_score_15(): void
    {
        $service = new LeadScoringService(self::ruleByName('origin_africa_expansion'));

        foreach (['Ghana', 'Egypt', 'Morocco', 'Kenya', 'Zambia'] as $country) {
            $this->assertSame(15, $service->calculate(['country' => $country]), "{$country} should score 15");
            $this->assertSame(15, $service->calculate(['country' => strtoupper($country)]), strtoupper($country) . ' should be case-insensitive');
        }

        $this->assertSame(0, $service->calculate(['country' => 'Nigeria']), 'Nigeria does not match expansion rule');
        $this->assertSame(0, $service->calculate(['country' => 'Uganda']),  'Uganda not yet in expansion list');
    }

    #[Test]
    public function combined_score_sums_all_matching_rules(): void
    {
        $service = LeadScoringService::withDefaultRules();

        $threeMonthsAhead = (new \DateTime('+3 months'))->format('F Y');

        $score = $service->calculate([
            'country'      => 'Nigeria',                             // origin_nigeria         +10
            'landing_page' => '/study-abroad/uk',                   // destination_uk_canada  +10
            'referrer'     => '/blog/uk-universities-for-nigerians', // referrer_blog          +5
            'start_date'   => $threeMonthsAhead,                    // start_date_within_six  +10
        ]);

        $this->assertSame(35, $score);
    }

    #[Test]
    public function score_changes_when_country_or_start_date_changes(): void
    {
        $service = LeadScoringService::withDefaultRules();

        // Initial: Nigerian lead, no start date specified yet.
        $initial = $service->calculate(array_merge(self::BLANK, ['country' => 'Nigeria']));
        // origin_nigeria: +10
        $this->assertSame(10, $initial);

        // Country corrected to Ghana, start date far in the future (>6 months).
        $sevenMonthsAhead = (new \DateTime('+7 months'))->format('F Y');
        $afterCountryUpdate = $service->calculate(array_merge(self::BLANK, [
            'country'    => 'Ghana',
            'start_date' => $sevenMonthsAhead,
        ]));
        // origin_africa_expansion: +15; start_date_within_six_months: 0 (>6 months)
        $this->assertSame(15, $afterCountryUpdate);

        // Start date corrected to within 6 months — score must rise.
        $threeMonthsAhead = (new \DateTime('+3 months'))->format('F Y');
        $afterStartDateUpdate = $service->calculate(array_merge(self::BLANK, [
            'country'    => 'Ghana',
            'start_date' => $threeMonthsAhead,
        ]));
        // origin_africa_expansion: +15; start_date_within_six_months: +10
        $this->assertSame(25, $afterStartDateUpdate);

        $this->assertNotSame($initial, $afterCountryUpdate,   'score changed when country updated');
        $this->assertNotSame($afterCountryUpdate, $afterStartDateUpdate, 'score changed when start_date updated');
    }
}

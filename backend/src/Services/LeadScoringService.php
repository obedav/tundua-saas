<?php

namespace Tundua\Services;

use Tundua\Models\Lead;
use Tundua\Scoring\LeadScoringRules;

/**
 * LeadScoringService — assign a numeric priority score to a lead.
 *
 * SRP: score calculation only. No notifications, no CRM writes.
 * Open/Closed: rules are injected via the constructor. To add a rule,
 *              edit LeadScoringRules::all() — this class never changes.
 */
class LeadScoringService
{
    /**
     * @param array<array{name: string, points: int, test: \Closure}> $rules
     */
    public function __construct(private readonly array $rules) {}

    public static function withDefaultRules(): self
    {
        return new self(LeadScoringRules::all());
    }

    /**
     * Sum the points of every rule whose test passes against the given lead data.
     *
     * @param array<string, mixed> $leadData
     */
    public function calculate(array $leadData): int
    {
        $score = 0;
        foreach ($this->rules as $rule) {
            if (($rule['test'])($leadData)) {
                $score += $rule['points'];
            }
        }
        return $score;
    }

    /**
     * Calculate the score for a persisted Lead and write it back.
     * Callers should wrap this in try/catch — scoring failure must never
     * block the lead submission response.
     */
    public function scoreAndSave(Lead $lead): void
    {
        $lead->lead_score = $this->calculate($lead->toArray());
        $lead->save();
    }
}

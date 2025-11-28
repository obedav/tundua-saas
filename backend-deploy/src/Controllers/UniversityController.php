<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Illuminate\Database\Capsule\Manager as DB;

class UniversityController
{
    /**
     * Search universities with intelligent filtering
     * This is the core of your "Multi-Platform Intelligence"
     *
     * GET /api/universities/search?country=UK&budget=25000&gpa=3.0&platform=applyboard
     */
    public function search(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();

        $query = DB::table('universities')->where('is_active', true);

        // Filter by country
        if (!empty($params['country'])) {
            $query->where('country', $params['country']);
        }

        // Filter by budget (tuition range)
        if (!empty($params['budget'])) {
            $budget = (float) $params['budget'];
            $query->where('tuition_min', '<=', $budget)
                  ->where('tuition_max', '>=', $budget);
        }

        // Filter by GPA requirement
        if (!empty($params['gpa'])) {
            $gpa = (float) $params['gpa'];
            $query->where(function($q) use ($gpa) {
                $q->where('min_gpa', '<=', $gpa)
                  ->orWhereNull('min_gpa');
            });
        }

        // Filter by IELTS score
        if (!empty($params['ielts'])) {
            $ielts = (float) $params['ielts'];
            $query->where(function($q) use ($ielts) {
                $q->where('min_ielts', '<=', $ielts)
                  ->orWhereNull('min_ielts');
            });
        }

        // Filter by platform availability
        if (!empty($params['platform'])) {
            $platform = strtolower($params['platform']);
            $query->where("available_on_$platform", true);
        }

        // Filter by field of study (if joining with programs)
        if (!empty($params['field'])) {
            $query->join('university_programs', 'universities.id', '=', 'university_programs.university_id')
                  ->where('university_programs.field_of_study', 'LIKE', '%' . $params['field'] . '%')
                  ->select('universities.*')
                  ->distinct();
        }

        // Sorting - THIS IS KEY FOR INTELLIGENCE
        $sortBy = $params['sort'] ?? 'smart';

        switch ($sortBy) {
            case 'commission':
                // Sort by highest commission (prioritize platforms with highest payout)
                $query->orderByRaw('GREATEST(
                    COALESCE(applyboard_commission, 0),
                    COALESCE(edvoy_commission, 0),
                    COALESCE(studygroup_commission, 0),
                    COALESCE(adventus_commission, 0)
                ) DESC');
                break;

            case 'acceptance':
                // Sort by highest acceptance rate (easiest to get into)
                $query->orderBy('acceptance_rate', 'DESC');
                break;

            case 'tuition':
                // Sort by lowest tuition
                $query->orderBy('tuition_min', 'ASC');
                break;

            case 'smart':
            default:
                // Intelligent ranking: Balance acceptance rate, commission, and cost
                // Higher acceptance rate (easier) + Higher commission (more profitable) = Better match
                $query->orderByRaw('(acceptance_rate * 0.4 +
                    (GREATEST(
                        COALESCE(applyboard_commission, 0),
                        COALESCE(edvoy_commission, 0),
                        COALESCE(studygroup_commission, 0),
                        COALESCE(adventus_commission, 0)
                    ) / 50) * 0.6
                ) DESC');
                break;
        }

        // Pagination
        $page = (int) ($params['page'] ?? 1);
        $perPage = (int) ($params['per_page'] ?? 20);
        $offset = ($page - 1) * $perPage;

        $total = $query->count(DB::raw('DISTINCT universities.id'));
        $universities = $query->offset($offset)->limit($perPage)->get();

        // For each university, determine BEST platform to use
        $results = [];
        foreach ($universities as $university) {
            $bestPlatform = $this->determineBestPlatform($university);

            $results[] = [
                'id' => $university->id,
                'name' => $university->name,
                'country' => $university->country,
                'city' => $university->city,
                'logo_url' => $university->logo_url,
                'website_url' => $university->website_url,
                'tuition_range' => [
                    'min' => $university->tuition_min,
                    'max' => $university->tuition_max,
                    'currency' => $university->currency,
                ],
                'acceptance_rate' => $university->acceptance_rate,
                'requirements' => [
                    'min_gpa' => $university->min_gpa,
                    'min_ielts' => $university->min_ielts,
                    'min_toefl' => $university->min_toefl,
                ],
                'platforms' => [
                    'applyboard' => $university->available_on_applyboard,
                    'edvoy' => $university->available_on_edvoy,
                    'studygroup' => $university->available_on_studygroup,
                    'adventus' => $university->available_on_adventus,
                ],
                'recommended_platform' => $bestPlatform['name'],
                'recommendation_reason' => $bestPlatform['reason'],
                'expected_commission' => $bestPlatform['commission'],
                'processing_time' => $bestPlatform['processing_days'],
                'popular' => $university->popular,
                'featured' => $university->featured,
            ];
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $results,
            'meta' => [
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'total_pages' => ceil($total / $perPage),
            ],
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Determine best platform for submission
     * This is YOUR competitive advantage - automatic optimization!
     */
    private function determineBestPlatform($university): array
    {
        $platforms = [];

        // Collect available platforms with their metrics
        if ($university->available_on_applyboard) {
            $platforms[] = [
                'name' => 'applyboard',
                'commission' => $university->applyboard_commission ?? 0,
                'processing_days' => $university->applyboard_processing_days ?? 14,
            ];
        }

        if ($university->available_on_edvoy) {
            $platforms[] = [
                'name' => 'edvoy',
                'commission' => $university->edvoy_commission ?? 0,
                'processing_days' => $university->edvoy_processing_days ?? 14,
            ];
        }

        if ($university->available_on_studygroup) {
            $platforms[] = [
                'name' => 'studygroup',
                'commission' => $university->studygroup_commission ?? 0,
                'processing_days' => $university->studygroup_processing_days ?? 7,
            ];
        }

        if ($university->available_on_adventus) {
            $platforms[] = [
                'name' => 'adventus',
                'commission' => $university->adventus_commission ?? 0,
                'processing_days' => $university->adventus_processing_days ?? 14,
            ];
        }

        if (empty($platforms)) {
            return [
                'name' => 'none',
                'commission' => 0,
                'processing_days' => 0,
                'reason' => 'Not available on any platform',
            ];
        }

        // Rank platforms by: Commission (70%) + Speed (30%)
        usort($platforms, function($a, $b) {
            $scoreA = ($a['commission'] * 0.7) - ($a['processing_days'] * 0.3);
            $scoreB = ($b['commission'] * 0.7) - ($b['processing_days'] * 0.3);
            return $scoreB <=> $scoreA; // Descending
        });

        $best = $platforms[0];

        // Generate reason
        $reason = sprintf(
            'Highest commission ($%s) with %d-day processing',
            number_format($best['commission'], 0),
            $best['processing_days']
        );

        return [
            'name' => $best['name'],
            'commission' => $best['commission'],
            'processing_days' => $best['processing_days'],
            'reason' => $reason,
        ];
    }

    /**
     * Get list of countries
     * GET /api/universities/countries
     */
    public function getCountries(Request $request, Response $response): Response
    {
        $countries = DB::table('universities')
            ->select('country', DB::raw('COUNT(*) as count'))
            ->where('is_active', true)
            ->groupBy('country')
            ->orderBy('country')
            ->get();

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $countries,
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Get university by ID
     * GET /api/universities/{id}
     */
    public function getById(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];

        $university = DB::table('universities')
            ->where('id', $id)
            ->where('is_active', true)
            ->first();

        if (!$university) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'University not found',
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $bestPlatform = $this->determineBestPlatform($university);

        $result = [
            'id' => $university->id,
            'name' => $university->name,
            'country' => $university->country,
            'city' => $university->city,
            'logo_url' => $university->logo_url,
            'website_url' => $university->website_url,
            'ranking' => $university->ranking,
            'tuition_range' => [
                'min' => $university->tuition_min,
                'max' => $university->tuition_max,
                'currency' => $university->currency,
            ],
            'acceptance_rate' => $university->acceptance_rate,
            'requirements' => [
                'min_gpa' => $university->min_gpa,
                'min_ielts' => $university->min_ielts,
                'min_toefl' => $university->min_toefl,
            ],
            'platforms' => [
                'applyboard' => [
                    'available' => $university->available_on_applyboard,
                    'commission' => $university->applyboard_commission,
                    'processing_days' => $university->applyboard_processing_days,
                ],
                'edvoy' => [
                    'available' => $university->available_on_edvoy,
                    'commission' => $university->edvoy_commission,
                    'processing_days' => $university->edvoy_processing_days,
                ],
                'studygroup' => [
                    'available' => $university->available_on_studygroup,
                    'commission' => $university->studygroup_commission,
                    'processing_days' => $university->studygroup_processing_days,
                ],
                'adventus' => [
                    'available' => $university->available_on_adventus,
                    'commission' => $university->adventus_commission,
                    'processing_days' => $university->adventus_processing_days,
                ],
            ],
            'recommended_platform' => $bestPlatform,
        ];

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $result,
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Get smart recommendations based on student profile
     * POST /api/universities/recommend
     * Body: { "country": "UK", "budget": 25000, "gpa": 3.0, "ielts": 6.5, "field": "Computer Science" }
     */
    public function recommend(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $query = DB::table('universities')->where('is_active', true);

        // Apply filters from student profile
        if (!empty($data['country'])) {
            $query->where('country', $data['country']);
        }

        if (!empty($data['budget'])) {
            $budget = (float) $data['budget'];
            $query->where('tuition_min', '<=', $budget);
        }

        if (!empty($data['gpa'])) {
            $gpa = (float) $data['gpa'];
            $query->where(function($q) use ($gpa) {
                $q->where('min_gpa', '<=', $gpa)
                  ->orWhereNull('min_gpa');
            });
        }

        if (!empty($data['ielts'])) {
            $ielts = (float) $data['ielts'];
            $query->where(function($q) use ($ielts) {
                $q->where('min_ielts', '<=', $ielts)
                  ->orWhereNull('min_ielts');
            });
        }

        // Smart ranking algorithm
        $query->orderByRaw('(
            acceptance_rate * 0.3 +
            (GREATEST(
                COALESCE(applyboard_commission, 0),
                COALESCE(edvoy_commission, 0),
                COALESCE(studygroup_commission, 0),
                COALESCE(adventus_commission, 0)
            ) / 50) * 0.4 +
            (CASE WHEN popular = 1 THEN 20 ELSE 0 END) * 0.3
        ) DESC');

        $universities = $query->limit(10)->get();

        $results = [];
        foreach ($universities as $university) {
            $bestPlatform = $this->determineBestPlatform($university);

            // Calculate match score
            $matchScore = $this->calculateMatchScore($university, $data);

            $results[] = [
                'id' => $university->id,
                'name' => $university->name,
                'country' => $university->country,
                'city' => $university->city,
                'match_score' => $matchScore,
                'tuition_range' => [
                    'min' => $university->tuition_min,
                    'max' => $university->tuition_max,
                    'currency' => $university->currency,
                ],
                'acceptance_rate' => $university->acceptance_rate,
                'recommended_platform' => $bestPlatform['name'],
                'expected_commission' => $bestPlatform['commission'],
                'match_reasons' => $this->getMatchReasons($university, $data),
            ];
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $results,
            'message' => 'Top ' . count($results) . ' recommendations based on your profile',
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    private function calculateMatchScore($university, $profile): int
    {
        $score = 0;

        // Budget match (30 points)
        if (!empty($profile['budget'])) {
            $budget = (float) $profile['budget'];
            if ($university->tuition_min <= $budget && $university->tuition_max >= $budget) {
                $score += 30;
            } elseif ($university->tuition_min <= $budget) {
                $score += 20;
            }
        }

        // GPA match (25 points)
        if (!empty($profile['gpa']) && !empty($university->min_gpa)) {
            $gpa = (float) $profile['gpa'];
            if ($gpa >= $university->min_gpa + 0.5) {
                $score += 25; // Comfortably above requirement
            } elseif ($gpa >= $university->min_gpa) {
                $score += 15; // Meets requirement
            }
        } else {
            $score += 15; // No GPA requirement
        }

        // Acceptance rate (20 points)
        $acceptanceScore = ($university->acceptance_rate / 100) * 20;
        $score += round($acceptanceScore);

        // Popular/Featured (15 points)
        if ($university->popular) {
            $score += 10;
        }
        if ($university->featured) {
            $score += 5;
        }

        // Commission potential (10 points)
        $maxCommission = max(
            $university->applyboard_commission ?? 0,
            $university->edvoy_commission ?? 0,
            $university->studygroup_commission ?? 0,
            $university->adventus_commission ?? 0
        );
        $score += min(10, round($maxCommission / 500));

        return min(100, $score);
    }

    private function getMatchReasons($university, $profile): array
    {
        $reasons = [];

        if (!empty($profile['budget'])) {
            $budget = (float) $profile['budget'];
            if ($university->tuition_min <= $budget) {
                $reasons[] = "Fits your budget of $" . number_format($budget);
            }
        }

        if ($university->acceptance_rate >= 70) {
            $reasons[] = "High acceptance rate ({$university->acceptance_rate}%)";
        }

        if (!empty($profile['gpa']) && !empty($university->min_gpa)) {
            $gpa = (float) $profile['gpa'];
            if ($gpa >= $university->min_gpa) {
                $reasons[] = "You meet GPA requirement ({$university->min_gpa})";
            }
        }

        if ($university->popular) {
            $reasons[] = "Popular choice among students";
        }

        return $reasons;
    }
}

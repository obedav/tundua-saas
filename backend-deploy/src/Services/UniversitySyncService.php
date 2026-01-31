<?php

namespace Tundua\Services;

use Illuminate\Database\Capsule\Manager as DB;

/**
 * University Sync Service
 *
 * Handles syncing university data from partner platforms (ApplyBoard, Edvoy)
 *
 * COMPLIANCE NOTES:
 * - Data is synced from partner APIs (not scraped)
 * - All applications route through partner platforms
 * - Data is cached locally for search/discovery only
 * - source and last_synced_at fields track data origin
 */
class UniversitySyncService
{
    /**
     * Sync universities from ApplyBoard API
     * Call this via cron job (daily/weekly)
     */
    public function syncFromApplyBoard(): array
    {
        $apiKey = $_ENV['APPLYBOARD_API_KEY'] ?? null;
        $apiEndpoint = $_ENV['APPLYBOARD_API_URL'] ?? 'https://api.applyboard.com/v1';

        if (!$apiKey) {
            return ['success' => false, 'error' => 'ApplyBoard API key not configured'];
        }

        try {
            // TODO: Replace with actual ApplyBoard API call when access granted
            // $response = $this->callApplyBoardAPI($apiEndpoint . '/institutions', $apiKey);

            // For now, log that sync was attempted
            error_log("ApplyBoard sync attempted at " . date('Y-m-d H:i:s'));

            return [
                'success' => true,
                'message' => 'Sync placeholder - Configure API credentials when access granted',
                'synced_at' => date('Y-m-d H:i:s')
            ];

        } catch (\Exception $e) {
            error_log("ApplyBoard sync error: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Sync universities from Edvoy API
     */
    public function syncFromEdvoy(): array
    {
        $apiKey = $_ENV['EDVOY_API_KEY'] ?? null;
        $apiEndpoint = $_ENV['EDVOY_API_URL'] ?? 'https://api.edvoy.com/v1';

        if (!$apiKey) {
            return ['success' => false, 'error' => 'Edvoy API key not configured'];
        }

        try {
            // TODO: Replace with actual Edvoy API call when access granted
            error_log("Edvoy sync attempted at " . date('Y-m-d H:i:s'));

            return [
                'success' => true,
                'message' => 'Sync placeholder - Configure API credentials when access granted',
                'synced_at' => date('Y-m-d H:i:s')
            ];

        } catch (\Exception $e) {
            error_log("Edvoy sync error: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Upsert university from partner data
     * Properly tracks source and sync timestamp
     */
    public function upsertUniversity(array $data, string $source): bool
    {
        $slug = $this->generateSlug($data['name']);

        $existing = DB::table('universities')->where('slug', $slug)->first();

        $universityData = [
            'name' => $data['name'],
            'slug' => $slug,
            'country' => $data['country'],
            'city' => $data['city'] ?? null,
            'state_province' => $data['state_province'] ?? null,
            'website_url' => $data['website_url'] ?? null,
            'tuition_min' => $data['tuition_min'] ?? null,
            'tuition_max' => $data['tuition_max'] ?? null,
            'currency' => $data['currency'] ?? 'USD',
            'min_gpa' => $data['min_gpa'] ?? null,
            'min_ielts' => $data['min_ielts'] ?? null,
            'min_toefl' => $data['min_toefl'] ?? null,
            'intake_periods' => json_encode($data['intake_periods'] ?? []),
            'program_levels' => json_encode($data['program_levels'] ?? []),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // Mark platform availability based on source
        if ($source === 'applyboard') {
            $universityData['available_on_applyboard'] = true;
            $universityData['applyboard_commission'] = $data['commission'] ?? 10.00;
            $universityData['applyboard_processing_days'] = $data['processing_days'] ?? 14;
        } elseif ($source === 'edvoy') {
            $universityData['available_on_edvoy'] = true;
            $universityData['edvoy_commission'] = $data['commission'] ?? 10.00;
            $universityData['edvoy_processing_days'] = $data['processing_days'] ?? 14;
        }

        if ($existing) {
            DB::table('universities')
                ->where('id', $existing->id)
                ->update($universityData);
        } else {
            $universityData['created_at'] = date('Y-m-d H:i:s');
            $universityData['is_active'] = true;
            DB::table('universities')->insert($universityData);
        }

        return true;
    }

    /**
     * Generate application link that routes through partner platform
     * COMPLIANCE: Applications must go through partner, not bypass
     */
    public function getApplicationLink(int $universityId, string $preferredPlatform = 'auto'): array
    {
        $university = DB::table('universities')->find($universityId);

        if (!$university) {
            return ['success' => false, 'error' => 'University not found'];
        }

        // Determine best platform if auto
        if ($preferredPlatform === 'auto') {
            $preferredPlatform = $this->determineBestPlatform($university);
        }

        // Partner IDs - these route commissions to your agency
        $applyboardPartnerId = $_ENV['APPLYBOARD_PARTNER_ID'] ?? '';
        $edvoyPartnerId = $_ENV['EDVOY_PARTNER_ID'] ?? '';

        switch ($preferredPlatform) {
            case 'applyboard':
                return [
                    'success' => true,
                    'platform' => 'applyboard',
                    'url' => "https://www.applyboard.com/schools/{$university->slug}?ref={$applyboardPartnerId}",
                    'note' => 'Application will be processed through ApplyBoard'
                ];

            case 'edvoy':
                return [
                    'success' => true,
                    'platform' => 'edvoy',
                    'url' => "https://edvoy.com/universities/{$university->slug}?agent={$edvoyPartnerId}",
                    'note' => 'Application will be processed through Edvoy'
                ];

            default:
                return [
                    'success' => false,
                    'error' => 'University not available on any partner platform'
                ];
        }
    }

    /**
     * Determine best platform based on commission and processing time
     */
    private function determineBestPlatform($university): string
    {
        $platforms = [];

        if ($university->available_on_applyboard) {
            $platforms['applyboard'] = [
                'commission' => $university->applyboard_commission ?? 0,
                'days' => $university->applyboard_processing_days ?? 14
            ];
        }

        if ($university->available_on_edvoy) {
            $platforms['edvoy'] = [
                'commission' => $university->edvoy_commission ?? 0,
                'days' => $university->edvoy_processing_days ?? 14
            ];
        }

        if (empty($platforms)) {
            return 'none';
        }

        // Rank by commission (higher = better), then by speed (lower = better)
        uasort($platforms, function($a, $b) {
            $scoreA = ($a['commission'] * 0.7) - ($a['days'] * 0.3);
            $scoreB = ($b['commission'] * 0.7) - ($b['days'] * 0.3);
            return $scoreB <=> $scoreA;
        });

        return array_key_first($platforms);
    }

    private function generateSlug(string $name): string
    {
        return strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', trim($name)));
    }
}

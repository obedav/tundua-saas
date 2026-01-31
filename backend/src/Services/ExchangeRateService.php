<?php

namespace Tundua\Services;

/**
 * Exchange Rate Service
 *
 * Fetches live exchange rates from external APIs with caching.
 * Falls back to environment variable if API fails.
 *
 * Uses ExchangeRate-API (free tier: 1,500 requests/month)
 * Rate is cached for 24 hours to minimize API calls.
 */
class ExchangeRateService
{
    /**
     * Cache file path for storing exchange rates
     */
    private static function getCacheFile(): string
    {
        return __DIR__ . '/../../storage/cache/exchange_rates.json';
    }

    /**
     * Cache duration in seconds (24 hours)
     */
    private const CACHE_DURATION = 86400;

    /**
     * API URL for fetching USD to NGN rate
     * Free tier: https://open.er-api.com/v6/latest/USD
     */
    private const API_URL = 'https://open.er-api.com/v6/latest/USD';

    /**
     * Get the current NGN to USD exchange rate
     *
     * Priority:
     * 1. Cached rate (if valid and not expired)
     * 2. Fresh rate from API
     * 3. Environment variable fallback
     * 4. Hardcoded fallback (1600)
     *
     * @return float NGN per 1 USD
     */
    public static function getNgnToUsdRate(): float
    {
        // Try to get cached rate first
        $cachedRate = self::getCachedRate();
        if ($cachedRate !== null) {
            return $cachedRate;
        }

        // Fetch fresh rate from API
        $freshRate = self::fetchRateFromApi();
        if ($freshRate !== null) {
            self::cacheRate($freshRate);
            return $freshRate;
        }

        // Fall back to environment variable
        $envRate = $_ENV['EXCHANGE_RATE_NGN_USD'] ?? null;
        if ($envRate !== null && is_numeric($envRate)) {
            return (float) $envRate;
        }

        // Ultimate fallback
        return 1600.0;
    }

    /**
     * Get cached exchange rate if valid
     *
     * @return float|null Rate if valid cache exists, null otherwise
     */
    private static function getCachedRate(): ?float
    {
        $cacheFile = self::getCacheFile();

        if (!file_exists($cacheFile)) {
            return null;
        }

        $cacheData = json_decode(file_get_contents($cacheFile), true);

        if (!$cacheData || !isset($cacheData['rate']) || !isset($cacheData['timestamp'])) {
            return null;
        }

        // Check if cache is expired
        if (time() - $cacheData['timestamp'] > self::CACHE_DURATION) {
            return null;
        }

        return (float) $cacheData['rate'];
    }

    /**
     * Fetch exchange rate from API
     *
     * @return float|null Rate if successful, null on failure
     */
    private static function fetchRateFromApi(): ?float
    {
        try {
            $context = stream_context_create([
                'http' => [
                    'timeout' => 10, // 10 second timeout
                    'ignore_errors' => true,
                ],
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                ]
            ]);

            $response = @file_get_contents(self::API_URL, false, $context);

            if ($response === false) {
                error_log('ExchangeRateService: Failed to fetch from API');
                return null;
            }

            $data = json_decode($response, true);

            if (!$data || $data['result'] !== 'success' || !isset($data['rates']['NGN'])) {
                error_log('ExchangeRateService: Invalid API response');
                return null;
            }

            $rate = (float) $data['rates']['NGN'];

            // Sanity check: Rate should be reasonable (between 500 and 5000 NGN per USD)
            if ($rate < 500 || $rate > 5000) {
                error_log("ExchangeRateService: Rate {$rate} seems unreasonable, using fallback");
                return null;
            }

            error_log("ExchangeRateService: Fetched fresh rate: 1 USD = {$rate} NGN");
            return $rate;

        } catch (\Exception $e) {
            error_log('ExchangeRateService: Exception - ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Cache the exchange rate
     *
     * @param float $rate The rate to cache
     */
    private static function cacheRate(float $rate): void
    {
        $cacheFile = self::getCacheFile();
        $cacheDir = dirname($cacheFile);

        // Ensure cache directory exists
        if (!is_dir($cacheDir)) {
            mkdir($cacheDir, 0755, true);
        }

        $cacheData = [
            'rate' => $rate,
            'timestamp' => time(),
            'fetched_at' => date('Y-m-d H:i:s'),
            'source' => 'ExchangeRate-API'
        ];

        file_put_contents($cacheFile, json_encode($cacheData, JSON_PRETTY_PRINT));
    }

    /**
     * Force refresh the exchange rate (bypass cache)
     * Useful for admin/cron jobs
     *
     * @return array Status and rate info
     */
    public static function forceRefresh(): array
    {
        $freshRate = self::fetchRateFromApi();

        if ($freshRate !== null) {
            self::cacheRate($freshRate);
            return [
                'success' => true,
                'rate' => $freshRate,
                'source' => 'api',
                'message' => "Rate updated: 1 USD = {$freshRate} NGN"
            ];
        }

        $fallbackRate = (float) ($_ENV['EXCHANGE_RATE_NGN_USD'] ?? 1600);
        return [
            'success' => false,
            'rate' => $fallbackRate,
            'source' => 'fallback',
            'message' => 'API fetch failed, using fallback rate'
        ];
    }

    /**
     * Get rate info for display (includes source and freshness)
     *
     * @return array Rate information
     */
    public static function getRateInfo(): array
    {
        $cacheFile = self::getCacheFile();
        $rate = self::getNgnToUsdRate();

        $info = [
            'rate' => $rate,
            'currency_pair' => 'USD/NGN',
            'description' => "1 USD = {$rate} NGN"
        ];

        if (file_exists($cacheFile)) {
            $cacheData = json_decode(file_get_contents($cacheFile), true);
            if ($cacheData) {
                $info['fetched_at'] = $cacheData['fetched_at'] ?? null;
                $info['source'] = $cacheData['source'] ?? 'cache';
                $info['expires_in'] = max(0, self::CACHE_DURATION - (time() - ($cacheData['timestamp'] ?? 0)));
            }
        } else {
            $info['source'] = 'fallback';
            $info['fetched_at'] = null;
        }

        return $info;
    }
}

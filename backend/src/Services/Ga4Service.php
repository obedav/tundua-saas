<?php

namespace Tundua\Services;

/**
 * Server-side GA4 tracking via the Measurement Protocol.
 *
 * Why server-side: client-side gtag is blocked by ~10–25% of users (ad blockers,
 * privacy modes) and lost when the browser closes mid-redirect. Firing the same
 * event from a webhook guarantees revenue is recorded even when the browser path
 * fails. GA4 deduplicates `purchase` events by `transaction_id`, so this is safe
 * to combine with the existing client-side `trackPaymentCompleted` call.
 *
 * SECURITY:
 *  - The API secret is read from the environment and never logged or returned.
 *  - We use HTTPS with peer verification.
 *  - cURL timeouts prevent the webhook from hanging if GA4 is slow.
 *  - All exceptions are caught — tracking failures never break the caller.
 *  - The synthetic client_id is derived from the transaction reference, so no
 *    user PII is ever sent.
 */
class Ga4Service
{
    private const ENDPOINT = 'https://www.google-analytics.com/mp/collect';
    private const CONNECT_TIMEOUT = 2;
    private const TOTAL_TIMEOUT = 5;

    /**
     * Send a purchase event to GA4. Fire-and-forget: never throws, never blocks.
     *
     * @param string      $transactionId Unique payment reference (used for GA4 dedup)
     * @param float       $value         Amount in the currency's major unit
     * @param string      $currency      ISO-4217 currency code (e.g. "NGN")
     * @param string|null $clientId      Optional GA4 client_id for proper attribution.
     *                                   When null, a synthetic ID is derived from the
     *                                   transaction so revenue is still recorded.
     */
    public static function trackPurchase(
        string $transactionId,
        float $value,
        string $currency,
        ?string $clientId = null
    ): void {
        $measurementId = $_ENV['GA4_MEASUREMENT_ID'] ?? '';
        $apiSecret = $_ENV['GA4_API_SECRET'] ?? '';

        // GA4 not configured — skip silently. Tracking is optional.
        if ($measurementId === '' || $apiSecret === '') {
            return;
        }

        // Synthetic client_id keeps the call PII-free when no real GA4 client_id
        // was captured at checkout. Stable per-transaction so retries dedupe.
        $resolvedClientId = $clientId !== null && $clientId !== ''
            ? $clientId
            : 'srv-' . substr(hash('sha256', $transactionId), 0, 16);

        $payload = [
            'client_id' => $resolvedClientId,
            'events' => [[
                'name' => 'purchase',
                'params' => [
                    'transaction_id' => $transactionId,
                    'value' => $value,
                    'currency' => $currency,
                    'items' => [[
                        'item_id' => $transactionId,
                        'item_name' => 'Study Abroad Application',
                        'price' => $value,
                        'quantity' => 1,
                    ]],
                ],
            ]],
        ];

        $url = self::ENDPOINT . '?' . http_build_query([
            'measurement_id' => $measurementId,
            'api_secret' => $apiSecret,
        ]);

        try {
            $ch = curl_init($url);
            if ($ch === false) {
                return;
            }

            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($payload),
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => self::CONNECT_TIMEOUT,
                CURLOPT_TIMEOUT => self::TOTAL_TIMEOUT,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
            ]);

            curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            // GA4 returns 204 on success. Anything else is logged for debugging
            // but never propagated.
            if ($httpCode !== 204) {
                error_log(sprintf(
                    'GA4 MP non-204 response (status=%d, error=%s) for transaction %s',
                    $httpCode,
                    $curlError,
                    $transactionId
                ));
            }
        } catch (\Throwable $e) {
            error_log('GA4 MP exception: ' . $e->getMessage());
        }
    }
}

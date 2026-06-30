<?php

namespace Tundua\Services;

use Tundua\Models\Lead;

/**
 * VepaарWebhookService — forward a new lead to Vepaar CRM.
 *
 * SRP: sends to Vepaar only. It does not score, validate, or modify the lead.
 *
 * Async: dispatch() registers a shutdown callback. public/index.php calls
 * fastcgi_finish_request() after $app->run(), so the HTTP response reaches
 * the client before this callback fires — the cURL call never blocks the 201.
 *
 * Non-fatal: all errors are written to error_log. Exceptions are never thrown.
 */
class VepaарWebhookService
{
    private const CONNECT_TIMEOUT = 3;
    private const TOTAL_TIMEOUT   = 8;

    /**
     * Build the Vepaar contact payload from a Lead instance.
     * Public so it can be tested independently of HTTP transport.
     *
     * @return array<string, mixed>
     */
    public static function buildPayload(Lead $lead): array
    {
        // Derive a CRM tag from the lead's origin country.
        // Lead::country is free-text ("Nigeria") — lowercase gives the slug Vepaar
        // expects as a tag ("nigeria"), consistent with KB article country_target.
        $countryTag = strtolower(trim((string)($lead->country ?? '')));

        // custom_fields: strip null/empty values so Vepaar typed fields don't fail.
        $customFields = array_filter(
            [
                'country'    => $lead->country,
                'start_date' => $lead->start_date,
                'lead_score' => $lead->lead_score ?? 0,
                'source'     => $lead->source,
            ],
            static fn($v) => $v !== null && $v !== ''
        );

        return [
            'name'          => $lead->name,
            'phone'         => $lead->phone ?? null,
            'tags'          => $countryTag !== '' ? [$countryTag] : [],
            'custom_fields' => $customFields,
        ];
    }

    /**
     * Register a post-response shutdown callback that POSTs the lead to Vepaar.
     * If VEPAAR_WEBHOOK_URL is not set, logs a warning and returns silently.
     */
    public static function dispatch(Lead $lead): void
    {
        $url = $_ENV['VEPAAR_WEBHOOK_URL'] ?? '';

        if ($url === '') {
            error_log('VepaарWebhookService: VEPAAR_WEBHOOK_URL is not set — skipping');
            return;
        }

        $payload = self::buildPayload($lead);

        // Deferred until after fastcgi_finish_request() in index.php has flushed
        // the HTTP response to the client. The 201 is already on the wire before
        // this callback fires.
        register_shutdown_function(static function () use ($url, $payload): void {
            try {
                self::post($url, $payload);
            } catch (\Throwable $e) {
                error_log('VepaарWebhookService: unexpected error — ' . $e->getMessage());
            }
        });
    }

    private static function post(string $url, array $payload): void
    {
        $body = json_encode($payload);
        if ($body === false) {
            error_log('VepaарWebhookService: failed to JSON-encode payload');
            return;
        }

        $ch = curl_init($url);
        if ($ch === false) {
            error_log('VepaарWebhookService: curl_init failed');
            return;
        }

        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Accept: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => self::CONNECT_TIMEOUT,
            CURLOPT_TIMEOUT        => self::TOTAL_TIMEOUT,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        $responseBody = curl_exec($ch);
        $httpCode     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError    = curl_error($ch);
        curl_close($ch);

        if ($curlError !== '') {
            error_log("VepaарWebhookService: cURL error — {$curlError}");
            return;
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            error_log("VepaарWebhookService: contact synced to Vepaar (HTTP {$httpCode})");
        } else {
            error_log(sprintf(
                'VepaарWebhookService: unexpected HTTP %d — %s',
                $httpCode,
                substr((string) $responseBody, 0, 300)
            ));
        }
    }
}

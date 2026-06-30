<?php

namespace Tundua\Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Tundua\Models\Lead;
use Tundua\Services\VepaарWebhookService;

/**
 * Tests buildPayload() in isolation — no HTTP, no DB, no env required.
 * The payload shape is the contract between this service and Vepaar's API.
 */
class VepaарWebhookServiceTest extends TestCase
{
    private static function makeLead(array $attrs): Lead
    {
        $lead = new Lead();
        foreach ($attrs as $key => $value) {
            $lead->{$key} = $value;
        }
        return $lead;
    }

    #[Test]
    public function build_payload_maps_lead_fields_to_vepaar_contact_format(): void
    {
        $lead = self::makeLead([
            'name'       => 'Amaka Osei',
            'phone'      => '+2348012345678',
            'country'    => 'Nigeria',
            'start_date' => 'September 2026',
            'lead_score' => 25,
            'source'     => 'apply-page',
        ]);

        $payload = VepaарWebhookService::buildPayload($lead);

        // Top-level contact fields
        $this->assertSame('Amaka Osei', $payload['name']);
        $this->assertSame('+2348012345678', $payload['phone']);

        // Country tag is derived from lead->country, lowercased
        $this->assertContains('nigeria', $payload['tags']);
        $this->assertCount(1, $payload['tags']);

        // Custom fields carry the enrichment data
        $this->assertSame('Nigeria', $payload['custom_fields']['country']);
        $this->assertSame('September 2026', $payload['custom_fields']['start_date']);
        $this->assertSame(25, $payload['custom_fields']['lead_score']);
        $this->assertSame('apply-page', $payload['custom_fields']['source']);
    }

    #[Test]
    public function build_payload_omits_null_phone_and_empty_custom_fields(): void
    {
        $lead = self::makeLead([
            'name'       => 'Kwame Mensah',
            'phone'      => null,
            'country'    => 'Ghana',
            'start_date' => null,
            'lead_score' => 15,
            'source'     => null,
        ]);

        $payload = VepaарWebhookService::buildPayload($lead);

        $this->assertNull($payload['phone']);
        $this->assertContains('ghana', $payload['tags']);

        // start_date and source are null — should not appear in custom_fields
        $this->assertArrayNotHasKey('start_date', $payload['custom_fields']);
        $this->assertArrayNotHasKey('source', $payload['custom_fields']);

        // lead_score 15 is non-null, should be present
        $this->assertSame(15, $payload['custom_fields']['lead_score']);
    }

    #[Test]
    public function build_payload_produces_empty_tags_when_country_is_blank(): void
    {
        $lead = self::makeLead([
            'name'       => 'Anonymous',
            'phone'      => null,
            'country'    => '',
            'start_date' => null,
            'lead_score' => 0,
            'source'     => 'web',
        ]);

        $payload = VepaарWebhookService::buildPayload($lead);

        $this->assertSame([], $payload['tags']);
    }

    #[Test]
    public function dispatch_returns_silently_when_webhook_url_is_not_set(): void
    {
        unset($_ENV['VEPAAR_WEBHOOK_URL']);

        $lead = self::makeLead(['name' => 'Test Lead', 'country' => 'Kenya', 'lead_score' => 10]);

        // Must not throw — just log a warning and return
        VepaарWebhookService::dispatch($lead);

        $this->assertTrue(true);
    }
}

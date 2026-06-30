<?php

namespace Tundua\Tests\Feature;

use Illuminate\Database\Capsule\Manager as Capsule;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Response;
use Tundua\Controllers\LeadController;
use Tundua\Models\Lead;

class LeadCreationTest extends TestCase
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        $capsule = new Capsule();
        $capsule->addConnection([
            'driver'   => 'sqlite',
            'database' => ':memory:',
            'prefix'   => '',
        ]);
        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }

    protected function setUp(): void
    {
        parent::setUp();

        Capsule::schema()->dropIfExists('leads');
        Capsule::schema()->create('leads', static function ($table): void {
            $table->increments('id');
            $table->string('name', 120);
            $table->string('email', 255)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('country', 100);
            $table->string('start_date', 30)->nullable();
            $table->string('budget', 100)->nullable();
            $table->text('message')->nullable();
            $table->string('source', 100)->nullable();
            $table->string('utm_source', 255)->nullable();
            $table->string('utm_medium', 255)->nullable();
            $table->string('utm_campaign', 255)->nullable();
            $table->string('utm_term', 255)->nullable();
            $table->string('utm_content', 255)->nullable();
            $table->string('gclid', 255)->nullable();
            $table->string('fbclid', 255)->nullable();
            $table->string('landing_page', 500)->nullable();
            $table->string('referrer', 500)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('status', 50)->default('new');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    #[Test]
    public function post_with_required_fields_and_email_returns_201_and_creates_lead(): void
    {
        $request = (new ServerRequestFactory())
            ->createServerRequest('POST', '/api/v1/leads')
            ->withParsedBody([
                'name'       => 'Amaka Osei',
                'country'    => 'Nigeria',
                'start_date' => 'September 2026',
                'email'      => 'amaka@example.com',
            ]);

        $controller = new LeadController();
        $result = $controller->create($request, new Response());

        $this->assertSame(201, $result->getStatusCode());

        $body = json_decode((string)$result->getBody(), true);
        $this->assertTrue($body['success']);
        $this->assertArrayHasKey('lead_id', $body);

        $this->assertSame(1, Lead::count());
        $lead = Lead::first();
        $this->assertSame('Amaka Osei', $lead->name);
        $this->assertSame('Nigeria', $lead->country);
        $this->assertSame('September 2026', $lead->start_date);
        $this->assertSame('amaka@example.com', $lead->email);
        $this->assertNull($lead->phone);
        $this->assertSame('new', $lead->status);
    }

    #[Test]
    public function post_with_phone_number_returns_201_and_stores_phone(): void
    {
        $request = (new ServerRequestFactory())
            ->createServerRequest('POST', '/api/v1/leads')
            ->withParsedBody([
                'name'       => 'Tunde Bello',
                'country'    => 'Nigeria',
                'start_date' => 'January 2027',
                'phone'      => '+2347039328174',
                'source'     => 'apply-page',
            ]);

        $controller = new LeadController();
        $result = $controller->create($request, new Response());

        $this->assertSame(201, $result->getStatusCode());

        $body = json_decode((string)$result->getBody(), true);
        $this->assertTrue($body['success']);
        $this->assertArrayHasKey('lead_id', $body);

        $this->assertSame(1, Lead::count());
        $lead = Lead::first();
        $this->assertSame('Tunde Bello', $lead->name);
        $this->assertSame('+2347039328174', $lead->phone);
        $this->assertNull($lead->email);
        $this->assertSame('apply-page', $lead->source);
    }

    #[Test]
    public function patch_details_returns_200_and_saves_optional_fields(): void
    {
        // Create a lead to update.
        $createRequest = (new ServerRequestFactory())
            ->createServerRequest('POST', '/api/v1/leads')
            ->withParsedBody([
                'name'       => 'Fatima Musa',
                'country'    => 'Nigeria',
                'start_date' => 'January 2027',
                'phone'      => '+2348012345678',
                'source'     => 'apply-page',
            ]);

        $controller = new LeadController();
        $createResult = $controller->create($createRequest, new Response());
        $this->assertSame(201, $createResult->getStatusCode());

        $createBody = json_decode((string)$createResult->getBody(), true);
        $leadId = $createBody['lead_id'];

        // PATCH the details endpoint with optional fields.
        $patchRequest = (new ServerRequestFactory())
            ->createServerRequest('PATCH', "/api/v1/leads/{$leadId}/details")
            ->withParsedBody([
                'email'   => 'fatima@example.com',
                'budget'  => '₦10M – ₦20M upfront',
                'message' => 'I am a nurse looking for a January intake.',
            ]);

        $result = $controller->updateDetails($patchRequest, new Response(), ['id' => (string)$leadId]);

        $this->assertSame(200, $result->getStatusCode());

        $body = json_decode((string)$result->getBody(), true);
        $this->assertTrue($body['success']);

        $lead = Lead::find($leadId);
        $this->assertSame('fatima@example.com', $lead->email);
        $this->assertSame('₦10M – ₦20M upfront', $lead->budget);
        $this->assertSame('I am a nurse looking for a January intake.', $lead->message);
        $this->assertSame('+2348012345678', $lead->phone);
    }

    #[Test]
    public function post_with_no_contact_method_returns_422_and_creates_no_lead(): void
    {
        $request = (new ServerRequestFactory())
            ->createServerRequest('POST', '/api/v1/leads')
            ->withParsedBody([
                'name'       => 'Amaka Osei',
                'country'    => 'Nigeria',
                'start_date' => 'September 2026',
            ]);

        $controller = new LeadController();
        $result = $controller->create($request, new Response());

        $this->assertSame(422, $result->getStatusCode());

        $body = json_decode((string)$result->getBody(), true);
        $this->assertFalse($body['success']);
        $this->assertArrayHasKey('error', $body);

        $this->assertSame(0, Lead::count());
    }
}

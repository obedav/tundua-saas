<?php

namespace Tundua\Tests\Feature;

use GuzzleHttp\Psr7\ServerRequest;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Tundua\Controllers\PaymentController;
use Tundua\Services\PaystackClientInterface;
use Tundua\Tests\TestCase;

/**
 * Payment Integration Tests
 *
 * Every test exercises real PaymentController logic against an in-memory SQLite
 * database (injected via constructor DI). The Paystack SDK is replaced by a
 * PHPUnit mock of PaystackClientInterface so no real API calls are made.
 *
 * SOLID principles in play:
 *  D — PaymentController accepts PaystackClientInterface, so tests inject fakes.
 *  O — validatePaymentAmount is protected, so the test double can override it
 *      without changing production code (used for the "success path" init tests
 *      where PricingService's Eloquent models are not available in SQLite).
 *  S — Each test asserts one behaviour; helpers handle repeated setup.
 *
 * DRY: makeController(), postRequest(), webhookRequest(), and decode() are
 * defined once and reused across all test methods.
 *
 * KISS: No extra testing framework, no Mockery — plain PHPUnit mocks only.
 */
class PaymentIntegrationTest extends TestCase
{
    /** Paystack secret configured in phpunit.xml */
    private const PAYSTACK_SECRET = 'sk_test_fake';

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function makeController(?PaystackClientInterface $paystack = null): PaymentController
    {
        return new PaymentController(self::$db, $paystack);
    }

    private function emptyResponse(): ResponseInterface
    {
        return new Response();
    }

    private function postRequest(array $body = []): ServerRequestInterface
    {
        return (new ServerRequest('POST', '/api/payments/paystack/initialize'))
            ->withParsedBody($body);
    }

    private function getRequest(array $queryParams = [], array $attributes = []): ServerRequestInterface
    {
        $request = new ServerRequest('GET', '/');
        foreach ($attributes as $key => $value) {
            $request = $request->withAttribute($key, $value);
        }
        if ($queryParams) {
            $request = $request->withQueryParams($queryParams);
        }
        return $request;
    }

    private function webhookRequest(array $payload): ServerRequestInterface
    {
        $body = json_encode($payload);
        $sig = hash_hmac('sha512', $body, self::PAYSTACK_SECRET);

        return new ServerRequest(
            'POST',
            '/api/payments/paystack/webhook',
            ['x-paystack-signature' => $sig, 'Content-Type' => 'application/json'],
            $body
        );
    }

    private function decode(ResponseInterface $response): array
    {
        return json_decode((string) $response->getBody(), true);
    }

    /** Build a mock PaystackClientInterface with preset return values. */
    private function mockPaystack(
        ?object $initResult = null,
        ?object $verifyResult = null
    ): PaystackClientInterface {
        $mock = $this->createMock(PaystackClientInterface::class);

        if ($initResult !== null) {
            $mock->method('initialize')->willReturn($initResult);
        }
        if ($verifyResult !== null) {
            $mock->method('verify')->willReturn($verifyResult);
        }

        return $mock;
    }

    /** Stubbed Paystack success response for initializePaystack. */
    private function paystackInitSuccess(string $ref = 'PAY-TESTREF'): object
    {
        return (object) [
            'status' => true,
            'data' => (object) [
                'authorization_url' => 'https://checkout.paystack.com/test',
                'access_code' => 'test_access_code',
                'reference' => $ref,
            ],
        ];
    }

    /** Stubbed Paystack success response for verifyPaystack. */
    private function paystackVerifySuccess(string $ref = 'PAY-TESTREF'): object
    {
        return (object) [
            'status' => true,
            'data' => (object) [
                'status' => 'success',
                'amount' => 5000000,
                'reference' => $ref,
            ],
        ];
    }

    /**
     * A minimal test double that bypasses PricingService (Eloquent-based) for
     * the "happy path" initializePaystack tests. All other controller logic runs
     * unchanged.
     */
    private function controllerWithBypassedValidation(
        ?PaystackClientInterface $paystack = null,
        bool $validationPasses = true
    ): PaymentController {
        return new class(self::$db, $paystack, $validationPasses) extends PaymentController {
            private bool $validationPasses;

            public function __construct(?\PDO $db, ?PaystackClientInterface $ps, bool $passes)
            {
                parent::__construct($db, $ps);
                $this->validationPasses = $passes;
            }

            protected function validatePaymentAmount(array $application): array
            {
                if (!$this->validationPasses) {
                    return ['valid' => false, 'error' => 'Amount mismatch'];
                }
                return ['valid' => true, 'expected' => 50000.0, 'currency' => 'NGN'];
            }
        };
    }

    // ── initializePaystack ────────────────────────────────────────────────────

    public function test_init_returns_400_when_application_id_is_missing(): void
    {
        $response = $this->makeController()->initializePaystack(
            $this->postRequest(),
            $this->emptyResponse()
        );

        $body = $this->decode($response);
        $this->assertSame(400, $response->getStatusCode());
        $this->assertFalse($body['success']);
        $this->assertStringContainsString('Application ID', $body['error']);
    }

    public function test_init_returns_404_when_application_does_not_exist(): void
    {
        $response = $this->makeController()->initializePaystack(
            $this->postRequest(['application_id' => 99999]),
            $this->emptyResponse()
        );

        $body = $this->decode($response);
        $this->assertSame(404, $response->getStatusCode());
        $this->assertFalse($body['success']);
    }

    public function test_init_returns_400_when_pricing_validation_fails(): void
    {
        $userId = $this->createTestUser();
        // service_tier_id = 0 causes PricingService to return 'not found' → validation fails
        $appId = $this->createTestApplication($userId, ['service_tier_id' => 0]);

        $response = $this->makeController()->initializePaystack(
            $this->postRequest(['application_id' => $appId]),
            $this->emptyResponse()
        );

        $body = $this->decode($response);
        $this->assertSame(400, $response->getStatusCode());
        $this->assertFalse($body['success']);
    }

    public function test_init_creates_pending_payment_and_returns_authorization_url(): void
    {
        $userId = $this->createTestUser();
        $appId = $this->createTestApplication($userId);

        $controller = $this->controllerWithBypassedValidation(
            $this->mockPaystack(initResult: $this->paystackInitSuccess())
        );

        $response = $controller->initializePaystack(
            $this->postRequest(['application_id' => $appId]),
            $this->emptyResponse()
        );

        $body = $this->decode($response);
        $this->assertSame(200, $response->getStatusCode());
        $this->assertTrue($body['success']);
        $this->assertArrayHasKey('authorization_url', $body['data']);
        $this->assertArrayHasKey('reference', $body['data']);

        // Payment row must be persisted in the DB as pending
        $stmt = self::$db->prepare("SELECT status, payment_method FROM payments WHERE application_id = ?");
        $stmt->execute([$appId]);
        $payment = $stmt->fetch();
        $this->assertNotEmpty($payment, 'Payment row was not inserted');
        $this->assertSame('pending', $payment['status']);
        $this->assertSame('paystack', $payment['payment_method']);
    }

    public function test_init_returns_500_when_paystack_sdk_throws(): void
    {
        $userId = $this->createTestUser();
        $appId = $this->createTestApplication($userId);

        $mock = $this->createMock(PaystackClientInterface::class);
        $mock->method('initialize')->willThrowException(new \Exception('Network error'));

        $controller = $this->controllerWithBypassedValidation($mock);

        $response = $controller->initializePaystack(
            $this->postRequest(['application_id' => $appId]),
            $this->emptyResponse()
        );

        $this->assertSame(500, $response->getStatusCode());
        $this->assertFalse($this->decode($response)['success']);
    }

    // ── verifyPaystack ────────────────────────────────────────────────────────

    public function test_verify_returns_400_when_reference_is_missing(): void
    {
        $response = $this->makeController()->verifyPaystack(
            $this->getRequest(),
            $this->emptyResponse(),
            []
        );

        $this->assertSame(400, $response->getStatusCode());
        $this->assertFalse($this->decode($response)['success']);
    }

    public function test_verify_returns_500_when_paystack_sdk_throws(): void
    {
        $mock = $this->createMock(PaystackClientInterface::class);
        $mock->method('verify')->willThrowException(new \Exception('Paystack unavailable'));

        $response = $this->makeController($mock)->verifyPaystack(
            $this->getRequest(),
            $this->emptyResponse(),
            ['reference' => 'PAY-FAIL']
        );

        $this->assertSame(500, $response->getStatusCode());
    }

    public function test_verify_updates_payment_and_application_on_success(): void
    {
        $userId = $this->createTestUser();
        $appId = $this->createTestApplication($userId);
        $paymentId = $this->createTestPayment($userId, $appId, [
            'provider_transaction_id' => 'PAY-VER01',
        ]);

        $mock = $this->mockPaystack(verifyResult: $this->paystackVerifySuccess('PAY-VER01'));

        $response = $this->makeController($mock)->verifyPaystack(
            $this->getRequest(),
            $this->emptyResponse(),
            ['reference' => 'PAY-VER01']
        );

        $body = $this->decode($response);
        $this->assertSame(200, $response->getStatusCode());
        $this->assertTrue($body['success']);

        // Payment row updated
        $stmt = self::$db->prepare("SELECT status FROM payments WHERE id = ?");
        $stmt->execute([$paymentId]);
        $this->assertSame('completed', $stmt->fetchColumn());

        // Application row updated
        $stmt = self::$db->prepare("SELECT payment_status, status FROM applications WHERE id = ?");
        $stmt->execute([$appId]);
        $app = $stmt->fetch();
        $this->assertSame('paid', $app['payment_status']);
        $this->assertSame('submitted', $app['status']);
    }

    public function test_verify_returns_500_when_payment_record_not_in_database(): void
    {
        // Paystack returns success but we have no matching payment row.
        // The controller falls through to 'throw' → 500. This test documents
        // that known behaviour so any future change is caught immediately.
        $mock = $this->mockPaystack(verifyResult: $this->paystackVerifySuccess('PAY-GHOST'));

        $response = $this->makeController($mock)->verifyPaystack(
            $this->getRequest(),
            $this->emptyResponse(),
            ['reference' => 'PAY-GHOST']
        );

        $this->assertSame(500, $response->getStatusCode());
    }

    // ── paystackWebhook ───────────────────────────────────────────────────────

    public function test_webhook_rejects_invalid_signature(): void
    {
        $request = new ServerRequest(
            'POST',
            '/api/payments/paystack/webhook',
            ['x-paystack-signature' => 'not-a-real-signature'],
            '{"event":"charge.success"}'
        );

        $response = $this->makeController()->paystackWebhook($request, $this->emptyResponse());

        $this->assertSame(401, $response->getStatusCode());
        $this->assertFalse($this->decode($response)['success']);
    }

    public function test_webhook_charge_success_marks_payment_completed_and_application_submitted(): void
    {
        $userId = $this->createTestUser();
        $appId = $this->createTestApplication($userId);
        $this->createTestPayment($userId, $appId, [
            'provider_transaction_id' => 'PAY-WH001',
            'status' => 'pending',
        ]);

        $response = $this->makeController()->paystackWebhook(
            $this->webhookRequest([
                'event' => 'charge.success',
                'data' => ['reference' => 'PAY-WH001'],
            ]),
            $this->emptyResponse()
        );

        $this->assertSame(200, $response->getStatusCode());

        $stmt = self::$db->prepare("SELECT status FROM payments WHERE provider_transaction_id = ?");
        $stmt->execute(['PAY-WH001']);
        $this->assertSame('completed', $stmt->fetchColumn());

        $stmt = self::$db->prepare("SELECT payment_status, status FROM applications WHERE id = ?");
        $stmt->execute([$appId]);
        $app = $stmt->fetch();
        $this->assertSame('paid', $app['payment_status']);
        $this->assertSame('submitted', $app['status']);
    }

    public function test_webhook_charge_success_is_idempotent_for_already_completed_payment(): void
    {
        $userId = $this->createTestUser();
        $appId = $this->createTestApplication($userId, ['payment_status' => 'paid']);
        $this->createTestPayment($userId, $appId, [
            'provider_transaction_id' => 'PAY-IDEM01',
            'status' => 'completed',
        ]);

        $payload = ['event' => 'charge.success', 'data' => ['reference' => 'PAY-IDEM01']];

        // Fire the same webhook twice
        $this->makeController()->paystackWebhook($this->webhookRequest($payload), $this->emptyResponse());
        $this->makeController()->paystackWebhook($this->webhookRequest($payload), $this->emptyResponse());

        // Exactly one payment row — not duplicated or double-processed
        $stmt = self::$db->prepare(
            "SELECT COUNT(*) FROM payments WHERE provider_transaction_id = ? AND status = 'completed'"
        );
        $stmt->execute(['PAY-IDEM01']);
        $this->assertSame(1, (int) $stmt->fetchColumn());
    }

    public function test_webhook_subscription_create_activates_scholar_plan_on_user(): void
    {
        $userId = $this->createTestUser(['email' => 'scholar@test.com']);

        $payload = [
            'event' => 'subscription.create',
            'data' => [
                'customer' => [
                    'email' => 'scholar@test.com',
                    'customer_code' => 'CUS-TEST001',
                ],
                'subscription_code' => 'SUB-TEST001',
                'email_token' => 'tok_abc123',
                'amount' => 4999900,
                'next_payment_date' => date('Y-m-d', strtotime('+1 year')) . 'T00:00:00.000Z',
            ],
        ];

        $response = $this->makeController()->paystackWebhook(
            $this->webhookRequest($payload),
            $this->emptyResponse()
        );

        $this->assertSame(200, $response->getStatusCode());

        $stmt = self::$db->prepare("SELECT subscription_plan FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $this->assertSame('scholar', $stmt->fetchColumn());

        $stmt = self::$db->prepare("SELECT status FROM subscriptions WHERE user_id = ?");
        $stmt->execute([$userId]);
        $this->assertSame('active', $stmt->fetchColumn());
    }

    public function test_webhook_invoice_payment_success_extends_subscription_and_user_access(): void
    {
        $userId = $this->createTestUser(['email' => 'renew@test.com']);
        self::$db->prepare("UPDATE users SET subscription_plan = 'scholar' WHERE id = ?")->execute([$userId]);
        self::$db->prepare("
            INSERT INTO subscriptions (user_id, plan, paystack_subscription_code, status, amount, currency)
            VALUES (?, 'scholar', 'SUB-RENEW01', 'active', 49999, 'NGN')
        ")->execute([$userId]);

        $nextYear = date('Y-m-d', strtotime('+1 year')) . 'T00:00:00.000Z';

        $this->makeController()->paystackWebhook(
            $this->webhookRequest([
                'event' => 'invoice.payment_success',
                'data' => [
                    'subscription' => [
                        'subscription_code' => 'SUB-RENEW01',
                        'next_payment_date' => $nextYear,
                    ],
                ],
            ]),
            $this->emptyResponse()
        );

        // User remains on scholar, subscription expiry extended
        $stmt = self::$db->prepare("SELECT subscription_plan, subscription_expires_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        $this->assertSame('scholar', $user['subscription_plan']);
        $this->assertNotNull($user['subscription_expires_at']);
    }

    public function test_webhook_subscription_disable_reverts_user_to_free_plan(): void
    {
        $userId = $this->createTestUser(['email' => 'cancel@test.com']);
        self::$db->prepare("UPDATE users SET subscription_plan = 'scholar' WHERE id = ?")->execute([$userId]);
        self::$db->prepare("
            INSERT INTO subscriptions (user_id, plan, paystack_subscription_code, status, amount, currency)
            VALUES (?, 'scholar', 'SUB-CANCEL01', 'active', 49999, 'NGN')
        ")->execute([$userId]);

        $this->makeController()->paystackWebhook(
            $this->webhookRequest([
                'event' => 'subscription.disable',
                'data' => ['subscription_code' => 'SUB-CANCEL01'],
            ]),
            $this->emptyResponse()
        );

        $stmt = self::$db->prepare("SELECT subscription_plan FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $this->assertSame('free', $stmt->fetchColumn(), 'Cancelled subscription should revert plan to free');

        $stmt = self::$db->prepare("SELECT status FROM subscriptions WHERE paystack_subscription_code = ?");
        $stmt->execute(['SUB-CANCEL01']);
        $this->assertSame('cancelled', $stmt->fetchColumn());
    }

    public function test_webhook_subscription_not_renew_sets_status_without_revoking_access(): void
    {
        // subscription.not_renew means "will not auto-renew" but the user keeps
        // access until expiry. Only subscription.disable should revert to free.
        $userId = $this->createTestUser(['email' => 'norenew@test.com']);
        self::$db->prepare("UPDATE users SET subscription_plan = 'scholar' WHERE id = ?")->execute([$userId]);
        self::$db->prepare("
            INSERT INTO subscriptions (user_id, plan, paystack_subscription_code, status, amount, currency)
            VALUES (?, 'scholar', 'SUB-NR01', 'active', 49999, 'NGN')
        ")->execute([$userId]);

        $this->makeController()->paystackWebhook(
            $this->webhookRequest([
                'event' => 'subscription.not_renew',
                'data' => ['subscription_code' => 'SUB-NR01'],
            ]),
            $this->emptyResponse()
        );

        // Plan must NOT change
        $stmt = self::$db->prepare("SELECT subscription_plan FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $this->assertSame('scholar', $stmt->fetchColumn(), 'not_renew must not revoke access');

        // But subscription status must be updated
        $stmt = self::$db->prepare("SELECT status FROM subscriptions WHERE paystack_subscription_code = ?");
        $stmt->execute(['SUB-NR01']);
        $this->assertSame('non_renewing', $stmt->fetchColumn());
    }

    // ── getPaymentHistory ─────────────────────────────────────────────────────

    public function test_payment_history_returns_accurate_summary_totals(): void
    {
        $userId = $this->createTestUser();
        $appId = $this->createTestApplication($userId);

        $this->createTestPayment($userId, $appId, ['amount' => 50000, 'status' => 'completed']);
        $this->createTestPayment($userId, $appId, ['amount' => 25000, 'status' => 'completed']);
        $this->createTestPayment($userId, $appId, ['amount' => 10000, 'status' => 'pending']);

        $request = $this->getRequest(attributes: ['user_id' => $userId]);
        $response = $this->makeController()->getPaymentHistory($request, $this->emptyResponse());

        $body = $this->decode($response);
        $this->assertSame(200, $response->getStatusCode());
        $this->assertTrue($body['success']);
        $this->assertSame(3, $body['summary']['total_count']);
        $this->assertSame(2, $body['summary']['completed_count']);
        $this->assertSame(1, $body['summary']['pending_count']);
        $this->assertEqualsWithDelta(75000.0, $body['summary']['total_paid'], 0.01);
    }

    public function test_payment_history_filters_by_status(): void
    {
        $userId = $this->createTestUser();
        $appId = $this->createTestApplication($userId);

        $this->createTestPayment($userId, $appId, ['status' => 'completed']);
        $this->createTestPayment($userId, $appId, ['status' => 'pending']);

        $request = $this->getRequest(
            queryParams: ['status' => 'completed'],
            attributes: ['user_id' => $userId]
        );
        $response = $this->makeController()->getPaymentHistory($request, $this->emptyResponse());

        $body = $this->decode($response);
        $this->assertSame(1, $body['summary']['total_count']);
        $this->assertSame('completed', $body['payments'][0]['status']);
    }
}

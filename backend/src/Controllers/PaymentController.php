<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Database\Database;
use Tundua\Services\PaystackClientInterface;
use Tundua\Services\PaystackClient;
use Tundua\Services\PricingService;
use Tundua\Services\Ga4Service;

class PaymentController
{
    private ?\PDO $db;
    private ?PaystackClientInterface $paystackClient;

    /**
     * DIP: accept abstractions, not concretions.
     * Both parameters are optional so existing call sites (DI container, routes)
     * that call new PaymentController() continue to work unchanged.
     */
    public function __construct(?\PDO $db = null, ?PaystackClientInterface $paystackClient = null)
    {
        $this->db = $db;
        $this->paystackClient = $paystackClient;
    }

    private function getDb(): \PDO
    {
        if ($this->db === null) {
            $this->db = Database::getConnection();
        }
        return $this->db;
    }

    private function getPaystackClient(): PaystackClientInterface
    {
        if ($this->paystackClient === null) {
            $this->paystackClient = new PaystackClient($_ENV['PAYSTACK_SECRET_KEY']);
        }
        return $this->paystackClient;
    }

    /**
     * Validate and recalculate payment amount server-side.
     * Protected (not private) so tests can override with a subclass when
     * PricingService's Eloquent models are not available in the test DB.
     */
    protected function validatePaymentAmount(array $application): array
    {
        $serviceTierId = (int) ($application['service_tier_id'] ?? 0);
        $addons = json_decode($application['addon_ids'] ?? '[]', true) ?: [];
        $discountCode = $application['discount_code'] ?? null;
        $currency = $application['currency'] ?? 'NGN';

        $calculated = PricingService::calculateTotal(
            $serviceTierId,
            $addons,
            $discountCode,
            $currency
        );

        if (!$calculated['success']) {
            return [
                'valid' => false,
                'error' => 'Failed to calculate pricing',
                'expected' => 0,
                'stored' => $application['total_amount'],
            ];
        }

        if ($calculated['is_custom_pricing'] ?? false) {
            return [
                'valid' => false,
                'error' => 'Custom pricing requires manual approval',
                'expected' => 0,
                'stored' => $application['total_amount'],
            ];
        }

        $expectedAmount = (float) $calculated['pricing']['total_amount'];
        $storedAmount = (float) $application['total_amount'];
        $tolerance = $expectedAmount * 0.01;
        $isValid = abs($expectedAmount - $storedAmount) <= $tolerance;

        return [
            'valid' => $isValid,
            'expected' => $expectedAmount,
            'stored' => $storedAmount,
            'currency' => $currency,
            'error' => $isValid ? null : 'Payment amount mismatch - possible tampering detected',
        ];
    }

    /**
     * Initialize Paystack payment
     * POST /api/payments/paystack/initialize
     */
    public function initializePaystack(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $applicationId = $data['application_id'] ?? null;

        if (!$applicationId) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Application ID is required',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            $stmt = $this->getDb()->prepare("
                SELECT a.*, u.email
                FROM applications a
                JOIN users u ON a.user_id = u.id
                WHERE a.id = ?
            ");
            $stmt->execute([$applicationId]);
            $application = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found',
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $validation = $this->validatePaymentAmount($application);
            if (!$validation['valid']) {
                error_log("Payment validation failed for application {$applicationId}: " . json_encode($validation));
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => $validation['error'] ?? 'Payment validation failed',
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $paymentAmount = $validation['expected'];
            $paymentCurrency = $validation['currency'];
            $amountInKobo = (int) ($paymentAmount * 100);

            $transactionId = 'PAY-' . strtoupper(uniqid());
            $stmt = $this->getDb()->prepare("
                INSERT INTO payments (
                    transaction_id, application_id, user_id, amount, currency,
                    payment_method, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ");
            $stmt->execute([
                $transactionId,
                $applicationId,
                $application['user_id'],
                $paymentAmount,
                $paymentCurrency,
                'paystack',
                'pending',
            ]);
            $paymentId = $this->getDb()->lastInsertId();

            $frontendUrl = $_ENV['APP_URL'] ?? 'http://localhost:3000';
            $callbackUrl = "{$frontendUrl}/dashboard/applications/{$applicationId}/payment/success";

            $paystackData = [
                'amount' => $amountInKobo,
                'email' => $application['email'],
                'reference' => $transactionId,
                'callback_url' => $callbackUrl,
                'metadata' => [
                    'application_id' => $applicationId,
                    'payment_id' => $paymentId,
                    'reference_number' => $application['reference_number'],
                    'custom_fields' => [[
                        'display_name' => 'Application Reference',
                        'variable_name' => 'application_reference',
                        'value' => $application['reference_number'],
                    ]],
                ],
            ];

            $result = $this->getPaystackClient()->initialize($paystackData);

            if ($result->status) {
                $stmt = $this->getDb()->prepare("
                    UPDATE payments
                    SET provider_transaction_id = ?,
                        provider_metadata = ?
                    WHERE id = ?
                ");
                $stmt->execute([
                    $result->data->reference,
                    json_encode($result->data),
                    $paymentId,
                ]);

                $response->getBody()->write(json_encode([
                    'success' => true,
                    'data' => [
                        'authorization_url' => $result->data->authorization_url,
                        'access_code' => $result->data->access_code,
                        'reference' => $result->data->reference,
                        'payment_id' => $paymentId,
                    ],
                ]));
                return $response->withHeader('Content-Type', 'application/json');
            }

            throw new \Exception('Failed to initialize Paystack payment');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage(),
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Verify Paystack payment
     * GET /api/payments/paystack/verify/{reference}
     */
    public function verifyPaystack(Request $request, Response $response, array $args): Response
    {
        $reference = $args['reference'] ?? null;

        if (!$reference) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Reference is required',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            $result = $this->getPaystackClient()->verify($reference);

            if ($result->status && $result->data->status === 'success') {
                $stmt = $this->getDb()->prepare("
                    SELECT * FROM payments WHERE provider_transaction_id = ?
                ");
                $stmt->execute([$reference]);
                $payment = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($payment) {
                    $stmt = $this->getDb()->prepare("
                        UPDATE payments
                        SET status = 'completed',
                            paid_at = CURRENT_TIMESTAMP,
                            provider_metadata = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([json_encode($result->data), $payment['id']]);

                    $stmt = $this->getDb()->prepare("
                        UPDATE applications
                        SET payment_status = 'paid',
                            payment_id = ?,
                            status = 'submitted',
                            submitted_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                    ");
                    $stmt->execute([$payment['id'], $payment['application_id']]);

                    $response->getBody()->write(json_encode([
                        'success' => true,
                        'message' => 'Payment verified successfully',
                        'data' => [
                            'payment_id' => $payment['id'],
                            'application_id' => $payment['application_id'],
                            'amount' => $result->data->amount / 100,
                            'status' => 'completed',
                        ],
                    ]));
                    return $response->withHeader('Content-Type', 'application/json');
                }
            }

            throw new \Exception('Payment verification failed');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage(),
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Paystack webhook handler
     * POST /api/payments/paystack/webhook
     */
    public function paystackWebhook(Request $request, Response $response): Response
    {
        try {
            $body = $request->getBody()->getContents();
            $signature = $request->getHeaderLine('x-paystack-signature');

            if ($signature !== hash_hmac('sha512', $body, $_ENV['PAYSTACK_SECRET_KEY'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid signature',
                ]));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            $event = json_decode($body);

            // ── Subscription lifecycle ────────────────────────────────────
            if ($event->event === 'subscription.create') {
                $subData = $event->data;
                $custEmail = $subData->customer->email ?? null;

                if ($custEmail) {
                    $stmt = $this->getDb()->prepare("SELECT id FROM users WHERE email = ?");
                    $stmt->execute([$custEmail]);
                    $user = $stmt->fetch(\PDO::FETCH_ASSOC);

                    if ($user) {
                        $nextDate = isset($subData->next_payment_date)
                            ? date('Y-m-d H:i:s', strtotime($subData->next_payment_date))
                            : null;

                        // Portable upsert: check-then-insert-or-update avoids
                        // MySQL-specific ON DUPLICATE KEY syntax so tests run on SQLite.
                        $stmt = $this->getDb()->prepare(
                            "SELECT id FROM subscriptions WHERE user_id = ?"
                        );
                        $stmt->execute([$user['id']]);
                        $existing = $stmt->fetch(\PDO::FETCH_ASSOC);

                        if ($existing) {
                            $stmt = $this->getDb()->prepare("
                                UPDATE subscriptions
                                SET status = 'active',
                                    email_token = ?,
                                    next_payment_date = ?,
                                    updated_at = CURRENT_TIMESTAMP
                                WHERE user_id = ?
                            ");
                            $stmt->execute([
                                $subData->email_token ?? null,
                                $nextDate,
                                $user['id'],
                            ]);
                        } else {
                            $stmt = $this->getDb()->prepare("
                                INSERT INTO subscriptions
                                    (user_id, plan, paystack_subscription_code,
                                     paystack_customer_code, email_token, status,
                                     amount, currency, next_payment_date, created_at)
                                VALUES (?, 'scholar', ?, ?, ?, 'active', ?, 'NGN', ?, CURRENT_TIMESTAMP)
                            ");
                            $stmt->execute([
                                $user['id'],
                                $subData->subscription_code ?? null,
                                $subData->customer->customer_code ?? null,
                                $subData->email_token ?? null,
                                (float) ($subData->amount ?? 0) / 100,
                                $nextDate,
                            ]);
                        }

                        $expiresAt = $nextDate ?? date('Y-m-d H:i:s', strtotime('+1 year'));
                        $stmt = $this->getDb()->prepare("
                            UPDATE users
                            SET subscription_plan = 'scholar',
                                subscription_expires_at = ?
                            WHERE id = ?
                        ");
                        $stmt->execute([$expiresAt, $user['id']]);
                    }
                }
            }

            if ($event->event === 'invoice.payment_success') {
                $subCode = $event->data->subscription->subscription_code ?? null;
                if ($subCode) {
                    $nextDate = isset($event->data->subscription->next_payment_date)
                        ? date('Y-m-d H:i:s', strtotime($event->data->subscription->next_payment_date))
                        : null;

                    $stmt = $this->getDb()->prepare("
                        UPDATE subscriptions
                        SET status = 'active',
                            next_payment_date = ?,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE paystack_subscription_code = ?
                    ");
                    $stmt->execute([$nextDate, $subCode]);

                    // Portable: subquery instead of MySQL-specific JOIN UPDATE
                    if ($nextDate) {
                        $stmt = $this->getDb()->prepare("
                            UPDATE users
                            SET subscription_plan = 'scholar',
                                subscription_expires_at = ?
                            WHERE id = (
                                SELECT user_id FROM subscriptions
                                WHERE paystack_subscription_code = ?
                            )
                        ");
                        $stmt->execute([$nextDate, $subCode]);
                    }
                }
            }

            if ($event->event === 'subscription.disable' || $event->event === 'subscription.not_renew') {
                $subCode = $event->data->subscription_code ?? null;
                if ($subCode) {
                    $newStatus = $event->event === 'subscription.not_renew' ? 'non_renewing' : 'cancelled';
                    $stmt = $this->getDb()->prepare("
                        UPDATE subscriptions
                        SET status = ?,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE paystack_subscription_code = ?
                    ");
                    $stmt->execute([$newStatus, $subCode]);

                    // Portable: subquery instead of MySQL-specific JOIN UPDATE
                    if ($newStatus === 'cancelled') {
                        $stmt = $this->getDb()->prepare("
                            UPDATE users
                            SET subscription_plan = 'free',
                                subscription_expires_at = NULL
                            WHERE id = (
                                SELECT user_id FROM subscriptions
                                WHERE paystack_subscription_code = ?
                            )
                        ");
                        $stmt->execute([$subCode]);
                    }
                }
            }
            // ─────────────────────────────────────────────────────────────

            if ($event->event === 'charge.success') {
                $reference = $event->data->reference;

                // IDEMPOTENCY: skip if already completed
                $stmt = $this->getDb()->prepare("
                    SELECT status FROM payments WHERE provider_transaction_id = ?
                ");
                $stmt->execute([$reference]);
                $existingPayment = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($existingPayment && $existingPayment['status'] === 'completed') {
                    error_log("Webhook already processed for reference: {$reference}");
                    $response->getBody()->write(json_encode(['success' => true, 'message' => 'Already processed']));
                    return $response->withHeader('Content-Type', 'application/json');
                }

                $stmt = $this->getDb()->prepare("
                    UPDATE payments
                    SET status = 'completed',
                        paid_at = CURRENT_TIMESTAMP
                    WHERE provider_transaction_id = ? AND status != 'completed'
                ");
                $stmt->execute([$reference]);

                if ($stmt->rowCount() > 0) {
                    $stmt = $this->getDb()->prepare("
                        SELECT application_id, amount, currency
                        FROM payments
                        WHERE provider_transaction_id = ?
                    ");
                    $stmt->execute([$reference]);
                    $payment = $stmt->fetch(\PDO::FETCH_ASSOC);

                    if ($payment) {
                        $stmt = $this->getDb()->prepare("
                            UPDATE applications
                            SET payment_status = 'paid',
                                status = 'submitted',
                                submitted_at = CURRENT_TIMESTAMP
                            WHERE id = ? AND payment_status != 'paid'
                        ");
                        $stmt->execute([$payment['application_id']]);

                        Ga4Service::trackPurchase(
                            $reference,
                            (float) $payment['amount'],
                            $payment['currency'] ?? 'NGN'
                        );
                    }
                }
            }

            $response->getBody()->write(json_encode(['success' => true]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage(),
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get payment details
     * GET /api/payments/{id}
     */
    public function getPayment(Request $request, Response $response, array $args): Response
    {
        $paymentId = $args['id'] ?? null;

        try {
            $stmt = $this->getDb()->prepare("
                SELECT p.*, a.reference_number, a.total_amount as application_amount
                FROM payments p
                LEFT JOIN applications a ON p.application_id = a.id
                WHERE p.id = ?
            ");
            $stmt->execute([$paymentId]);
            $payment = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$payment) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Payment not found',
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'payment' => $payment,
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage(),
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's payment history
     * GET /api/payments/history
     */
    public function getPaymentHistory(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();
            $status = $queryParams['status'] ?? null;

            $query = "
                SELECT
                    p.id, p.transaction_id, p.amount, p.currency, p.status,
                    p.payment_method, p.invoice_number, p.receipt_url,
                    p.paid_at, p.created_at,
                    a.reference_number, a.destination_country, a.service_tier_name
                FROM payments p
                LEFT JOIN applications a ON p.application_id = a.id
                WHERE p.user_id = ?
            ";

            $params = [$userId];

            if ($status) {
                $query .= " AND p.status = ?";
                $params[] = $status;
            }

            $query .= " ORDER BY p.created_at DESC LIMIT 100";

            $stmt = $this->getDb()->prepare($query);
            $stmt->execute($params);
            $payments = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $totalPaid = 0;
            $completedCount = 0;
            $pendingCount = 0;

            foreach ($payments as $payment) {
                if ($payment['status'] === 'completed') {
                    $totalPaid += (float) $payment['amount'];
                    $completedCount++;
                } elseif ($payment['status'] === 'pending' || $payment['status'] === 'processing') {
                    $pendingCount++;
                }
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'payments' => $payments,
                'summary' => [
                    'total_paid' => $totalPaid,
                    'completed_count' => $completedCount,
                    'pending_count' => $pendingCount,
                    'total_count' => count($payments),
                ],
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Error getting payment history: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error',
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's saved payment methods
     * GET /api/payments/methods
     */
    public function getPaymentMethods(Request $request, Response $response): Response
    {
        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => [],
            'message' => 'Payment methods are securely managed by Paystack. Add a payment method during checkout.',
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}

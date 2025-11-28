<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Database\Database;
use Yabacon\Paystack;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Webhook as StripeWebhook;

class PaymentController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
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
                'error' => 'Application ID is required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            // Get application details
            $stmt = $this->db->prepare("
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
                    'error' => 'Application not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Convert amount to kobo (Paystack uses kobo for NGN, pesewas for GHS, cents for ZAR)
            $amountInKobo = (int)($application['total_amount'] * 100);

            // Create payment record
            $transactionId = 'PAY-' . strtoupper(uniqid());
            $stmt = $this->db->prepare("
                INSERT INTO payments (
                    transaction_id, application_id, user_id, amount, currency,
                    payment_method, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $transactionId,
                $applicationId,
                $application['user_id'],
                $application['total_amount'],
                'NGN',
                'paystack',
                'pending'
            ]);
            $paymentId = $this->db->lastInsertId();

            // Initialize Paystack
            $paystack = new Paystack($_ENV['PAYSTACK_SECRET_KEY']);

            // Build callback URL with application ID
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
                    'custom_fields' => [
                        [
                            'display_name' => 'Application Reference',
                            'variable_name' => 'application_reference',
                            'value' => $application['reference_number']
                        ]
                    ]
                ]
            ];

            $result = $paystack->transaction->initialize($paystackData);

            if ($result->status) {
                // Update payment with Paystack reference
                $stmt = $this->db->prepare("
                    UPDATE payments
                    SET provider_transaction_id = ?,
                        provider_metadata = ?
                    WHERE id = ?
                ");
                $stmt->execute([
                    $result->data->reference,
                    json_encode($result->data),
                    $paymentId
                ]);

                $response->getBody()->write(json_encode([
                    'success' => true,
                    'data' => [
                        'authorization_url' => $result->data->authorization_url,
                        'access_code' => $result->data->access_code,
                        'reference' => $result->data->reference,
                        'payment_id' => $paymentId
                    ]
                ]));
                return $response->withHeader('Content-Type', 'application/json');
            } else {
                throw new \Exception('Failed to initialize Paystack payment');
            }
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
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
                'error' => 'Reference is required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            $paystack = new Paystack($_ENV['PAYSTACK_SECRET_KEY']);
            $result = $paystack->transaction->verify(['reference' => $reference]);

            if ($result->status && $result->data->status === 'success') {
                // Get payment record
                $stmt = $this->db->prepare("
                    SELECT * FROM payments WHERE provider_transaction_id = ?
                ");
                $stmt->execute([$reference]);
                $payment = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($payment) {
                    // Update payment status
                    $stmt = $this->db->prepare("
                        UPDATE payments
                        SET status = 'completed',
                            paid_at = NOW(),
                            provider_metadata = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        json_encode($result->data),
                        $payment['id']
                    ]);

                    // Update application
                    $stmt = $this->db->prepare("
                        UPDATE applications
                        SET payment_status = 'paid',
                            payment_id = ?,
                            status = 'submitted',
                            submitted_at = NOW()
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        $payment['id'],
                        $payment['application_id']
                    ]);

                    $response->getBody()->write(json_encode([
                        'success' => true,
                        'message' => 'Payment verified successfully',
                        'data' => [
                            'payment_id' => $payment['id'],
                            'application_id' => $payment['application_id'],
                            'amount' => $result->data->amount / 100,
                            'status' => 'completed'
                        ]
                    ]));
                    return $response->withHeader('Content-Type', 'application/json');
                }
            }

            throw new \Exception('Payment verification failed');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
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

            // Verify signature
            if ($signature !== hash_hmac('sha512', $body, $_ENV['PAYSTACK_SECRET_KEY'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid signature'
                ]));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            $event = json_decode($body);

            if ($event->event === 'charge.success') {
                $reference = $event->data->reference;

                // Update payment status
                $stmt = $this->db->prepare("
                    UPDATE payments
                    SET status = 'completed', paid_at = NOW()
                    WHERE provider_transaction_id = ?
                ");
                $stmt->execute([$reference]);

                // Update application
                $stmt = $this->db->prepare("
                    SELECT application_id FROM payments WHERE provider_transaction_id = ?
                ");
                $stmt->execute([$reference]);
                $payment = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($payment) {
                    $stmt = $this->db->prepare("
                        UPDATE applications
                        SET payment_status = 'paid', status = 'submitted', submitted_at = NOW()
                        WHERE id = ?
                    ");
                    $stmt->execute([$payment['application_id']]);
                }
            }

            $response->getBody()->write(json_encode(['success' => true]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create Stripe checkout session
     * POST /api/payments/stripe/create-checkout
     */
    public function createStripeCheckout(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $applicationId = $data['application_id'] ?? null;
        $successUrl = $data['success_url'] ?? null;
        $cancelUrl = $data['cancel_url'] ?? null;

        if (!$applicationId || !$successUrl || !$cancelUrl) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Missing required parameters'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            // Get application details
            $stmt = $this->db->prepare("
                SELECT * FROM applications WHERE id = ?
            ");
            $stmt->execute([$applicationId]);
            $application = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Create payment record
            $transactionId = 'STRIPE-' . strtoupper(uniqid());
            $stmt = $this->db->prepare("
                INSERT INTO payments (
                    transaction_id, application_id, user_id, amount, currency,
                    payment_method, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $transactionId,
                $applicationId,
                $application['user_id'],
                $application['total_amount'],
                'NGN',
                'stripe',
                'pending'
            ]);
            $paymentId = $this->db->lastInsertId();

            // Initialize Stripe
            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

            $session = StripeSession::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Study Abroad Application - ' . $application['reference_number'],
                            'description' => $application['service_tier_name'] ?? 'Application Fee',
                        ],
                        'unit_amount' => (int)($application['total_amount'] * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $successUrl . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $cancelUrl,
                'metadata' => [
                    'application_id' => $applicationId,
                    'payment_id' => $paymentId,
                    'transaction_id' => $transactionId,
                ],
            ]);

            // Update payment with Stripe session info
            $stmt = $this->db->prepare("
                UPDATE payments
                SET stripe_session_id = ?,
                    provider_transaction_id = ?,
                    provider_metadata = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $session->id,
                $session->id,
                json_encode($session),
                $paymentId
            ]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'session_id' => $session->id,
                    'url' => $session->url,
                    'payment_id' => $paymentId
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Stripe webhook handler
     * POST /api/payments/stripe/webhook
     */
    public function stripeWebhook(Request $request, Response $response): Response
    {
        try {
            $payload = $request->getBody()->getContents();
            $sigHeader = $request->getHeaderLine('stripe-signature');

            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

            $event = StripeWebhook::constructEvent(
                $payload,
                $sigHeader,
                $_ENV['STRIPE_WEBHOOK_SECRET']
            );

            if ($event->type === 'checkout.session.completed') {
                $session = $event->data->object;

                // Update payment status
                $stmt = $this->db->prepare("
                    UPDATE payments
                    SET status = 'completed',
                        paid_at = NOW(),
                        stripe_payment_intent = ?
                    WHERE stripe_session_id = ?
                ");
                $stmt->execute([
                    $session->payment_intent,
                    $session->id
                ]);

                // Update application
                $stmt = $this->db->prepare("
                    SELECT application_id FROM payments WHERE stripe_session_id = ?
                ");
                $stmt->execute([$session->id]);
                $payment = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($payment) {
                    $stmt = $this->db->prepare("
                        UPDATE applications
                        SET payment_status = 'paid', status = 'submitted', submitted_at = NOW()
                        WHERE id = ?
                    ");
                    $stmt->execute([$payment['application_id']]);
                }
            }

            $response->getBody()->write(json_encode(['success' => true]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
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
            $stmt = $this->db->prepare("
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
                    'error' => 'Payment not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'payment' => $payment
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
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
                    p.id,
                    p.transaction_id,
                    p.amount,
                    p.currency,
                    p.status,
                    p.payment_method,
                    p.invoice_number,
                    p.receipt_url,
                    p.paid_at,
                    p.created_at,
                    a.reference_number,
                    a.destination_country,
                    a.service_tier_name
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

            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $payments = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Calculate summary
            $totalPaid = 0;
            $completedCount = 0;
            $pendingCount = 0;

            foreach ($payments as $payment) {
                if ($payment['status'] === 'completed') {
                    $totalPaid += (float)$payment['amount'];
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
                    'total_count' => count($payments)
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting payment history: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

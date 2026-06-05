<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Database\Database;
use Yabacon\Paystack;

class SubscriptionController
{
    private $db = null;

    private function getDb()
    {
        if ($this->db === null) {
            $this->db = Database::getConnection();
        }
        return $this->db;
    }

    private function json(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    private const PLAN_CONFIG = [
        'scholar' => [
            'label'       => 'Scholar Annual',
            'plan_code'   => 'PAYSTACK_SCHOLAR_PLAN_CODE',
            'plan_amount' => 'PAYSTACK_SCHOLAR_PLAN_AMOUNT',
            'default'     => 7500000, // e.g. ₦75,000 → 7500000 kobo
        ],
        'application_support' => [
            'label'       => 'Application Support',
            'plan_code'   => 'PAYSTACK_APPLICATION_SUPPORT_PLAN_CODE',
            'plan_amount' => 'PAYSTACK_APPLICATION_SUPPORT_PLAN_AMOUNT',
            'default'     => 25000000, // e.g. ₦250,000 → 25000000 kobo
        ],
        'fellow' => [
            'label'       => 'Fellow',
            'plan_code'   => 'PAYSTACK_FELLOW_PLAN_CODE',
            'plan_amount' => 'PAYSTACK_FELLOW_PLAN_AMOUNT',
            'default'     => 50000000, // e.g. ₦500,000 → 50000000 kobo
        ],
        'premium_concierge' => [
            'label'       => 'Premium Concierge',
            'plan_code'   => 'PAYSTACK_PREMIUM_CONCIERGE_PLAN_CODE',
            'plan_amount' => 'PAYSTACK_PREMIUM_CONCIERGE_PLAN_AMOUNT',
            'default'     => 100000000, // e.g. ₦1,000,000 → 100000000 kobo
        ],
    ];

    /**
     * Initialize a subscription checkout via Paystack.
     * POST /api/v1/subscriptions/initialize
     * Body: { "plan": "scholar" | "application_support" | "fellow" | "premium_concierge" }
     */
    public function initialize(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $body   = $request->getParsedBody();
        $plan   = $body['plan'] ?? 'scholar';

        if (!array_key_exists($plan, self::PLAN_CONFIG)) {
            return $this->json($response, [
                'success' => false,
                'error'   => 'Invalid plan selected.',
            ], 400);
        }

        $config = self::PLAN_CONFIG[$plan];

        try {
            // Read and validate env vars before touching any subscription state
            $planCode   = $_ENV[$config['plan_code']]   ?? null;
            $secretKey  = $_ENV['PAYSTACK_SECRET_KEY']  ?? null;
            $planAmount = (int) ($_ENV[$config['plan_amount']] ?? $config['default']);

            if (!$planCode || !$secretKey) {
                return $this->json($response, [
                    'success' => false,
                    'error'   => 'Subscription plan not configured.',
                ], 500);
            }

            // Check for any active subscription
            $stmt = $this->getDb()->prepare("
                SELECT id, plan, paystack_subscription_code, email_token
                FROM subscriptions
                WHERE user_id = ? AND status IN ('active', 'non_renewing')
                LIMIT 1
            ");
            $stmt->execute([$userId]);
            $existingSub = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($existingSub) {
                if ($existingSub['plan'] === $plan) {
                    // Same plan — block the duplicate
                    return $this->json($response, [
                        'success' => false,
                        'error'   => "You already have an active {$config['label']} subscription.",
                    ], 409);
                }

                // Different plan — cancel the old one before initializing the new one
                if ($existingSub['paystack_subscription_code'] && $existingSub['email_token']) {
                    try {
                        (new Paystack($secretKey))->subscription->disable([
                            'code'  => $existingSub['paystack_subscription_code'],
                            'token' => $existingSub['email_token'],
                        ]);
                    } catch (\Throwable $e) {
                        // Log but do not block — the new checkout should still proceed
                        error_log("Paystack disable failed during plan upgrade for user {$userId}: " . $e->getMessage());
                    }
                }

                $stmt = $this->getDb()->prepare("
                    UPDATE subscriptions
                    SET status = 'cancelled', cancelled_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$existingSub['id']]);
            }

            $stmt = $this->getDb()->prepare("SELECT email FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$user) {
                return $this->json($response, ['success' => false, 'error' => 'User not found.'], 404);
            }

            $paystack    = new Paystack($secretKey);
            $frontendUrl = $_ENV['APP_URL'] ?? 'http://localhost:3000';

            $result = $paystack->transaction->initialize([
                'email'        => $user['email'],
                'amount'       => $planAmount,
                'plan'         => $planCode,
                'callback_url' => "{$frontendUrl}/dashboard/billing?subscribed=1",
                'metadata'     => [
                    'user_id' => $userId,
                    'plan'    => $plan,
                    'custom_fields' => [[
                        'display_name'  => 'Plan',
                        'variable_name' => 'plan',
                        'value'         => $config['label'],
                    ]],
                ],
            ]);

            if (!$result->status) {
                throw new \Exception('Paystack initialization failed.');
            }

            return $this->json($response, [
                'success' => true,
                'data'    => [
                    'authorization_url' => $result->data->authorization_url,
                    'reference'         => $result->data->reference,
                ],
            ]);
        } catch (\Throwable $e) {
            error_log("Subscription init error: " . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Return the current user's subscription status.
     * GET /api/v1/subscriptions/status
     */
    public function getStatus(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');

        try {
            $stmt = $this->getDb()->prepare("
                SELECT subscription_plan, subscription_expires_at FROM users WHERE id = ?
            ");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            $sub = null;
            if ($user && $user['subscription_plan'] !== 'free') {
                $stmt = $this->getDb()->prepare("
                    SELECT id, plan, status, amount, currency, next_payment_date, cancelled_at, created_at
                    FROM subscriptions
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                    LIMIT 1
                ");
                $stmt->execute([$userId]);
                $sub = $stmt->fetch(\PDO::FETCH_ASSOC);
            }

            return $this->json($response, [
                'success' => true,
                'data' => [
                    'plan'             => $user['subscription_plan'] ?? 'free',
                    'expires_at'       => $user['subscription_expires_at'] ?? null,
                    'subscription'     => $sub ?: null,
                ],
            ]);
        } catch (\Throwable $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel the active subscription or service package.
     * POST /api/v1/subscriptions/cancel
     */
    public function cancel(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');

        try {
            $stmt = $this->getDb()->prepare("
                SELECT id, plan, paystack_subscription_code, email_token, status
                FROM subscriptions
                WHERE user_id = ? AND status = 'active'
                LIMIT 1
            ");
            $stmt->execute([$userId]);
            $sub = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$sub) {
                return $this->json($response, [
                    'success' => false,
                    'error'   => 'No active subscription found.',
                ], 404);
            }

            if ($sub['plan'] === 'scholar') {
                // Recurring subscription — tell Paystack to stop renewing
                if ($sub['paystack_subscription_code'] && $sub['email_token']) {
                    $paystack = new Paystack($_ENV['PAYSTACK_SECRET_KEY'] ?? '');
                    $paystack->subscription->disable([
                        'code'  => $sub['paystack_subscription_code'],
                        'token' => $sub['email_token'],
                    ]);
                }

                // Mark as non_renewing — access continues until expires_at
                $stmt = $this->getDb()->prepare("
                    UPDATE subscriptions
                    SET status = 'non_renewing', cancelled_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$sub['id']]);

                $message = 'Your subscription will not renew. You keep access until your current period ends.';
            } else {
                // One-time service package — no Paystack subscription to disable
                $stmt = $this->getDb()->prepare("
                    UPDATE subscriptions
                    SET status = 'cancelled', cancelled_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$sub['id']]);

                $message = 'Your service package has been cancelled. Please contact support if you need assistance.';
            }

            return $this->json($response, [
                'success' => true,
                'message' => $message,
            ]);
        } catch (\Throwable $e) {
            error_log("Subscription cancel error: " . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}

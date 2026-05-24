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

    /**
     * Initialize a Scholar subscription checkout via Paystack.
     * POST /api/v1/subscriptions/initialize
     */
    public function initialize(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');

        try {
            // Block duplicate active subscriptions
            $stmt = $this->getDb()->prepare("
                SELECT id FROM subscriptions
                WHERE user_id = ? AND status IN ('active', 'non_renewing')
                LIMIT 1
            ");
            $stmt->execute([$userId]);
            if ($stmt->fetch()) {
                return $this->json($response, [
                    'success' => false,
                    'error' => 'You already have an active Scholar subscription.',
                ], 409);
            }

            $stmt = $this->getDb()->prepare("SELECT email FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$user) {
                return $this->json($response, ['success' => false, 'error' => 'User not found.'], 404);
            }

            $planCode = $_ENV['PAYSTACK_SCHOLAR_PLAN_CODE'] ?? null;
            if (!$planCode) {
                return $this->json($response, [
                    'success' => false,
                    'error' => 'Subscription plan not configured.',
                ], 500);
            }

            $paystack   = new Paystack($_ENV['PAYSTACK_SECRET_KEY']);
            $frontendUrl = $_ENV['APP_URL'] ?? 'http://localhost:3000';

            $result = $paystack->transaction->initialize([
                'email'        => $user['email'],
                'plan'         => $planCode,
                'callback_url' => "{$frontendUrl}/dashboard/billing?subscribed=1",
                'metadata'     => [
                    'user_id'    => $userId,
                    'plan'       => 'scholar',
                    'custom_fields' => [[
                        'display_name'  => 'Plan',
                        'variable_name' => 'plan',
                        'value'         => 'Scholar Annual',
                    ]],
                ],
            ]);

            if (!$result->status) {
                throw new \Exception('Paystack initialization failed.');
            }

            return $this->json($response, [
                'success' => true,
                'data' => [
                    'authorization_url' => $result->data->authorization_url,
                    'reference'         => $result->data->reference,
                ],
            ]);
        } catch (\Exception $e) {
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
            if ($user['subscription_plan'] !== 'free') {
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
                    'plan'             => $user['subscription_plan'],
                    'expires_at'       => $user['subscription_expires_at'],
                    'subscription'     => $sub,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel (set to non-renewing) the active Scholar subscription.
     * POST /api/v1/subscriptions/cancel
     */
    public function cancel(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');

        try {
            $stmt = $this->getDb()->prepare("
                SELECT id, paystack_subscription_code, email_token, status
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

            // Tell Paystack to stop renewing
            if ($sub['paystack_subscription_code'] && $sub['email_token']) {
                $paystack = new Paystack($_ENV['PAYSTACK_SECRET_KEY']);
                $paystack->subscription->disable([
                    'code'  => $sub['paystack_subscription_code'],
                    'token' => $sub['email_token'],
                ]);
            }

            // Mark locally as non_renewing — access continues until expires_at
            $stmt = $this->getDb()->prepare("
                UPDATE subscriptions
                SET status = 'non_renewing', cancelled_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$sub['id']]);

            return $this->json($response, [
                'success' => true,
                'message' => 'Your subscription will not renew. You keep access until your current period ends.',
            ]);
        } catch (\Exception $e) {
            error_log("Subscription cancel error: " . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}

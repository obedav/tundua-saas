<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\Referral;
use Tundua\Models\User;

class ReferralController
{
    /**
     * Get user's referral stats and list
     * GET /api/referrals
     */
    public function getUserReferrals(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            // Get user's referral code
            $userModel = new User();
            $user = $userModel->findById($userId);

            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'User not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $referralCode = $user['referral_code'] ?? null;

            // Generate one if doesn't exist
            if (!$referralCode) {
                $referralCode = Referral::generateReferralCode($userId);
                $userModel->updateReferralCode($userId, $referralCode);
            }

            $stats = Referral::getReferralStats($userId);
            $referrals = Referral::getUserReferrals($userId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'referral_code' => $referralCode,
                'referral_link' => $this->generateReferralLink($referralCode),
                'stats' => $stats,
                'referrals' => $referrals
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting referrals: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error',
                'message' => $_ENV['APP_DEBUG'] === 'true' ? $e->getMessage() : null
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create new referral
     * POST /api/referrals
     */
    public function createReferral(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();
            $userId = $request->getAttribute('user_id');

            if (!isset($data['email'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Email is required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Validate email
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid email address'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Check if email is already a user
            $userModel = new User();
            $existingUser = $userModel->findByEmail($data['email']);
            if ($existingUser) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'This email is already registered'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $source = $data['source'] ?? 'manual';
            $referral = Referral::createReferral($userId, $data['email'], $source);

            if (!$referral) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to create referral. Email may already be referred.'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Referral created successfully',
                'referral' => $referral
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error creating referral: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Claim referral reward
     * POST /api/referrals/{id}/claim
     */
    public function claimReward(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');

            $success = Referral::claimReward($id, $userId);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Reward not found or already claimed'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Reward claimed successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error claiming reward: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Helper: Generate referral link
     */
    private function generateReferralLink(string $code): string
    {
        $baseUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000';
        return "{$baseUrl}/auth/register?ref={$code}";
    }
}

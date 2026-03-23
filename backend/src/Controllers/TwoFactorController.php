<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\User;
use Tundua\Services\AuthService;
use Tundua\Services\TwoFactorService;

class TwoFactorController
{
    private AuthService $authService;
    private TwoFactorService $twoFactorService;

    public function __construct()
    {
        $this->authService = new AuthService();
        $this->twoFactorService = new TwoFactorService();
    }

    /**
     * Set up 2FA - generate secret and QR URI
     * POST /api/auth/2fa/setup
     * Requires: AuthMiddleware
     */
    public function setup(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $user = User::findById($userId);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found',
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        // Check if 2FA is already enabled
        if ($user->two_factor_enabled) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Two-factor authentication is already enabled. Disable it first to reconfigure.',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Generate a new TOTP secret
        $secret = $this->twoFactorService->generateSecret();

        // Generate the otpauth URI for QR code scanning
        $otpAuthUri = $this->twoFactorService->generateOtpAuthUri($secret, $user->email);

        // Encrypt and store the secret (not yet confirmed)
        $encryptedSecret = $this->twoFactorService->encryptSecret($secret);
        $user->two_factor_secret = $encryptedSecret;
        $user->two_factor_enabled = false;
        $user->two_factor_confirmed_at = null;
        $user->save();

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Two-factor authentication setup initiated. Scan the QR code with your authenticator app and verify with a code.',
            'data' => [
                'secret' => $secret,
                'otpauth_uri' => $otpAuthUri,
            ],
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Verify TOTP code and enable 2FA
     * POST /api/auth/2fa/verify
     * Requires: AuthMiddleware
     * Body: { "code": "123456" }
     */
    public function verify(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $user = User::findById($userId);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found',
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        // Check that setup was initiated (secret exists but not yet enabled)
        if (!$user->two_factor_secret) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Two-factor authentication has not been set up. Call /api/auth/2fa/setup first.',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if ($user->two_factor_enabled) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Two-factor authentication is already enabled.',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();
        $code = $data['code'] ?? '';

        if (empty($code)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Verification code is required',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Decrypt the secret and verify the code
        $secret = $this->twoFactorService->decryptSecret($user->two_factor_secret);
        $isValid = $this->twoFactorService->verifyCode($secret, $code);

        if (!$isValid) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid verification code. Please try again.',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Generate recovery codes
        $recoveryCodes = $this->twoFactorService->generateRecoveryCodes();
        $hashedCodes = $this->twoFactorService->hashRecoveryCodes($recoveryCodes);

        // Enable 2FA
        $user->two_factor_enabled = true;
        $user->two_factor_confirmed_at = date('Y-m-d H:i:s');
        $user->two_factor_recovery_codes = json_encode($hashedCodes);
        $user->save();

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Two-factor authentication has been enabled successfully.',
            'data' => [
                'recovery_codes' => $recoveryCodes,
            ],
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Disable 2FA with password confirmation
     * POST /api/auth/2fa/disable
     * Requires: AuthMiddleware
     * Body: { "password": "current_password" }
     */
    public function disable(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $user = User::findById($userId);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found',
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        if (!$user->two_factor_enabled) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Two-factor authentication is not enabled.',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();
        $password = $data['password'] ?? '';

        if (empty($password)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Password confirmation is required to disable two-factor authentication.',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Verify password
        if (!$this->authService->verifyPassword($password, $user->password_hash)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid password.',
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Disable 2FA and clear all related data
        $user->two_factor_secret = null;
        $user->two_factor_enabled = false;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Two-factor authentication has been disabled.',
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Verify 2FA code during login (challenge step)
     * POST /api/auth/2fa/challenge
     * Body: { "temp_token": "...", "code": "123456" }
     */
    public function challenge(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $tempToken = $data['temp_token'] ?? '';
        $code = $data['code'] ?? '';

        if (empty($tempToken) || empty($code)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Temporary token and verification code are required',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Verify the temporary token
        $decoded = $this->twoFactorService->verifyTempToken($tempToken);

        if (!$decoded) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired temporary token. Please login again.',
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Get user
        $user = User::findById($decoded->sub);

        if (!$user || !$user->two_factor_enabled) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found or two-factor authentication is not enabled.',
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Decrypt secret and verify code
        $secret = $this->twoFactorService->decryptSecret($user->two_factor_secret);
        $isValid = $this->twoFactorService->verifyCode($secret, $code);

        if (!$isValid) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid verification code.',
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Generate full JWT tokens
        $tokens = $this->authService->generateLoginResponse($user);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Two-factor authentication verified successfully.',
            'data' => $tokens,
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Use recovery code during login
     * POST /api/auth/2fa/recovery
     * Body: { "temp_token": "...", "recovery_code": "abcde-fghij" }
     */
    public function recovery(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $tempToken = $data['temp_token'] ?? '';
        $recoveryCode = $data['recovery_code'] ?? '';

        if (empty($tempToken) || empty($recoveryCode)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Temporary token and recovery code are required',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Verify the temporary token
        $decoded = $this->twoFactorService->verifyTempToken($tempToken);

        if (!$decoded) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired temporary token. Please login again.',
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Get user
        $user = User::findById($decoded->sub);

        if (!$user || !$user->two_factor_enabled) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found or two-factor authentication is not enabled.',
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Get hashed recovery codes
        $hashedCodes = json_decode($user->two_factor_recovery_codes, true);

        if (!is_array($hashedCodes) || empty($hashedCodes)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'No recovery codes available. Please contact support.',
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Verify recovery code
        $matchIndex = $this->twoFactorService->verifyRecoveryCode($recoveryCode, $hashedCodes);

        if ($matchIndex === false) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid recovery code.',
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Remove used recovery code
        array_splice($hashedCodes, $matchIndex, 1);
        $user->two_factor_recovery_codes = json_encode(array_values($hashedCodes));
        $user->save();

        // Generate full JWT tokens
        $tokens = $this->authService->generateLoginResponse($user);

        $remainingCodes = count($hashedCodes);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => "Recovery code accepted. You have {$remainingCodes} recovery code(s) remaining.",
            'data' => $tokens,
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}

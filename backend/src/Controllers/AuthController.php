<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\User;
use Tundua\Services\AuthService;
use Tundua\Services\EmailService;

class AuthController
{
    private User $userModel;
    private AuthService $authService;
    private EmailService $emailService;

    public function __construct()
    {
        $this->userModel = new User();
        $this->authService = new AuthService();
        $this->emailService = new EmailService();
    }

    /**
     * Register new user
     * POST /api/auth/register
     */
    public function register(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validate required fields
        $requiredFields = ['first_name', 'last_name', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => "Field '{$field}' is required"
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }

        // Sanitize inputs
        $firstName = $this->authService->sanitizeInput($data['first_name']);
        $lastName = $this->authService->sanitizeInput($data['last_name']);
        $email = strtolower(trim($data['email']));
        $password = $data['password'];
        $phone = isset($data['phone']) ? $this->authService->sanitizeInput($data['phone']) : null;

        // Validate email
        if (!$this->authService->validateEmail($email)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid email format'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Check if email already exists
        if ($this->userModel->emailExists($email)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Email already registered'
            ]));
            return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
        }

        // Validate password strength
        $passwordValidation = $this->authService->validatePassword($password);
        if (!$passwordValidation['valid']) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Password validation failed',
                'details' => $passwordValidation['errors']
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Hash password
        $passwordHash = $this->authService->hashPassword($password);

        // Generate UUID and email verification token
        $uuid = $this->authService->generateUuid();
        $verificationToken = $this->authService->generateEmailVerificationToken();

        // Create user
        $userId = $this->userModel->create([
            'uuid' => $uuid,
            'email' => $email,
            'password_hash' => $passwordHash,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $phone,
            'role' => 'user',
            'email_verification_token' => $verificationToken
        ]);

        if (!$userId) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to create user'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }

        // Send verification email
        $verificationUrl = $this->authService->generateVerificationUrl($verificationToken);
        $this->emailService->sendVerificationEmail($email, $firstName, $verificationUrl);

        // Get created user
        $user = $this->userModel->findById($userId);

        // Generate tokens
        $tokens = $this->authService->generateLoginResponse($user);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Registration successful. Please check your email to verify your account.',
            'data' => $tokens
        ]));

        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validate required fields
        if (empty($data['email']) || empty($data['password'])) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Email and password are required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $email = strtolower(trim($data['email']));
        $password = $data['password'];

        // Find user by email
        $user = $this->userModel->findByEmail($email);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid credentials'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Check if account is locked
        if ($this->userModel->isLocked($user['id'])) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
            ]));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        // Verify password
        if (!$this->authService->verifyPassword($password, $user['password_hash'])) {
            // Increment failed login attempts
            $this->userModel->incrementLoginAttempts($user['id']);

            // Lock account after 5 failed attempts
            if (($user['login_attempts'] + 1) >= 5) {
                $this->userModel->lockAccount($user['id'], 30); // Lock for 30 minutes
            }

            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid credentials'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Check if account is active
        if (!$this->authService->isAccountActive($user)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Account is deactivated. Please contact support.'
            ]));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        // Reset login attempts and update last login
        $this->userModel->resetLoginAttempts($user['id']);
        $this->userModel->updateLastLogin($user['id']);

        // Generate tokens
        $tokens = $this->authService->generateLoginResponse($user);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => $tokens
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Get current authenticated user
     * GET /api/auth/me
     */
    public function me(Request $request, Response $response): Response
    {
        // User is attached by AuthMiddleware
        $userId = $request->getAttribute('user_id');

        if (!$userId) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Unauthorized'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $user = $this->userModel->findById($userId);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $safeUser = $this->userModel->getSafeUser($user);

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $safeUser
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Update current user profile
     * PUT /api/auth/me
     */
    public function updateProfile(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $data = $request->getParsedBody();

        // Allowed fields to update
        $allowedFields = ['first_name', 'last_name', 'phone'];
        $updateData = [];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $this->authService->sanitizeInput($data[$field]);
            }
        }

        if (empty($updateData)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'No valid fields to update'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $success = $this->userModel->update($userId, $updateData);

        if (!$success) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update profile'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }

        $user = $this->userModel->findById($userId);
        $safeUser = $this->userModel->getSafeUser($user);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $safeUser
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Verify email address
     * GET /api/auth/verify-email/{token}
     */
    public function verifyEmail(Request $request, Response $response, array $args): Response
    {
        $token = $args['token'] ?? null;

        if (!$token) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Verification token is required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $user = $this->userModel->findByEmailVerificationToken($token);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired verification token'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $success = $this->userModel->verifyEmail($user['id']);

        if (!$success) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to verify email'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Email verified successfully'
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Request password reset
     * POST /api/auth/forgot-password
     */
    public function forgotPassword(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $email = strtolower(trim($data['email'] ?? ''));

        if (empty($email)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Email is required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $user = $this->userModel->findByEmail($email);

        // Always return success for security (don't reveal if email exists)
        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'If an account exists with this email, a password reset link has been sent.'
            ]));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        }

        // Generate reset token
        $resetToken = $this->authService->generatePasswordResetToken();
        $expiresAt = $this->authService->getTokenExpiry(1); // 1 hour

        // Update user with reset token
        $this->userModel->update($user['id'], [
            'password_reset_token' => $resetToken,
            'password_reset_expires' => $expiresAt
        ]);

        // Send reset email
        $resetUrl = $this->authService->generatePasswordResetUrl($resetToken);
        $this->emailService->sendPasswordResetEmail($email, $user['first_name'], $resetUrl);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'If an account exists with this email, a password reset link has been sent.'
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Reset password
     * POST /api/auth/reset-password
     */
    public function resetPassword(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $token = $data['token'] ?? null;
        $password = $data['password'] ?? null;

        if (!$token || !$password) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Token and password are required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Find user by reset token
        $user = $this->userModel->findByPasswordResetToken($token);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired reset token'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Validate new password
        $passwordValidation = $this->authService->validatePassword($password);
        if (!$passwordValidation['valid']) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Password validation failed',
                'details' => $passwordValidation['errors']
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Hash new password
        $passwordHash = $this->authService->hashPassword($password);

        // Update password and clear reset token
        $success = $this->userModel->update($user['id'], [
            'password_hash' => $passwordHash,
            'password_reset_token' => null,
            'password_reset_expires' => null
        ]);

        if (!$success) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to reset password'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Password reset successfully. You can now login with your new password.'
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    public function refresh(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $refreshToken = $data['refresh_token'] ?? null;

        if (!$refreshToken) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Refresh token is required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Verify refresh token
        $decoded = $this->authService->verifyToken($refreshToken);

        if (!$decoded || $decoded->type !== 'refresh') {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid refresh token'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Get user
        $user = $this->userModel->findById($decoded->sub);

        if (!$user || !$this->authService->isAccountActive($user)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found or account inactive'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Generate new tokens
        $tokens = $this->authService->generateLoginResponse($user);

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $tokens
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Logout (client-side token deletion)
     * POST /api/auth/logout
     */
    public function logout(Request $request, Response $response): Response
    {
        // In a stateless JWT system, logout is typically handled client-side
        // by deleting the tokens. This endpoint exists for consistency.

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Logout successful'
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}

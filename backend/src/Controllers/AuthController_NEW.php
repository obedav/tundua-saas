<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\User;
use Tundua\Services\AuthService;
use Tundua\Services\EmailService;

/**
 * AuthController (UPDATED FOR ELOQUENT)
 *
 * Changes from PDO version:
 * - User model now returns User objects instead of arrays
 * - Changed array access ($user['field']) to object access ($user->field)
 * - Changed static methods requiring IDs to instance methods
 * - Simplified code by using Eloquent features
 */
class AuthController
{
    private AuthService $authService;
    private EmailService $emailService;

    public function __construct()
    {
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
        if (User::emailExists($email)) {
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

        // Set verification token expiry (24 hours from now)
        $verificationExpires = date('Y-m-d H:i:s', strtotime('+24 hours'));

        // Create user (ELOQUENT: returns User object or null)
        $user = User::createUser([
            'uuid' => $uuid,
            'email' => $email,
            'password_hash' => $passwordHash,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $phone,
            'role' => 'user',
            'email_verification_token' => $verificationToken,
            'email_verification_expires' => $verificationExpires
        ]);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to create user'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }

        // Send verification email
        $verificationUrl = $this->authService->generateVerificationUrl($verificationToken);
        $this->emailService->sendVerificationEmail($email, $firstName, $verificationUrl);

        // Generate tokens (AuthService needs to handle User object now)
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

        // Find user by email (ELOQUENT: returns User object or null)
        $user = User::findByEmail($email);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid credentials'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Check if account is locked (ELOQUENT: instance method)
        if ($user->isLocked()) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
            ]));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        // Verify password (ELOQUENT: object property access)
        if (!$this->authService->verifyPassword($password, $user->password_hash)) {
            // Increment failed login attempts (ELOQUENT: instance method)
            $user->incrementLoginAttempts();

            // Lock account after 5 failed attempts
            if ($user->login_attempts >= 5) {
                $user->lockAccount(30); // Lock for 30 minutes
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

        // Reset login attempts and update last login (ELOQUENT: instance methods)
        $user->resetLoginAttempts();
        $user->updateLastLogin();

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

        // Find user by ID (ELOQUENT: returns User object or null)
        $user = User::find($userId);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        // Get safe user data (ELOQUENT: instance method)
        $safeUser = $user->getSafeData();

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

        // Find user first (ELOQUENT: need User object to update)
        $user = User::find($userId);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

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

        // Update user (ELOQUENT: instance method)
        $success = $user->update($updateData);

        if (!$success) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update profile'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }

        // Refresh user data from database
        $user->refresh();
        $safeUser = $user->getSafeData();

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

        // Find user by token (ELOQUENT: returns User object or null)
        $user = User::findByEmailVerificationToken($token);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired verification token'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Verify email (ELOQUENT: instance method)
        $success = $user->verifyEmail();

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

        // Find user by email (ELOQUENT: returns User object or null)
        $user = User::findByEmail($email);

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

        // Update user with reset token (ELOQUENT: instance method)
        $user->update([
            'password_reset_token' => $resetToken,
            'password_reset_expires' => $expiresAt
        ]);

        // Send reset email (ELOQUENT: object property access)
        $resetUrl = $this->authService->generatePasswordResetUrl($resetToken);
        $this->emailService->sendPasswordResetEmail($email, $user->first_name, $resetUrl);

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
        $newPassword = $data['password'] ?? null;

        if (!$token || !$newPassword) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Token and new password are required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Validate password strength
        $passwordValidation = $this->authService->validatePassword($newPassword);
        if (!$passwordValidation['valid']) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Password validation failed',
                'details' => $passwordValidation['errors']
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Find user by reset token (ELOQUENT: returns User object or null)
        $user = User::findByPasswordResetToken($token);

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired reset token'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Hash new password
        $passwordHash = $this->authService->hashPassword($newPassword);

        // Update password and clear reset token (ELOQUENT: instance method)
        $user->update([
            'password_hash' => $passwordHash,
            'password_reset_token' => null,
            'password_reset_expires' => null
        ]);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Password reset successfully'
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    public function logout(Request $request, Response $response): Response
    {
        // In a stateless JWT system, logout is typically handled client-side
        // by removing the token. Server-side logout would require token blacklisting.

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Logged out successfully'
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}

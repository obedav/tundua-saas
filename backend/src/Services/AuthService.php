<?php

namespace Tundua\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Ramsey\Uuid\Uuid;

class AuthService
{
    private string $jwtSecret;
    private string $jwtAlgorithm;
    private int $jwtExpiry;
    private int $jwtRefreshExpiry;

    public function __construct()
    {
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-in-production';
        $this->jwtAlgorithm = $_ENV['JWT_ALGORITHM'] ?? 'HS256';
        $this->jwtExpiry = (int)($_ENV['JWT_EXPIRY'] ?? 3600); // 1 hour
        $this->jwtRefreshExpiry = (int)($_ENV['JWT_REFRESH_EXPIRY'] ?? 2592000); // 30 days
    }

    /**
     * Hash password using bcrypt
     */
    public function hashPassword(string $password): string
    {
        $cost = (int)($_ENV['BCRYPT_ROUNDS'] ?? 12);
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => $cost]);
    }

    /**
     * Verify password against hash
     */
    public function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * Generate JWT access token
     */
    public function generateAccessToken(array $user): string
    {
        $now = time();
        $payload = [
            'iat' => $now,
            'exp' => $now + $this->jwtExpiry,
            'sub' => $user['id'],
            'uuid' => $user['uuid'],
            'email' => $user['email'],
            'role' => $user['role'],
            'type' => 'access'
        ];

        return JWT::encode($payload, $this->jwtSecret, $this->jwtAlgorithm);
    }

    /**
     * Generate JWT refresh token
     */
    public function generateRefreshToken(array $user): string
    {
        $now = time();
        $payload = [
            'iat' => $now,
            'exp' => $now + $this->jwtRefreshExpiry,
            'sub' => $user['id'],
            'uuid' => $user['uuid'],
            'type' => 'refresh'
        ];

        return JWT::encode($payload, $this->jwtSecret, $this->jwtAlgorithm);
    }

    /**
     * Verify and decode JWT token
     */
    public function verifyToken(string $token): ?object
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, $this->jwtAlgorithm));
            return $decoded;
        } catch (\Exception $e) {
            error_log("JWT verification failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Extract token from Authorization header
     */
    public function extractTokenFromHeader(?string $header): ?string
    {
        if (!$header) {
            return null;
        }

        // Format: "Bearer <token>"
        if (preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Generate UUID v4
     */
    public function generateUuid(): string
    {
        return Uuid::uuid4()->toString();
    }

    /**
     * Generate random token for email verification or password reset
     */
    public function generateRandomToken(int $length = 32): string
    {
        return bin2hex(random_bytes($length));
    }

    /**
     * Generate email verification token
     */
    public function generateEmailVerificationToken(): string
    {
        return $this->generateRandomToken(32);
    }

    /**
     * Generate password reset token
     */
    public function generatePasswordResetToken(): string
    {
        return $this->generateRandomToken(32);
    }

    /**
     * Get token expiry timestamp
     */
    public function getTokenExpiry(int $hoursFromNow = 24): string
    {
        return date('Y-m-d H:i:s', strtotime("+{$hoursFromNow} hours"));
    }

    /**
     * Validate email format
     */
    public function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Validate password strength
     * Minimum 8 characters, at least one uppercase, one lowercase, one number
     */
    public function validatePassword(string $password): array
    {
        $errors = [];

        if (strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters long';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password must contain at least one number';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Sanitize user input
     */
    public function sanitizeInput(string $input): string
    {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Generate login response with tokens
     */
    public function generateLoginResponse(array $user): array
    {
        $accessToken = $this->generateAccessToken($user);
        $refreshToken = $this->generateRefreshToken($user);

        // Remove sensitive data
        unset($user['password_hash']);
        unset($user['email_verification_token']);
        unset($user['email_verification_expires']);
        unset($user['password_reset_token']);
        unset($user['password_reset_expires']);

        return [
            'user' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => $this->jwtExpiry
        ];
    }

    /**
     * Check if user account is active
     */
    public function isAccountActive(array $user): bool
    {
        return (bool)$user['is_active'];
    }

    /**
     * Check if email is verified
     */
    public function isEmailVerified(array $user): bool
    {
        return (bool)$user['email_verified'];
    }

    /**
     * Generate verification URL
     */
    public function generateVerificationUrl(string $token): string
    {
        $appUrl = $_ENV['APP_URL'] ?? 'http://localhost:3000';
        return "{$appUrl}/auth/verify-email?token={$token}";
    }

    /**
     * Generate password reset URL
     */
    public function generatePasswordResetUrl(string $token): string
    {
        $appUrl = $_ENV['APP_URL'] ?? 'http://localhost:3000';
        return "{$appUrl}/auth/reset-password?token={$token}";
    }

    /**
     * Check if password reset token is expired
     */
    public function isTokenExpired(?string $expiryDate): bool
    {
        if (!$expiryDate) {
            return true;
        }

        return strtotime($expiryDate) < time();
    }
}

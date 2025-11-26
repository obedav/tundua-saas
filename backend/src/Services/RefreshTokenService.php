<?php

namespace Tundua\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Tundua\Models\User;

/**
 * Refresh Token Service
 *
 * Manages JWT refresh tokens for better UX and security
 *
 * Features:
 * - Generate refresh tokens (30 days)
 * - Validate and rotate refresh tokens
 * - Token blacklisting (optional)
 * - Automatic access token refresh
 */
class RefreshTokenService
{
    private string $jwtSecret;
    private string $jwtAlgorithm;
    private int $accessTokenExpiry;
    private int $refreshTokenExpiry;
    private string $storageDir;

    public function __construct()
    {
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-in-production';
        $this->jwtAlgorithm = $_ENV['JWT_ALGORITHM'] ?? 'HS256';
        $this->accessTokenExpiry = (int)($_ENV['JWT_EXPIRY'] ?? 3600); // 1 hour
        $this->refreshTokenExpiry = (int)($_ENV['JWT_REFRESH_EXPIRY'] ?? 2592000); // 30 days
        $this->storageDir = __DIR__ . '/../../storage/refresh_tokens';

        // Ensure storage directory exists
        if (!is_dir($this->storageDir)) {
            mkdir($this->storageDir, 0755, true);
        }
    }

    /**
     * Generate refresh token
     */
    public function generateRefreshToken($user): string
    {
        // Convert User object to array if needed
        $userData = $user instanceof User ? $user->toArray() : $user;

        $now = time();
        $jti = bin2hex(random_bytes(16)); // Unique token ID

        $payload = [
            'iat' => $now,
            'exp' => $now + $this->refreshTokenExpiry,
            'sub' => $userData['id'],
            'uuid' => $userData['uuid'],
            'jti' => $jti,
            'type' => 'refresh'
        ];

        $token = JWT::encode($payload, $this->jwtSecret, $this->jwtAlgorithm);

        // Store token metadata for tracking
        $this->storeTokenMetadata($jti, $userData['id'], $now + $this->refreshTokenExpiry);

        return $token;
    }

    /**
     * Generate new access token from refresh token
     */
    public function refreshAccessToken(string $refreshToken): ?array
    {
        try {
            // Decode and validate refresh token
            $decoded = JWT::decode($refreshToken, new Key($this->jwtSecret, $this->jwtAlgorithm));

            // Verify token type
            if ($decoded->type !== 'refresh') {
                error_log("Invalid token type: {$decoded->type}");
                return null;
            }

            // Check if token is blacklisted
            if ($this->isTokenBlacklisted($decoded->jti)) {
                error_log("Token is blacklisted: {$decoded->jti}");
                return null;
            }

            // Get user
            $user = User::find($decoded->sub);

            if (!$user) {
                error_log("User not found: {$decoded->sub}");
                return null;
            }

            // Check if user is active
            if (!$user->is_active) {
                error_log("User is not active: {$decoded->sub}");
                return null;
            }

            // Generate new access token
            $authService = new AuthService();
            $accessToken = $authService->generateAccessToken($user);

            // Optionally rotate refresh token (more secure)
            $shouldRotate = filter_var($_ENV['REFRESH_TOKEN_ROTATION'] ?? false, FILTER_VALIDATE_BOOLEAN);

            if ($shouldRotate) {
                // Blacklist old refresh token
                $this->blacklistToken($decoded->jti);

                // Generate new refresh token
                $newRefreshToken = $this->generateRefreshToken($user);
            } else {
                $newRefreshToken = $refreshToken;
            }

            return [
                'access_token' => $accessToken,
                'refresh_token' => $newRefreshToken,
                'token_type' => 'Bearer',
                'expires_in' => $this->accessTokenExpiry
            ];

        } catch (\Exception $e) {
            error_log("Refresh token validation failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate refresh token
     */
    public function validateRefreshToken(string $refreshToken): bool
    {
        try {
            $decoded = JWT::decode($refreshToken, new Key($this->jwtSecret, $this->jwtAlgorithm));

            // Check token type
            if ($decoded->type !== 'refresh') {
                return false;
            }

            // Check if blacklisted
            if ($this->isTokenBlacklisted($decoded->jti)) {
                return false;
            }

            return true;

        } catch (\Exception $e) {
            error_log("Refresh token validation failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Revoke refresh token (logout)
     */
    public function revokeToken(string $refreshToken): bool
    {
        try {
            $decoded = JWT::decode($refreshToken, new Key($this->jwtSecret, $this->jwtAlgorithm));

            // Blacklist token
            return $this->blacklistToken($decoded->jti);

        } catch (\Exception $e) {
            error_log("Failed to revoke token: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Revoke all user tokens (logout from all devices)
     */
    public function revokeAllUserTokens(int $userId): int
    {
        $count = 0;
        $files = glob($this->storageDir . "/token_*.json");

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);

            if ($data && $data['user_id'] == $userId) {
                // Blacklist token
                $this->blacklistToken($data['jti']);
                $count++;
            }
        }

        return $count;
    }

    /**
     * Store token metadata
     */
    private function storeTokenMetadata(string $jti, int $userId, int $expiresAt): void
    {
        $data = [
            'jti' => $jti,
            'user_id' => $userId,
            'created_at' => time(),
            'expires_at' => $expiresAt,
            'blacklisted' => false
        ];

        $filePath = $this->storageDir . "/token_{$jti}.json";
        file_put_contents($filePath, json_encode($data));
    }

    /**
     * Blacklist a token
     */
    private function blacklistToken(string $jti): bool
    {
        $filePath = $this->storageDir . "/token_{$jti}.json";

        if (!file_exists($filePath)) {
            // Token doesn't exist, create blacklist entry
            $data = [
                'jti' => $jti,
                'blacklisted' => true,
                'blacklisted_at' => time()
            ];
        } else {
            $data = json_decode(file_get_contents($filePath), true);
            $data['blacklisted'] = true;
            $data['blacklisted_at'] = time();
        }

        return file_put_contents($filePath, json_encode($data)) !== false;
    }

    /**
     * Check if token is blacklisted
     */
    private function isTokenBlacklisted(string $jti): bool
    {
        $filePath = $this->storageDir . "/token_{$jti}.json";

        if (!file_exists($filePath)) {
            return false;
        }

        $data = json_decode(file_get_contents($filePath), true);

        return $data && ($data['blacklisted'] ?? false);
    }

    /**
     * Clean up expired tokens (call via cron)
     */
    public static function cleanup(): int
    {
        $storageDir = __DIR__ . '/../../storage/refresh_tokens';
        $deleted = 0;

        if (!is_dir($storageDir)) {
            return 0;
        }

        $files = glob($storageDir . '/token_*.json');
        $now = time();

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);

            // Delete if expired
            if ($data && isset($data['expires_at']) && $now >= $data['expires_at']) {
                unlink($file);
                $deleted++;
            }
        }

        return $deleted;
    }

    /**
     * Get token info
     */
    public function getTokenInfo(string $refreshToken): ?array
    {
        try {
            $decoded = JWT::decode($refreshToken, new Key($this->jwtSecret, $this->jwtAlgorithm));

            return [
                'user_id' => $decoded->sub,
                'uuid' => $decoded->uuid,
                'jti' => $decoded->jti,
                'issued_at' => $decoded->iat,
                'expires_at' => $decoded->exp,
                'is_expired' => time() >= $decoded->exp,
                'is_blacklisted' => $this->isTokenBlacklisted($decoded->jti)
            ];

        } catch (\Exception $e) {
            error_log("Failed to get token info: " . $e->getMessage());
            return null;
        }
    }
}

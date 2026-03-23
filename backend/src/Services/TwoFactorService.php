<?php

namespace Tundua\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TwoFactorService
{
    private string $jwtSecret;
    private string $jwtAlgorithm;
    private string $encryptionKey;

    /**
     * Base32 alphabet (RFC 4648)
     */
    private const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    /**
     * TOTP parameters (RFC 6238)
     */
    private const TOTP_PERIOD = 30;
    private const TOTP_DIGITS = 6;
    private const TOTP_ALGORITHM = 'sha1';

    /**
     * Recovery code parameters
     */
    private const RECOVERY_CODE_COUNT = 8;
    private const RECOVERY_CODE_LENGTH = 10;

    /**
     * Temp token expiry (5 minutes)
     */
    private const TEMP_TOKEN_EXPIRY = 300;

    public function __construct()
    {
        if (empty($_ENV['JWT_SECRET'])) {
            throw new \RuntimeException('JWT_SECRET environment variable is required.');
        }
        $this->jwtSecret = $_ENV['JWT_SECRET'];
        $this->jwtAlgorithm = $_ENV['JWT_ALGORITHM'] ?? 'HS256';

        // Derive a separate encryption key from JWT_SECRET for encrypting TOTP secrets
        $this->encryptionKey = hash('sha256', $this->jwtSecret . ':2fa_encryption', true);
    }

    // ============================================
    // TOTP SECRET GENERATION
    // ============================================

    /**
     * Generate a random TOTP secret (160-bit, base32 encoded)
     */
    public function generateSecret(): string
    {
        // 160 bits = 20 bytes
        $randomBytes = random_bytes(20);
        return $this->base32Encode($randomBytes);
    }

    /**
     * Generate otpauth:// URI for QR code generation
     */
    public function generateOtpAuthUri(string $secret, string $email, string $issuer = 'Tundua'): string
    {
        $params = [
            'secret' => $secret,
            'issuer' => $issuer,
            'algorithm' => strtoupper(self::TOTP_ALGORITHM),
            'digits' => self::TOTP_DIGITS,
            'period' => self::TOTP_PERIOD,
        ];

        $label = rawurlencode($issuer) . ':' . rawurlencode($email);
        $query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);

        return "otpauth://totp/{$label}?{$query}";
    }

    // ============================================
    // TOTP CODE GENERATION & VERIFICATION (RFC 6238)
    // ============================================

    /**
     * Generate TOTP code for the current time
     */
    public function generateCode(string $secret, ?int $timestamp = null): string
    {
        $timestamp = $timestamp ?? time();
        $timeCounter = (int) floor($timestamp / self::TOTP_PERIOD);

        return $this->hotpCode($secret, $timeCounter);
    }

    /**
     * Verify a TOTP code with 1-step window tolerance for clock drift
     */
    public function verifyCode(string $secret, string $code, ?int $timestamp = null): bool
    {
        $timestamp = $timestamp ?? time();
        $timeCounter = (int) floor($timestamp / self::TOTP_PERIOD);

        // Check current time step and +/- 1 step for clock drift
        for ($offset = -1; $offset <= 1; $offset++) {
            $expectedCode = $this->hotpCode($secret, $timeCounter + $offset);
            if (hash_equals($expectedCode, $code)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Generate HOTP code (RFC 4226)
     * This is the core algorithm used by TOTP
     */
    private function hotpCode(string $base32Secret, int $counter): string
    {
        // Decode base32 secret to raw bytes
        $secretBytes = $this->base32Decode($base32Secret);

        // Pack counter as 8-byte big-endian
        $counterBytes = pack('N*', 0, $counter);

        // HMAC-SHA1
        $hash = hash_hmac(self::TOTP_ALGORITHM, $counterBytes, $secretBytes, true);

        // Dynamic truncation (RFC 4226 Section 5.4)
        $offset = ord($hash[strlen($hash) - 1]) & 0x0F;

        $binary = (
            ((ord($hash[$offset]) & 0x7F) << 24) |
            ((ord($hash[$offset + 1]) & 0xFF) << 16) |
            ((ord($hash[$offset + 2]) & 0xFF) << 8) |
            (ord($hash[$offset + 3]) & 0xFF)
        );

        // Modulo to get desired number of digits
        $otp = $binary % (10 ** self::TOTP_DIGITS);

        return str_pad((string) $otp, self::TOTP_DIGITS, '0', STR_PAD_LEFT);
    }

    // ============================================
    // RECOVERY CODES
    // ============================================

    /**
     * Generate recovery codes (plaintext)
     *
     * @return string[] Array of plaintext recovery codes
     */
    public function generateRecoveryCodes(): array
    {
        $codes = [];
        $charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
        $charsetLen = strlen($charset);

        for ($i = 0; $i < self::RECOVERY_CODE_COUNT; $i++) {
            $code = '';
            $bytes = random_bytes(self::RECOVERY_CODE_LENGTH);
            for ($j = 0; $j < self::RECOVERY_CODE_LENGTH; $j++) {
                $code .= $charset[ord($bytes[$j]) % $charsetLen];
            }
            // Insert a dash in the middle for readability (e.g., "abcde-fghij")
            $codes[] = substr($code, 0, 5) . '-' . substr($code, 5);
        }

        return $codes;
    }

    /**
     * Hash recovery codes for storage
     *
     * @param string[] $codes Plaintext recovery codes
     * @return string[] Hashed recovery codes
     */
    public function hashRecoveryCodes(array $codes): array
    {
        return array_map(function (string $code) {
            return hash('sha256', $code);
        }, $codes);
    }

    /**
     * Verify a recovery code against hashed codes
     *
     * @param string $code Plaintext recovery code
     * @param string[] $hashedCodes Array of hashed recovery codes
     * @return int|false Index of matching code, or false if not found
     */
    public function verifyRecoveryCode(string $code, array $hashedCodes): int|false
    {
        $hashedInput = hash('sha256', $code);

        foreach ($hashedCodes as $index => $hashedCode) {
            if (hash_equals($hashedCode, $hashedInput)) {
                return $index;
            }
        }

        return false;
    }

    // ============================================
    // SECRET ENCRYPTION / DECRYPTION
    // ============================================

    /**
     * Encrypt TOTP secret for database storage
     */
    public function encryptSecret(string $secret): string
    {
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($secret, 'aes-256-cbc', $this->encryptionKey, OPENSSL_RAW_DATA, $iv);

        if ($encrypted === false) {
            throw new \RuntimeException('Failed to encrypt TOTP secret');
        }

        // Prepend IV to ciphertext and base64 encode
        return base64_encode($iv . $encrypted);
    }

    /**
     * Decrypt TOTP secret from database storage
     */
    public function decryptSecret(string $encryptedSecret): string
    {
        $data = base64_decode($encryptedSecret, true);

        if ($data === false || strlen($data) < 17) {
            throw new \RuntimeException('Invalid encrypted TOTP secret');
        }

        $iv = substr($data, 0, 16);
        $ciphertext = substr($data, 16);

        $decrypted = openssl_decrypt($ciphertext, 'aes-256-cbc', $this->encryptionKey, OPENSSL_RAW_DATA, $iv);

        if ($decrypted === false) {
            throw new \RuntimeException('Failed to decrypt TOTP secret');
        }

        return $decrypted;
    }

    // ============================================
    // TEMPORARY TOKEN FOR 2FA CHALLENGE
    // ============================================

    /**
     * Generate a temporary token for the 2FA challenge flow
     * This token is short-lived and only allows completing the 2FA challenge
     */
    public function generateTempToken(array|object $user): string
    {
        $now = time();

        if (is_object($user)) {
            $user = $user->toArray();
        }

        $payload = [
            'iat' => $now,
            'exp' => $now + self::TEMP_TOKEN_EXPIRY,
            'sub' => $user['id'],
            'uuid' => $user['uuid'],
            'email' => $user['email'],
            'type' => '2fa_challenge',
        ];

        return JWT::encode($payload, $this->jwtSecret, $this->jwtAlgorithm);
    }

    /**
     * Verify a temporary 2FA challenge token
     */
    public function verifyTempToken(string $token): ?object
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, $this->jwtAlgorithm));

            if ($decoded->type !== '2fa_challenge') {
                return null;
            }

            return $decoded;
        } catch (\Exception $e) {
            error_log("2FA temp token verification failed: " . $e->getMessage());
            return null;
        }
    }

    // ============================================
    // BASE32 ENCODING / DECODING (RFC 4648)
    // ============================================

    /**
     * Encode raw bytes to base32
     */
    private function base32Encode(string $data): string
    {
        $binary = '';
        foreach (str_split($data) as $char) {
            $binary .= str_pad(decbin(ord($char)), 8, '0', STR_PAD_LEFT);
        }

        $encoded = '';
        $chunks = str_split($binary, 5);
        foreach ($chunks as $chunk) {
            $chunk = str_pad($chunk, 5, '0', STR_PAD_RIGHT);
            $encoded .= self::BASE32_ALPHABET[bindec($chunk)];
        }

        return $encoded;
    }

    /**
     * Decode base32 string to raw bytes
     */
    private function base32Decode(string $base32): string
    {
        $base32 = strtoupper(rtrim($base32, '='));
        $binary = '';

        foreach (str_split($base32) as $char) {
            $index = strpos(self::BASE32_ALPHABET, $char);
            if ($index === false) {
                throw new \InvalidArgumentException("Invalid base32 character: {$char}");
            }
            $binary .= str_pad(decbin($index), 5, '0', STR_PAD_LEFT);
        }

        $bytes = '';
        $chunks = str_split($binary, 8);
        foreach ($chunks as $chunk) {
            if (strlen($chunk) === 8) {
                $bytes .= chr(bindec($chunk));
            }
        }

        return $bytes;
    }
}

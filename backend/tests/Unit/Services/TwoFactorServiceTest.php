<?php

namespace Tundua\Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;
use Tundua\Services\TwoFactorService;

/**
 * Unit tests for the TwoFactorService (TOTP / recovery codes / encryption).
 */
class TwoFactorServiceTest extends TestCase
{
    private TwoFactorService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // The service reads from $_ENV in its constructor
        $_ENV['JWT_SECRET'] = 'testing-jwt-secret-do-not-use-in-production-1234567890';
        $_ENV['JWT_ALGORITHM'] = 'HS256';

        $this->service = new TwoFactorService();
    }

    // =============================================
    //  Secret Generation
    // =============================================

    #[Test]
    public function generateSecret_returns_valid_base32_string(): void
    {
        $secret = $this->service->generateSecret();

        $this->assertMatchesRegularExpression(
            '/^[A-Z2-7]+$/',
            $secret,
            'Secret must consist only of valid base32 characters (A-Z, 2-7)'
        );
    }

    #[Test]
    public function generateSecret_has_correct_length_for_160_bit_key(): void
    {
        $secret = $this->service->generateSecret();

        // 160 bits = 20 bytes -> ceil(20*8/5) = 32 base32 chars
        $this->assertEquals(32, strlen($secret), 'A 160-bit key encodes to 32 base32 characters');
    }

    #[Test]
    public function generateSecret_produces_unique_values(): void
    {
        $secrets = [];
        for ($i = 0; $i < 10; $i++) {
            $secrets[] = $this->service->generateSecret();
        }

        $this->assertCount(10, array_unique($secrets), 'Each generated secret should be unique');
    }

    // =============================================
    //  OTP Auth URI
    // =============================================

    #[Test]
    public function generateOtpAuthUri_produces_valid_uri(): void
    {
        $secret = $this->service->generateSecret();
        $uri = $this->service->generateOtpAuthUri($secret, 'user@example.com', 'Tundua');

        $this->assertStringStartsWith('otpauth://totp/', $uri);
        $this->assertStringContainsString('secret=' . $secret, $uri);
        $this->assertStringContainsString('issuer=Tundua', $uri);
        $this->assertStringContainsString('user%40example.com', $uri);
        $this->assertStringContainsString('digits=6', $uri);
        $this->assertStringContainsString('period=30', $uri);
    }

    // =============================================
    //  Code Generation & Verification
    // =============================================

    #[Test]
    public function generateCode_returns_six_digit_string(): void
    {
        $secret = $this->service->generateSecret();
        $code = $this->service->generateCode($secret);

        $this->assertMatchesRegularExpression('/^\d{6}$/', $code);
    }

    #[Test]
    public function verifyCode_accepts_correct_code(): void
    {
        $secret = $this->service->generateSecret();
        $timestamp = 1700000000; // fixed timestamp for determinism

        $code = $this->service->generateCode($secret, $timestamp);
        $result = $this->service->verifyCode($secret, $code, $timestamp);

        $this->assertTrue($result, 'Code generated for a given timestamp must verify at the same timestamp');
    }

    #[Test]
    public function verifyCode_rejects_wrong_code(): void
    {
        $secret = $this->service->generateSecret();
        $timestamp = 1700000000;

        $result = $this->service->verifyCode($secret, '000000', $timestamp);

        // It is theoretically possible (1-in-a-million) that '000000' is valid,
        // so generate the actual code and only assert false if they differ.
        $actual = $this->service->generateCode($secret, $timestamp);
        if ($actual !== '000000') {
            $this->assertFalse($result);
        } else {
            $this->assertTrue($result); // edge case: it happens to be correct
        }
    }

    #[Test]
    public function verifyCode_tolerates_one_step_clock_drift_backwards(): void
    {
        $secret = $this->service->generateSecret();
        $timestamp = 1700000000;

        // Generate code for the previous 30-second window
        $previousWindowCode = $this->service->generateCode($secret, $timestamp - 30);

        $this->assertTrue(
            $this->service->verifyCode($secret, $previousWindowCode, $timestamp),
            'Should accept a code from one time-step in the past'
        );
    }

    #[Test]
    public function verifyCode_tolerates_one_step_clock_drift_forwards(): void
    {
        $secret = $this->service->generateSecret();
        $timestamp = 1700000000;

        // Generate code for the next 30-second window
        $nextWindowCode = $this->service->generateCode($secret, $timestamp + 30);

        $this->assertTrue(
            $this->service->verifyCode($secret, $nextWindowCode, $timestamp),
            'Should accept a code from one time-step in the future'
        );
    }

    #[Test]
    public function verifyCode_rejects_code_outside_drift_window(): void
    {
        $secret = $this->service->generateSecret();
        $timestamp = 1700000000;

        // Generate code for two windows in the future (outside +/- 1 tolerance)
        $farFutureCode = $this->service->generateCode($secret, $timestamp + 90);

        $this->assertFalse(
            $this->service->verifyCode($secret, $farFutureCode, $timestamp),
            'Should reject a code that is more than one time-step away'
        );
    }

    #[Test]
    public function generateCode_is_deterministic_for_same_inputs(): void
    {
        $secret = $this->service->generateSecret();
        $timestamp = 1700000000;

        $code1 = $this->service->generateCode($secret, $timestamp);
        $code2 = $this->service->generateCode($secret, $timestamp);

        $this->assertSame($code1, $code2, 'Same secret + timestamp must produce the same code');
    }

    // =============================================
    //  Recovery Codes
    // =============================================

    #[Test]
    public function generateRecoveryCodes_returns_eight_codes(): void
    {
        $codes = $this->service->generateRecoveryCodes();

        $this->assertCount(8, $codes);
    }

    #[Test]
    public function generateRecoveryCodes_returns_correctly_formatted_codes(): void
    {
        $codes = $this->service->generateRecoveryCodes();

        foreach ($codes as $code) {
            $this->assertMatchesRegularExpression(
                '/^[a-z0-9]{5}-[a-z0-9]{5}$/',
                $code,
                "Recovery code '{$code}' should be in xxxxx-xxxxx format"
            );
        }
    }

    #[Test]
    public function generateRecoveryCodes_produces_unique_codes(): void
    {
        $codes = $this->service->generateRecoveryCodes();

        $this->assertCount(
            count($codes),
            array_unique($codes),
            'All recovery codes within a set must be unique'
        );
    }

    #[Test]
    public function verifyRecoveryCode_matches_valid_code(): void
    {
        $codes = $this->service->generateRecoveryCodes();
        $hashed = $this->service->hashRecoveryCodes($codes);

        // Pick the third code to verify (index 2)
        $index = $this->service->verifyRecoveryCode($codes[2], $hashed);

        $this->assertSame(2, $index);
    }

    #[Test]
    public function verifyRecoveryCode_rejects_invalid_code(): void
    {
        $codes = $this->service->generateRecoveryCodes();
        $hashed = $this->service->hashRecoveryCodes($codes);

        $result = $this->service->verifyRecoveryCode('xxxxx-yyyyy', $hashed);

        $this->assertFalse($result);
    }

    #[Test]
    public function hashRecoveryCodes_returns_sha256_hashes(): void
    {
        $codes = $this->service->generateRecoveryCodes();
        $hashed = $this->service->hashRecoveryCodes($codes);

        $this->assertCount(count($codes), $hashed);

        foreach ($hashed as $hash) {
            $this->assertEquals(64, strlen($hash), 'SHA-256 hash should be 64 hex characters');
            $this->assertMatchesRegularExpression('/^[0-9a-f]{64}$/', $hash);
        }
    }

    // =============================================
    //  Encryption / Decryption
    // =============================================

    #[Test]
    public function encryptSecret_and_decryptSecret_roundtrip(): void
    {
        $secret = $this->service->generateSecret();

        $encrypted = $this->service->encryptSecret($secret);
        $decrypted = $this->service->decryptSecret($encrypted);

        $this->assertSame($secret, $decrypted);
    }

    #[Test]
    public function encryptSecret_produces_base64_output(): void
    {
        $secret = $this->service->generateSecret();
        $encrypted = $this->service->encryptSecret($secret);

        // base64_decode with strict mode should succeed
        $decoded = base64_decode($encrypted, true);
        $this->assertNotFalse($decoded, 'Encrypted output must be valid base64');
    }

    #[Test]
    public function encryptSecret_produces_different_ciphertext_each_time(): void
    {
        $secret = $this->service->generateSecret();

        $encrypted1 = $this->service->encryptSecret($secret);
        $encrypted2 = $this->service->encryptSecret($secret);

        $this->assertNotSame(
            $encrypted1,
            $encrypted2,
            'Each encryption should use a random IV, producing different ciphertexts'
        );
    }

    #[Test]
    public function decryptSecret_throws_on_corrupted_data(): void
    {
        $this->expectException(\RuntimeException::class);

        $this->service->decryptSecret('not-valid-base64-!@#$');
    }

    #[Test]
    public function decryptSecret_throws_on_truncated_ciphertext(): void
    {
        $this->expectException(\RuntimeException::class);

        // Valid base64 but too short (less than 17 bytes decoded)
        $this->service->decryptSecret(base64_encode('short'));
    }
}

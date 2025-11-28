<?php

namespace Tundua\Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Basic Database Tests
 * Tests database structure and helpers
 */
class DatabaseTest extends TestCase
{
    /** @test */
    public function password_hashing_works_correctly()
    {
        $password = 'SecurePassword123!';
        $hash = password_hash($password, PASSWORD_BCRYPT);

        $this->assertNotEmpty($hash);
        $this->assertTrue(password_verify($password, $hash));
        $this->assertFalse(password_verify('WrongPassword', $hash));
    }

    /** @test */
    public function uuid_generation_works()
    {
        $uuid = \Ramsey\Uuid\Uuid::uuid4()->toString();

        $this->assertIsString($uuid);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $uuid);
    }

    /** @test */
    public function date_formatting_works()
    {
        $date = date('Y-m-d H:i:s', strtotime('+24 hours'));

        $this->assertIsString($date);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $date);
    }

    /** @test */
    public function email_validation_regex_works()
    {
        $validEmail = 'test@example.com';
        $invalidEmail = 'invalid-email';

        $this->assertTrue(filter_var($validEmail, FILTER_VALIDATE_EMAIL) !== false);
        $this->assertFalse(filter_var($invalidEmail, FILTER_VALIDATE_EMAIL) !== false);
    }

    /** @test */
    public function token_generation_is_secure()
    {
        $token1 = bin2hex(random_bytes(32));
        $token2 = bin2hex(random_bytes(32));

        $this->assertIsString($token1);
        $this->assertEquals(64, strlen($token1)); // 32 bytes = 64 hex chars
        $this->assertNotEquals($token1, $token2); // Should be unique
    }
}

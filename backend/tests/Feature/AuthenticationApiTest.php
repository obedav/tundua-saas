<?php

namespace Tundua\Tests\Feature;

use Tundua\Tests\TestCase;

/**
 * Authentication API Endpoint Tests
 *
 * Tests all authentication endpoints end-to-end
 */
class AuthenticationApiTest extends TestCase
{
    private string $apiUrl = 'http://localhost:8000';

    /**
     * Test POST /api/auth/register - Success
     * @test
     */
    public function it_registers_new_user_successfully()
    {
        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe.' . time() . '@test.com',
            'password' => 'SecurePass123!',
            'phone' => '+1234567890'
        ];

        $response = $this->post('/api/auth/register', $data);

        $this->assertEquals(201, $response['status']);
        $this->assertTrue($response['body']['success']);
        $this->assertArrayHasKey('access_token', $response['body']['data']);
        $this->assertArrayHasKey('refresh_token', $response['body']['data']);
        $this->assertArrayHasKey('user', $response['body']['data']);
    }

    /**
     * Test POST /api/auth/register - Duplicate Email
     * @test
     */
    public function it_rejects_duplicate_email_registration()
    {
        $email = 'duplicate.' . time() . '@test.com';

        // Register first user
        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $email,
            'password' => 'SecurePass123!'
        ];

        $this->post('/api/auth/register', $data);

        // Try to register with same email
        $response = $this->post('/api/auth/register', $data);

        $this->assertEquals(409, $response['status']);
        $this->assertFalse($response['body']['success']);
        $this->assertStringContainsString('already registered', $response['body']['error']);
    }

    /**
     * Test POST /api/auth/register - Weak Password
     * @test
     */
    public function it_rejects_weak_password()
    {
        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'test.' . time() . '@test.com',
            'password' => 'weak'
        ];

        $response = $this->post('/api/auth/register', $data);

        $this->assertEquals(400, $response['status']);
        $this->assertFalse($response['body']['success']);
    }

    /**
     * Test POST /api/auth/register - Missing Fields
     * @test
     */
    public function it_rejects_registration_with_missing_fields()
    {
        $data = [
            'email' => 'test@test.com'
            // Missing required fields
        ];

        $response = $this->post('/api/auth/register', $data);

        $this->assertEquals(400, $response['status']);
        $this->assertFalse($response['body']['success']);
    }

    /**
     * Test POST /api/auth/login - Success
     * @test
     */
    public function it_logs_in_with_correct_credentials()
    {
        // First register a user
        $email = 'login.test.' . time() . '@test.com';
        $password = 'SecurePass123!';

        $this->post('/api/auth/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $email,
            'password' => $password
        ]);

        // Now login
        $response = $this->post('/api/auth/login', [
            'email' => $email,
            'password' => $password
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['body']['success']);
        $this->assertArrayHasKey('access_token', $response['body']['data']);
    }

    /**
     * Test POST /api/auth/login - Wrong Password
     * @test
     */
    public function it_rejects_login_with_wrong_password()
    {
        // Register a user
        $email = 'wrong.pass.' . time() . '@test.com';

        $this->post('/api/auth/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $email,
            'password' => 'CorrectPass123!'
        ]);

        // Try to login with wrong password
        $response = $this->post('/api/auth/login', [
            'email' => $email,
            'password' => 'WrongPass123!'
        ]);

        $this->assertEquals(401, $response['status']);
        $this->assertFalse($response['body']['success']);
    }

    /**
     * Test POST /api/auth/login - Non-existent User
     * @test
     */
    public function it_rejects_login_for_non_existent_user()
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'nonexistent@test.com',
            'password' => 'Password123!'
        ]);

        $this->assertEquals(401, $response['status']);
        $this->assertFalse($response['body']['success']);
    }

    /**
     * Test Rate Limiting on Login
     * @test
     */
    public function it_rate_limits_login_attempts()
    {
        $email = 'ratelimit.' . time() . '@test.com';

        // Make 6 failed login attempts (limit is 5)
        for ($i = 0; $i < 6; $i++) {
            $response = $this->post('/api/auth/login', [
                'email' => $email,
                'password' => 'WrongPassword123!'
            ]);
        }

        // 6th attempt should be rate limited
        $this->assertEquals(429, $response['status']);
        $this->assertArrayHasKey('X-RateLimit-Remaining', $response['headers']);
    }

    /**
     * Test GET /api/auth/me - Authenticated
     * @test
     */
    public function it_returns_current_user_when_authenticated()
    {
        // Register and login
        $user = $this->createAndLoginUser();

        // Get current user
        $response = $this->get('/api/auth/me', [
            'Authorization' => 'Bearer ' . $user['access_token']
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['body']['success']);
        $this->assertEquals($user['email'], $response['body']['data']['email']);
    }

    /**
     * Test GET /api/auth/me - Unauthenticated
     * @test
     */
    public function it_rejects_unauthenticated_request_to_me_endpoint()
    {
        $response = $this->get('/api/auth/me');

        $this->assertEquals(401, $response['status']);
        $this->assertFalse($response['body']['success']);
    }

    /**
     * Test PUT /api/auth/me - Update Profile
     * @test
     */
    public function it_updates_user_profile()
    {
        $user = $this->createAndLoginUser();

        $response = $this->put('/api/auth/me', [
            'first_name' => 'UpdatedName',
            'phone' => '+9876543210'
        ], [
            'Authorization' => 'Bearer ' . $user['access_token']
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['body']['success']);
        $this->assertEquals('UpdatedName', $response['body']['data']['first_name']);
    }

    /**
     * Test POST /api/auth/refresh - Refresh Token
     * @test
     */
    public function it_refreshes_access_token()
    {
        $user = $this->createAndLoginUser();

        $response = $this->post('/api/auth/refresh', [
            'refresh_token' => $user['refresh_token']
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['body']['success']);
        $this->assertArrayHasKey('access_token', $response['body']['data']);
    }

    /**
     * Test POST /api/auth/refresh - Invalid Token
     * @test
     */
    public function it_rejects_invalid_refresh_token()
    {
        $response = $this->post('/api/auth/refresh', [
            'refresh_token' => 'invalid_token_here'
        ]);

        $this->assertEquals(401, $response['status']);
        $this->assertFalse($response['body']['success']);
    }

    /**
     * Test POST /api/auth/forgot-password
     * @test
     */
    public function it_sends_password_reset_email()
    {
        $user = $this->createAndLoginUser();

        $response = $this->post('/api/auth/forgot-password', [
            'email' => $user['email']
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['body']['success']);
    }

    /**
     * Test GET /api/auth/verify-email/{token}
     * @test
     */
    public function it_verifies_email_with_valid_token()
    {
        // This would require creating a user with unverified email
        // and extracting the verification token
        // For now, we'll skip the actual implementation
        $this->markTestSkipped('Requires email token extraction');
    }

    // ==========================================
    // Helper Methods
    // ==========================================

    /**
     * Create and login a test user
     */
    private function createAndLoginUser(): array
    {
        $email = 'test.user.' . time() . '@test.com';
        $password = 'SecurePass123!';

        // Register
        $registerResponse = $this->post('/api/auth/register', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => $email,
            'password' => $password
        ]);

        return [
            'email' => $email,
            'password' => $password,
            'access_token' => $registerResponse['body']['data']['access_token'],
            'refresh_token' => $registerResponse['body']['data']['refresh_token'],
            'user' => $registerResponse['body']['data']['user']
        ];
    }

    /**
     * Make HTTP POST request
     */
    private function post(string $endpoint, array $data, array $headers = []): array
    {
        $ch = curl_init($this->apiUrl . $endpoint);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HEADER, true);

        $defaultHeaders = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        foreach ($headers as $key => $value) {
            $defaultHeaders[] = "$key: $value";
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $defaultHeaders);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

        curl_close($ch);

        $header = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        return [
            'status' => $httpCode,
            'headers' => $this->parseHeaders($header),
            'body' => json_decode($body, true)
        ];
    }

    /**
     * Make HTTP GET request
     */
    private function get(string $endpoint, array $headers = []): array
    {
        $ch = curl_init($this->apiUrl . $endpoint);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);

        $defaultHeaders = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        foreach ($headers as $key => $value) {
            $defaultHeaders[] = "$key: $value";
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $defaultHeaders);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

        curl_close($ch);

        $header = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        return [
            'status' => $httpCode,
            'headers' => $this->parseHeaders($header),
            'body' => json_decode($body, true)
        ];
    }

    /**
     * Make HTTP PUT request
     */
    private function put(string $endpoint, array $data, array $headers = []): array
    {
        $ch = curl_init($this->apiUrl . $endpoint);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HEADER, true);

        $defaultHeaders = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        foreach ($headers as $key => $value) {
            $defaultHeaders[] = "$key: $value";
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $defaultHeaders);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

        curl_close($ch);

        $header = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        return [
            'status' => $httpCode,
            'headers' => $this->parseHeaders($header),
            'body' => json_decode($body, true)
        ];
    }

    /**
     * Parse HTTP headers
     */
    private function parseHeaders(string $header): array
    {
        $headers = [];
        $lines = explode("\r\n", $header);

        foreach ($lines as $line) {
            if (strpos($line, ':') !== false) {
                list($key, $value) = explode(':', $line, 2);
                $headers[trim($key)] = trim($value);
            }
        }

        return $headers;
    }
}

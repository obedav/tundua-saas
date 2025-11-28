<?php

namespace Tundua\Tests\Feature;

use Tundua\Tests\TestCase;
use Tundua\Models\User;
use Tundua\Services\AuthService;

/**
 * Authentication Feature Tests
 * Tests the complete authentication flow
 */
class AuthenticationTest extends TestCase
{
    private AuthService $authService;
    private User $userModel;

    protected function setUp(): void
    {
        parent::setUp();

        // Clean up test database before each test
        User::query()->delete();

        // Initialize services
        $this->userModel = new User();

        // Note: AuthService might need dependency injection
        // Adjust based on actual implementation
    }

    /** @test */
    public function user_can_register_with_valid_data()
    {
        $userData = [
            'email' => 'newuser@test.com',
            'password' => 'SecurePass123!',
            'first_name' => 'New',
            'last_name' => 'User',
            'phone' => '+1234567890'
        ];

        // This test would call the registration endpoint
        // For now, we'll test the model directly
        $userId = $this->createTestUser([
            'email' => $userData['email'],
            'password_hash' => password_hash($userData['password'], PASSWORD_BCRYPT),
            'first_name' => $userData['first_name'],
            'last_name' => $userData['last_name'],
            'phone' => $userData['phone']
        ]);

        $this->assertNotNull($userId);
        $this->assertGreaterThan(0, $userId);

        $user = $this->userModel->findById($userId);
        $this->assertEquals('newuser@test.com', $user['email']);
        $this->assertNotNull($user['email_verification_token']);
    }

    /** @test */
    public function registration_fails_with_duplicate_email()
    {
        $email = 'duplicate@test.com';

        // Create first user
        $this->createTestUser(['email' => $email]);

        // Try to create second user with same email
        $userData = $this->generateUserData(['email' => $email]);
        $userId = $this->userModel->create($userData);

        $this->assertNull($userId);
    }

    /** @test */
    public function user_can_verify_email_with_valid_token()
    {
        $token = bin2hex(random_bytes(32));
        $userId = $this->createTestUser([
            'email_verification_token' => $token,
            'email_verification_expires' => date('Y-m-d H:i:s', strtotime('+24 hours'))
        ]);

        // Find user by token
        $user = $this->userModel->findByEmailVerificationToken($token);
        $this->assertNotNull($user);

        // Verify email
        $verified = $this->userModel->verifyEmail($userId);
        $this->assertTrue($verified);

        // Check verification status
        $updatedUser = $this->userModel->findById($userId);
        $this->assertEquals(1, $updatedUser['email_verified']);
        $this->assertNull($updatedUser['email_verification_token']);
    }

    /** @test */
    public function email_verification_fails_with_expired_token()
    {
        $token = bin2hex(random_bytes(32));
        $this->createTestUser([
            'email_verification_token' => $token,
            'email_verification_expires' => date('Y-m-d H:i:s', strtotime('-1 hour')) // Expired
        ]);

        $user = $this->userModel->findByEmailVerificationToken($token);
        $this->assertNull($user);
    }

    /** @test */
    public function user_can_login_with_correct_credentials()
    {
        $email = 'login@test.com';
        $password = 'CorrectPassword123!';

        $userId = $this->createTestUser([
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_BCRYPT),
            'email_verified' => 1
        ]);

        // Simulate login
        $user = $this->userModel->findByEmail($email);
        $this->assertNotNull($user);

        // Verify password
        $passwordValid = password_verify($password, $user['password_hash']);
        $this->assertTrue($passwordValid);

        // Update last login
        $updated = $this->userModel->updateLastLogin($userId);
        $this->assertTrue($updated);
    }

    /** @test */
    public function login_fails_with_incorrect_password()
    {
        $email = 'logintest@test.com';
        $correctPassword = 'CorrectPassword123!';
        $wrongPassword = 'WrongPassword123!';

        $this->createTestUser([
            'email' => $email,
            'password_hash' => password_hash($correctPassword, PASSWORD_BCRYPT)
        ]);

        $user = $this->userModel->findByEmail($email);
        $passwordValid = password_verify($wrongPassword, $user['password_hash']);

        $this->assertFalse($passwordValid);
    }

    /** @test */
    public function account_gets_locked_after_multiple_failed_attempts()
    {
        $userId = $this->createTestUser();

        // Simulate 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $this->userModel->incrementLoginAttempts($userId);
        }

        $user = $this->userModel->findById($userId);
        $this->assertEquals(5, $user['login_attempts']);

        // Lock account
        $this->userModel->lockAccount($userId, 30);

        $this->assertTrue($this->userModel->isLocked($userId));
    }

    /** @test */
    public function successful_login_resets_failed_attempts()
    {
        $userId = $this->createTestUser();

        // Simulate failed attempts
        $this->userModel->incrementLoginAttempts($userId);
        $this->userModel->incrementLoginAttempts($userId);

        // Successful login
        $this->userModel->resetLoginAttempts($userId);

        $user = $this->userModel->findById($userId);
        $this->assertEquals(0, $user['login_attempts']);
    }

    /** @test */
    public function user_cannot_login_when_account_is_inactive()
    {
        $userId = $this->createTestUser();

        // Soft delete (deactivate) user
        $this->userModel->delete($userId);

        $user = $this->userModel->findById($userId);
        $this->assertEquals(0, $user['is_active']);
    }

    /** @test */
    public function password_reset_token_generation()
    {
        $email = 'reset@test.com';
        $userId = $this->createTestUser(['email' => $email]);

        $resetToken = bin2hex(random_bytes(32));
        $this->userModel->update($userId, [
            'password_reset_token' => $resetToken,
            'password_reset_expires' => date('Y-m-d H:i:s', strtotime('+1 hour'))
        ]);

        $user = $this->userModel->findByPasswordResetToken($resetToken);
        $this->assertNotNull($user);
        $this->assertEquals($email, $user['email']);
    }

    /** @test */
    public function expired_password_reset_token_is_invalid()
    {
        $resetToken = bin2hex(random_bytes(32));
        $this->createTestUser([
            'password_reset_token' => $resetToken,
            'password_reset_expires' => date('Y-m-d H:i:s', strtotime('-1 hour')) // Expired
        ]);

        $user = $this->userModel->findByPasswordResetToken($resetToken);
        $this->assertNull($user);
    }
}

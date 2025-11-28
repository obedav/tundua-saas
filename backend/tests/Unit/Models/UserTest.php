<?php

namespace Tundua\Tests\Unit\Models;

use Tundua\Tests\TestCase;
use Tundua\Models\User;

/**
 * User Model Unit Tests
 * Tests core User model functionality
 */
class UserTest extends TestCase
{
    private User $userModel;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userModel = new User();
    }

    /** @test */
    public function it_can_create_a_user()
    {
        $userData = $this->generateUserData();
        $userId = $this->userModel->create($userData);

        $this->assertIsInt($userId);
        $this->assertGreaterThan(0, $userId);
    }

    /** @test */
    public function it_can_find_user_by_email()
    {
        $userData = $this->generateUserData(['email' => 'findme@test.com']);
        $this->userModel->create($userData);

        $user = $this->userModel->findByEmail('findme@test.com');

        $this->assertIsArray($user);
        $this->assertEquals('findme@test.com', $user['email']);
        $this->assertEquals('Test', $user['first_name']);
    }

    /** @test */
    public function it_returns_null_when_email_not_found()
    {
        $user = $this->userModel->findByEmail('nonexistent@test.com');
        $this->assertNull($user);
    }

    /** @test */
    public function it_can_find_user_by_id()
    {
        $userData = $this->generateUserData();
        $userId = $this->userModel->create($userData);

        $user = $this->userModel->findById($userId);

        $this->assertIsArray($user);
        $this->assertEquals($userId, $user['id']);
    }

    /** @test */
    public function it_can_find_user_by_uuid()
    {
        $uuid = \Ramsey\Uuid\Uuid::uuid4()->toString();
        $userData = $this->generateUserData(['uuid' => $uuid]);
        $this->userModel->create($userData);

        $user = $this->userModel->findByUuid($uuid);

        $this->assertIsArray($user);
        $this->assertEquals($uuid, $user['uuid']);
    }

    /** @test */
    public function it_can_find_user_by_verification_token()
    {
        $token = bin2hex(random_bytes(32));
        $userData = $this->generateUserData([
            'email_verification_token' => $token,
            'email_verification_expires' => date('Y-m-d H:i:s', strtotime('+24 hours'))
        ]);
        $this->userModel->create($userData);

        $user = $this->userModel->findByEmailVerificationToken($token);

        $this->assertIsArray($user);
        $this->assertEquals($token, $user['email_verification_token']);
    }

    /** @test */
    public function it_returns_null_for_expired_verification_token()
    {
        $token = bin2hex(random_bytes(32));
        $userData = $this->generateUserData([
            'email_verification_token' => $token,
            'email_verification_expires' => date('Y-m-d H:i:s', strtotime('-1 hour')) // Expired
        ]);
        $this->userModel->create($userData);

        $user = $this->userModel->findByEmailVerificationToken($token);

        $this->assertNull($user);
    }

    /** @test */
    public function it_can_update_user()
    {
        $userId = $this->createTestUser();

        $updated = $this->userModel->update($userId, [
            'first_name' => 'Updated',
            'last_name' => 'Name'
        ]);

        $this->assertTrue($updated);

        $user = $this->userModel->findById($userId);
        $this->assertEquals('Updated', $user['first_name']);
        $this->assertEquals('Name', $user['last_name']);
    }

    /** @test */
    public function it_can_verify_email()
    {
        $userId = $this->createTestUser();

        $verified = $this->userModel->verifyEmail($userId);

        $this->assertTrue($verified);

        $user = $this->userModel->findById($userId);
        $this->assertEquals(1, $user['email_verified']);
        $this->assertNull($user['email_verification_token']);
    }

    /** @test */
    public function it_can_check_if_email_exists()
    {
        $this->createTestUser(['email' => 'exists@test.com']);

        $this->assertTrue($this->userModel->emailExists('exists@test.com'));
        $this->assertFalse($this->userModel->emailExists('notexists@test.com'));
    }

    /** @test */
    public function it_can_update_last_login()
    {
        $userId = $this->createTestUser();

        $updated = $this->userModel->updateLastLogin($userId);

        $this->assertTrue($updated);

        $user = $this->userModel->findById($userId);
        $this->assertNotNull($user['last_login']);
    }

    /** @test */
    public function it_can_increment_login_attempts()
    {
        $userId = $this->createTestUser();

        $this->userModel->incrementLoginAttempts($userId);
        $this->userModel->incrementLoginAttempts($userId);

        $user = $this->userModel->findById($userId);
        $this->assertEquals(2, $user['login_attempts']);
    }

    /** @test */
    public function it_can_reset_login_attempts()
    {
        $userId = $this->createTestUser();

        $this->userModel->incrementLoginAttempts($userId);
        $this->userModel->resetLoginAttempts($userId);

        $user = $this->userModel->findById($userId);
        $this->assertEquals(0, $user['login_attempts']);
    }

    /** @test */
    public function it_can_lock_account()
    {
        $userId = $this->createTestUser();

        $locked = $this->userModel->lockAccount($userId, 30);

        $this->assertTrue($locked);
        $this->assertTrue($this->userModel->isLocked($userId));
    }

    /** @test */
    public function it_can_soft_delete_user()
    {
        $userId = $this->createTestUser();

        $deleted = $this->userModel->delete($userId);

        $this->assertTrue($deleted);

        $user = $this->userModel->findById($userId);
        $this->assertEquals(0, $user['is_active']);
    }

    /** @test */
    public function it_returns_safe_user_without_sensitive_data()
    {
        $userId = $this->createTestUser();
        $user = $this->userModel->findById($userId);

        $safeUser = $this->userModel->getSafeUser($user);

        $this->assertArrayNotHasKey('password_hash', $safeUser);
        $this->assertArrayNotHasKey('email_verification_token', $safeUser);
        $this->assertArrayNotHasKey('password_reset_token', $safeUser);
        $this->assertArrayHasKey('email', $safeUser);
        $this->assertArrayHasKey('first_name', $safeUser);
    }

    /** @test */
    public function it_prevents_duplicate_email_registration()
    {
        $email = 'duplicate@test.com';
        $this->createTestUser(['email' => $email]);

        // Try to create another user with same email
        $userData = $this->generateUserData(['email' => $email]);
        $userId = $this->userModel->create($userData);

        // Should fail (returns null or error)
        $this->assertNull($userId);
    }
}

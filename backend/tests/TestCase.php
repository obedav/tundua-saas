<?php

namespace Tundua\Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;
use Tundua\Database\Database;

/**
 * Base Test Case
 * Provides common functionality for all tests
 */
abstract class TestCase extends BaseTestCase
{
    protected static ?\PDO $db = null;
    protected static bool $dbInitialized = false;

    /**
     * Set up test database connection before class
     */
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        // Use in-memory SQLite for tests (no DB setup required)
        try {
            self::$db = new \PDO('sqlite::memory:');
            self::$db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            self::$db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);

            // Create users table for tests
            self::createTestTables();
            self::$dbInitialized = true;
        } catch (\PDOException $e) {
            echo "Test DB setup failed: " . $e->getMessage() . "\n";
            throw $e;
        }
    }

    /**
     * Create test database tables
     */
    protected static function createTestTables(): void
    {
        // Users table
        self::$db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                phone TEXT,
                role TEXT DEFAULT 'user',
                email_verified INTEGER DEFAULT 0,
                email_verification_token TEXT,
                email_verification_expires DATETIME,
                password_reset_token TEXT,
                password_reset_expires DATETIME,
                login_attempts INTEGER DEFAULT 0,
                locked_until DATETIME,
                last_login DATETIME,
                referral_code TEXT,
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }

    /**
     * Set up before each test
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Start transaction for test isolation
        if (self::$db) {
            self::$db->beginTransaction();
        }
    }

    /**
     * Tear down after each test
     */
    protected function tearDown(): void
    {
        // Rollback transaction to keep database clean
        if (self::$db && self::$db->inTransaction()) {
            self::$db->rollBack();
        }

        parent::tearDown();
    }

    /**
     * Helper: Generate test user data
     */
    protected function generateUserData(array $overrides = []): array
    {
        return array_merge([
            'uuid' => \Ramsey\Uuid\Uuid::uuid4()->toString(),
            'email' => 'test' . time() . '@example.com',
            'password_hash' => password_hash('password123', PASSWORD_BCRYPT),
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '+1234567890',
            'role' => 'user',
            'email_verification_token' => bin2hex(random_bytes(32)),
            'email_verification_expires' => date('Y-m-d H:i:s', strtotime('+24 hours'))
        ], $overrides);
    }

    /**
     * Helper: Create test user directly in test DB
     */
    protected function createTestUser(array $data = []): ?int
    {
        $userData = $this->generateUserData($data);

        $sql = "INSERT INTO users (
            uuid, email, password_hash, first_name, last_name, phone,
            role, email_verification_token, email_verification_expires
        ) VALUES (
            :uuid, :email, :password_hash, :first_name, :last_name, :phone,
            :role, :email_verification_token, :email_verification_expires
        )";

        try {
            $stmt = self::$db->prepare($sql);
            $stmt->execute([
                'uuid' => $userData['uuid'],
                'email' => $userData['email'],
                'password_hash' => $userData['password_hash'],
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'phone' => $userData['phone'] ?? null,
                'role' => $userData['role'] ?? 'user',
                'email_verification_token' => $userData['email_verification_token'] ?? null,
                'email_verification_expires' => $userData['email_verification_expires'] ?? null
            ]);

            return (int) self::$db->lastInsertId();
        } catch (\PDOException $e) {
            echo "Create test user failed: " . $e->getMessage() . "\n";
            return null;
        }
    }

    /**
     * Get User Model with test DB injected
     */
    protected function getUserModel(): \Tundua\Models\User
    {
        // For now, we'll need to modify User model to accept PDO injection
        // This is a temporary workaround
        return new \Tundua\Models\User();
    }

    /**
     * Helper: Assert JSON response structure
     */
    protected function assertJsonStructure(array $structure, array $data): void
    {
        foreach ($structure as $key => $value) {
            if (is_array($value)) {
                $this->assertArrayHasKey($key, $data);
                $this->assertJsonStructure($value, $data[$key]);
            } else {
                $this->assertArrayHasKey($value, $data);
            }
        }
    }
}

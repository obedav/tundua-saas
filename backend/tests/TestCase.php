<?php

namespace Tundua\Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;
use Tundua\Database\Database;

/**
 * Base Test Case
 *
 * Provides a shared SQLite in-memory database and DRY factory helpers for all
 * test classes. Each test runs inside a transaction that is rolled back in
 * tearDown(), so tests are fully isolated from one another without truncating
 * tables between runs.
 */
abstract class TestCase extends BaseTestCase
{
    protected static ?\PDO $db = null;
    protected static bool $dbInitialized = false;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        try {
            self::$db = new \PDO('sqlite::memory:');
            self::$db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            self::$db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);

            self::createTestTables();
            self::$dbInitialized = true;
        } catch (\PDOException $e) {
            echo "Test DB setup failed: " . $e->getMessage() . "\n";
            throw $e;
        }
    }

    protected static function createTestTables(): void
    {
        // ── Users ────────────────────────────────────────────────────────────
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
                subscription_plan TEXT DEFAULT 'free',
                subscription_expires_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        // ── Applications ─────────────────────────────────────────────────────
        self::$db->exec("
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                reference_number TEXT,
                service_tier_id INTEGER DEFAULT 0,
                service_tier_name TEXT,
                addon_ids TEXT DEFAULT '[]',
                discount_code TEXT,
                currency TEXT DEFAULT 'NGN',
                total_amount REAL DEFAULT 0,
                destination_country TEXT,
                status TEXT DEFAULT 'draft',
                payment_status TEXT DEFAULT 'unpaid',
                payment_id INTEGER,
                submitted_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        // ── Payments ─────────────────────────────────────────────────────────
        self::$db->exec("
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id TEXT NOT NULL UNIQUE,
                application_id INTEGER,
                user_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'NGN',
                payment_method TEXT DEFAULT 'paystack',
                status TEXT DEFAULT 'pending',
                provider_transaction_id TEXT,
                provider_metadata TEXT,
                invoice_number TEXT,
                receipt_url TEXT,
                paid_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        // ── Subscriptions ─────────────────────────────────────────────────────
        self::$db->exec("
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                plan TEXT DEFAULT 'scholar',
                paystack_subscription_code TEXT,
                paystack_customer_code TEXT,
                email_token TEXT,
                status TEXT DEFAULT 'active',
                amount REAL DEFAULT 0,
                currency TEXT DEFAULT 'NGN',
                next_payment_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }

    protected function setUp(): void
    {
        parent::setUp();

        if (self::$db) {
            self::$db->beginTransaction();
        }
    }

    protected function tearDown(): void
    {
        if (self::$db && self::$db->inTransaction()) {
            self::$db->rollBack();
        }

        parent::tearDown();
    }

    // ── Factory helpers ───────────────────────────────────────────────────────

    protected function generateUserData(array $overrides = []): array
    {
        return array_merge([
            'uuid' => \Ramsey\Uuid\Uuid::uuid4()->toString(),
            'email' => 'test' . uniqid() . '@example.com',
            'password_hash' => password_hash('password123', PASSWORD_BCRYPT),
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '+1234567890',
            'role' => 'user',
            'email_verification_token' => bin2hex(random_bytes(32)),
            'email_verification_expires' => date('Y-m-d H:i:s', strtotime('+24 hours')),
        ], $overrides);
    }

    protected function createTestUser(array $data = []): ?int
    {
        $userData = $this->generateUserData($data);

        $stmt = self::$db->prepare("
            INSERT INTO users (
                uuid, email, password_hash, first_name, last_name, phone,
                role, email_verification_token, email_verification_expires
            ) VALUES (
                :uuid, :email, :password_hash, :first_name, :last_name, :phone,
                :role, :email_verification_token, :email_verification_expires
            )
        ");

        try {
            $stmt->execute([
                'uuid' => $userData['uuid'],
                'email' => $userData['email'],
                'password_hash' => $userData['password_hash'],
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'phone' => $userData['phone'] ?? null,
                'role' => $userData['role'] ?? 'user',
                'email_verification_token' => $userData['email_verification_token'] ?? null,
                'email_verification_expires' => $userData['email_verification_expires'] ?? null,
            ]);

            return (int) self::$db->lastInsertId();
        } catch (\PDOException $e) {
            echo "createTestUser failed: " . $e->getMessage() . "\n";
            return null;
        }
    }

    /**
     * Seed an application row and return its ID.
     *
     * @param int   $userId
     * @param array $overrides Column overrides (service_tier_id, total_amount, etc.)
     */
    protected function createTestApplication(int $userId, array $overrides = []): int
    {
        $defaults = [
            'user_id' => $userId,
            'reference_number' => 'APP-' . strtoupper(uniqid()),
            'service_tier_id' => 1,
            'addon_ids' => '[]',
            'currency' => 'NGN',
            'total_amount' => 50000.00,
            'status' => 'draft',
            'payment_status' => 'unpaid',
        ];

        $row = array_merge($defaults, $overrides);

        $stmt = self::$db->prepare("
            INSERT INTO applications (
                user_id, reference_number, service_tier_id, addon_ids,
                currency, total_amount, status, payment_status
            ) VALUES (
                :user_id, :reference_number, :service_tier_id, :addon_ids,
                :currency, :total_amount, :status, :payment_status
            )
        ");
        $stmt->execute([
            'user_id' => $row['user_id'],
            'reference_number' => $row['reference_number'],
            'service_tier_id' => $row['service_tier_id'],
            'addon_ids' => $row['addon_ids'],
            'currency' => $row['currency'],
            'total_amount' => $row['total_amount'],
            'status' => $row['status'],
            'payment_status' => $row['payment_status'],
        ]);

        return (int) self::$db->lastInsertId();
    }

    /**
     * Seed a payment row and return its ID.
     *
     * @param int   $userId
     * @param int   $applicationId
     * @param array $overrides Column overrides (status, provider_transaction_id, etc.)
     */
    protected function createTestPayment(int $userId, int $applicationId, array $overrides = []): int
    {
        $defaults = [
            'transaction_id' => 'PAY-' . strtoupper(uniqid()),
            'application_id' => $applicationId,
            'user_id' => $userId,
            'amount' => 50000.00,
            'currency' => 'NGN',
            'payment_method' => 'paystack',
            'status' => 'pending',
            'provider_transaction_id' => null,
        ];

        $row = array_merge($defaults, $overrides);

        $stmt = self::$db->prepare("
            INSERT INTO payments (
                transaction_id, application_id, user_id, amount, currency,
                payment_method, status, provider_transaction_id
            ) VALUES (
                :transaction_id, :application_id, :user_id, :amount, :currency,
                :payment_method, :status, :provider_transaction_id
            )
        ");
        $stmt->execute([
            'transaction_id' => $row['transaction_id'],
            'application_id' => $row['application_id'],
            'user_id' => $row['user_id'],
            'amount' => $row['amount'],
            'currency' => $row['currency'],
            'payment_method' => $row['payment_method'],
            'status' => $row['status'],
            'provider_transaction_id' => $row['provider_transaction_id'],
        ]);

        return (int) self::$db->lastInsertId();
    }

    // ── Assertion helpers ─────────────────────────────────────────────────────

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

    protected function getUserModel(): \Tundua\Models\User
    {
        return new \Tundua\Models\User();
    }
}

<?php

namespace Tundua\Models;

use PDO;
use Tundua\Database\Database;

class User
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Create a new user
     */
    public function create(array $data): ?int
    {
        $sql = "INSERT INTO users (
            uuid,
            email,
            password_hash,
            first_name,
            last_name,
            phone,
            role,
            email_verification_token,
            email_verification_expires
        ) VALUES (
            :uuid,
            :email,
            :password_hash,
            :first_name,
            :last_name,
            :phone,
            :role,
            :email_verification_token,
            :email_verification_expires
        )";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                'uuid' => $data['uuid'],
                'email' => $data['email'],
                'password_hash' => $data['password_hash'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'phone' => $data['phone'] ?? null,
                'role' => $data['role'] ?? 'user',
                'email_verification_token' => $data['email_verification_token'] ?? null,
                'email_verification_expires' => $data['email_verification_expires'] ?? null
            ]);

            return (int) $this->db->lastInsertId();
        } catch (\PDOException $e) {
            error_log("User creation failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?array
    {
        $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['email' => $email]);

            $user = $stmt->fetch();
            return $user ?: null;
        } catch (\PDOException $e) {
            error_log("Find user by email failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by ID
     */
    public function findById(int $id): ?array
    {
        $sql = "SELECT * FROM users WHERE id = :id LIMIT 1";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['id' => $id]);

            $user = $stmt->fetch();
            return $user ?: null;
        } catch (\PDOException $e) {
            error_log("Find user by ID failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by UUID
     */
    public function findByUuid(string $uuid): ?array
    {
        $sql = "SELECT * FROM users WHERE uuid = :uuid LIMIT 1";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['uuid' => $uuid]);

            $user = $stmt->fetch();
            return $user ?: null;
        } catch (\PDOException $e) {
            error_log("Find user by UUID failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by email verification token
     */
    public function findByEmailVerificationToken(string $token): ?array
    {
        $sql = "SELECT * FROM users
                WHERE email_verification_token = :token
                AND email_verification_expires > NOW()
                LIMIT 1";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['token' => $token]);

            $user = $stmt->fetch();
            return $user ?: null;
        } catch (\PDOException $e) {
            error_log("Find user by verification token failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by password reset token
     */
    public function findByPasswordResetToken(string $token): ?array
    {
        $sql = "SELECT * FROM users
                WHERE password_reset_token = :token
                AND password_reset_expires > NOW()
                LIMIT 1";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['token' => $token]);

            $user = $stmt->fetch();
            return $user ?: null;
        } catch (\PDOException $e) {
            error_log("Find user by reset token failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Update user
     */
    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = ['id' => $id];

        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
            $params[$key] = $value;
        }

        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute($params);
        } catch (\PDOException $e) {
            error_log("User update failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Verify email
     */
    public function verifyEmail(int $id): bool
    {
        $sql = "UPDATE users
                SET email_verified = 1,
                    email_verification_token = NULL,
                    email_verification_expires = NULL
                WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute(['id' => $id]);
        } catch (\PDOException $e) {
            error_log("Email verification failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update last login
     */
    public function updateLastLogin(int $id): bool
    {
        $sql = "UPDATE users SET last_login = NOW() WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute(['id' => $id]);
        } catch (\PDOException $e) {
            error_log("Update last login failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Increment login attempts
     */
    public function incrementLoginAttempts(int $id): bool
    {
        $sql = "UPDATE users
                SET login_attempts = login_attempts + 1
                WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute(['id' => $id]);
        } catch (\PDOException $e) {
            error_log("Increment login attempts failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update user's referral code
     */
    public function updateReferralCode(int $id, string $referralCode): bool
    {
        $sql = "UPDATE users SET referral_code = :referral_code WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                'id' => $id,
                'referral_code' => $referralCode
            ]);
        } catch (\PDOException $e) {
            error_log("Update referral code failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Reset login attempts
     */
    public function resetLoginAttempts(int $id): bool
    {
        $sql = "UPDATE users
                SET login_attempts = 0,
                    locked_until = NULL
                WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute(['id' => $id]);
        } catch (\PDOException $e) {
            error_log("Reset login attempts failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Lock account temporarily
     */
    public function lockAccount(int $id, int $minutes = 30): bool
    {
        $sql = "UPDATE users
                SET locked_until = DATE_ADD(NOW(), INTERVAL :minutes MINUTE)
                WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                'id' => $id,
                'minutes' => $minutes
            ]);
        } catch (\PDOException $e) {
            error_log("Lock account failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if account is locked
     */
    public function isLocked(int $id): bool
    {
        $sql = "SELECT locked_until FROM users WHERE id = :id LIMIT 1";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['id' => $id]);

            $result = $stmt->fetch();

            if (!$result || !$result['locked_until']) {
                return false;
            }

            return strtotime($result['locked_until']) > time();
        } catch (\PDOException $e) {
            error_log("Check account lock failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete user (soft delete by deactivating)
     */
    public function delete(int $id): bool
    {
        $sql = "UPDATE users SET is_active = 0 WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute(['id' => $id]);
        } catch (\PDOException $e) {
            error_log("User deletion failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user without password
     */
    public function getSafeUser(?array $user): ?array
    {
        if (!$user) {
            return null;
        }

        unset($user['password_hash']);
        unset($user['email_verification_token']);
        unset($user['email_verification_expires']);
        unset($user['password_reset_token']);
        unset($user['password_reset_expires']);

        return $user;
    }

    /**
     * Check if email exists
     */
    public function emailExists(string $email): bool
    {
        $sql = "SELECT COUNT(*) as count FROM users WHERE email = :email";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['email' => $email]);

            $result = $stmt->fetch();
            return $result['count'] > 0;
        } catch (\PDOException $e) {
            error_log("Email exists check failed: " . $e->getMessage());
            return false;
        }
    }
}

<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * User Model (Eloquent ORM)
 * CONVERTED FROM PDO TO ELOQUENT
 *
 * Benefits:
 * - Consistent with other models (Application, Referral, Document, etc.)
 * - Better relationship support
 * - Auto-timestamps
 * - Query builder
 * - Better testability
 * - Less error-prone than raw SQL
 */
class User extends Model
{
    protected $table = 'users';

    protected $fillable = [
        'uuid',
        'email',
        'password_hash',
        'first_name',
        'last_name',
        'phone',
        'role',
        'email_verified',
        'email_verification_token',
        'email_verification_expires',
        'password_reset_token',
        'password_reset_expires',
        'login_attempts',
        'locked_until',
        'last_login',
        'referral_code',
        'is_active',
        'google_id',
        'avatar_url',
        'timezone',
        'language',
        'notification_preferences',
    ];

    protected $hidden = [
        'password_hash',
        'email_verification_token',
        'password_reset_token',
    ];

    protected $casts = [
        'email_verified' => 'boolean',
        'is_active' => 'boolean',
        'login_attempts' => 'integer',
        'email_verification_expires' => 'datetime',
        'password_reset_expires' => 'datetime',
        'locked_until' => 'datetime',
        'last_login' => 'datetime',
        'notification_preferences' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ============================================
    // STATIC METHODS (BUSINESS LOGIC)
    // ============================================

    /**
     * Create a new user
     */
    public static function createUser(array $data): ?self
    {
        try {
            return self::create($data);
        } catch (\Exception $e) {
            error_log("User creation failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by email
     */
    public static function findByEmail(string $email): ?self
    {
        try {
            return self::where('email', $email)->first();
        } catch (\Exception $e) {
            error_log("Find user by email failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by ID
     */
    public static function findById(int $id): ?self
    {
        try {
            return self::find($id);
        } catch (\Exception $e) {
            error_log("Find user by ID failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by UUID
     */
    public static function findByUuid(string $uuid): ?self
    {
        try {
            return self::where('uuid', $uuid)->first();
        } catch (\Exception $e) {
            error_log("Find user by UUID failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by email verification token
     */
    public static function findByEmailVerificationToken(string $token): ?self
    {
        try {
            return self::where('email_verification_token', $token)
                ->where('email_verification_expires', '>', Carbon::now())
                ->first();
        } catch (\Exception $e) {
            error_log("Find user by verification token failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by password reset token
     */
    public static function findByPasswordResetToken(string $token): ?self
    {
        try {
            return self::where('password_reset_token', $token)
                ->where('password_reset_expires', '>', Carbon::now())
                ->first();
        } catch (\Exception $e) {
            error_log("Find user by reset token failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Verify email
     */
    public function verifyEmail(): bool
    {
        try {
            return $this->update([
                'email_verified' => true,
                'email_verification_token' => null,
                'email_verification_expires' => null,
            ]);
        } catch (\Exception $e) {
            error_log("Email verification failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update last login
     */
    public function updateLastLogin(): bool
    {
        try {
            return $this->update(['last_login' => Carbon::now()]);
        } catch (\Exception $e) {
            error_log("Update last login failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Increment login attempts
     */
    public function incrementLoginAttempts(): bool
    {
        try {
            return $this->increment('login_attempts');
        } catch (\Exception $e) {
            error_log("Increment login attempts failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Reset login attempts
     */
    public function resetLoginAttempts(): bool
    {
        try {
            return $this->update([
                'login_attempts' => 0,
                'locked_until' => null,
            ]);
        } catch (\Exception $e) {
            error_log("Reset login attempts failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Lock account temporarily
     */
    public function lockAccount(int $minutes = 30): bool
    {
        try {
            return $this->update([
                'locked_until' => Carbon::now()->addMinutes($minutes),
            ]);
        } catch (\Exception $e) {
            error_log("Lock account failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if account is locked
     */
    public function isLocked(): bool
    {
        if (!$this->locked_until) {
            return false;
        }

        return $this->locked_until->isFuture();
    }

    /**
     * Update user's referral code
     */
    public function updateReferralCode(string $referralCode): bool
    {
        try {
            return $this->update(['referral_code' => $referralCode]);
        } catch (\Exception $e) {
            error_log("Update referral code failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Soft delete user (deactivate)
     */
    public function deactivate(): bool
    {
        try {
            return $this->update(['is_active' => false]);
        } catch (\Exception $e) {
            error_log("User deactivation failed: " . $e->getMessage());
            return false;
        }
    }

    // ============================================
    // STATIC WRAPPER METHODS (for backwards compatibility with PDO-style calls)
    // ============================================

    /**
     * Verify email by user ID (static wrapper)
     */
    public static function verifyEmailById(int $id): bool
    {
        $user = self::findById($id);
        return $user ? $user->verifyEmail() : false;
    }

    /**
     * Update last login by user ID (static wrapper)
     */
    public static function updateLastLoginById(int $id): bool
    {
        $user = self::findById($id);
        return $user ? $user->updateLastLogin() : false;
    }

    /**
     * Increment login attempts by user ID (static wrapper)
     */
    public static function incrementLoginAttemptsById(int $id): bool
    {
        $user = self::findById($id);
        return $user ? $user->incrementLoginAttempts() : false;
    }

    /**
     * Reset login attempts by user ID (static wrapper)
     */
    public static function resetLoginAttemptsById(int $id): bool
    {
        $user = self::findById($id);
        return $user ? $user->resetLoginAttempts() : false;
    }

    /**
     * Lock account by user ID (static wrapper)
     */
    public static function lockAccountById(int $id, int $minutes = 30): bool
    {
        $user = self::findById($id);
        return $user ? $user->lockAccount($minutes) : false;
    }

    /**
     * Check if account is locked by user ID (static wrapper)
     */
    public static function isLockedById(int $id): bool
    {
        $user = self::findById($id);
        return $user ? $user->isLocked() : false;
    }

    /**
     * Update user by ID (static wrapper)
     */
    public static function updateById(int $id, array $data): bool
    {
        try {
            $user = self::findById($id);
            return $user ? $user->update($data) : false;
        } catch (\Exception $e) {
            error_log("User update failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get safe user data (without sensitive fields)
     */
    public function getSafeData(): array
    {
        return $this->makeHidden([
            'password_hash',
            'email_verification_token',
            'email_verification_expires',
            'password_reset_token',
            'password_reset_expires',
        ])->toArray();
    }

    /**
     * Get safe user data (static method for backwards compatibility)
     * Accepts both array and Eloquent model
     */
    public static function getSafeUser(array|object|null $user): ?array
    {
        if (!$user) {
            return null;
        }

        // If it's an Eloquent model, use getSafeData()
        if ($user instanceof self) {
            return $user->getSafeData();
        }

        // If it's an array, remove sensitive fields manually
        if (is_array($user)) {
            unset($user['password_hash']);
            unset($user['email_verification_token']);
            unset($user['email_verification_expires']);
            unset($user['password_reset_token']);
            unset($user['password_reset_expires']);
            return $user;
        }

        return null;
    }

    /**
     * Check if email exists
     */
    public static function emailExists(string $email): bool
    {
        try {
            return self::where('email', $email)->exists();
        } catch (\Exception $e) {
            error_log("Email exists check failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Find by Google ID
     */
    public static function findByGoogleId(string $googleId): ?self
    {
        try {
            return self::where('google_id', $googleId)->first();
        } catch (\Exception $e) {
            error_log("Find by Google ID failed: " . $e->getMessage());
            return null;
        }
    }

    // ============================================
    // RELATIONSHIPS
    // ============================================

    /**
     * Get user's applications
     */
    public function applications()
    {
        return $this->hasMany(Application::class, 'user_id');
    }

    /**
     * Get user's documents
     */
    public function documents()
    {
        return $this->hasMany(Document::class, 'user_id');
    }

    /**
     * Get user's referrals (as referrer)
     */
    public function referrals()
    {
        return $this->hasMany(Referral::class, 'referrer_user_id');
    }

    /**
     * Get user's notifications
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
     * Get user's activities
     */
    public function activities()
    {
        return $this->hasMany(Activity::class, 'user_id');
    }

    // ============================================
    // ACCESSORS & MUTATORS
    // ============================================

    /**
     * Get full name
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Check if user is admin
     */
    public function getIsAdminAttribute(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    /**
     * Check if user is super admin
     */
    public function getIsSuperAdminAttribute(): bool
    {
        return $this->role === 'super_admin';
    }

    // ============================================
    // SCOPES
    // ============================================

    /**
     * Scope: Active users only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Verified users only
     */
    public function scopeVerified($query)
    {
        return $query->where('email_verified', true);
    }

    /**
     * Scope: Admins only
     */
    public function scopeAdmins($query)
    {
        return $query->whereIn('role', ['admin', 'super_admin']);
    }
}

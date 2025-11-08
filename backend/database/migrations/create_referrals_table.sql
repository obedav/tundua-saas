-- Referrals table for referral program
CREATE TABLE IF NOT EXISTS referrals (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    referrer_user_id INT UNSIGNED NOT NULL COMMENT 'User who made the referral',
    referred_email VARCHAR(255) NOT NULL COMMENT 'Email of referred person',
    referred_user_id INT UNSIGNED NULL COMMENT 'User ID once they sign up',
    referral_code VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique referral code',

    -- Status tracking
    status ENUM('pending', 'signed_up', 'converted', 'rewarded') DEFAULT 'pending',

    -- Rewards
    reward_type VARCHAR(50) DEFAULT 'discount' COMMENT 'discount, cash, credit',
    reward_amount DECIMAL(10,2) DEFAULT 50.00,
    reward_currency VARCHAR(3) DEFAULT 'USD',
    reward_claimed BOOLEAN DEFAULT FALSE,
    reward_claimed_at TIMESTAMP NULL,

    -- Conversion tracking
    signed_up_at TIMESTAMP NULL,
    converted_at TIMESTAMP NULL COMMENT 'When referred user made their first purchase',
    conversion_value DECIMAL(10,2) NULL COMMENT 'Value of first purchase',

    -- Metadata
    referral_source VARCHAR(100) COMMENT 'email, social, direct_link',
    metadata JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_referrer (referrer_user_id),
    INDEX idx_referred_email (referred_email),
    INDEX idx_referred_user (referred_user_id),
    INDEX idx_code (referral_code),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB COMMENT='Referral program tracking';

-- Add referral_code to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) UNIQUE COMMENT 'Users personal referral code';
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by INT UNSIGNED NULL COMMENT 'User ID who referred this user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_rewards_earned DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Total rewards earned from referrals';
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_referral_code (referral_code);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_referred_by (referred_by);

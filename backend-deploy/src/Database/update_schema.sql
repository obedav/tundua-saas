-- Update to add email_verification_expires field
-- Run this if you already have the database created

USE tundua_saas;

-- Add email_verification_expires column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP NULL AFTER email_verification_token;

-- Update existing verification tokens to expire in 24 hours
UPDATE users
SET email_verification_expires = DATE_ADD(NOW(), INTERVAL 24 HOUR)
WHERE email_verification_token IS NOT NULL AND email_verification_expires IS NULL;

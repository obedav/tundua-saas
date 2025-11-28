-- Migration to make applications table fields nullable for draft creation
-- This allows users to save progress step-by-step without all required fields

USE tundua_saas;

-- Make fields nullable that are filled in later steps
ALTER TABLE applications
    MODIFY COLUMN applicant_name VARCHAR(255) NULL,
    MODIFY COLUMN applicant_email VARCHAR(255) NULL,
    MODIFY COLUMN destination_country VARCHAR(100) NULL,
    MODIFY COLUMN service_tier_id INT UNSIGNED NULL,
    MODIFY COLUMN base_price DECIMAL(10,2) NULL DEFAULT 0.00,
    MODIFY COLUMN subtotal DECIMAL(10,2) NULL DEFAULT 0.00,
    MODIFY COLUMN total_amount DECIMAL(10,2) NULL DEFAULT 0.00;

-- Drop the foreign key constraint temporarily to allow NULL service_tier_id
ALTER TABLE applications DROP FOREIGN KEY applications_ibfk_2;

-- Add it back with NULL support
ALTER TABLE applications
    ADD CONSTRAINT applications_service_tier_fk
    FOREIGN KEY (service_tier_id)
    REFERENCES service_tiers(id)
    ON DELETE RESTRICT;

-- Add new columns for Step 1 personal data
-- These will be stored separately from applicant_name (which combines them)
ALTER TABLE applications
    ADD COLUMN first_name VARCHAR(100) NULL AFTER applicant_phone,
    ADD COLUMN last_name VARCHAR(100) NULL AFTER first_name,
    ADD COLUMN date_of_birth DATE NULL AFTER last_name,
    ADD COLUMN nationality VARCHAR(100) NULL AFTER date_of_birth,
    ADD COLUMN passport_number VARCHAR(50) NULL AFTER nationality,
    ADD COLUMN current_country VARCHAR(100) NULL AFTER passport_number,
    ADD COLUMN current_city VARCHAR(100) NULL AFTER current_country;

-- Add index for better query performance
CREATE INDEX idx_first_last_name ON applications(first_name, last_name);
CREATE INDEX idx_nationality ON applications(nationality);

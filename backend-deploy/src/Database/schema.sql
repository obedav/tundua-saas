-- Tundua Study Abroad SaaS Platform - Database Schema
-- Version: 1.0
-- Date: 2025-01-06

-- Create database
CREATE DATABASE IF NOT EXISTS tundua_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tundua_saas;

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- Users table with role-based access control
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',

    -- Email verification
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP NULL,

    -- Password reset
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,

    -- Account status
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_uuid (uuid),
    INDEX idx_role (role),
    INDEX idx_email_verified (email_verified)
) ENGINE=InnoDB;

-- User profiles with detailed information
CREATE TABLE user_profiles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,

    -- Personal information
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    passport_expiry DATE,

    -- Contact information
    current_country VARCHAR(100),
    current_city VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),

    -- Profile
    profile_photo_url VARCHAR(500),
    bio TEXT,

    -- Academic background
    highest_education VARCHAR(100),
    field_of_study VARCHAR(100),
    institution_name VARCHAR(255),
    graduation_year YEAR,
    gpa DECIMAL(3,2),
    gpa_scale VARCHAR(10) DEFAULT '4.0',

    -- English proficiency
    english_test_type VARCHAR(50),
    english_test_score VARCHAR(50),
    english_test_date DATE,

    -- Work experience
    work_experience_years INT DEFAULT 0,
    current_occupation VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_nationality (nationality)
) ENGINE=InnoDB;

-- ============================================================================
-- SERVICE CONFIGURATION
-- ============================================================================

-- Service tiers (Standard, Premium, Concierge)
CREATE TABLE service_tiers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    features JSON,
    max_universities INT NOT NULL,
    includes_essay_review BOOLEAN DEFAULT FALSE,
    includes_sop_writing BOOLEAN DEFAULT FALSE,
    includes_visa_support BOOLEAN DEFAULT FALSE,
    includes_interview_coaching BOOLEAN DEFAULT FALSE,
    support_level VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB;

-- Add-on services catalog
CREATE TABLE addon_services (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    delivery_time_days INT DEFAULT 7,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB;

-- ============================================================================
-- APPLICATIONS
-- ============================================================================

-- Applications table - Core of the SaaS platform
CREATE TABLE applications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT UNSIGNED NOT NULL,

    -- Step 1: Personal Information (auto-filled from profile)
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),

    -- Step 2: Academic Background
    highest_education VARCHAR(100),
    field_of_study VARCHAR(255),
    institution_name VARCHAR(255),
    graduation_year YEAR,
    gpa DECIMAL(3,2),
    gpa_scale VARCHAR(10) DEFAULT '4.0',
    english_test_type VARCHAR(50),
    english_test_score VARCHAR(50),

    -- Step 3: Destination & Universities
    destination_country VARCHAR(100) NOT NULL,
    universities JSON,
    program_type VARCHAR(100),
    intended_major VARCHAR(255),
    intake_season VARCHAR(50),
    intake_year YEAR,

    -- Step 4: Service Tier Selection
    service_tier_id INT UNSIGNED NOT NULL,
    service_tier_name VARCHAR(100),
    base_price DECIMAL(10,2) NOT NULL,

    -- Step 5: Add-On Services
    addon_services JSON,
    addon_total DECIMAL(10,2) DEFAULT 0.00,

    -- Step 6: Documents (handled in documents table)
    documents_complete BOOLEAN DEFAULT FALSE,

    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    -- Payment Status
    payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded') DEFAULT 'pending',
    payment_id INT UNSIGNED NULL,
    paid_at TIMESTAMP NULL,

    -- Application Status
    status ENUM(
        'draft',
        'submitted',
        'payment_pending',
        'under_review',
        'documents_requested',
        'in_progress',
        'approved',
        'rejected',
        'completed',
        'cancelled'
    ) DEFAULT 'draft',

    -- Progress tracking
    current_step INT DEFAULT 1,
    completion_percentage INT DEFAULT 0,

    -- Admin management
    assigned_to INT UNSIGNED NULL,
    admin_notes TEXT,
    internal_notes TEXT,
    rejection_reason TEXT,

    -- Timestamps
    submitted_at TIMESTAMP NULL,
    reviewed_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Auto-delete unpaid applications after 72 hours
    auto_delete_at TIMESTAMP GENERATED ALWAYS AS (
        CASE
            WHEN payment_status = 'pending' AND status IN ('draft', 'payment_pending')
            THEN DATE_ADD(created_at, INTERVAL 72 HOUR)
            ELSE NULL
        END
    ) STORED,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_tier_id) REFERENCES service_tiers(id),
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_reference_number (reference_number),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_auto_delete (auto_delete_at),
    INDEX idx_destination_country (destination_country),
    INDEX idx_created_at (created_at),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB;

-- ============================================================================
-- DOCUMENTS
-- ============================================================================

-- Documents table for file uploads
CREATE TABLE documents (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,

    -- Document details
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT UNSIGNED,
    mime_type VARCHAR(100),
    file_extension VARCHAR(10),

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT UNSIGNED NULL,
    verified_at TIMESTAMP NULL,
    verification_notes TEXT,

    -- Status
    status ENUM('pending', 'under_review', 'approved', 'rejected', 'needs_revision') DEFAULT 'pending',
    rejection_reason TEXT,

    -- Metadata
    metadata JSON,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_application_id (application_id),
    INDEX idx_user_id (user_id),
    INDEX idx_document_type (document_type),
    INDEX idx_status (status),
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB;

-- ============================================================================
-- PAYMENTS
-- ============================================================================

-- Payments table
CREATE TABLE payments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    application_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,

    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method ENUM('stripe', 'mpesa', 'paypal', 'bank_transfer', 'other') NOT NULL,

    -- Provider-specific data
    provider_transaction_id VARCHAR(255),
    provider_metadata JSON,

    -- Status
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded') DEFAULT 'pending',

    -- Stripe specific
    stripe_session_id VARCHAR(255),
    stripe_payment_intent VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),

    -- M-Pesa specific
    mpesa_checkout_request_id VARCHAR(255),
    mpesa_merchant_request_id VARCHAR(255),
    mpesa_receipt_number VARCHAR(255),
    mpesa_phone_number VARCHAR(20),

    -- Receipt
    receipt_url VARCHAR(500),
    receipt_sent BOOLEAN DEFAULT FALSE,
    invoice_number VARCHAR(50),

    -- Error handling
    error_code VARCHAR(100),
    error_message TEXT,
    retry_count INT DEFAULT 0,

    -- Timestamps
    paid_at TIMESTAMP NULL,
    failed_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_transaction_id (transaction_id),
    INDEX idx_application_id (application_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_method (payment_method),
    INDEX idx_stripe_session_id (stripe_session_id),
    INDEX idx_mpesa_receipt_number (mpesa_receipt_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================================
-- REFUNDS
-- ============================================================================

-- Refunds table with E-Agreement and 90-day countdown
CREATE TABLE refunds (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    refund_reference VARCHAR(50) UNIQUE NOT NULL,
    application_id INT UNSIGNED NOT NULL,
    payment_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,

    -- Refund details
    refund_amount DECIMAL(10,2) NOT NULL,
    refund_reason TEXT NOT NULL,
    refund_type ENUM('full', 'partial') DEFAULT 'full',

    -- E-Agreement
    agreement_signed BOOLEAN DEFAULT FALSE,
    agreement_signature_data LONGTEXT,
    agreement_signed_at TIMESTAMP NULL,
    agreement_ip_address VARCHAR(45),
    agreement_user_agent TEXT,
    agreement_pdf_url VARCHAR(500),

    -- Status
    status ENUM('requested', 'pending_review', 'approved', 'rejected', 'processing', 'completed', 'cancelled') DEFAULT 'requested',

    -- Admin review
    reviewed_by INT UNSIGNED NULL,
    reviewed_at TIMESTAMP NULL,
    admin_notes TEXT,
    rejection_reason TEXT,

    -- 90-day countdown (business days)
    approved_at TIMESTAMP NULL,
    refund_deadline DATE GENERATED ALWAYS AS (
        CASE
            WHEN approved_at IS NOT NULL
            THEN DATE_ADD(DATE(approved_at), INTERVAL 90 DAY)
            ELSE NULL
        END
    ) STORED,
    business_days_remaining INT DEFAULT 90,

    -- Completion
    refunded_at TIMESTAMP NULL,
    refund_transaction_id VARCHAR(255),
    refund_method VARCHAR(100),
    refund_metadata JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_refund_reference (refund_reference),
    INDEX idx_application_id (application_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_approved_at (approved_at),
    INDEX idx_refund_deadline (refund_deadline)
) ENGINE=InnoDB;

-- ============================================================================
-- ADD-ON ORDERS
-- ============================================================================

-- Add-on orders for purchased services
CREATE TABLE addon_orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id INT UNSIGNED NOT NULL,
    addon_service_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,

    -- Order details
    quantity INT DEFAULT 1,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,

    -- Fulfillment
    status ENUM('pending', 'in_progress', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
    assigned_to INT UNSIGNED NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    fulfillment_notes TEXT,

    -- Delivery
    deliverable_url VARCHAR(500),
    delivered_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_service_id) REFERENCES addon_services(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_application_id (application_id),
    INDEX idx_addon_service_id (addon_service_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB;

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Notifications table
CREATE TABLE notifications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,

    -- Notification details
    type VARCHAR(100) NOT NULL,
    channel ENUM('email', 'sms', 'whatsapp', 'in_app', 'push') NOT NULL,
    template_name VARCHAR(100),

    -- Content
    subject VARCHAR(255),
    message TEXT NOT NULL,
    data JSON,

    -- Delivery
    status ENUM('pending', 'sent', 'delivered', 'failed', 'bounced') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    failed_at TIMESTAMP NULL,
    error_message TEXT,

    -- Tracking
    opened BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMP NULL,
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP NULL,

    -- Priority
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',

    -- Related entities
    related_entity_type VARCHAR(100),
    related_entity_id INT UNSIGNED,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_channel (channel),
    INDEX idx_sent_at (sent_at),
    INDEX idx_related_entity (related_entity_type, related_entity_id)
) ENGINE=InnoDB;

-- ============================================================================
-- ACTIVITY LOG
-- ============================================================================

-- Activity log for audit trail
CREATE TABLE activity_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,

    -- Activity details
    entity_type VARCHAR(100) NOT NULL,
    entity_id INT UNSIGNED NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,

    -- Changes
    old_values JSON,
    new_values JSON,

    -- Request details
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_method VARCHAR(10),
    request_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================================
-- SYSTEM CONFIGURATION
-- ============================================================================

-- System settings
CREATE TABLE system_settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB;

-- ============================================================================
-- SEED DATA - Service Tiers
-- ============================================================================

INSERT INTO service_tiers (name, slug, description, base_price, max_universities, features, support_level, is_active, is_featured, sort_order) VALUES
('Standard Package', 'standard', 'Perfect for students who need basic application support', 299.00, 3,
'["3 university applications", "Basic document review", "Email support", "Application tracking dashboard"]',
'email', TRUE, FALSE, 1),

('Premium Package', 'premium', 'Comprehensive support for serious applicants', 599.00, 5,
'["5 university applications", "Essay review and editing", "Document verification", "Priority email support", "Application strategy consultation", "Interview preparation tips"]',
'priority', TRUE, TRUE, 2),

('Concierge Package', 'concierge', 'White-glove service with dedicated counselor', 999.00, 8,
'["8 university applications", "Complete essay writing", "Full document preparation", "Visa application assistance", "Interview coaching sessions", "Dedicated counselor", "24/7 WhatsApp support", "Post-acceptance support"]',
'vip', TRUE, TRUE, 3);

-- ============================================================================
-- SEED DATA - Add-On Services
-- ============================================================================

INSERT INTO addon_services (name, slug, description, price, category, delivery_time_days, is_active, is_featured, sort_order) VALUES
('Statement of Purpose Writing', 'sop-writing', 'Professional SOP written by experienced writers', 150.00, 'documents', 7, TRUE, TRUE, 1),
('Letter of Recommendation Editing', 'lor-editing', 'Expert editing and refinement of your LORs', 75.00, 'documents', 5, TRUE, FALSE, 2),
('Resume Optimization', 'resume-optimization', 'Academic resume tailored for university applications', 95.00, 'documents', 3, TRUE, FALSE, 3),
('Scholarship Search & Matching', 'scholarship-search', 'Personalized scholarship recommendations', 125.00, 'planning', 7, TRUE, TRUE, 4),
('Interview Coaching Session', 'interview-coaching', 'One-on-one mock interview with feedback (60 minutes)', 200.00, 'coaching', 1, TRUE, TRUE, 5),
('Visa Application Support', 'visa-support', 'Complete visa application assistance', 299.00, 'support', 14, TRUE, TRUE, 6),
('Document Translation', 'document-translation', 'Professional translation per page', 50.00, 'documents', 5, TRUE, FALSE, 7),
('IELTS/TOEFL Prep Course', 'test-prep', 'Comprehensive test preparation program', 399.00, 'coaching', 30, TRUE, FALSE, 8),
('University Selection Report', 'university-selection', 'Detailed report with best-fit universities', 149.00, 'planning', 7, TRUE, FALSE, 9),
('Financial Aid Consulting', 'financial-aid', 'Expert guidance on financial aid options', 249.00, 'planning', 7, TRUE, FALSE, 10),
('Post-Landing Support', 'post-landing', 'Pre-departure and arrival assistance', 199.00, 'support', 1, TRUE, FALSE, 11),
('Accommodation Booking', 'accommodation', 'Help finding and booking student accommodation', 99.00, 'support', 7, TRUE, FALSE, 12),
('Flight Booking Assistance', 'flight-booking', 'Best deals on student flights', 75.00, 'support', 3, TRUE, FALSE, 13);

-- ============================================================================
-- SEED DATA - System Settings
-- ============================================================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'Tundua Study Abroad', 'string', 'Platform name', TRUE),
('currency_default', 'USD', 'string', 'Default currency', TRUE),
('tax_rate', '0.00', 'number', 'Tax rate (0 for no tax)', FALSE),
('auto_delete_unpaid_hours', '72', 'number', 'Hours before auto-deleting unpaid applications', FALSE),
('refund_business_days', '90', 'number', 'Business days for refund processing', TRUE),
('max_upload_size_mb', '10', 'number', 'Maximum file upload size in MB', TRUE),
('allowed_document_types', '["pdf","jpg","jpeg","png","docx","doc"]', 'json', 'Allowed document file types', FALSE),
('email_notifications_enabled', 'true', 'boolean', 'Enable email notifications', FALSE),
('sms_notifications_enabled', 'false', 'boolean', 'Enable SMS notifications', FALSE),
('application_reference_prefix', 'TUN', 'string', 'Prefix for application reference numbers', FALSE),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', TRUE);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

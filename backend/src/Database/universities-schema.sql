-- Universities Table for Multi-Platform Support
-- Run this after the main schema.sql

CREATE TABLE IF NOT EXISTS universities (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- Basic Info
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    logo_url VARCHAR(500),
    website_url VARCHAR(500),

    -- Academic Info
    ranking INT,
    acceptance_rate DECIMAL(5,2), -- e.g., 75.50 for 75.5%
    tuition_min DECIMAL(10,2),
    tuition_max DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',

    -- Platform Availability
    available_on_applyboard BOOLEAN DEFAULT FALSE,
    available_on_edvoy BOOLEAN DEFAULT FALSE,
    available_on_studygroup BOOLEAN DEFAULT FALSE,
    available_on_adventus BOOLEAN DEFAULT FALSE,

    -- Platform-Specific Data
    applyboard_id VARCHAR(100),
    edvoy_id VARCHAR(100),
    studygroup_id VARCHAR(100),
    adventus_id VARCHAR(100),

    -- Commission Info (for your intelligence system)
    applyboard_commission DECIMAL(10,2),
    edvoy_commission DECIMAL(10,2),
    studygroup_commission DECIMAL(10,2),
    adventus_commission DECIMAL(10,2),

    -- Processing Times (in days)
    applyboard_processing_days INT,
    edvoy_processing_days INT,
    studygroup_processing_days INT,
    adventus_processing_days INT,

    -- Requirements
    min_gpa DECIMAL(3,2),
    min_ielts DECIMAL(3,1),
    min_toefl INT,

    -- Metadata
    popular BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes for fast search
    INDEX idx_country (country),
    INDEX idx_tuition (tuition_min, tuition_max),
    INDEX idx_platforms (available_on_applyboard, available_on_edvoy, available_on_studygroup, available_on_adventus),
    INDEX idx_popular (popular, featured),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Programs table (universities offer multiple programs)
CREATE TABLE IF NOT EXISTS university_programs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    university_id INT UNSIGNED NOT NULL,

    name VARCHAR(255) NOT NULL,
    degree_level ENUM('Bachelors', 'Masters', 'PhD', 'Diploma', 'Certificate') NOT NULL,
    field_of_study VARCHAR(100),
    duration_months INT,

    tuition_per_year DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',

    -- Requirements
    min_gpa DECIMAL(3,2),
    min_ielts DECIMAL(3,1),
    min_toefl INT,

    intake_months VARCHAR(50), -- e.g., "September,January"

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    INDEX idx_university (university_id),
    INDEX idx_degree (degree_level),
    INDEX idx_field (field_of_study)
) ENGINE=InnoDB;

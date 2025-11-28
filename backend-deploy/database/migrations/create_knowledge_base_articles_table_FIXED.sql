-- ============================================================================
-- TUNDUA SAAS - KNOWLEDGE BASE ARTICLES TABLE MIGRATION (FIXED)
-- ============================================================================
-- Created: 2025-11-08
-- Purpose: Create knowledge_base_articles table for help center/documentation
-- ============================================================================

-- Drop table if it exists (UNCOMMENT ONLY IF YOU WANT TO RECREATE)
-- DROP TABLE IF EXISTS knowledge_base_articles;

-- Create knowledge_base_articles table
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100),
    tags JSON,
    author_id BIGINT UNSIGNED,
    is_published TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    view_count INT UNSIGNED DEFAULT 0,
    helpful_count INT UNSIGNED DEFAULT 0,
    not_helpful_count INT UNSIGNED DEFAULT 0,
    metadata JSON,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_category (category),
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured),
    INDEX idx_published_at (published_at),
    INDEX idx_view_count (view_count DESC),
    FULLTEXT INDEX idx_search (title, content, excerpt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- VERIFY TABLE CREATION
-- ============================================================================

SELECT 'Table created successfully!' AS Status;

-- Show table structure
DESCRIBE knowledge_base_articles;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT '✅ Knowledge Base Articles table created successfully!' AS status;

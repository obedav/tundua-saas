-- ============================================================================
-- TUNDUA SAAS - KNOWLEDGE BASE ARTICLES TABLE MIGRATION
-- ============================================================================
-- Created: 2025-11-08
-- Purpose: Create knowledge_base_articles table for help center/documentation
-- ============================================================================

-- Drop table if it exists (USE WITH CAUTION IN PRODUCTION!)
-- DROP TABLE IF EXISTS knowledge_base_articles;

-- Create knowledge_base_articles table
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
    -- Primary Key
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- Content Fields
    title VARCHAR(255) NOT NULL COMMENT 'Article title',
    slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly identifier',
    content LONGTEXT NOT NULL COMMENT 'Article content (supports HTML/Markdown)',
    excerpt TEXT COMMENT 'Short summary/preview',

    -- Organization Fields
    category VARCHAR(100) COMMENT 'Category (Applications, Documents, Payments, etc.)',
    tags JSON COMMENT 'Array of tags for filtering',

    -- Author & Publishing
    author_id BIGINT UNSIGNED COMMENT 'User ID of article author',
    is_published BOOLEAN DEFAULT FALSE COMMENT 'Published status',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Show on featured list',
    published_at TIMESTAMP NULL COMMENT 'When article was published',

    -- Engagement Metrics
    view_count INT UNSIGNED DEFAULT 0 COMMENT 'Number of times viewed',
    helpful_count INT UNSIGNED DEFAULT 0 COMMENT 'Number of "helpful" votes',
    not_helpful_count INT UNSIGNED DEFAULT 0 COMMENT 'Number of "not helpful" votes',

    -- Additional Data
    metadata JSON COMMENT 'Additional metadata (related_articles, video_url, etc.)',

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes for Performance
    INDEX idx_category (category),
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured),
    INDEX idx_published_at (published_at),
    INDEX idx_view_count (view_count DESC),

    -- Full-text search index
    FULLTEXT INDEX idx_search (title, content, excerpt),

    -- Foreign Key (optional - uncomment if you want to enforce author relationship)
    -- FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL

    -- Table Engine & Charset
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Knowledge base articles for help center';

-- ============================================================================
-- VERIFY TABLE CREATION
-- ============================================================================

-- Check if table was created successfully
SELECT
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME,
    TABLE_COMMENT
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'knowledge_base_articles';

-- Show table structure
DESCRIBE knowledge_base_articles;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT '✅ Knowledge Base Articles table created successfully!' AS status;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================
-- 1. Run the seeder script to populate with sample articles
-- 2. Update your .env to ensure DB_DATABASE matches this database
-- 3. Test API endpoints: GET /api/knowledge-base/popular
-- ============================================================================

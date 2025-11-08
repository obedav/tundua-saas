-- Add missing columns to refunds table for E-Agreement and countdown

ALTER TABLE refunds
ADD COLUMN IF NOT EXISTS signature_data TEXT COMMENT 'Base64 signature image',
ADD COLUMN IF NOT EXISTS signed_ip_address VARCHAR(45) COMMENT 'IP address when agreement was signed',
ADD COLUMN IF NOT EXISTS signed_at DATETIME COMMENT 'Timestamp when agreement was signed',
ADD COLUMN IF NOT EXISTS agreement_pdf_url VARCHAR(500) COMMENT 'URL to the signed PDF agreement',
ADD COLUMN IF NOT EXISTS approved_at DATETIME COMMENT 'Timestamp when refund was approved',
ADD COLUMN IF NOT EXISTS business_days_remaining INT DEFAULT 90 COMMENT 'Business days remaining until refund processing',
ADD COLUMN IF NOT EXISTS refund_due_date DATE COMMENT 'Calculated due date (90 business days from approval)',
ADD COLUMN IF NOT EXISTS last_countdown_update DATETIME COMMENT 'Last time countdown was updated by cron';

-- Create index for approved refunds (used by cron job)
CREATE INDEX IF NOT EXISTS idx_refunds_approved ON refunds(status, approved_at);

-- Create index for countdown updates
CREATE INDEX IF NOT EXISTS idx_refunds_countdown ON refunds(business_days_remaining, last_countdown_update);

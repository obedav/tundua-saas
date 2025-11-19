-- Add OAuth fields to users table

-- Add google_id field (if it doesn't exist)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL UNIQUE,
ADD INDEX idx_google_id (google_id);

-- Add user_type field (if it doesn't exist)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS user_type ENUM('student', 'partner') DEFAULT 'student',
ADD INDEX idx_user_type (user_type);

-- Add profile_picture field for Google avatar (if it doesn't exist)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500) NULL;

SELECT 'OAuth fields added successfully!' AS message;

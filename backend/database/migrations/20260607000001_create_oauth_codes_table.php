<?php

use Phinx\Migration\AbstractMigration;

class CreateOauthCodesTable extends AbstractMigration
{
    public function up(): void
    {
        $this->execute("
            CREATE TABLE oauth_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(64) NOT NULL UNIQUE,
                user_id INT NOT NULL,
                access_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL,
                user_role VARCHAR(50) NOT NULL DEFAULT 'user',
                expires_at INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_code (code),
                INDEX idx_expires (expires_at)
            )
        ");
    }

    public function down(): void
    {
        $this->execute("DROP TABLE IF EXISTS oauth_codes");
    }
}

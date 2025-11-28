#!/usr/bin/env php
<?php

/**
 * Security Cleanup Script
 *
 * Cleans up expired security data:
 * - Rate limit files
 * - Refresh tokens
 * - Audit logs (90 day retention)
 *
 * Usage: php scripts/cleanup-security.php
 * Cron: 0 3 * * * cd /path/to/backend && php scripts/cleanup-security.php
 */

require __DIR__ . '/../vendor/autoload.php';

use Tundua\Middleware\RateLimitMiddleware;
use Tundua\Services\RefreshTokenService;
use Tundua\Services\AuditLogger;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Initialize Eloquent for database operations
$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'database' => $_ENV['DB_DATABASE'] ?? 'tundua_saas',
    'username' => $_ENV['DB_USERNAME'] ?? 'root',
    'password' => $_ENV['DB_PASSWORD'] ?? '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

// Colors for CLI output
$colors = [
    'reset' => "\033[0m",
    'green' => "\033[32m",
    'yellow' => "\033[33m",
    'blue' => "\033[34m",
    'red' => "\033[31m",
];

function colorize($text, $color, $colors) {
    return $colors[$color] . $text . $colors['reset'];
}

echo colorize("========================================\n", 'green', $colors);
echo colorize("Tundua Security Cleanup Script\n", 'green', $colors);
echo colorize("========================================\n", 'green', $colors);
echo "\n";

$startTime = microtime(true);
$totalCleaned = 0;

// ============================================
// 1. Clean up expired rate limit files
// ============================================
echo colorize("→ Cleaning rate limit files...\n", 'blue', $colors);
try {
    $rateLimitDeleted = RateLimitMiddleware::cleanup();
    $totalCleaned += $rateLimitDeleted;
    echo colorize("  ✓ Deleted {$rateLimitDeleted} expired rate limit files\n", 'green', $colors);
} catch (Exception $e) {
    echo colorize("  ✗ Error cleaning rate limits: " . $e->getMessage() . "\n", 'red', $colors);
}

echo "\n";

// ============================================
// 2. Clean up expired refresh tokens
// ============================================
echo colorize("→ Cleaning refresh tokens...\n", 'blue', $colors);
try {
    $tokensDeleted = RefreshTokenService::cleanup();
    $totalCleaned += $tokensDeleted;
    echo colorize("  ✓ Deleted {$tokensDeleted} expired refresh tokens\n", 'green', $colors);
} catch (Exception $e) {
    echo colorize("  ✗ Error cleaning refresh tokens: " . $e->getMessage() . "\n", 'red', $colors);
}

echo "\n";

// ============================================
// 3. Clean up old audit logs (90 day retention)
// ============================================
echo colorize("→ Cleaning audit logs (90 day retention)...\n", 'blue', $colors);
try {
    $auditLogsDeleted = AuditLogger::cleanup(90);
    $totalCleaned += $auditLogsDeleted;
    echo colorize("  ✓ Deleted {$auditLogsDeleted} old audit log entries\n", 'green', $colors);
} catch (Exception $e) {
    echo colorize("  ✗ Error cleaning audit logs: " . $e->getMessage() . "\n", 'red', $colors);
}

echo "\n";

// ============================================
// Summary
// ============================================
$endTime = microtime(true);
$duration = round($endTime - $startTime, 2);

echo colorize("========================================\n", 'green', $colors);
echo colorize("Cleanup Summary\n", 'green', $colors);
echo colorize("========================================\n", 'green', $colors);
echo colorize("Total items cleaned: {$totalCleaned}\n", 'yellow', $colors);
echo colorize("Duration: {$duration}s\n", 'yellow', $colors);
echo colorize("Timestamp: " . date('Y-m-d H:i:s') . "\n", 'yellow', $colors);
echo colorize("========================================\n", 'green', $colors);

// Log to file
$logFile = __DIR__ . '/../storage/logs/cleanup.log';
$logDir = dirname($logFile);

if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

$logMessage = sprintf(
    "[%s] Cleanup completed: %d items removed in %ss\n",
    date('Y-m-d H:i:s'),
    $totalCleaned,
    $duration
);

file_put_contents($logFile, $logMessage, FILE_APPEND);

exit(0);

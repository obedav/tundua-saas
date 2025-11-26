#!/usr/bin/env php
<?php

/**
 * System Health Check Script
 *
 * Checks system health and generates a report
 *
 * Usage: php scripts/health-check.php
 * Cron: 0 9 * * 1 (Every Monday at 9 AM)
 */

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as DB;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Initialize Eloquent
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

echo "========================================\n";
echo "Tundua System Health Check\n";
echo "========================================\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";

$health = [
    'timestamp' => date('Y-m-d H:i:s'),
    'status' => 'healthy',
    'checks' => []
];

// ============================================
// 1. Database Connection
// ============================================
echo "→ Checking database connection...\n";
try {
    DB::connection()->getPdo();
    $health['checks']['database'] = [
        'status' => 'ok',
        'message' => 'Database connection successful'
    ];
    echo "  ✓ Database connection OK\n";
} catch (Exception $e) {
    $health['checks']['database'] = [
        'status' => 'error',
        'message' => $e->getMessage()
    ];
    $health['status'] = 'unhealthy';
    echo "  ✗ Database connection FAILED: " . $e->getMessage() . "\n";
}

echo "\n";

// ============================================
// 2. Storage Directories
// ============================================
echo "→ Checking storage directories...\n";
$requiredDirs = [
    'storage/rate_limits',
    'storage/refresh_tokens',
    'storage/backups',
    'storage/logs',
    'storage/uploads'
];

$dirStatus = [];
foreach ($requiredDirs as $dir) {
    $fullPath = __DIR__ . '/../' . $dir;
    if (is_dir($fullPath) && is_writable($fullPath)) {
        echo "  ✓ {$dir} (writable)\n";
        $dirStatus[$dir] = 'ok';
    } else {
        echo "  ✗ {$dir} (missing or not writable)\n";
        $dirStatus[$dir] = 'error';
        $health['status'] = 'warning';
    }
}

$health['checks']['storage'] = [
    'status' => in_array('error', $dirStatus) ? 'warning' : 'ok',
    'directories' => $dirStatus
];

echo "\n";

// ============================================
// 3. Database Statistics
// ============================================
echo "→ Database statistics...\n";
try {
    $stats = [
        'users' => DB::table('users')->count(),
        'applications' => DB::table('applications')->count(),
        'payments' => DB::table('payments')->count(),
        'audit_logs' => DB::table('audit_logs')->count(),
        'documents' => DB::table('documents')->count()
    ];

    foreach ($stats as $table => $count) {
        echo "  • {$table}: {$count}\n";
    }

    $health['checks']['database_stats'] = [
        'status' => 'ok',
        'stats' => $stats
    ];
} catch (Exception $e) {
    echo "  ✗ Error getting statistics: " . $e->getMessage() . "\n";
    $health['checks']['database_stats'] = [
        'status' => 'error',
        'message' => $e->getMessage()
    ];
}

echo "\n";

// ============================================
// 4. Recent Activity (Last 7 days)
// ============================================
echo "→ Recent activity (last 7 days)...\n";
try {
    $sevenDaysAgo = date('Y-m-d H:i:s', strtotime('-7 days'));

    $recentActivity = [
        'new_users' => DB::table('users')->where('created_at', '>=', $sevenDaysAgo)->count(),
        'new_applications' => DB::table('applications')->where('created_at', '>=', $sevenDaysAgo)->count(),
        'payments' => DB::table('payments')->where('created_at', '>=', $sevenDaysAgo)->count(),
        'login_attempts' => DB::table('audit_logs')->where('event_type', 'user.login')->where('created_at', '>=', $sevenDaysAgo)->count(),
        'failed_logins' => DB::table('audit_logs')->where('event_type', 'user.login.failed')->where('created_at', '>=', $sevenDaysAgo)->count()
    ];

    foreach ($recentActivity as $metric => $count) {
        echo "  • {$metric}: {$count}\n";
    }

    $health['checks']['recent_activity'] = [
        'status' => 'ok',
        'activity' => $recentActivity
    ];
} catch (Exception $e) {
    echo "  ✗ Error getting activity: " . $e->getMessage() . "\n";
}

echo "\n";

// ============================================
// 5. Disk Usage
// ============================================
echo "→ Disk usage...\n";
$backupDir = __DIR__ . '/../storage/backups';
if (is_dir($backupDir)) {
    $backupSize = 0;
    $files = glob($backupDir . '/*');
    foreach ($files as $file) {
        if (is_file($file)) {
            $backupSize += filesize($file);
        }
    }

    $backupSizeHuman = $backupSize > 1024*1024 ?
        round($backupSize / (1024*1024), 2) . ' MB' :
        round($backupSize / 1024, 2) . ' KB';

    echo "  • Backup storage: {$backupSizeHuman} (" . count($files) . " files)\n";

    $health['checks']['disk_usage'] = [
        'status' => 'ok',
        'backup_size' => $backupSizeHuman,
        'backup_count' => count($files)
    ];
}

echo "\n";

// ============================================
// Summary
// ============================================
echo "========================================\n";
echo "Health Status: " . strtoupper($health['status']) . "\n";
echo "========================================\n";

// Save report
$reportFile = __DIR__ . '/../storage/logs/health-report.json';
file_put_contents($reportFile, json_encode($health, JSON_PRETTY_PRINT));

echo "\nReport saved to: {$reportFile}\n";

exit($health['status'] === 'healthy' ? 0 : 1);

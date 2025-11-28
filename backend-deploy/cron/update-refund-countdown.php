<?php

/**
 * Cron Job: Update refund countdown timers (business days)
 * Schedule: Daily at midnight
 * Command: php /path/to/backend/cron/update-refund-countdown.php
 */

require __DIR__ . '/../vendor/autoload.php';

use Tundua\Database\Database;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

try {
    $db = Database::getConnection();

    echo "===================================\n";
    echo "Refund Countdown Update - Started\n";
    echo "Time: " . date('Y-m-d H:i:s') . "\n";
    echo "===================================\n\n";

    // Find approved refunds that need countdown update
    $stmt = $db->prepare("
        SELECT id, approved_at, business_days_remaining
        FROM refunds
        WHERE status = 'approved'
        AND business_days_remaining > 0
    ");
    $stmt->execute();
    $refunds = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Found " . count($refunds) . " active refunds to update\n\n";

    $updatedCount = 0;
    $completedCount = 0;

    foreach ($refunds as $refund) {
        echo "Processing Refund #{$refund['id']}...\n";

        // Calculate business days remaining
        $approvedDate = new DateTime($refund['approved_at']);
        $today = new DateTime();

        $businessDaysPassed = 0;
        $currentDate = clone $approvedDate;

        while ($currentDate < $today) {
            $currentDate->modify('+1 day');
            $dayOfWeek = $currentDate->format('N'); // 1 (Monday) to 7 (Sunday)

            if ($dayOfWeek < 6) { // Monday to Friday
                $businessDaysPassed++;
            }
        }

        $daysRemaining = max(0, 90 - $businessDaysPassed);

        echo "  Approved: {$refund['approved_at']}\n";
        echo "  Business days passed: {$businessDaysPassed}\n";
        echo "  Days remaining: {$daysRemaining}\n";

        // Update countdown
        $updateStmt = $db->prepare("
            UPDATE refunds
            SET business_days_remaining = ?,
                last_countdown_update = NOW()
            WHERE id = ?
        ");
        $updateStmt->execute([$daysRemaining, $refund['id']]);

        $updatedCount++;

        // Mark as ready for processing if countdown reached zero
        if ($daysRemaining === 0) {
            $completeStmt = $db->prepare("
                UPDATE refunds
                SET status = 'ready_for_processing'
                WHERE id = ?
            ");
            $completeStmt->execute([$refund['id']]);

            $completedCount++;
            echo "  ✅ Countdown complete! Status: ready_for_processing\n";
        } else {
            echo "  ✅ Updated countdown\n";
        }

        echo "\n";
    }

    echo "===================================\n";
    echo "Countdown Update Summary\n";
    echo "===================================\n";
    echo "Total refunds processed: {$updatedCount}\n";
    echo "Completed (ready for processing): {$completedCount}\n";
    echo "===================================\n";

    if (php_sapi_name() !== 'cli') {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'updated_count' => $updatedCount,
            'completed_count' => $completedCount,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

} catch (Exception $e) {
    echo "Error: {$e->getMessage()}\n";

    if (php_sapi_name() !== 'cli') {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }

    exit(1);
}

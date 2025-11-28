<?php

/**
 * Cron Job: Send payment reminders for applications nearing 72-hour deadline
 * Schedule: Daily at 9 AM
 * Command: php /path/to/backend/cron/payment-reminders.php
 */

require __DIR__ . '/../vendor/autoload.php';

use Tundua\Database\Database;
use Tundua\Services\EmailService;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

try {
    $db = Database::getConnection();

    echo "===================================\n";
    echo "Payment Reminders - Started\n";
    echo "Time: " . date('Y-m-d H:i:s') . "\n";
    echo "===================================\n\n";

    // Find applications that are 60-72 hours old (reminder window)
    $stmt = $db->prepare("
        SELECT a.*, u.email, u.first_name, u.last_name
        FROM applications a
        JOIN users u ON a.user_id = u.id
        WHERE a.payment_status = 'pending'
        AND a.status = 'draft'
        AND a.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 72 HOUR) AND DATE_SUB(NOW(), INTERVAL 60 HOUR)
        AND a.id NOT IN (
            SELECT entity_id FROM activity_log
            WHERE action = 'payment_reminder_sent'
            AND entity_type = 'application'
            AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        )
    ");
    $stmt->execute();
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Found " . count($applications) . " applications needing reminders\n\n";

    $sentCount = 0;

    foreach ($applications as $app) {
        // Calculate hours remaining
        $createdAt = new DateTime($app['created_at']);
        $now = new DateTime();
        $diff = $now->diff($createdAt);
        $hoursElapsed = ($diff->days * 24) + $diff->h;
        $hoursRemaining = 72 - $hoursElapsed;

        echo "Processing {$app['reference_number']} for {$app['email']}...\n";
        echo "  Hours remaining: {$hoursRemaining}\n";

        // Send reminder email
        $sent = EmailService::sendPaymentReminder($app, $hoursRemaining);

        if ($sent) {
            $sentCount++;

            // Log reminder sent
            $logStmt = $db->prepare("
                INSERT INTO activity_log (
                    user_id, entity_type, entity_id, action, description, created_at
                ) VALUES (?, 'application', ?, 'payment_reminder_sent', ?, NOW())
            ");
            $logStmt->execute([
                $app['user_id'],
                $app['id'],
                "Payment reminder sent: {$hoursRemaining} hours remaining"
            ]);

            echo "  ✅ Reminder sent successfully\n\n";
        } else {
            echo "  ❌ Failed to send reminder\n\n";
        }
    }

    echo "===================================\n";
    echo "Reminders sent: {$sentCount} / " . count($applications) . "\n";
    echo "===================================\n";

    if (php_sapi_name() !== 'cli') {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'sent_count' => $sentCount,
            'total' => count($applications),
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

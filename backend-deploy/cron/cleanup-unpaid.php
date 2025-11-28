<?php

/**
 * Cron Job: Delete unpaid applications older than 72 hours
 * Schedule: Every 6 hours
 * Command: php /path/to/backend/cron/cleanup-unpaid.php
 */

require __DIR__ . '/../vendor/autoload.php';

use Tundua\Database\Database;

// Load environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Verify cron secret (if called via HTTP)
if (php_sapi_name() !== 'cli') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $expectedAuth = 'Bearer ' . $_ENV['CRON_SECRET'];

    if ($authHeader !== $expectedAuth) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

try {
    $db = Database::getConnection();

    echo "===================================\n";
    echo "Tundua Auto-Cleanup - Started\n";
    echo "Time: " . date('Y-m-d H:i:s') . "\n";
    echo "===================================\n\n";

    // Find unpaid applications older than 72 hours
    $stmt = $db->prepare("
        SELECT id, reference_number, user_id
        FROM applications
        WHERE payment_status = 'pending'
        AND status = 'draft'
        AND created_at < DATE_SUB(NOW(), INTERVAL 72 HOUR)
    ");
    $stmt->execute();
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $deletedCount = 0;
    $errors = [];

    foreach ($applications as $app) {
        $appId = $app['id'];
        $refNumber = $app['reference_number'];

        echo "Processing application {$refNumber} (ID: {$appId})...\n";

        // Start transaction
        $db->beginTransaction();

        try {
            // 1. Get and delete documents from storage
            $docStmt = $db->prepare("SELECT file_path FROM documents WHERE application_id = ?");
            $docStmt->execute([$appId]);
            $documents = $docStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($documents as $doc) {
                $filePath = __DIR__ . '/../storage/documents/' . $doc['file_path'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                    echo "  ✓ Deleted file: {$doc['file_path']}\n";
                }
            }

            // 2. Delete documents from database
            $deleteDocsStmt = $db->prepare("DELETE FROM documents WHERE application_id = ?");
            $deleteDocsStmt->execute([$appId]);
            echo "  ✓ Deleted documents from database\n";

            // 3. Delete addon orders
            $deleteAddonsStmt = $db->prepare("DELETE FROM addon_orders WHERE application_id = ?");
            $deleteAddonsStmt->execute([$appId]);
            echo "  ✓ Deleted addon orders\n";

            // 4. Delete payments
            $deletePaymentsStmt = $db->prepare("DELETE FROM payments WHERE application_id = ?");
            $deletePaymentsStmt->execute([$appId]);
            echo "  ✓ Deleted payments\n";

            // 5. Delete activity log
            $deleteActivityStmt = $db->prepare("
                DELETE FROM activity_log
                WHERE entity_type = 'application' AND entity_id = ?
            ");
            $deleteActivityStmt->execute([$appId]);
            echo "  ✓ Deleted activity log\n";

            // 6. Delete application
            $deleteAppStmt = $db->prepare("DELETE FROM applications WHERE id = ?");
            $deleteAppStmt->execute([$appId]);
            echo "  ✓ Deleted application record\n";

            // Commit transaction
            $db->commit();

            $deletedCount++;
            echo "✅ Successfully deleted application {$refNumber}\n\n";

            // Log cleanup action
            $logStmt = $db->prepare("
                INSERT INTO activity_log (
                    user_id, entity_type, entity_id, action, description, created_at
                ) VALUES (?, 'system', 0, 'auto_cleanup', ?, NOW())
            ");
            $logStmt->execute([
                $app['user_id'],
                "Auto-deleted unpaid application {$refNumber} (72+ hours old)"
            ]);

        } catch (Exception $e) {
            $db->rollBack();
            $error = "Error deleting application {$refNumber}: {$e->getMessage()}";
            echo "❌ {$error}\n\n";
            $errors[] = $error;
        }
    }

    echo "\n===================================\n";
    echo "Cleanup Summary\n";
    echo "===================================\n";
    echo "Applications found: " . count($applications) . "\n";
    echo "Successfully deleted: {$deletedCount}\n";
    echo "Errors: " . count($errors) . "\n";
    echo "===================================\n";

    // Return JSON if called via HTTP
    if (php_sapi_name() !== 'cli') {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'deleted_count' => $deletedCount,
            'errors' => $errors,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    exit(0);

} catch (Exception $e) {
    echo "❌ Fatal error: {$e->getMessage()}\n";

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

<?php
/**
 * Test Email Configuration
 * Usage: php test-email.php recipient@example.com
 */

require_once __DIR__ . '/vendor/autoload.php';

use Tundua\Services\EmailService;
use Dotenv\Dotenv;

// Load environment
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get recipient from command line
$recipient = $argv[1] ?? null;

if (!$recipient) {
    echo "❌ Usage: php test-email.php recipient@example.com\n";
    exit(1);
}

echo "========================================\n";
echo "Email Configuration Test\n";
echo "========================================\n";
echo "SMTP Host: {$_ENV['MAIL_HOST']}\n";
echo "SMTP Port: {$_ENV['MAIL_PORT']}\n";
echo "SMTP User: {$_ENV['MAIL_USERNAME']}\n";
echo "From: {$_ENV['MAIL_FROM_ADDRESS']}\n";
echo "To: $recipient\n";
echo "========================================\n\n";

try {
    $emailService = new EmailService();

    echo "Sending test email...\n";

    // Send verification email
    $result = $emailService->sendVerificationEmail(
        $recipient,
        'Test User',
        'TEST123456'
    );

    if ($result) {
        echo "\n✅ SUCCESS! Email sent successfully!\n";
        echo "\nCheck your inbox at: $recipient\n";
        echo "Subject: Verify Your Email - Tundua\n";
        echo "\nIf you don't see it:\n";
        echo "  1. Check your spam/junk folder\n";
        echo "  2. Wait 2-3 minutes (it may be delayed)\n";
        echo "  3. Verify SMTP credentials in .env\n";
    } else {
        echo "\n❌ FAILED! Email was not sent.\n";
        echo "\nPossible issues:\n";
        echo "  1. Invalid SMTP credentials\n";
        echo "  2. SMTP server not reachable\n";
        echo "  3. Port blocked by firewall\n";
        echo "\nCheck backend/storage/logs/ for error details.\n";
    }

} catch (Exception $e) {
    echo "\n❌ ERROR: {$e->getMessage()}\n";
    echo "\nDebug info:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n";

<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Database connection
$host = $_ENV['DB_HOST'] ?? 'localhost';
$database = $_ENV['DB_DATABASE'] ?? 'tundua_saas';
$username = $_ENV['DB_USERNAME'] ?? 'root';
$password = $_ENV['DB_PASSWORD'] ?? '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get email from command line or use a default
    $email = $argv[1] ?? null;

    if (!$email) {
        echo "Usage: php make-admin.php user@example.com\n";
        exit(1);
    }

    // Update user role to admin
    $stmt = $pdo->prepare("UPDATE users SET role = 'admin' WHERE email = :email");
    $stmt->execute(['email' => $email]);

    if ($stmt->rowCount() > 0) {
        echo "✅ User $email is now an admin!\n";

        // Fetch and display user info
        $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, role FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        echo "\nUser Details:\n";
        echo "ID: {$user['id']}\n";
        echo "Name: {$user['first_name']} {$user['last_name']}\n";
        echo "Email: {$user['email']}\n";
        echo "Role: {$user['role']}\n";
    } else {
        echo "❌ User with email $email not found!\n";
    }

} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    exit(1);
}

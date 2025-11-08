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

    // Get all users
    $stmt = $pdo->query("SELECT id, first_name, last_name, email, role, is_active, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($users)) {
        echo "❌ No users found in the database!\n";
        echo "\nPlease register a user first at: http://localhost:3000/auth/register\n";
        exit(1);
    }

    echo "📋 List of Users in Database:\n";
    echo str_repeat("=", 100) . "\n";
    printf("%-5s %-20s %-30s %-15s %-10s %s\n", "ID", "Name", "Email", "Role", "Active", "Created");
    echo str_repeat("=", 100) . "\n";

    foreach ($users as $user) {
        $name = trim($user['first_name'] . ' ' . $user['last_name']);
        $active = $user['is_active'] ? 'Yes' : 'No';
        $created = date('Y-m-d H:i', strtotime($user['created_at']));

        printf("%-5s %-20s %-30s %-15s %-10s %s\n",
            $user['id'],
            substr($name, 0, 20),
            substr($user['email'], 0, 30),
            $user['role'],
            $active,
            $created
        );
    }

    echo str_repeat("=", 100) . "\n";
    echo "\nTotal users: " . count($users) . "\n\n";
    echo "To make a user admin, run:\n";
    echo "  php make-admin.php <email>\n\n";
    echo "Example:\n";
    echo "  php make-admin.php " . ($users[0]['email'] ?? 'user@example.com') . "\n";

} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    exit(1);
}

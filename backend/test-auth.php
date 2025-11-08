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

echo "Testing Authentication for john.doe@example.com\n";
echo str_repeat("=", 60) . "\n";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get user
    $stmt = $pdo->prepare("SELECT id, uuid, first_name, last_name, email, role, is_active, email_verified FROM users WHERE email = :email");
    $stmt->execute(['email' => 'john.doe@example.com']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo "❌ User not found!\n";
        exit(1);
    }

    echo "✅ User found in database:\n\n";
    echo "ID:             {$user['id']}\n";
    echo "UUID:           {$user['uuid']}\n";
    echo "Name:           {$user['first_name']} {$user['last_name']}\n";
    echo "Email:          {$user['email']}\n";
    echo "Role:           {$user['role']}\n";
    echo "Active:         " . ($user['is_active'] ? 'Yes' : 'No') . "\n";
    echo "Email Verified: " . ($user['email_verified'] ? 'Yes' : 'No') . "\n\n";

    if ($user['role'] === 'admin' || $user['role'] === 'super_admin') {
        echo "✅ User HAS admin privileges!\n\n";
        echo "This user should be able to access:\n";
        echo "  - http://localhost:3000/admin\n";
        echo "  - http://localhost:3000/dashboard/admin\n\n";
        echo "If you cannot access the admin panel:\n";
        echo "  1. Logout from the current session\n";
        echo "  2. Login again with john.doe@example.com\n";
        echo "  3. Navigate to /dashboard/admin\n";
    } else {
        echo "❌ User does NOT have admin privileges!\n";
        echo "Current role: {$user['role']}\n\n";
        echo "Run: php make-admin.php john.doe@example.com\n";
    }

} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    exit(1);
}

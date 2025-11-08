<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['DB_HOST'],
    'database' => $_ENV['DB_DATABASE'],
    'username' => $_ENV['DB_USERNAME'],
    'password' => $_ENV['DB_PASSWORD'],
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "===========================================\n";
echo "Reset Test User Password\n";
echo "===========================================\n\n";

$db = $capsule->getConnection()->getPdo();

// Set password to "password123"
$newPassword = 'password123';
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

// Update the user
$stmt = $db->prepare("UPDATE users SET password_hash = ? WHERE id = 1");
$stmt->execute([$hashedPassword]);

echo "✓ Password reset successfully!\n\n";

// Get user details
$stmt = $db->query('SELECT id, email, first_name, last_name, role FROM users WHERE id = 1');
$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo "Test Login Credentials:\n";
echo "========================\n";
echo "Email: {$user['email']}\n";
echo "Password: password123\n";
echo "Role: {$user['role']}\n\n";

echo "Login URL: http://localhost:3001/auth/login\n\n";

echo "To test admin features, run this SQL:\n";
echo "UPDATE users SET role = 'admin' WHERE id = 1;\n";

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

$db = $capsule->getConnection()->getPdo();
$stmt = $db->query('SELECT id, email, first_name, last_name, role FROM users ORDER BY id LIMIT 10');
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($users)) {
    echo "No users found in database.\n\n";
    echo "You need to create a user account by registering at: http://localhost:3001/auth/register\n\n";
    echo "After registering, you can:\n";
    echo "1. Login as a regular user at: http://localhost:3001/auth/login\n";
    echo "2. To test admin features, manually change your user role to 'admin' in the database\n";
} else {
    echo "Existing users in database:\n";
    echo str_repeat("=", 80) . "\n";
    foreach ($users as $user) {
        echo "ID: {$user['id']}\n";
        echo "Email: {$user['email']}\n";
        echo "Name: {$user['first_name']} {$user['last_name']}\n";
        echo "Role: {$user['role']}\n";
        echo str_repeat("-", 80) . "\n";
    }
    echo "\nTo test admin features, you can manually update a user's role:\n";
    echo "UPDATE users SET role = 'admin' WHERE id = 1;\n";
}

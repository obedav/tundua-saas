<?php
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Connect to database
$host = $_ENV['DB_HOST'] ?? 'localhost';
$dbname = $_ENV['DB_DATABASE'] ?? 'tundua_saas';
$username = $_ENV['DB_USERNAME'] ?? 'root';
$password = $_ENV['DB_PASSWORD'] ?? '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Generate proper password hash
    $passwordHash = password_hash('Test123!', PASSWORD_DEFAULT);

    // Update test user
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
    $stmt->execute([$passwordHash, 'test@example.com']);

    echo "✓ Password updated successfully!\n";
    echo "Email: test@example.com\n";
    echo "Password: Test123!\n";
    echo "Hash: $passwordHash\n";

    // Verify login works
    $stmt = $pdo->prepare("SELECT id, email, password_hash FROM users WHERE email = ?");
    $stmt->execute(['test@example.com']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify('Test123!', $user['password_hash'])) {
        echo "\n✓ Password verification successful!\n";
        echo "You can now login with: test@example.com / Test123!\n";
    } else {
        echo "\n✗ Password verification failed!\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

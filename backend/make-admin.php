<?php
require_once __DIR__ . '/vendor/autoload.php';
use Illuminate\Database\Capsule\Manager as Capsule;
use Dotenv\Dotenv;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$capsule = new Capsule;
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

$email = $argv[1] ?? null;

echo "========================================\n";
echo "Make User Admin\n";
echo "========================================\n\n";

if (!$email) {
    echo "Current users:\n\n";
    $users = Capsule::table('users')->select('id', 'email', 'first_name', 'last_name', 'role')->get();
    
    foreach ($users as $user) {
        $roleLabel = $user->role === 'admin' ? '✅ ADMIN' : '👤 User';
        echo "  {$user->first_name} {$user->last_name} ({$user->email}) - {$roleLabel}\n";
    }
    
    echo "\nUsage: php make-admin.php email@example.com\n";
    exit(0);
}

$user = Capsule::table('users')->where('email', $email)->first();

if (!$user) {
    echo "❌ User not found: {$email}\n";
    exit(1);
}

if ($user->role === 'admin') {
    echo "✅ Already admin: {$email}\n";
    exit(0);
}

Capsule::table('users')->where('email', $email)->update(['role' => 'admin']);

echo "✅ SUCCESS! {$user->first_name} {$user->last_name} is now an admin!\n\n";
echo "IMPORTANT: Logout and login again to see changes!\n";

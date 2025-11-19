<?php
/**
 * Fix invalid GPA values
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => $_ENV['DB_HOST'],
    'database'  => $_ENV['DB_DATABASE'],
    'username'  => $_ENV['DB_USERNAME'],
    'password'  => $_ENV['DB_PASSWORD'],
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "Fixing invalid GPA values (> 4.0)...\n";

$count = Capsule::table('universities')
    ->where('min_gpa', '>', 4.0)
    ->update(['min_gpa' => null]);

echo "✓ Fixed $count universities\n";
echo "These universities now accept any GPA (no minimum requirement)\n";

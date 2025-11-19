<?php
/**
 * Check GPA data quality
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

echo "Checking GPA data quality...\n\n";

// Check UK universities with strange GPA values
$strangeGPA = Capsule::table('universities')
    ->where('country', 'UK')
    ->where('min_gpa', '>', 4.0)
    ->select('name', 'min_gpa', 'tuition_min', 'tuition_max')
    ->limit(5)
    ->get();

echo "UK Universities with GPA > 4.0:\n";
foreach ($strangeGPA as $uni) {
    echo "  {$uni->name}: GPA {$uni->min_gpa}, Tuition: \${$uni->tuition_min}-\${$uni->tuition_max}\n";
}

// Check budget-friendly UK universities
echo "\n\nBudget-friendly UK universities (under $20,000):\n";
$affordable = Capsule::table('universities')
    ->where('country', 'UK')
    ->where('tuition_min', '<=', 20000)
    ->select('name', 'tuition_min', 'tuition_max', 'min_gpa', 'acceptance_rate')
    ->orderBy('tuition_min')
    ->limit(5)
    ->get();

foreach ($affordable as $uni) {
    echo "  {$uni->name}: \${$uni->tuition_min}-\${$uni->tuition_max}, GPA: {$uni->min_gpa}, Acceptance: {$uni->acceptance_rate}%\n";
}

// Fix strange GPA values (likely should be NULL or converted)
echo "\n\nWould you like to fix GPA values > 4.0? (Setting them to NULL)\n";
echo "This would make recommendations work better.\n";

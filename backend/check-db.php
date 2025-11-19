<?php
/**
 * Check database status
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Setup database connection
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

echo "========================================\n";
echo "Database Connection Check\n";
echo "========================================\n";
echo "Host: {$_ENV['DB_HOST']}\n";
echo "Database: {$_ENV['DB_DATABASE']}\n";
echo "Username: {$_ENV['DB_USERNAME']}\n";
echo "\n";

try {
    // Check if universities table exists
    $tableExists = Capsule::schema()->hasTable('universities');
    echo "Universities table exists: " . ($tableExists ? "YES ✓" : "NO ✗") . "\n";

    if ($tableExists) {
        $count = Capsule::table('universities')->count();
        echo "Current universities in database: $count\n";

        if ($count > 0) {
            echo "\nSample universities:\n";
            $sample = Capsule::table('universities')
                ->select('name', 'country', 'acceptance_rate')
                ->limit(5)
                ->get();

            foreach ($sample as $uni) {
                echo "  - {$uni->name} ({$uni->country}) - {$uni->acceptance_rate}% acceptance\n";
            }
        }
    } else {
        echo "\n⚠️  Universities table does not exist!\n";
        echo "You need to run: mysql -u root -p tundua_saas < src/Database/universities-schema.sql\n";
    }

    echo "\n✅ Database connection successful!\n";

} catch (Exception $e) {
    echo "\n❌ Error: {$e->getMessage()}\n";
    exit(1);
}

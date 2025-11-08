<?php

/**
 * Seed Service Tiers and Add-on Services
 * Run this script to populate the database with default service data
 *
 * Usage: php seed-services.php
 */

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Tundua\Models\ServiceTier;
use Tundua\Models\AddonService;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

echo "===================================\n";
echo "Tundua SaaS - Service Data Seeder\n";
echo "===================================\n\n";

try {
    // Initialize Eloquent ORM
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection([
        'driver' => 'mysql',
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'database' => $_ENV['DB_DATABASE'] ?? 'tundua_saas',
        'username' => $_ENV['DB_USERNAME'] ?? 'root',
        'password' => $_ENV['DB_PASSWORD'] ?? '',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
    ]);
    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    echo "✓ Database connection established\n\n";

    // Seed Service Tiers
    echo "Seeding Service Tiers...\n";
    ServiceTier::seedDefaultTiers();
    echo "✓ Service tiers seeded successfully\n";

    $tiers = ServiceTier::getActiveTiers();
    echo "  - " . count($tiers) . " service tiers available\n";
    foreach ($tiers as $tier) {
        echo "    • {$tier['name']} - \${$tier['base_price']}\n";
    }

    echo "\n";

    // Seed Add-on Services
    echo "Seeding Add-on Services...\n";
    AddonService::seedDefaultAddons();
    echo "✓ Add-on services seeded successfully\n";

    $addons = AddonService::getActiveAddons();
    echo "  - " . count($addons) . " add-on services available\n";

    // Group by category
    $categories = [];
    foreach ($addons as $addon) {
        $category = $addon['category'] ?? 'other';
        if (!isset($categories[$category])) {
            $categories[$category] = [];
        }
        $categories[$category][] = $addon;
    }

    foreach ($categories as $category => $services) {
        echo "\n  " . ucfirst($category) . ":\n";
        foreach ($services as $service) {
            echo "    • {$service['name']} - \${$service['price']}\n";
        }
    }

    echo "\n===================================\n";
    echo "✓ Seeding completed successfully!\n";
    echo "===================================\n\n";

    echo "Next steps:\n";
    echo "1. Start the backend: cd backend && composer start\n";
    echo "2. Test the endpoints:\n";
    echo "   - GET http://localhost:8000/api/service-tiers\n";
    echo "   - GET http://localhost:8000/api/addon-services\n";
    echo "3. Create an admin user and test the admin endpoints\n\n";

} catch (\Exception $e) {
    echo "\n✗ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

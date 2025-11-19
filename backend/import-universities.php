<?php
/**
 * Import universities from CSV to database
 * Run: php import-universities.php
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

echo "Starting university import...\n";

// Read CSV file
$csvFile = __DIR__ . '/src/Database/universities-focused-final.csv';
if (!file_exists($csvFile)) {
    die("ERROR: CSV file not found at: $csvFile\n");
}

$handle = fopen($csvFile, 'r');
if ($handle === false) {
    die("ERROR: Could not open CSV file\n");
}

// Read header row
$headers = fgetcsv($handle);
echo "CSV Headers: " . implode(', ', $headers) . "\n\n";

$imported = 0;
$errors = 0;

// Read data rows
while (($data = fgetcsv($handle)) !== false) {
    try {
        // Map CSV columns to database fields
        $university = [
            'name' => $data[0],
            'country' => $data[1],
            'city' => $data[2],
            'tuition_min' => (float) $data[3],
            'tuition_max' => (float) $data[4],
            'acceptance_rate' => (float) $data[5],
            'available_on_applyboard' => (bool) $data[6],
            'available_on_edvoy' => (bool) $data[7],
            'available_on_studygroup' => (bool) $data[8],
            'available_on_adventus' => (bool) $data[9],
            'applyboard_commission' => !empty($data[10]) ? (float) $data[10] : null,
            'edvoy_commission' => !empty($data[11]) ? (float) $data[11] : null,
            'studygroup_commission' => !empty($data[12]) ? (float) $data[12] : null,
            'min_gpa' => !empty($data[13]) ? (float) $data[13] : null,
            'min_ielts' => !empty($data[14]) ? (float) $data[14] : null,
            'popular' => (bool) $data[15],
            'is_active' => true,
        ];

        // Insert into database
        Capsule::table('universities')->insert($university);

        $imported++;
        echo "✓ Imported: {$university['name']} ({$university['country']})\n";

    } catch (Exception $e) {
        $errors++;
        echo "✗ Error importing {$data[0]}: {$e->getMessage()}\n";
    }
}

fclose($handle);

echo "\n";
echo "========================================\n";
echo "Import Complete!\n";
echo "Successfully imported: $imported universities\n";
echo "Errors: $errors\n";
echo "========================================\n";

// Show summary stats
try {
    $total = Capsule::table('universities')->count();
    $byCountry = Capsule::table('universities')
        ->select('country', Capsule::raw('COUNT(*) as count'))
        ->groupBy('country')
        ->orderBy('count', 'DESC')
        ->get();

    echo "\nDatabase Summary:\n";
    echo "Total universities: $total\n\n";
    echo "By Country:\n";
    foreach ($byCountry as $row) {
        echo "  {$row->country}: {$row->count}\n";
    }

    echo "\nPlatform Coverage:\n";
    $applyboard = Capsule::table('universities')->where('available_on_applyboard', true)->count();
    $edvoy = Capsule::table('universities')->where('available_on_edvoy', true)->count();
    $studygroup = Capsule::table('universities')->where('available_on_studygroup', true)->count();
    $adventus = Capsule::table('universities')->where('available_on_adventus', true)->count();

    echo "  ApplyBoard: $applyboard\n";
    echo "  Edvoy: $edvoy\n";
    echo "  Study Group: $studygroup\n";
    echo "  Adventus: $adventus\n";

} catch (Exception $e) {
    echo "Could not generate stats: {$e->getMessage()}\n";
}

echo "\n✅ Done!\n";

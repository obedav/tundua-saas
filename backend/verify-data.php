<?php
/**
 * Verify university data quality
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
echo "University Data Quality Report\n";
echo "========================================\n\n";

$total = Capsule::table('universities')->count();
echo "Total Universities: $total\n\n";

// By Country
echo "By Country:\n";
$byCountry = Capsule::table('universities')
    ->select('country', Capsule::raw('COUNT(*) as count'))
    ->groupBy('country')
    ->orderBy('count', 'DESC')
    ->limit(10)
    ->get();

foreach ($byCountry as $row) {
    echo "  {$row->country}: {$row->count}\n";
}

// Platform Coverage
echo "\nPlatform Availability:\n";
$applyboard = Capsule::table('universities')->where('available_on_applyboard', true)->count();
$edvoy = Capsule::table('universities')->where('available_on_edvoy', true)->count();
$studygroup = Capsule::table('universities')->where('available_on_studygroup', true)->count();
$adventus = Capsule::table('universities')->where('available_on_adventus', true)->count();

echo "  ApplyBoard: $applyboard universities (" . round($applyboard/$total*100, 1) . "%)\n";
echo "  Edvoy: $edvoy universities (" . round($edvoy/$total*100, 1) . "%)\n";
echo "  Study Group: $studygroup universities (" . round($studygroup/$total*100, 1) . "%)\n";
echo "  Adventus: $adventus universities (" . round($adventus/$total*100, 1) . "%)\n";

// Commission Data
echo "\nCommission Data:\n";
$withApplyboardCommission = Capsule::table('universities')
    ->whereNotNull('applyboard_commission')
    ->where('applyboard_commission', '>', 0)
    ->count();
$avgApplyboardCommission = Capsule::table('universities')
    ->whereNotNull('applyboard_commission')
    ->where('applyboard_commission', '>', 0)
    ->avg('applyboard_commission');

echo "  Universities with ApplyBoard commission: $withApplyboardCommission\n";
echo "  Average ApplyBoard commission: $" . round($avgApplyboardCommission, 2) . "\n";

$withStudyGroupCommission = Capsule::table('universities')
    ->whereNotNull('studygroup_commission')
    ->where('studygroup_commission', '>', 0)
    ->count();
$avgStudyGroupCommission = Capsule::table('universities')
    ->whereNotNull('studygroup_commission')
    ->where('studygroup_commission', '>', 0)
    ->avg('studygroup_commission');

if ($withStudyGroupCommission > 0) {
    echo "  Universities with Study Group commission: $withStudyGroupCommission\n";
    echo "  Average Study Group commission: $" . round($avgStudyGroupCommission, 2) . "\n";
}

// Popular universities
echo "\nPopular Universities:\n";
$popular = Capsule::table('universities')
    ->where('popular', true)
    ->count();
echo "  Marked as popular: $popular\n";

// Sample high-commission universities
echo "\nTop 5 Universities by Commission:\n";
$topCommission = Capsule::table('universities')
    ->select('name', 'country', 'applyboard_commission', 'studygroup_commission')
    ->whereNotNull('applyboard_commission')
    ->orderBy('applyboard_commission', 'DESC')
    ->limit(5)
    ->get();

foreach ($topCommission as $uni) {
    $commission = max($uni->applyboard_commission, $uni->studygroup_commission ?? 0);
    echo "  {$uni->name} ({$uni->country}) - \${$commission}\n";
}

echo "\n✅ Data verification complete!\n";

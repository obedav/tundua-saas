<?php

/**
 * Eloquent ORM initialization.
 *
 * Configures and boots the Illuminate Database Capsule Manager
 * using environment variables for connection settings.
 */

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

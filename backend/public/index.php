<?php

use Slim\Factory\AppFactory;
use DI\Container;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Configure session for OAuth state management
if (session_status() === PHP_SESSION_NONE) {
    $isProduction = ($_ENV['APP_ENV'] ?? 'production') === 'production';
    session_set_cookie_params([
        'lifetime' => (int)($_ENV['SESSION_LIFETIME'] ?? 120) * 60,
        'path' => '/',
        'domain' => '',
        'secure' => $isProduction,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

// Boot Eloquent ORM
require __DIR__ . '/../config/database.php';

// Create Container & App
$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();

// Add Body Parsing Middleware (MUST be before routing)
$app->addBodyParsingMiddleware();

// Add Error Middleware with custom JSON error handler
$errorMiddleware = $app->addErrorMiddleware(
    $_ENV['APP_DEBUG'] === 'true',
    true,
    true
);
$errorHandler = $errorMiddleware->getDefaultErrorHandler();
$errorHandler->forceContentType('application/json');

// CORS Middleware & preflight handler
$cors = require __DIR__ . '/../config/cors.php';
$app->add($cors['middleware']);
$app->options('/{routes:.+}', $cors['preflight']);

// Security Middleware Stack (order matters - outermost first)
$registerMiddleware = require __DIR__ . '/../config/middleware.php';
$registerMiddleware($app);

// Initialize Controllers
$controllers = require __DIR__ . '/../config/controllers.php';

// Register all API routes
require __DIR__ . '/../routes/api.php';
registerRoutes($app, $controllers);

// Run
$app->run();

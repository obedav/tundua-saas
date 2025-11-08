<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use DI\Container;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

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

// Create Container
$container = new Container();
AppFactory::setContainer($container);

// Create App
$app = AppFactory::create();

// Add Body Parsing Middleware (MUST be before routing)
$app->addBodyParsingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(
    $_ENV['APP_DEBUG'] === 'true',
    true,
    true
);

// CORS Middleware
$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);

    $allowedOrigins = explode(',', $_ENV['CORS_ORIGIN'] ?? 'http://localhost:3000');
    $origin = $request->getHeaderLine('Origin');
    $allowOrigin = in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0];

    return $response
        ->withHeader('Access-Control-Allow-Origin', $allowOrigin)
        ->withHeader('Access-Control-Allow-Credentials', $_ENV['CORS_CREDENTIALS'] ?? 'true')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-API-Key')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        ->withHeader('Access-Control-Max-Age', '86400');
});

// Handle preflight requests
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// Initialize Controllers
use Tundua\Controllers\AuthController;
use Tundua\Controllers\ApplicationController;
use Tundua\Controllers\ServiceController;
use Tundua\Controllers\PaymentController;
use Tundua\Controllers\DocumentController;
use Tundua\Controllers\RefundController;
use Tundua\Controllers\AnalyticsController;
use Tundua\Controllers\UserController;
use Tundua\Controllers\NotificationController;
use Tundua\Controllers\ActivityController;
use Tundua\Controllers\DashboardController;
use Tundua\Controllers\AddonOrderController;
use Tundua\Controllers\ReferralController;
use Tundua\Controllers\KnowledgeBaseController;
use Tundua\Middleware\AuthMiddleware;
use Tundua\Middleware\AdminMiddleware;

$authController = new AuthController();
$applicationController = new ApplicationController();
$serviceController = new ServiceController();
$paymentController = new PaymentController();
$documentController = new DocumentController();
$refundController = new RefundController();
$analyticsController = new AnalyticsController();
$userController = new UserController();
$notificationController = new NotificationController();
$activityController = new ActivityController();
$dashboardController = new DashboardController();
$addonOrderController = new AddonOrderController();
$referralController = new ReferralController();
$knowledgeBaseController = new KnowledgeBaseController();

// ============================================================================
// API ROOT
// ============================================================================

$app->get('/', function (Request $request, Response $response) {
    $data = [
        'name' => $_ENV['APP_NAME'] ?? 'Tundua SaaS API',
        'version' => '1.0.0',
        'status' => 'active',
        'environment' => $_ENV['APP_ENV'] ?? 'production',
        'documentation' => '/api/docs',
        'endpoints' => [
            'auth' => [
                'POST /api/auth/register' => 'User registration',
                'POST /api/auth/login' => 'User login',
                'POST /api/auth/logout' => 'User logout',
                'POST /api/auth/refresh' => 'Refresh JWT token',
                'POST /api/auth/forgot-password' => 'Request password reset',
                'POST /api/auth/reset-password' => 'Reset password',
                'GET /api/auth/verify-email/{token}' => 'Verify email',
                'GET /api/auth/me' => 'Get current user (protected)',
                'PUT /api/auth/me' => 'Update current user (protected)'
            ],
            'applications' => [
                'POST /api/applications' => 'Create application',
                'GET /api/applications' => 'List user applications',
                'GET /api/applications/{id}' => 'Get application details',
                'PUT /api/applications/{id}' => 'Update application',
                'POST /api/applications/{id}/submit' => 'Submit application',
                'DELETE /api/applications/{id}' => 'Delete draft application',
                'POST /api/applications/{id}/calculate' => 'Calculate pricing'
            ],
            'documents' => [
                'POST /api/documents/upload' => 'Upload document',
                'GET /api/documents/application/{id}' => 'List application documents',
                'GET /api/documents/{id}' => 'Get document details',
                'GET /api/documents/{id}/download' => 'Download document',
                'DELETE /api/documents/{id}' => 'Delete document'
            ],
            'payments' => [
                'POST /api/payments/paystack/initialize' => 'Initialize Paystack payment',
                'GET /api/payments/paystack/verify/{reference}' => 'Verify Paystack payment',
                'POST /api/payments/paystack/webhook' => 'Paystack webhook',
                'POST /api/payments/stripe/create-checkout' => 'Create Stripe checkout',
                'POST /api/payments/stripe/webhook' => 'Stripe webhook',
                'GET /api/payments/{id}' => 'Get payment details',
                'GET /api/payments/history' => 'Get payment history with summary'
            ],
            'refunds' => [
                'POST /api/refunds' => 'Request refund',
                'GET /api/refunds/user' => 'List user refunds',
                'GET /api/refunds/{id}' => 'Get refund details',
                'POST /api/refunds/{id}/sign' => 'Sign E-Agreement',
                'GET /api/refunds/{id}/agreement' => 'Download agreement PDF'
            ],
            'services' => [
                'GET /api/service-tiers' => 'List service tiers',
                'GET /api/addon-services' => 'List add-on services'
            ],
            'dashboard' => [
                'GET /api/dashboard/stats' => 'Get dashboard statistics with trends',
                'GET /api/dashboard/overview' => 'Get complete dashboard overview'
            ],
            'notifications' => [
                'GET /api/notifications' => 'Get user notifications',
                'GET /api/notifications/unread-count' => 'Get unread count',
                'PUT /api/notifications/{id}/read' => 'Mark notification as read',
                'PUT /api/notifications/read-all' => 'Mark all as read',
                'DELETE /api/notifications/{id}' => 'Delete notification'
            ],
            'activity' => [
                'GET /api/activity' => 'Get user activity feed',
                'GET /api/activity/{entity_type}/{entity_id}' => 'Get entity activity'
            ],
            'addons' => [
                'GET /api/addons/purchased' => 'Get purchased add-ons',
                'POST /api/addons/purchase' => 'Purchase add-on service',
                'GET /api/addons/orders/{id}' => 'Get add-on order details',
                'GET /api/addons/application/{id}' => 'Get add-ons for application'
            ],
            'admin' => [
                'GET /api/admin/applications' => 'List all applications',
                'PUT /api/admin/applications/{id}/status' => 'Update application status',
                'POST /api/admin/applications/{id}/notes' => 'Add admin notes',
                'GET /api/admin/documents/pending' => 'Documents pending review',
                'PUT /api/admin/documents/{id}/review' => 'Review document',
                'GET /api/admin/refunds' => 'List refund requests',
                'PUT /api/admin/refunds/{id}/review' => 'Review refund',
                'GET /api/admin/analytics' => 'Analytics dashboard',
                'GET /api/admin/users' => 'List users',
                'GET /api/admin/addons/orders' => 'List all add-on orders',
                'PUT /api/admin/addons/orders/{id}/status' => 'Update add-on order status',
                'GET /api/admin/activity' => 'Get recent activity log'
            ]
        ]
    ];

    $response->getBody()->write(json_encode($data, JSON_PRETTY_PRINT));
    return $response->withHeader('Content-Type', 'application/json');
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

$app->get('/health', function (Request $request, Response $response) {
    try {
        // Test database connection
        $db = \Tundua\Database\Database::getConnection();
        $stmt = $db->query('SELECT 1');
        $dbStatus = $stmt ? 'connected' : 'disconnected';
    } catch (\Exception $e) {
        $dbStatus = 'error: ' . $e->getMessage();
    }

    $data = [
        'status' => 'ok',
        'timestamp' => date('Y-m-d H:i:s'),
        'database' => $dbStatus,
        'php_version' => PHP_VERSION,
        'memory_usage' => round(memory_get_usage() / 1024 / 1024, 2) . ' MB'
    ];

    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json');
});

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

$app->group('/api/auth', function ($group) use ($authController) {
    // Public routes (no authentication required)
    $group->post('/register', [$authController, 'register']);
    $group->post('/login', [$authController, 'login']);
    $group->post('/forgot-password', [$authController, 'forgotPassword']);
    $group->post('/reset-password', [$authController, 'resetPassword']);
    $group->get('/verify-email/{token}', [$authController, 'verifyEmail']);
    $group->post('/refresh', [$authController, 'refresh']);

    // Protected routes (authentication required)
    $group->get('/me', [$authController, 'me'])->add(new AuthMiddleware());
    $group->put('/me', [$authController, 'updateProfile'])->add(new AuthMiddleware());
    $group->post('/logout', [$authController, 'logout'])->add(new AuthMiddleware());
});

// ============================================================================
// SERVICE CONFIGURATION ROUTES (PUBLIC)
// ============================================================================

$app->group('/api', function ($group) use ($serviceController) {
    // Service Tiers
    $group->get('/service-tiers', [$serviceController, 'getServiceTiers']);
    $group->get('/service-tiers/comparison', [$serviceController, 'getTierComparison']);
    $group->get('/service-tiers/{id}', [$serviceController, 'getServiceTierById']);

    // Add-on Services
    $group->get('/addon-services', [$serviceController, 'getAddonServices']);
    $group->get('/addon-services/by-category', [$serviceController, 'getAddonsByCategory']);
    $group->get('/addon-services/{id}', [$serviceController, 'getAddonServiceById']);
});

// ============================================================================
// APPLICATION ROUTES (PROTECTED)
// ============================================================================

$app->group('/api/applications', function ($group) use ($applicationController) {
    // User application endpoints
    $group->post('', [$applicationController, 'create']);
    $group->get('', [$applicationController, 'getUserApplications']);
    $group->get('/statistics', [$applicationController, 'getStatistics']);
    $group->post('/calculate-pricing', [$applicationController, 'calculatePricing']);
    $group->get('/{id}', [$applicationController, 'getById']);
    $group->put('/{id}', [$applicationController, 'update']);
    $group->post('/{id}/submit', [$applicationController, 'submit']);
    $group->delete('/{id}', [$applicationController, 'delete']);
})->add(new AuthMiddleware());

// ============================================================================
// PAYMENT ROUTES
// ============================================================================

// Paystack Routes (Protected + Webhooks)
$app->group('/api/payments/paystack', function ($group) use ($paymentController) {
    // Protected routes
    $group->post('/initialize', [$paymentController, 'initializePaystack'])->add(new AuthMiddleware());
    $group->get('/verify/{reference}', [$paymentController, 'verifyPaystack'])->add(new AuthMiddleware());

    // Public webhook route (Paystack calls this)
    $group->post('/webhook', [$paymentController, 'paystackWebhook']);
});

// Stripe Routes (Protected + Webhooks)
$app->group('/api/payments/stripe', function ($group) use ($paymentController) {
    // Protected routes
    $group->post('/create-checkout', [$paymentController, 'createStripeCheckout'])->add(new AuthMiddleware());

    // Public webhook route (Stripe calls this)
    $group->post('/webhook', [$paymentController, 'stripeWebhook']);
});

// General Payment Routes (Protected)
$app->group('/api/payments', function ($group) use ($paymentController) {
    // Static routes must come before dynamic routes
    $group->get('/history', [$paymentController, 'getPaymentHistory']);
    $group->get('/{id}', [$paymentController, 'getPayment']);
})->add(new AuthMiddleware());

// ============================================================================
// DOCUMENT ROUTES (PROTECTED)
// ============================================================================

$app->group('/api/documents', function ($group) use ($documentController) {
    // Public endpoint for document types
    $group->get('/types', [$documentController, 'getDocumentTypes']);

    // Protected routes
    $group->post('/upload', [$documentController, 'upload']);
    $group->get('/application/{id}', [$documentController, 'getApplicationDocuments']);
    $group->get('/{id}', [$documentController, 'getDocument']);
    $group->get('/{id}/download', [$documentController, 'download']);
    $group->delete('/{id}', [$documentController, 'delete']);
})->add(new AuthMiddleware());

// ============================================================================
// NOTIFICATION ROUTES (PROTECTED)
// ============================================================================

$app->group('/api/notifications', function ($group) use ($notificationController) {
    $group->get('', [$notificationController, 'getUserNotifications']);
    $group->get('/unread-count', [$notificationController, 'getUnreadCount']);
    $group->put('/{id}/read', [$notificationController, 'markAsRead']);
    $group->put('/read-all', [$notificationController, 'markAllAsRead']);
    $group->delete('/{id}', [$notificationController, 'delete']);
})->add(new AuthMiddleware());

// ============================================================================
// ACTIVITY ROUTES (PROTECTED)
// ============================================================================

$app->group('/api/activity', function ($group) use ($activityController) {
    $group->get('', [$activityController, 'getUserActivity']);
    $group->get('/{entity_type}/{entity_id}', [$activityController, 'getEntityActivity']);
})->add(new AuthMiddleware());

// ============================================================================
// DASHBOARD ROUTES (PROTECTED)
// ============================================================================

$app->group('/api/dashboard', function ($group) use ($dashboardController) {
    $group->get('/stats', [$dashboardController, 'getStats']);
    $group->get('/overview', [$dashboardController, 'getOverview']);
})->add(new AuthMiddleware());

// ============================================================================
// ADD-ON PURCHASE ROUTES (PROTECTED)
// ============================================================================

$app->group('/api/addons', function ($group) use ($addonOrderController) {
    $group->get('/purchased', [$addonOrderController, 'getUserAddons']);
    $group->post('/purchase', [$addonOrderController, 'purchaseAddon']);
    $group->get('/orders/{id}', [$addonOrderController, 'getOrderById']);
    $group->get('/application/{id}', [$addonOrderController, 'getApplicationAddons']);
})->add(new AuthMiddleware());

// ============================================================================
// REFERRAL ROUTES (PROTECTED)
// ============================================================================

$app->group('/api/referrals', function ($group) use ($referralController) {
    $group->get('', [$referralController, 'getUserReferrals']);
    $group->post('', [$referralController, 'createReferral']);
    $group->post('/{id}/claim', [$referralController, 'claimReward']);
})->add(new AuthMiddleware());

// ============================================================================
// KNOWLEDGE BASE ROUTES (PUBLIC)
// ============================================================================

$app->group('/api/knowledge-base', function ($group) use ($knowledgeBaseController) {
    $group->get('', [$knowledgeBaseController, 'getArticles']);
    $group->get('/popular', [$knowledgeBaseController, 'getPopular']);
    $group->get('/featured', [$knowledgeBaseController, 'getFeatured']);
    $group->get('/categories', [$knowledgeBaseController, 'getCategories']);
    $group->get('/{id}', [$knowledgeBaseController, 'getArticle']);
    $group->post('/{id}/feedback', [$knowledgeBaseController, 'markHelpful']);
});

// ============================================================================
// ADMIN ROUTES (PROTECTED - ADMIN ONLY)
// ============================================================================

// Admin Application Routes
$app->group('/api/admin/applications', function ($group) use ($applicationController) {
    $group->get('', [$applicationController, 'getAllApplications']);
    $group->get('/statistics', [$applicationController, 'getAdminStatistics']);
    $group->put('/{id}/status', [$applicationController, 'updateStatus']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// Admin Document Routes
$app->group('/api/admin/documents', function ($group) use ($documentController) {
    $group->get('/pending', [$documentController, 'getPendingDocuments']);
    $group->put('/{id}/review', [$documentController, 'reviewDocument']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// ============================================================================
// REFUND ROUTES
// ============================================================================

// User Refund Routes (Protected)
$app->group('/api/refunds', function ($group) use ($refundController) {
    $group->post('', [$refundController, 'create']);
    $group->get('/user', [$refundController, 'getUserRefunds']);
    $group->get('/{id}', [$refundController, 'getById']);
    $group->post('/upload-agreement', [$refundController, 'uploadAgreement']);
})->add(new AuthMiddleware());

// Admin Refund Routes
$app->group('/api/admin/refunds', function ($group) use ($refundController) {
    $group->get('', [$refundController, 'getAllRefunds']);
    $group->put('/{id}/review', [$refundController, 'reviewRefund']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// Admin Analytics Routes
$app->group('/api/admin/analytics', function ($group) use ($analyticsController) {
    $group->get('', [$analyticsController, 'getAnalytics']);
    $group->get('/revenue-chart', [$analyticsController, 'getRevenueChart']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// Admin User Routes
$app->group('/api/admin/users', function ($group) use ($userController) {
    $group->get('', [$userController, 'getAllUsers']);
    $group->get('/statistics', [$userController, 'getUserStatistics']);
    $group->get('/{id}', [$userController, 'getUserDetails']);
    $group->put('/{id}', [$userController, 'updateUser']);
    $group->post('/{id}/suspend', [$userController, 'suspendUser']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// Admin Service Configuration Routes
$app->group('/api/admin', function ($group) use ($serviceController) {
    // Service Tiers Management
    $group->post('/service-tiers', [$serviceController, 'createServiceTier']);
    $group->put('/service-tiers/{id}', [$serviceController, 'updateServiceTier']);
    $group->delete('/service-tiers/{id}', [$serviceController, 'deleteServiceTier']);

    // Add-on Services Management
    $group->post('/addon-services', [$serviceController, 'createAddonService']);
    $group->put('/addon-services/{id}', [$serviceController, 'updateAddonService']);
    $group->delete('/addon-services/{id}', [$serviceController, 'deleteAddonService']);

    // Seed Default Data
    $group->post('/services/seed', [$serviceController, 'seedDefaultData']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// Admin Add-On Orders Routes
$app->group('/api/admin/addons', function ($group) use ($addonOrderController) {
    $group->get('/orders', [$addonOrderController, 'getAllOrders']);
    $group->put('/orders/{id}/status', [$addonOrderController, 'updateOrderStatus']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// Admin Activity Routes
$app->group('/api/admin/activity', function ($group) use ($activityController) {
    $group->get('', [$activityController, 'getRecentActivity']);
})->add(new AuthMiddleware())->add(new AdminMiddleware());

// ============================================================================
// RUN APPLICATION
// ============================================================================

$app->run();

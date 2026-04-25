<?php

/**
 * API route definitions.
 *
 * Registers all route groups on the Slim app instance.
 * Routes are versioned under /v1 with backward-compatible redirects.
 *
 * @param \Slim\App $app
 * @param array     $controllers Associative array of controller instances
 */

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Middleware\AuthMiddleware;
use Tundua\Middleware\AdminMiddleware;
use Tundua\Middleware\TwoFactorMiddleware;

function registerRoutes($app, array $controllers)
{
    // Extract controllers for readability
    $authController = $controllers['auth'];
    $refreshTokenController = $controllers['refreshToken'];
    $googleOAuthController = $controllers['googleOAuth'];
    $applicationController = $controllers['application'];
    $serviceController = $controllers['service'];
    $paymentController = $controllers['payment'];
    $documentController = $controllers['document'];
    $refundController = $controllers['refund'];
    $analyticsController = $controllers['analytics'];
    $userController = $controllers['user'];
    $notificationController = $controllers['notification'];
    $activityController = $controllers['activity'];
    $dashboardController = $controllers['dashboard'];
    $addonOrderController = $controllers['addonOrder'];
    $referralController = $controllers['referral'];
    $knowledgeBaseController = $controllers['knowledgeBase'];
    $universityController = $controllers['university'];
    $aiUsageController = $controllers['aiUsage'];
    $pusherController = $controllers['pusher'];
    $partnerController = $controllers['partner'];
    $twoFactorController = $controllers['twoFactor'];
    $leadController = $controllers['lead'];

    // ========================================================================
    // API ROOT (unversioned)
    // ========================================================================

    $app->get('/', function (Request $request, Response $response) {
        $data = [
            'name' => $_ENV['APP_NAME'] ?? 'Tundua SaaS API',
            'version' => '1.0.0',
            'status' => 'active',
            'environment' => $_ENV['APP_ENV'] ?? 'production',
            'documentation' => '/api/docs',
            'api_versions' => ['v1'],
            'current_version' => 'v1',
            'endpoints' => [
                'auth' => [
                    'POST /api/v1/auth/register' => 'User registration',
                    'POST /api/v1/auth/login' => 'User login',
                    'POST /api/v1/auth/logout' => 'User logout',
                    'POST /api/v1/auth/refresh' => 'Refresh JWT token',
                    'POST /api/v1/auth/forgot-password' => 'Request password reset',
                    'POST /api/v1/auth/reset-password' => 'Reset password',
                    'GET /api/v1/auth/verify-email/{token}' => 'Verify email',
                    'GET /api/v1/auth/me' => 'Get current user (protected)',
                    'PUT /api/v1/auth/me' => 'Update current user (protected)',
                    'POST /api/v1/auth/2fa/setup' => 'Set up two-factor authentication (protected)',
                    'POST /api/v1/auth/2fa/verify' => 'Verify and enable 2FA (protected)',
                    'POST /api/v1/auth/2fa/disable' => 'Disable 2FA with password (protected)',
                    'POST /api/v1/auth/2fa/challenge' => 'Verify 2FA code during login',
                    'POST /api/v1/auth/2fa/recovery' => 'Use recovery code during login'
                ],
                'applications' => [
                    'POST /api/v1/applications' => 'Create application',
                    'GET /api/v1/applications' => 'List user applications',
                    'GET /api/v1/applications/{id}' => 'Get application details',
                    'PUT /api/v1/applications/{id}' => 'Update application',
                    'POST /api/v1/applications/{id}/submit' => 'Submit application',
                    'DELETE /api/v1/applications/{id}' => 'Delete draft application',
                    'POST /api/v1/applications/{id}/calculate' => 'Calculate pricing'
                ],
                'documents' => [
                    'POST /api/v1/documents/upload' => 'Upload document',
                    'GET /api/v1/documents/application/{id}' => 'List application documents',
                    'GET /api/v1/documents/{id}' => 'Get document details',
                    'GET /api/v1/documents/{id}/download' => 'Download document',
                    'DELETE /api/v1/documents/{id}' => 'Delete document'
                ],
                'payments' => [
                    'POST /api/v1/payments/paystack/initialize' => 'Initialize Paystack payment',
                    'GET /api/v1/payments/paystack/verify/{reference}' => 'Verify Paystack payment',
                    'POST /api/v1/payments/paystack/webhook' => 'Paystack webhook',
                    'GET /api/v1/payments/{id}' => 'Get payment details',
                    'GET /api/v1/payments/history' => 'Get payment history with summary'
                ],
                'refunds' => [
                    'POST /api/v1/refunds' => 'Request refund',
                    'GET /api/v1/refunds/user' => 'List user refunds',
                    'GET /api/v1/refunds/{id}' => 'Get refund details',
                    'POST /api/v1/refunds/{id}/sign' => 'Sign E-Agreement',
                    'GET /api/v1/refunds/{id}/agreement' => 'Download agreement PDF'
                ],
                'services' => [
                    'GET /api/v1/service-tiers' => 'List service tiers',
                    'GET /api/v1/addon-services' => 'List add-on services'
                ],
                'universities' => [
                    'GET /api/v1/universities/search' => 'Search universities (country, budget, gpa, sort)',
                    'GET /api/v1/universities/countries' => 'List available countries',
                    'GET /api/v1/universities/{id}' => 'Get university details',
                    'POST /api/v1/universities/recommend' => 'Get smart recommendations (profile-based)'
                ],
                'dashboard' => [
                    'GET /api/v1/dashboard/stats' => 'Get dashboard statistics with trends',
                    'GET /api/v1/dashboard/overview' => 'Get complete dashboard overview'
                ],
                'notifications' => [
                    'GET /api/v1/notifications' => 'Get user notifications',
                    'GET /api/v1/notifications/unread-count' => 'Get unread count',
                    'PUT /api/v1/notifications/{id}/read' => 'Mark notification as read',
                    'PUT /api/v1/notifications/read-all' => 'Mark all as read',
                    'DELETE /api/v1/notifications/{id}' => 'Delete notification'
                ],
                'activity' => [
                    'GET /api/v1/activity' => 'Get user activity feed',
                    'GET /api/v1/activity/{entity_type}/{entity_id}' => 'Get entity activity'
                ],
                'addons' => [
                    'GET /api/v1/addons/purchased' => 'Get purchased add-ons',
                    'POST /api/v1/addons/purchase' => 'Purchase add-on service',
                    'GET /api/v1/addons/orders/{id}' => 'Get add-on order details',
                    'GET /api/v1/addons/application/{id}' => 'Get add-ons for application'
                ],
                'admin' => [
                    'GET /api/v1/admin/applications' => 'List all applications',
                    'PUT /api/v1/admin/applications/{id}/status' => 'Update application status',
                    'POST /api/v1/admin/applications/{id}/notes' => 'Add admin notes',
                    'GET /api/v1/admin/documents/pending' => 'Documents pending review',
                    'GET /api/v1/admin/documents/{id}/download' => 'Download document (admin)',
                    'PUT /api/v1/admin/documents/{id}/review' => 'Review document',
                    'GET /api/v1/admin/refunds' => 'List refund requests',
                    'PUT /api/v1/admin/refunds/{id}/review' => 'Review refund',
                    'GET /api/v1/admin/analytics' => 'Analytics dashboard',
                    'GET /api/v1/admin/users' => 'List users',
                    'GET /api/v1/admin/addons/orders' => 'List all add-on orders',
                    'PUT /api/v1/admin/addons/orders/{id}/status' => 'Update add-on order status',
                    'GET /api/v1/admin/activity' => 'Get recent activity log',
                    'GET /api/v1/admin/partners' => 'List partners with statistics',
                    'GET /api/v1/admin/commissions/dashboard' => 'Commission dashboard summary',
                    'GET /api/v1/admin/commissions' => 'List commissions (filter by status, partner)',
                    'POST /api/v1/admin/commissions' => 'Create commission record',
                    'PATCH /api/v1/admin/commissions/{id}' => 'Update commission status',
                    'GET /api/v1/admin/commissions/report' => 'Revenue report by period'
                ]
            ]
        ];

        $response->getBody()->write(json_encode($data, JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // ========================================================================
    // HEALTH CHECK (unversioned)
    // ========================================================================

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

    // ========================================================================
    // VERSIONED API ROUTES (v1)
    // ========================================================================

    $app->group('/api/v1', function ($v1) use (
        $authController, $refreshTokenController, $googleOAuthController,
        $applicationController, $serviceController, $paymentController,
        $documentController, $refundController, $analyticsController,
        $userController, $notificationController, $activityController,
        $dashboardController, $addonOrderController, $referralController,
        $knowledgeBaseController, $universityController, $aiUsageController,
        $pusherController, $partnerController, $twoFactorController,
        $leadController
    ) {

        // ====================================================================
        // AUTHENTICATION ROUTES
        // ====================================================================

        $v1->group('/auth', function ($group) use ($authController, $refreshTokenController, $googleOAuthController, $twoFactorController) {
            // Public routes (no authentication required)
            $group->post('/register', [$authController, 'register']);
            $group->post('/login', [$authController, 'login'])->add(new TwoFactorMiddleware());
            $group->post('/forgot-password', [$authController, 'forgotPassword']);
            $group->post('/reset-password', [$authController, 'resetPassword']);
            $group->get('/verify-email/{token}', [$authController, 'verifyEmail']);
            $group->post('/resend-verification', [$authController, 'resendVerification']);
            $group->post('/refresh', [$authController, 'refresh']);

            // Refresh token management (public, requires refresh token)
            $group->post('/revoke', [$refreshTokenController, 'revoke']);

            // Google OAuth routes
            if ($googleOAuthController) {
                $group->get('/google', [$googleOAuthController, 'redirectToGoogle']);
                $group->get('/google/callback', [$googleOAuthController, 'handleCallback']);
            } else {
                // Fallback routes when Google OAuth is not configured
                $group->get('/google', function ($request, $response) {
                    $frontendUrl = $_ENV['APP_URL'] ?? 'https://tundua.com';
                    $error = urlencode('Google login is temporarily unavailable. Please use email login.');
                    return $response->withHeader('Location', $frontendUrl . '/auth/login?error=' . $error)->withStatus(302);
                });
                $group->get('/google/callback', function ($request, $response) {
                    $frontendUrl = $_ENV['APP_URL'] ?? 'https://tundua.com';
                    $error = urlencode('Google login is temporarily unavailable. Please use email login.');
                    return $response->withHeader('Location', $frontendUrl . '/auth/login?error=' . $error)->withStatus(302);
                });
            }

            // Two-Factor Authentication - Public (accepts temp_token)
            $group->post('/2fa/challenge', [$twoFactorController, 'challenge']);
            $group->post('/2fa/recovery', [$twoFactorController, 'recovery']);

            // Two-Factor Authentication - Protected (requires full auth)
            $group->post('/2fa/setup', [$twoFactorController, 'setup'])->add(new AuthMiddleware());
            $group->post('/2fa/verify', [$twoFactorController, 'verify'])->add(new AuthMiddleware());
            $group->post('/2fa/disable', [$twoFactorController, 'disable'])->add(new AuthMiddleware());

            // Protected routes (authentication required)
            $group->get('/me', [$authController, 'me'])->add(new AuthMiddleware());
            $group->put('/me', [$authController, 'updateProfile'])->add(new AuthMiddleware());
            $group->post('/logout', [$authController, 'logout'])->add(new AuthMiddleware());
            $group->post('/revoke-all', [$refreshTokenController, 'revokeAll'])->add(new AuthMiddleware());
        });

        // ====================================================================
        // PUSHER AUTHENTICATION (REAL-TIME)
        // ====================================================================

        $v1->post('/pusher/auth', [$pusherController, 'auth'])->add(new AuthMiddleware());

        // ====================================================================
        // PUBLIC LEAD CAPTURE (apply form, blog inline form, exit-intent popup)
        // ====================================================================
        // No auth — this is the top-of-funnel entry point. Rate limiting is
        // applied centrally in RateLimitMiddleware's $endpointLimits.
        $v1->post('/leads', [$leadController, 'create']);

        // ====================================================================
        // SERVICE CONFIGURATION ROUTES (PUBLIC)
        // ====================================================================

        $v1->group('', function ($group) use ($serviceController) {
            // Service Tiers
            $group->get('/service-tiers', [$serviceController, 'getServiceTiers']);
            $group->get('/service-tiers/comparison', [$serviceController, 'getTierComparison']);
            $group->get('/service-tiers/{id}', [$serviceController, 'getServiceTierById']);

            // Add-on Services
            $group->get('/addon-services', [$serviceController, 'getAddonServices']);
            $group->get('/addon-services/by-category', [$serviceController, 'getAddonsByCategory']);
            $group->get('/addon-services/{id}', [$serviceController, 'getAddonServiceById']);
        });

        // ====================================================================
        // UNIVERSITY SEARCH & INTELLIGENCE ROUTES (PUBLIC)
        // ====================================================================

        $v1->group('/universities', function ($group) use ($universityController) {
            $group->get('/search', [$universityController, 'search']);
            $group->get('/countries', [$universityController, 'getCountries']);
            $group->get('/{id}', [$universityController, 'getById']);
            $group->post('/recommend', [$universityController, 'recommend']);
        });

        // ====================================================================
        // APPLICATION ROUTES (PROTECTED)
        // ====================================================================

        $v1->group('/applications', function ($group) use ($applicationController) {
            $group->post('', [$applicationController, 'create']);
            $group->get('', [$applicationController, 'getUserApplications']);
            $group->get('/statistics', [$applicationController, 'getStatistics']);
            $group->post('/calculate-pricing', [$applicationController, 'calculatePricing']);
            $group->get('/{id}', [$applicationController, 'getById']);
            $group->put('/{id}', [$applicationController, 'update']);
            $group->post('/{id}/submit', [$applicationController, 'submit']);
            $group->delete('/{id}', [$applicationController, 'delete']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // PAYMENT ROUTES
        // ====================================================================

        // Paystack Routes (Protected + Webhooks)
        $v1->group('/payments/paystack', function ($group) use ($paymentController) {
            $group->post('/initialize', [$paymentController, 'initializePaystack'])->add(new AuthMiddleware());
            $group->get('/verify/{reference}', [$paymentController, 'verifyPaystack'])->add(new AuthMiddleware());
            $group->post('/webhook', [$paymentController, 'paystackWebhook']);
        });

        // General Payment Routes (Protected)
        $v1->group('/payments', function ($group) use ($paymentController) {
            $group->get('/methods', [$paymentController, 'getPaymentMethods']);
            $group->get('/history', [$paymentController, 'getPaymentHistory']);
            $group->get('/{id}', [$paymentController, 'getPayment']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // DOCUMENT ROUTES
        // ====================================================================

        // Public endpoint for document types (no auth required)
        $v1->get('/documents/types', [$documentController, 'getDocumentTypes']);

        // Protected document routes
        $v1->group('/documents', function ($group) use ($documentController) {
            $group->post('/upload', [$documentController, 'upload']);
            $group->get('/application/{id}', [$documentController, 'getApplicationDocuments']);
            $group->get('/{id}', [$documentController, 'getDocument']);
            $group->get('/{id}/download', [$documentController, 'download']);
            $group->delete('/{id}', [$documentController, 'delete']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // NOTIFICATION ROUTES (PROTECTED)
        // ====================================================================

        $v1->group('/notifications', function ($group) use ($notificationController) {
            $group->get('', [$notificationController, 'getUserNotifications']);
            $group->get('/unread-count', [$notificationController, 'getUnreadCount']);
            $group->put('/{id}/read', [$notificationController, 'markAsRead']);
            $group->put('/read-all', [$notificationController, 'markAllAsRead']);
            $group->delete('/{id}', [$notificationController, 'delete']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // ACTIVITY ROUTES (PROTECTED)
        // ====================================================================

        $v1->group('/activity', function ($group) use ($activityController) {
            $group->get('', [$activityController, 'getUserActivity']);
            $group->get('/{entity_type}/{entity_id}', [$activityController, 'getEntityActivity']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // DASHBOARD ROUTES (PROTECTED)
        // ====================================================================

        $v1->group('/dashboard', function ($group) use ($dashboardController) {
            $group->get('/stats', [$dashboardController, 'getStats']);
            $group->get('/overview', [$dashboardController, 'getOverview']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // ADD-ON PURCHASE ROUTES (PROTECTED)
        // ====================================================================

        $v1->group('/addons', function ($group) use ($addonOrderController) {
            $group->get('/purchased', [$addonOrderController, 'getUserAddons']);
            $group->post('/purchase', [$addonOrderController, 'purchaseAddon']);
            $group->get('/orders/{id}', [$addonOrderController, 'getOrderById']);
            $group->get('/application/{id}', [$addonOrderController, 'getApplicationAddons']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // REFERRAL ROUTES (PROTECTED)
        // ====================================================================

        $v1->group('/referrals', function ($group) use ($referralController) {
            $group->get('', [$referralController, 'getUserReferrals']);
            $group->post('', [$referralController, 'createReferral']);
            $group->post('/{id}/claim', [$referralController, 'claimReward']);
        })->add(new AuthMiddleware());

        // ====================================================================
        // KNOWLEDGE BASE ROUTES (PUBLIC)
        // ====================================================================

        $v1->group('/knowledge-base', function ($group) use ($knowledgeBaseController) {
            $group->get('', [$knowledgeBaseController, 'getArticles']);
            $group->get('/slugs', [$knowledgeBaseController, 'getPublishedSlugs']);
            $group->get('/popular', [$knowledgeBaseController, 'getPopular']);
            $group->get('/featured', [$knowledgeBaseController, 'getFeatured']);
            $group->get('/categories', [$knowledgeBaseController, 'getCategories']);
            $group->get('/{id}', [$knowledgeBaseController, 'getArticle']);
            $group->post('/{id}/feedback', [$knowledgeBaseController, 'markHelpful']);
        });

        // ====================================================================
        // ADMIN ROUTES (PROTECTED - ADMIN ONLY)
        // ====================================================================

        // Admin Application Routes
        $v1->group('/admin/applications', function ($group) use ($applicationController) {
            $group->get('', [$applicationController, 'getAllApplications']);
            $group->get('/statistics', [$applicationController, 'getAdminStatistics']);
            $group->get('/{id}', [$applicationController, 'getApplication']);
            $group->put('/{id}/status', [$applicationController, 'updateStatus']);
            $group->post('/{id}/notes', [$applicationController, 'addAdminNotes']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Admin Document Routes
        $v1->group('/admin/documents', function ($group) use ($documentController) {
            $group->get('/pending', [$documentController, 'getPendingDocuments']);
            $group->get('/{id}/download', [$documentController, 'adminDownload']);
            $group->put('/{id}/review', [$documentController, 'reviewDocument']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // ====================================================================
        // REFUND ROUTES
        // ====================================================================

        // User Refund Routes (Protected)
        $v1->group('/refunds', function ($group) use ($refundController) {
            $group->post('', [$refundController, 'create']);
            $group->get('/user', [$refundController, 'getUserRefunds']);
            $group->get('/{id}', [$refundController, 'getById']);
            $group->get('/{id}/agreement', [$refundController, 'downloadAgreement']);
            $group->post('/upload-agreement', [$refundController, 'uploadAgreement']);
        })->add(new AuthMiddleware());

        // Admin Refund Routes
        $v1->group('/admin/refunds', function ($group) use ($refundController) {
            $group->get('', [$refundController, 'getAllRefunds']);
            $group->put('/{id}/review', [$refundController, 'reviewRefund']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Admin Analytics Routes
        $v1->group('/admin/analytics', function ($group) use ($analyticsController) {
            $group->get('', [$analyticsController, 'getAnalytics']);
            $group->get('/revenue-chart', [$analyticsController, 'getRevenueChart']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Admin User Routes
        $v1->group('/admin/users', function ($group) use ($userController) {
            $group->get('', [$userController, 'getAllUsers']);
            $group->get('/statistics', [$userController, 'getUserStatistics']);
            $group->get('/{id}', [$userController, 'getUserDetails']);
            $group->put('/{id}', [$userController, 'updateUser']);
            $group->post('/{id}/suspend', [$userController, 'suspendUser']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Admin Service Configuration Routes
        $v1->group('/admin', function ($group) use ($serviceController) {
            $group->post('/service-tiers', [$serviceController, 'createServiceTier']);
            $group->put('/service-tiers/{id}', [$serviceController, 'updateServiceTier']);
            $group->delete('/service-tiers/{id}', [$serviceController, 'deleteServiceTier']);
            $group->post('/addon-services', [$serviceController, 'createAddonService']);
            $group->put('/addon-services/{id}', [$serviceController, 'updateAddonService']);
            $group->delete('/addon-services/{id}', [$serviceController, 'deleteAddonService']);
            $group->post('/services/seed', [$serviceController, 'seedDefaultData']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Admin Add-On Orders Routes
        $v1->group('/admin/addons', function ($group) use ($addonOrderController) {
            $group->get('/orders', [$addonOrderController, 'getAllOrders']);
            $group->put('/orders/{id}/status', [$addonOrderController, 'updateOrderStatus']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Admin Activity Routes
        $v1->group('/admin/activity', function ($group) use ($activityController) {
            $group->get('', [$activityController, 'getRecentActivity']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Admin Knowledge Base Routes
        $v1->group('/admin/knowledge-base', function ($group) use ($knowledgeBaseController) {
            $group->get('', [$knowledgeBaseController, 'getAllArticles']);
            $group->post('', [$knowledgeBaseController, 'createArticle']);
            $group->post('/upload-image', [$knowledgeBaseController, 'downloadImage']);
            $group->put('/{id}', [$knowledgeBaseController, 'updateArticle']);
            $group->delete('/{id}', [$knowledgeBaseController, 'deleteArticle']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // ====================================================================
        // AI USAGE TRACKING ROUTES
        // ====================================================================

        $v1->post('/ai/usage', [$aiUsageController, 'trackUsage'])->add(new AuthMiddleware());

        // Protected AI usage routes (user)
        $v1->group('/ai/usage', function ($group) use ($aiUsageController) {
            $group->get('/stats', [$aiUsageController, 'getStats']);
            $group->get('/quota', [$aiUsageController, 'getQuota']);
        })->add(new AuthMiddleware());

        // Admin AI usage routes
        $v1->group('/admin/ai', function ($group) use ($aiUsageController) {
            $group->get('/usage', [$aiUsageController, 'getRecentUsage']);
            $group->get('/analytics', [$aiUsageController, 'getAnalytics']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // ====================================================================
        // PARTNER & COMMISSION TRACKING ROUTES (ADMIN)
        // ====================================================================

        // Partner Management
        $v1->group('/admin/partners', function ($group) use ($partnerController) {
            $group->get('', [$partnerController, 'getPartners']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());

        // Commission Tracking
        $v1->group('/admin/commissions', function ($group) use ($partnerController) {
            $group->get('/dashboard', [$partnerController, 'dashboard']);
            $group->get('/report', [$partnerController, 'getReport']);
            $group->get('', [$partnerController, 'getCommissions']);
            $group->post('', [$partnerController, 'createCommission']);
            $group->patch('/{id}', [$partnerController, 'updateCommission']);
        })->add(new AdminMiddleware())->add(new AuthMiddleware());
    });

    // ========================================================================
    // BACKWARD-COMPATIBLE REDIRECTS (/api/* -> /api/v1/*)
    // These redirect unversioned API calls to the v1 endpoints during the
    // transition period. Remove these once all clients have migrated.
    // ========================================================================

    $app->any('/api/{path:.*}', function (Request $request, Response $response, array $args) {
        $path = $args['path'];
        $queryString = $request->getUri()->getQuery();
        $redirectUrl = '/api/v1/' . $path;
        if ($queryString) {
            $redirectUrl .= '?' . $queryString;
        }

        // Use 307 Temporary Redirect to preserve the HTTP method (POST, PUT, DELETE, etc.)
        return $response
            ->withHeader('Location', $redirectUrl)
            ->withHeader('X-API-Deprecation-Notice', 'Unversioned API endpoints are deprecated. Please use /api/v1/ prefix.')
            ->withStatus(307);
    });
}

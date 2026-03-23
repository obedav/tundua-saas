<?php

/**
 * Controller instantiation.
 *
 * Returns an associative array of all controller instances
 * used by the route definitions.
 */

use Tundua\Controllers\AuthController;
use Tundua\Controllers\RefreshTokenController;
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
use Tundua\Controllers\UniversityController;
use Tundua\Controllers\GoogleOAuthController;
use Tundua\Controllers\AIUsageController;
use Tundua\Controllers\PusherController;
use Tundua\Controllers\PartnerController;
use Tundua\Controllers\TwoFactorController;

// Initialize Google OAuth Controller only if the package is installed
$googleOAuthController = null;
if (class_exists('League\OAuth2\Client\Provider\Google')) {
    try {
        $googleOAuthController = new GoogleOAuthController(new \Tundua\Services\AuthService());
    } catch (\Throwable $e) {
        error_log('Failed to initialize GoogleOAuthController: ' . $e->getMessage());
    }
}

return [
    'auth'          => new AuthController(),
    'refreshToken'  => new RefreshTokenController(),
    'googleOAuth'   => $googleOAuthController,
    'application'   => new ApplicationController(),
    'service'       => new ServiceController(),
    'payment'       => new PaymentController(),
    'document'      => new DocumentController(),
    'refund'        => new RefundController(),
    'analytics'     => new AnalyticsController(),
    'user'          => new UserController(),
    'notification'  => new NotificationController(),
    'activity'      => new ActivityController(),
    'dashboard'     => new DashboardController(),
    'addonOrder'    => new AddonOrderController(),
    'referral'      => new ReferralController(),
    'knowledgeBase' => new KnowledgeBaseController(),
    'university'    => new UniversityController(),
    'aiUsage'       => new AIUsageController(),
    'pusher'        => new PusherController(),
    'partner'       => new PartnerController(),
    'twoFactor'     => new TwoFactorController(),
];

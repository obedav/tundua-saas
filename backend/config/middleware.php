<?php

/**
 * Security middleware stack registration.
 *
 * Adds the global security middleware to the Slim app.
 * Order matters: outermost middleware is added first.
 *
 * @param \Slim\App $app
 */

use Tundua\Middleware\SecurityHeadersMiddleware;
use Tundua\Middleware\CsrfMiddleware;
use Tundua\Middleware\RateLimitMiddleware;
use Tundua\Middleware\TracingMiddleware;

return function ($app) {
    $app->add(new SecurityHeadersMiddleware());
    $app->add(new CsrfMiddleware());
    $app->add(new RateLimitMiddleware());

    // TracingMiddleware is the outermost middleware (added last, executed first)
    // so it captures the full request lifecycle including all other middleware.
    $app->add(new TracingMiddleware());
};

<?php

/**
 * CORS middleware and preflight handler.
 *
 * Returns an array with two keys:
 *   'middleware' - The CORS middleware closure to add to the app
 *   'preflight' - The OPTIONS preflight handler closure
 */

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

return [
    'middleware' => function (Request $request, $handler) {
        $origin = $request->getHeaderLine('Origin');
        $allowedOrigins = explode(',', $_ENV['CORS_ORIGIN'] ?? 'http://localhost:3000');

        // Trim whitespace from allowed origins
        $allowedOrigins = array_map('trim', $allowedOrigins);

        // Determine which origin to allow
        $allowOrigin = in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0];

        // Handle the request
        $response = $handler->handle($request);

        return $response
            ->withHeader('Access-Control-Allow-Origin', $allowOrigin)
            ->withHeader('Access-Control-Allow-Credentials', $_ENV['CORS_CREDENTIALS'] ?? 'true')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-API-Key')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
            ->withHeader('Access-Control-Max-Age', '86400');
    },

    'preflight' => function (Request $request, Response $response) {
        return $response;
    },
];

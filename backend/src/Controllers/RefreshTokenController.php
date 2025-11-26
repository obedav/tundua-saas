<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Services\RefreshTokenService;

/**
 * Refresh Token Controller
 * Handles token refresh and revocation
 */
class RefreshTokenController
{
    private RefreshTokenService $refreshTokenService;

    public function __construct()
    {
        $this->refreshTokenService = new RefreshTokenService();
    }

    /**
     * Refresh access token using refresh token
     * POST /api/auth/refresh
     */
    public function refresh(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $refreshToken = $data['refresh_token'] ?? null;

        if (!$refreshToken) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Refresh token is required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Generate new access token
        $tokens = $this->refreshTokenService->refreshAccessToken($refreshToken);

        if (!$tokens) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired refresh token'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => $tokens
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Revoke refresh token (logout)
     * POST /api/auth/revoke
     */
    public function revoke(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $refreshToken = $data['refresh_token'] ?? null;

        if (!$refreshToken) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Refresh token is required'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $success = $this->refreshTokenService->revokeToken($refreshToken);

        if (!$success) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to revoke token'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Token revoked successfully'
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Revoke all user tokens (logout from all devices)
     * POST /api/auth/revoke-all
     */
    public function revokeAll(Request $request, Response $response): Response
    {
        // Get user ID from auth middleware
        $userId = $request->getAttribute('user_id');

        if (!$userId) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Unauthorized'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $count = $this->refreshTokenService->revokeAllUserTokens($userId);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => "Successfully logged out from all devices",
            'tokens_revoked' => $count
        ]));

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}

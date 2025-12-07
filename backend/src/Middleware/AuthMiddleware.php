<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Tundua\Services\AuthService;
use Tundua\Models\User;

class AuthMiddleware
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * Invoke middleware
     */
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        // Get Authorization header
        $authHeader = $request->getHeaderLine('Authorization');
        $token = null;

        if ($authHeader) {
            // Extract token from Authorization header
            $token = $this->authService->extractTokenFromHeader($authHeader);
        } else {
            // Try to get token from cookies if Authorization header is not present
            $cookies = $request->getCookieParams();
            if (isset($cookies['auth_token'])) {
                $token = $cookies['auth_token'];
            }
        }

        if (!$token) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Authentication required. Please provide Authorization header or auth_token cookie.'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Verify token
        $decoded = $this->authService->verifyToken($token);

        if (!$decoded) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid or expired token'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Check token type
        if ($decoded->type !== 'access') {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid token type'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Get user from database
        $user = User::findById($decoded->sub);

        if (!$user) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'User not found'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Check if user is active
        if (!$this->authService->isAccountActive($user)) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Account is deactivated'
            ]));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        // Attach user data to request
        $request = $request
            ->withAttribute('user_id', $user->id)
            ->withAttribute('user_uuid', $user->uuid)
            ->withAttribute('user_email', $user->email)
            ->withAttribute('user_role', $user->role)
            ->withAttribute('user', $user);

        // Continue to next middleware/route
        return $handler->handle($request);
    }
}

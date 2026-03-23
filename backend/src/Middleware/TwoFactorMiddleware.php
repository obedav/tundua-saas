<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Tundua\Models\User;
use Tundua\Services\AuthService;
use Tundua\Services\TwoFactorService;

class TwoFactorMiddleware
{
    private AuthService $authService;
    private TwoFactorService $twoFactorService;

    public function __construct()
    {
        $this->authService = new AuthService();
        $this->twoFactorService = new TwoFactorService();
    }

    /**
     * Invoke middleware
     *
     * This middleware intercepts the login flow. It should be applied to the
     * login endpoint. When a user with 2FA enabled authenticates successfully
     * with email/password, this middleware changes the response to return a
     * temporary token instead of full JWT tokens, requiring the client to
     * complete the 2FA challenge.
     */
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        // Let the login handler process first
        $response = $handler->handle($request);

        // Only intercept successful login responses
        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        // Parse the response body
        $body = (string) $response->getBody();
        $responseData = json_decode($body, true);

        // Only intercept if login was successful and contains user data
        if (!isset($responseData['success']) || !$responseData['success']) {
            return $response;
        }

        if (!isset($responseData['data']['user']['id'])) {
            return $response;
        }

        // Check if user has 2FA enabled
        $userId = $responseData['data']['user']['id'];
        $user = User::findById($userId);

        if (!$user || !$user->two_factor_enabled) {
            // No 2FA enabled, return normal login response
            return $response;
        }

        // User has 2FA enabled - generate temp token and return 2FA challenge response
        $tempToken = $this->twoFactorService->generateTempToken($user);

        $twoFactorResponse = new \Slim\Psr7\Response();
        $twoFactorResponse->getBody()->write(json_encode([
            'success' => true,
            'two_factor_required' => true,
            'message' => 'Two-factor authentication is required. Please provide your verification code.',
            'temp_token' => $tempToken,
        ]));

        return $twoFactorResponse->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
}

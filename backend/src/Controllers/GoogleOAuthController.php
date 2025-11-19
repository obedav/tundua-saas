<?php

namespace Tundua\Controllers;

use League\OAuth2\Client\Provider\Google;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\User;
use Tundua\Services\AuthService;
use Exception;

class GoogleOAuthController
{
    private Google $provider;
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;

        $this->provider = new Google([
            'clientId'     => $_ENV['GOOGLE_CLIENT_ID'],
            'clientSecret' => $_ENV['GOOGLE_CLIENT_SECRET'],
            'redirectUri'  => $_ENV['GOOGLE_REDIRECT_URI'],
        ]);
    }

    /**
     * Initiate Google OAuth flow
     */
    public function redirectToGoogle(Request $request, Response $response): Response
    {
        // Get the authorization URL
        $authorizationUrl = $this->provider->getAuthorizationUrl([
            'scope' => ['email', 'profile']
        ]);

        // Store the state in session (for CSRF protection)
        $_SESSION['oauth2state'] = $this->provider->getState();

        // Get the user_type from query params (student or partner)
        $queryParams = $request->getQueryParams();
        $userType = $queryParams['user_type'] ?? 'student';
        $_SESSION['oauth_user_type'] = $userType;

        // Redirect to Google OAuth authorization page
        return $response
            ->withHeader('Location', $authorizationUrl)
            ->withStatus(302);
    }

    /**
     * Handle callback from Google
     */
    public function handleCallback(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();

            // Check for errors
            if (isset($queryParams['error'])) {
                throw new Exception('OAuth error: ' . $queryParams['error']);
            }

            // Verify state (CSRF protection)
            if (!isset($queryParams['state']) ||
                !isset($_SESSION['oauth2state']) ||
                $queryParams['state'] !== $_SESSION['oauth2state']) {
                unset($_SESSION['oauth2state']);
                throw new Exception('Invalid state parameter');
            }

            // Get access token
            $token = $this->provider->getAccessToken('authorization_code', [
                'code' => $queryParams['code']
            ]);

            // Get user details from Google
            $googleUser = $this->provider->getResourceOwner($token);
            $googleUserData = $googleUser->toArray();

            // Extract user info
            $email = $googleUserData['email'];
            $firstName = $googleUserData['given_name'] ?? '';
            $lastName = $googleUserData['family_name'] ?? '';
            $googleId = $googleUserData['sub'];
            $avatar = $googleUserData['picture'] ?? null;
            $userType = $_SESSION['oauth_user_type'] ?? 'student';

            // Check if user already exists
            $existingUser = User::where('email', $email)->first();

            if ($existingUser) {
                // User exists - update Google ID if not set
                if (!$existingUser->google_id) {
                    $existingUser->google_id = $googleId;
                    $existingUser->save();
                }

                $user = $existingUser;
            } else {
                // Create new user
                $user = User::create([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'google_id' => $googleId,
                    'profile_picture' => $avatar,
                    'user_type' => $userType,
                    'role' => 'user',
                    'password' => '', // No password for OAuth users
                    'email_verified' => true, // Google has already verified the email
                    'email_verified_at' => date('Y-m-d H:i:s'),
                    'status' => 'active'
                ]);
            }

            // Generate JWT tokens
            $accessToken = $this->authService->generateAccessToken($user);
            $refreshToken = $this->authService->generateRefreshToken($user);

            // Clear OAuth session data
            unset($_SESSION['oauth2state']);
            unset($_SESSION['oauth_user_type']);

            // Redirect to frontend with tokens
            $frontendUrl = $_ENV['APP_URL'];
            $redirectUrl = $frontendUrl . '/auth/oauth-callback?' . http_build_query([
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'user_role' => $user->role,
                'user_type' => $user->user_type
            ]);

            return $response
                ->withHeader('Location', $redirectUrl)
                ->withStatus(302);

        } catch (IdentityProviderException $e) {
            // OAuth provider error
            error_log('Google OAuth Error: ' . $e->getMessage());

            $frontendUrl = $_ENV['APP_URL'];
            $redirectUrl = $frontendUrl . '/auth/login?error=' . urlencode('Google login failed. Please try again.');

            return $response
                ->withHeader('Location', $redirectUrl)
                ->withStatus(302);

        } catch (Exception $e) {
            // General error
            error_log('OAuth Callback Error: ' . $e->getMessage());

            $frontendUrl = $_ENV['APP_URL'];
            $redirectUrl = $frontendUrl . '/auth/login?error=' . urlencode('Authentication failed. Please try again.');

            return $response
                ->withHeader('Location', $redirectUrl)
                ->withStatus(302);
        }
    }
}

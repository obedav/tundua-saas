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
    private ?Google $provider = null;
    private AuthService $authService;
    private bool $isConfigured = false;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;

        // Check if Google OAuth is configured
        $clientId = $_ENV['GOOGLE_CLIENT_ID'] ?? null;
        $clientSecret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? null;
        $redirectUri = $_ENV['GOOGLE_REDIRECT_URI'] ?? null;

        if ($clientId && $clientSecret && $redirectUri) {
            $this->provider = new Google([
                'clientId'     => $clientId,
                'clientSecret' => $clientSecret,
                'redirectUri'  => $redirectUri,
            ]);
            $this->isConfigured = true;
        } else {
            error_log('Google OAuth not configured: Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI');
        }
    }

    /**
     * Initiate Google OAuth flow
     */
    public function redirectToGoogle(Request $request, Response $response): Response
    {
        // Check if Google OAuth is configured
        if (!$this->isConfigured || !$this->provider) {
            $frontendUrl = $_ENV['APP_URL'] ?? 'https://tundua.com';
            $redirectUrl = $frontendUrl . '/auth/login?error=' . urlencode('Google login is not configured. Please contact support.');
            return $response->withHeader('Location', $redirectUrl)->withStatus(302);
        }

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

        error_log('Google OAuth: Starting flow, state=' . $_SESSION['oauth2state'] . ', session_id=' . session_id());

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
        $frontendUrl = $_ENV['APP_URL'] ?? 'https://tundua.com';

        try {
            // Check if Google OAuth is configured
            if (!$this->isConfigured || !$this->provider) {
                error_log('Google OAuth Callback: Not configured');
                $redirectUrl = $frontendUrl . '/auth/login?error=' . urlencode('Google login is not configured.');
                return $response->withHeader('Location', $redirectUrl)->withStatus(302);
            }

            $queryParams = $request->getQueryParams();

            error_log('Google OAuth Callback: session_id=' . session_id() . ', has_state=' . (isset($queryParams['state']) ? 'yes' : 'no') . ', session_state=' . ($_SESSION['oauth2state'] ?? 'NOT SET'));

            // Check for errors from Google
            if (isset($queryParams['error'])) {
                error_log('Google OAuth Error from Google: ' . $queryParams['error']);
                throw new Exception('Google returned an error: ' . $queryParams['error']);
            }

            // Verify state (CSRF protection)
            if (!isset($queryParams['state'])) {
                error_log('Google OAuth: Missing state parameter in callback');
                throw new Exception('Missing state parameter');
            }

            if (!isset($_SESSION['oauth2state'])) {
                error_log('Google OAuth: Session state is missing. Session may have expired or cookies are blocked.');
                throw new Exception('Session expired. Please try again.');
            }

            if ($queryParams['state'] !== $_SESSION['oauth2state']) {
                error_log('Google OAuth: State mismatch. Expected: ' . $_SESSION['oauth2state'] . ', Got: ' . $queryParams['state']);
                unset($_SESSION['oauth2state']);
                throw new Exception('Invalid state - possible CSRF attack or session issue');
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
                // Create new user with UUID
                $uuid = \Ramsey\Uuid\Uuid::uuid4()->toString();

                $user = User::create([
                    'uuid' => $uuid,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'google_id' => $googleId,
                    'avatar_url' => $avatar,
                    'role' => 'user',
                    'password_hash' => password_hash($uuid, PASSWORD_DEFAULT), // Random password for OAuth users
                    'email_verified' => true, // Google has already verified the email
                    'is_active' => true
                ]);

                if (!$user) {
                    throw new Exception('Failed to create user account. Please try again.');
                }
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
                'user_role' => $user->role
            ]);

            return $response
                ->withHeader('Location', $redirectUrl)
                ->withStatus(302);

        } catch (IdentityProviderException $e) {
            // OAuth provider error (token exchange failed)
            error_log('Google OAuth IdentityProviderException: ' . $e->getMessage());
            $redirectUrl = $frontendUrl . '/auth/login?error=' . urlencode('Google login failed: ' . $e->getMessage());
            return $response->withHeader('Location', $redirectUrl)->withStatus(302);

        } catch (Exception $e) {
            // General error - pass the actual message for debugging
            error_log('Google OAuth Exception: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
            $errorMessage = $e->getMessage();

            // Make error message user-friendly but informative
            if (strpos($errorMessage, 'Session expired') !== false) {
                $errorMessage = 'Session expired. Please try again.';
            } elseif (strpos($errorMessage, 'state') !== false) {
                $errorMessage = 'Security validation failed. Please try again.';
            }

            $redirectUrl = $frontendUrl . '/auth/login?error=' . urlencode($errorMessage);
            return $response->withHeader('Location', $redirectUrl)->withStatus(302);
        }
    }
}

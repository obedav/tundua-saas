<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class PusherController
{
    /**
     * Authenticate Pusher private/presence channels
     * POST /api/pusher/auth
     */
    public function auth(Request $request, Response $response): Response
    {
        try {
            // Get authenticated user from middleware
            $userId = $request->getAttribute('user_id');
            $user = $request->getAttribute('user');

            if (!$userId || !$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Unauthorized'
                ]));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            // Get POST data
            $body = $request->getParsedBody();
            $socketId = $body['socket_id'] ?? null;
            $channelName = $body['channel_name'] ?? null;

            if (!$socketId || !$channelName) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Missing socket_id or channel_name'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Get Pusher credentials from environment
            $pusherKey = $_ENV['PUSHER_APP_KEY'] ?? '';
            $pusherSecret = $_ENV['PUSHER_APP_SECRET'] ?? '';

            if (empty($pusherKey) || empty($pusherSecret)) {
                error_log("Pusher credentials not configured");
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Pusher not configured'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            // Determine if it's a presence channel
            $isPresenceChannel = strpos($channelName, 'presence-') === 0;

            if ($isPresenceChannel) {
                // For presence channels, include user data
                $channelData = [
                    'user_id' => (string)$userId,
                    'user_info' => [
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email
                    ]
                ];
                $channelDataJson = json_encode($channelData);

                // Create auth signature for presence channel
                $stringToSign = $socketId . ':' . $channelName . ':' . $channelDataJson;
                $signature = hash_hmac('sha256', $stringToSign, $pusherSecret);
                $auth = $pusherKey . ':' . $signature;

                $response->getBody()->write(json_encode([
                    'auth' => $auth,
                    'channel_data' => $channelDataJson
                ]));
            } else {
                // For private channels
                $stringToSign = $socketId . ':' . $channelName;
                $signature = hash_hmac('sha256', $stringToSign, $pusherSecret);
                $auth = $pusherKey . ':' . $signature;

                $response->getBody()->write(json_encode([
                    'auth' => $auth
                ]));
            }

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Pusher auth error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

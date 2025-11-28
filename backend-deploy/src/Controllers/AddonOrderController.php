<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\AddonOrder;

class AddonOrderController
{
    /**
     * Get user's purchased add-ons
     * GET /api/addons/purchased
     */
    public function getUserAddons(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();
            $status = $queryParams['status'] ?? null;

            $addons = AddonOrder::getUserAddons($userId, $status);

            $response->getBody()->write(json_encode([
                'success' => true,
                'addons' => $addons,
                'count' => count($addons)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting user add-ons: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Purchase add-on service
     * POST /api/addons/purchase
     */
    public function purchaseAddon(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();
            $userId = $request->getAttribute('user_id');

            // Validate required fields
            if (!isset($data['addon_service_id']) || !isset($data['application_id'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Add-on service ID and application ID are required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $data['user_id'] = $userId;

            $order = AddonOrder::purchaseAddon($data);

            if (!$order) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to purchase add-on. Service may not be available.'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Add-on service purchased successfully',
                'order' => $order
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error purchasing add-on: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get add-on order details
     * GET /api/addons/orders/{id}
     */
    public function getOrderById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');

            $order = AddonOrder::getById($id, $userId);

            if (!$order) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Order not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'order' => $order
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting add-on order: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get add-ons for specific application
     * GET /api/addons/application/{id}
     */
    public function getApplicationAddons(Request $request, Response $response, array $args): Response
    {
        try {
            $applicationId = (int) $args['id'];

            $addons = AddonOrder::getByApplication($applicationId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'addons' => $addons,
                'count' => count($addons)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting application add-ons: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all add-on orders (admin)
     * GET /api/admin/addons/orders
     */
    public function getAllOrders(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $status = $queryParams['status'] ?? null;
            $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;
            $perPage = isset($queryParams['per_page']) ? (int)$queryParams['per_page'] : 20;

            $result = AddonOrder::getAllOrders($status, $page, $perPage);

            $response->getBody()->write(json_encode([
                'success' => true,
                ...$result
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting all add-on orders: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update add-on order status (admin)
     * PUT /api/admin/addons/orders/{id}/status
     */
    public function updateOrderStatus(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $data = $request->getParsedBody();

            if (!isset($data['status'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Status is required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $additionalData = [];
            if (isset($data['fulfillment_notes'])) {
                $additionalData['fulfillment_notes'] = $data['fulfillment_notes'];
            }
            if (isset($data['deliverable_url'])) {
                $additionalData['deliverable_url'] = $data['deliverable_url'];
            }
            if (isset($data['assigned_to'])) {
                $additionalData['assigned_to'] = $data['assigned_to'];
            }

            $success = AddonOrder::updateOrderStatus($id, $data['status'], $additionalData);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Order not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Order status updated successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error updating add-on order status: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

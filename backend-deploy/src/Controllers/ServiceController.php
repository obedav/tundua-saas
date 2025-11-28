<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\ServiceTier;
use Tundua\Models\AddonService;
use Tundua\Services\PricingService;

class ServiceController
{
    /**
     * Get all active service tiers
     * GET /api/service-tiers
     */
    public function getServiceTiers(Request $request, Response $response): Response
    {
        try {
            $tiers = ServiceTier::getActiveTiers();

            $response->getBody()->write(json_encode([
                'success' => true,
                'service_tiers' => $tiers,
                'count' => count($tiers)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting service tiers: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get service tier by ID
     * GET /api/service-tiers/{id}
     */
    public function getServiceTierById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];

            $tier = ServiceTier::getById($id);

            if (!$tier) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Service tier not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'service_tier' => $tier
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting service tier: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get service tiers comparison
     * GET /api/service-tiers/comparison
     */
    public function getTierComparison(Request $request, Response $response): Response
    {
        try {
            $comparison = PricingService::getTierComparison();

            $response->getBody()->write(json_encode([
                'success' => true,
                'tiers' => $comparison
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting tier comparison: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all active add-on services
     * GET /api/addon-services
     */
    public function getAddonServices(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $category = $queryParams['category'] ?? null;

            $addons = AddonService::getActiveAddons($category);

            $response->getBody()->write(json_encode([
                'success' => true,
                'addon_services' => $addons,
                'count' => count($addons)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting add-on services: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get add-on services grouped by category
     * GET /api/addon-services/by-category
     */
    public function getAddonsByCategory(Request $request, Response $response): Response
    {
        try {
            $grouped = PricingService::getAddonsByCategory();

            $response->getBody()->write(json_encode([
                'success' => true,
                'categories' => $grouped
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting add-ons by category: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get add-on service by ID
     * GET /api/addon-services/{id}
     */
    public function getAddonServiceById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];

            $addon = AddonService::getById($id);

            if (!$addon) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Add-on service not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'addon_service' => $addon
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting add-on service: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    // =========================================================================
    // ADMIN ENDPOINTS
    // =========================================================================

    /**
     * Create service tier (admin)
     * POST /api/admin/service-tiers
     */
    public function createServiceTier(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            // Validate required fields
            if (!isset($data['name']) || !isset($data['slug']) || !isset($data['base_price'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Name, slug, and base price are required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $tier = ServiceTier::createTier($data);

            if (!$tier) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to create service tier'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Service tier created successfully',
                'service_tier' => $tier
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error creating service tier: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update service tier (admin)
     * PUT /api/admin/service-tiers/{id}
     */
    public function updateServiceTier(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $data = $request->getParsedBody();

            $success = ServiceTier::updateTier($id, $data);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to update service tier'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $updated = ServiceTier::getById($id);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Service tier updated successfully',
                'service_tier' => $updated
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error updating service tier: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete service tier (admin)
     * DELETE /api/admin/service-tiers/{id}
     */
    public function deleteServiceTier(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];

            $success = ServiceTier::deleteTier($id);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to delete service tier'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Service tier deleted successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error deleting service tier: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create add-on service (admin)
     * POST /api/admin/addon-services
     */
    public function createAddonService(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            // Validate required fields
            if (!isset($data['name']) || !isset($data['slug']) || !isset($data['price'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Name, slug, and price are required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $addon = AddonService::createAddon($data);

            if (!$addon) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to create add-on service'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Add-on service created successfully',
                'addon_service' => $addon
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error creating add-on service: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update add-on service (admin)
     * PUT /api/admin/addon-services/{id}
     */
    public function updateAddonService(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $data = $request->getParsedBody();

            $success = AddonService::updateAddon($id, $data);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to update add-on service'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $updated = AddonService::getById($id);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Add-on service updated successfully',
                'addon_service' => $updated
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error updating add-on service: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete add-on service (admin)
     * DELETE /api/admin/addon-services/{id}
     */
    public function deleteAddonService(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];

            $success = AddonService::deleteAddon($id);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to delete add-on service'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Add-on service deleted successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error deleting add-on service: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Seed default data (admin)
     * POST /api/admin/services/seed
     */
    public function seedDefaultData(Request $request, Response $response): Response
    {
        try {
            // Seed service tiers
            ServiceTier::seedDefaultTiers();

            // Seed add-on services
            AddonService::seedDefaultAddons();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Default service data seeded successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error seeding default data: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

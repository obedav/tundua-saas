<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\Application;
use Tundua\Services\PricingService;
use Tundua\Services\EmailService;

class ApplicationController
{
    /**
     * Create new application (draft)
     * POST /api/applications
     */
    public function create(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();
            $userId = $request->getAttribute('user_id');

            // Service tier is not required for draft creation
            // It will be validated when submitting the application

            // Add user ID
            $data['user_id'] = $userId;

            // Create application
            $application = Application::createApplication($data);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to create application'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Application created successfully',
                'application' => $application
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error in create application: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's applications
     * GET /api/applications
     */
    public function getUserApplications(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();
            $status = $queryParams['status'] ?? null;

            $applications = Application::getByUserId($userId, $status);

            $response->getBody()->write(json_encode([
                'success' => true,
                'applications' => $applications,
                'count' => count($applications)
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting applications: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get application by ID
     * GET /api/applications/{id}
     */
    public function getById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');

            $application = Application::getById($id);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check ownership
            if ($application->user_id != $userId) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Unauthorized'
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'application' => $application
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting application: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update application (draft only)
     * PUT /api/applications/{id}
     */
    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');
            $data = $request->getParsedBody();

            $application = Application::getById($id);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check ownership
            if ($application->user_id != $userId) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Unauthorized'
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Only allow updates to draft applications
            if ($application->status !== 'draft' && $application->status !== 'payment_pending') {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Cannot update application in current status'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Update application
            $success = Application::updateApplication($id, $data);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to update application'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            // Get updated application
            $updated = Application::getById($id);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Application updated successfully',
                'application' => $updated
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error updating application: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Submit application for payment
     * POST /api/applications/{id}/submit
     */
    public function submit(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');

            $application = Application::getById($id);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check ownership
            if ($application->user_id != $userId) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Unauthorized'
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Validate application is complete
            if (!$application->destination_country || !$application->service_tier_id) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application is incomplete'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Submit application
            $success = Application::submitApplication($id);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to submit application'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            // Get updated application
            $updated = Application::getById($id);

            // Try to send confirmation email (don't fail if email fails)
            try {
                EmailService::sendApplicationSubmitted($updated);
            } catch (\Exception $e) {
                error_log("Failed to send application confirmation email: " . $e->getMessage());
                // Continue anyway - email failure shouldn't block submission
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Application submitted successfully',
                'application' => $updated
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error submitting application: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete application (draft only)
     * DELETE /api/applications/{id}
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $userId = $request->getAttribute('user_id');

            $application = Application::getById($id);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check ownership
            if ($application->user_id != $userId) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Unauthorized'
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Delete application
            $success = Application::deleteApplication($id);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Cannot delete application in current status'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Application deleted successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error deleting application: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Calculate pricing
     * POST /api/applications/calculate-pricing
     */
    public function calculatePricing(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            if (!isset($data['service_tier_id'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Service tier ID is required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $serviceTierId = (int) $data['service_tier_id'];
            $addonServiceIds = $data['addon_services'] ?? [];
            $discountCode = $data['discount_code'] ?? null;

            $pricing = PricingService::calculateTotal($serviceTierId, $addonServiceIds, $discountCode);

            $response->getBody()->write(json_encode($pricing));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error calculating pricing: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's application statistics
     * GET /api/applications/statistics
     */
    public function getStatistics(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            $stats = Application::getStatistics($userId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'statistics' => $stats
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting statistics: " . $e->getMessage());
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
     * Get all applications (admin)
     * GET /api/admin/applications
     */
    public function getAllApplications(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $status = $queryParams['status'] ?? null;
            $page = (int) ($queryParams['page'] ?? 1);
            $perPage = (int) ($queryParams['per_page'] ?? 20);

            $result = Application::getAllApplications($status, $page, $perPage);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting all applications: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update application status (admin)
     * PUT /api/admin/applications/{id}/status
     */
    public function updateStatus(Request $request, Response $response, array $args): Response
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

            $status = $data['status'];
            $notes = $data['notes'] ?? null;

            $success = Application::updateStatus($id, $status, $notes);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to update status'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $updated = Application::getById($id);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Status updated successfully',
                'application' => $updated
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error updating status: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all statistics (admin)
     * GET /api/admin/applications/statistics
     */
    public function getAdminStatistics(Request $request, Response $response): Response
    {
        try {
            $stats = Application::getStatistics();

            $response->getBody()->write(json_encode([
                'success' => true,
                'statistics' => $stats
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting admin statistics: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

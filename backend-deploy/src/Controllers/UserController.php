<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\User;
use Tundua\Database\Database;

class UserController
{
    private $db;
    private User $userModel;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->userModel = new User();
    }

    /**
     * Get all users with filtering and pagination (admin)
     * GET /api/admin/users
     */
    public function getAllUsers(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $page = (int) ($queryParams['page'] ?? 1);
            $perPage = (int) ($queryParams['per_page'] ?? 20);
            $role = $queryParams['role'] ?? null;
            $status = $queryParams['status'] ?? null;
            $search = $queryParams['search'] ?? null;

            $offset = ($page - 1) * $perPage;

            // Build query
            $conditions = ['1=1'];
            $params = [];

            if ($role && $role !== 'all') {
                $conditions[] = "role = :role";
                $params['role'] = $role;
            }

            if ($status) {
                if ($status === 'active') {
                    $conditions[] = "is_active = 1";
                } elseif ($status === 'inactive') {
                    $conditions[] = "is_active = 0";
                } elseif ($status === 'suspended') {
                    $conditions[] = "locked_until IS NOT NULL AND locked_until > NOW()";
                }
            }

            if ($search) {
                $conditions[] = "(first_name LIKE :search OR last_name LIKE :search OR email LIKE :search)";
                $params['search'] = "%$search%";
            }

            $whereClause = implode(' AND ', $conditions);

            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM users WHERE $whereClause";
            $stmt = $this->db->prepare($countSql);
            $stmt->execute($params);
            $total = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

            // Get users with application count
            $sql = "
                SELECT
                    u.id,
                    u.uuid,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.phone,
                    u.role,
                    u.is_active,
                    u.email_verified,
                    u.locked_until,
                    u.login_attempts,
                    u.last_login,
                    u.created_at,
                    COUNT(a.id) as applications_count,
                    CASE
                        WHEN u.locked_until IS NOT NULL AND u.locked_until > NOW() THEN 'suspended'
                        WHEN u.is_active = 1 THEN 'active'
                        ELSE 'inactive'
                    END as status
                FROM users u
                LEFT JOIN applications a ON u.id = a.user_id
                WHERE $whereClause
                GROUP BY u.id
                ORDER BY u.created_at DESC
                LIMIT :limit OFFSET :offset
            ";

            $stmt = $this->db->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue(":$key", $value);
            }
            $stmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
            $stmt->execute();

            $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Remove sensitive data
            foreach ($users as &$user) {
                unset($user['password_hash']);
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'users' => $users,
                    'pagination' => [
                        'total' => (int) $total,
                        'per_page' => $perPage,
                        'current_page' => $page,
                        'total_pages' => ceil($total / $perPage)
                    ]
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting all users: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user details with full information (admin)
     * GET /api/admin/users/{id}
     */
    public function getUserDetails(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = (int) $args['id'];
            error_log("Getting user details for user ID: $userId");

            // Get user info
            $user = $this->userModel->findById($userId);

            if (!$user) {
                error_log("User not found: $userId");
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'User not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            error_log("User found: " . $user['email']);

            // Get user's applications
            try {
                $stmt = $this->db->prepare("
                    SELECT
                        id,
                        reference_number,
                        destination_country,
                        service_tier_name,
                        status,
                        payment_status,
                        total_amount,
                        created_at
                    FROM applications
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                ");
                $stmt->execute([$userId]);
                $applications = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                error_log("Found " . count($applications) . " applications for user $userId");
            } catch (\PDOException $e) {
                error_log("Error fetching applications: " . $e->getMessage());
                $applications = [];
            }

            // Get user's payments - Fixed query to handle LEFT JOIN properly
            try {
                $stmt = $this->db->prepare("
                    SELECT
                        p.id,
                        p.reference,
                        p.amount,
                        p.currency,
                        p.payment_method,
                        p.status,
                        p.created_at,
                        a.reference_number as application_reference
                    FROM payments p
                    LEFT JOIN applications a ON p.application_id = a.id
                    WHERE p.application_id IN (SELECT id FROM applications WHERE user_id = ?)
                       OR p.user_id = ?
                    ORDER BY p.created_at DESC
                ");
                $stmt->execute([$userId, $userId]);
                $payments = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                error_log("Found " . count($payments) . " payments for user $userId");
            } catch (\PDOException $e) {
                error_log("Error fetching payments: " . $e->getMessage());
                $payments = [];
            }

            // Remove sensitive data
            $safeUser = $this->userModel->getSafeUser($user);

            error_log("Successfully prepared user details response for user $userId");

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'user' => $safeUser,
                    'applications' => $applications,
                    'payments' => $payments
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("EXCEPTION in getUserDetails: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update user (admin)
     * PUT /api/admin/users/{id}
     */
    public function updateUser(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = (int) $args['id'];
            $data = $request->getParsedBody();

            // Check if user exists
            $user = $this->userModel->findById($userId);
            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'User not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Allowed fields to update
            $allowedFields = ['first_name', 'last_name', 'phone', 'role', 'is_active', 'email_verified'];
            $updateData = [];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateData[$field] = $data[$field];
                }
            }

            if (empty($updateData)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'No valid fields to update'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $success = $this->userModel->update($userId, $updateData);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to update user'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            // Get updated user
            $updatedUser = $this->userModel->getSafeUser($this->userModel->findById($userId));

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'User updated successfully',
                'user' => $updatedUser
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error updating user: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Suspend/unsuspend user (admin)
     * POST /api/admin/users/{id}/suspend
     */
    public function suspendUser(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = (int) $args['id'];
            $data = $request->getParsedBody();
            $action = $data['action'] ?? 'suspend'; // suspend or unsuspend
            $minutes = (int) ($data['minutes'] ?? 30);

            $user = $this->userModel->findById($userId);
            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'User not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            if ($action === 'suspend') {
                $success = $this->userModel->lockAccount($userId, $minutes);
                $message = "User suspended for $minutes minutes";
            } else {
                $success = $this->userModel->update($userId, ['locked_until' => null]);
                $message = 'User suspension removed';
            }

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Failed to update user status'
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => $message
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error suspending user: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user statistics (admin)
     * GET /api/admin/users/statistics
     */
    public function getUserStatistics(Request $request, Response $response): Response
    {
        try {
            // Total users
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM users");
            $totalUsers = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

            // Active users
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM users WHERE is_active = 1");
            $activeUsers = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

            // Suspended users
            $stmt = $this->db->query("
                SELECT COUNT(*) as total FROM users
                WHERE locked_until IS NOT NULL AND locked_until > NOW()
            ");
            $suspendedUsers = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

            // New users this month
            $stmt = $this->db->query("
                SELECT COUNT(*) as total FROM users
                WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
                AND YEAR(created_at) = YEAR(CURRENT_DATE())
            ");
            $newThisMonth = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

            // Users by role
            $stmt = $this->db->query("
                SELECT role, COUNT(*) as count
                FROM users
                GROUP BY role
            ");
            $byRole = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Users with applications
            $stmt = $this->db->query("
                SELECT COUNT(DISTINCT user_id) as total FROM applications
            ");
            $usersWithApplications = $stmt->fetch(\PDO::FETCH_ASSOC)['total'];

            $response->getBody()->write(json_encode([
                'success' => true,
                'statistics' => [
                    'total_users' => (int) $totalUsers,
                    'active_users' => (int) $activeUsers,
                    'suspended_users' => (int) $suspendedUsers,
                    'new_this_month' => (int) $newThisMonth,
                    'by_role' => $byRole,
                    'users_with_applications' => (int) $usersWithApplications,
                    'conversion_rate' => $totalUsers > 0 ?
                        round(($usersWithApplications / $totalUsers) * 100, 2) : 0
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            error_log("Error getting user statistics: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

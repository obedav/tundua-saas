<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Database\Database;

class RefundController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Upload refund agreement PDF
     * POST /api/refunds/upload-agreement
     */
    public function uploadAgreement(Request $request, Response $response): Response
    {
        try {
            $uploadedFiles = $request->getUploadedFiles();
            $data = $request->getParsedBody();

            if (!isset($uploadedFiles['file'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'No file uploaded'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $uploadedFile = $uploadedFiles['file'];
            $applicationRef = $data['application_ref'] ?? 'unknown';

            // Save file
            $filename = 'refund-agreement-' . $applicationRef . '-' . time() . '.pdf';
            $storagePath = __DIR__ . '/../../storage/refund-agreements/';

            if (!is_dir($storagePath)) {
                mkdir($storagePath, 0755, true);
            }

            $filePath = $storagePath . $filename;
            $uploadedFile->moveTo($filePath);

            // Return URL
            $fileUrl = '/storage/refund-agreements/' . $filename;

            $response->getBody()->write(json_encode([
                'success' => true,
                'agreement_url' => $fileUrl
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create refund request
     * POST /api/refunds
     */
    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $userId = $request->getAttribute('user_id');

        try {
            // Get client IP
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

            // Get application amount
            $app = $this->db->prepare("SELECT total_amount FROM applications WHERE id = ? AND user_id = ?");
            $app->execute([$data['application_id'], $userId]);
            $application = $app->fetch(\PDO::FETCH_ASSOC);

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found or access denied'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Create refund request
            $stmt = $this->db->prepare("
                INSERT INTO refunds (
                    application_id, user_id, refund_amount, reason, status,
                    signature_data, signed_ip_address, signed_at,
                    agreement_pdf_url, requested_at
                ) VALUES (?, ?, ?, ?, 'pending', ?, ?, NOW(), ?, NOW())
            ");

            $stmt->execute([
                $data['application_id'],
                $userId,
                $application['total_amount'],
                $data['reason'],
                $data['signature_data'],
                $ipAddress,
                $data['agreement_pdf_url']
            ]);

            $refundId = $this->db->lastInsertId();

            $response->getBody()->write(json_encode([
                'success' => true,
                'refund_id' => $refundId,
                'message' => 'Refund request submitted successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get user's refund requests
     * GET /api/refunds/user
     */
    public function getUserRefunds(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');

        try {
            $stmt = $this->db->prepare("
                SELECT r.*, a.reference_number as application_reference
                FROM refunds r
                LEFT JOIN applications a ON r.application_id = a.id
                WHERE r.user_id = ?
                ORDER BY r.requested_at DESC
            ");
            $stmt->execute([$userId]);
            $refunds = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $response->getBody()->write(json_encode([
                'success' => true,
                'refunds' => $refunds
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get refund by ID
     * GET /api/refunds/{id}
     */
    public function getById(Request $request, Response $response, array $args): Response
    {
        $refundId = $args['id'] ?? null;
        $userId = $request->getAttribute('user_id');

        try {
            $stmt = $this->db->prepare("
                SELECT r.*, a.reference_number as application_reference
                FROM refunds r
                LEFT JOIN applications a ON r.application_id = a.id
                WHERE r.id = ? AND r.user_id = ?
            ");
            $stmt->execute([$refundId, $userId]);
            $refund = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$refund) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Refund not found or access denied'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'refund' => $refund
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all refund requests (admin only)
     * GET /api/admin/refunds
     */
    public function getAllRefunds(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $status = $queryParams['status'] ?? null;
        $page = (int)($queryParams['page'] ?? 1);
        $perPage = (int)($queryParams['per_page'] ?? 20);
        $offset = ($page - 1) * $perPage;

        try {
            $whereClause = $status ? "WHERE r.status = ?" : "";
            $params = $status ? [$status] : [];

            // Get total count
            $countStmt = $this->db->prepare("
                SELECT COUNT(*) as total FROM refunds r $whereClause
            ");
            $countStmt->execute($params);
            $total = $countStmt->fetch(\PDO::FETCH_ASSOC)['total'];

            // Get refunds
            $stmt = $this->db->prepare("
                SELECT r.*, a.reference_number as application_reference,
                       u.first_name, u.last_name, u.email
                FROM refunds r
                LEFT JOIN applications a ON r.application_id = a.id
                LEFT JOIN users u ON r.user_id = u.id
                $whereClause
                ORDER BY r.requested_at DESC
                LIMIT ? OFFSET ?
            ");

            $params[] = $perPage;
            $params[] = $offset;
            $stmt->execute($params);
            $refunds = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $response->getBody()->write(json_encode([
                'success' => true,
                'refunds' => $refunds,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total' => $total,
                    'total_pages' => ceil($total / $perPage)
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Review refund request (admin only)
     * PUT /api/admin/refunds/{id}/review
     */
    public function reviewRefund(Request $request, Response $response, array $args): Response
    {
        $refundId = $args['id'] ?? null;
        $data = $request->getParsedBody();
        $adminId = $request->getAttribute('user_id');

        try {
            $status = $data['status'] ?? null;
            $adminNotes = $data['admin_notes'] ?? null;

            if (!in_array($status, ['approved', 'rejected'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid status. Must be approved or rejected'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $updateFields = "status = ?, reviewed_by = ?, reviewed_at = NOW(), admin_notes = ?";
            $params = [$status, $adminId, $adminNotes];

            // If approved, set approved_at and business_days_remaining
            if ($status === 'approved') {
                $updateFields .= ", approved_at = NOW(), business_days_remaining = 90";
            }

            $stmt = $this->db->prepare("
                UPDATE refunds
                SET $updateFields
                WHERE id = ?
            ");

            $params[] = $refundId;
            $stmt->execute($params);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => "Refund $status successfully"
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

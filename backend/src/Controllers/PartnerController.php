<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\Partner;
use Tundua\Models\PartnerCommission;

/**
 * Partner & Commission Management Controller
 * Admin dashboard for tracking ApplyBoard, Edvoy, BPP commissions
 */
class PartnerController
{
    /**
     * Get commission dashboard summary
     * GET /api/admin/commissions/dashboard
     */
    public function dashboard(Request $request, Response $response): Response
    {
        try {
            $summary = PartnerCommission::getDashboardSummary();

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $summary
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Commission dashboard error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to load dashboard'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all partners
     * GET /api/admin/partners
     */
    public function getPartners(Request $request, Response $response): Response
    {
        try {
            $partners = Partner::getActive();

            // Add statistics for each partner
            foreach ($partners as &$partner) {
                $partnerModel = Partner::find($partner['id']);
                $partner['statistics'] = $partnerModel->getStatistics();
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'partners' => $partners
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Get partners error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to load partners'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all commissions with filters
     * GET /api/admin/commissions
     */
    public function getCommissions(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            $status = $params['status'] ?? null;
            $partnerId = $params['partner_id'] ?? null;
            $page = (int)($params['page'] ?? 1);
            $limit = (int)($params['limit'] ?? 20);
            $offset = ($page - 1) * $limit;

            $query = PartnerCommission::query()
                ->orderBy('created_at', 'DESC');

            if ($status) {
                $query->where('status', $status);
            }

            if ($partnerId) {
                $query->where('partner_id', $partnerId);
            }

            $total = $query->count();
            $commissions = $query->skip($offset)->take($limit)->get()->toArray();

            $response->getBody()->write(json_encode([
                'success' => true,
                'commissions' => $commissions,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Get commissions error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to load commissions'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Create commission record (assign application to partner)
     * POST /api/admin/commissions
     */
    public function createCommission(Request $request, Response $response): Response
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);

            $required = ['application_id', 'user_id', 'partner_id', 'university_name'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    $response->getBody()->write(json_encode([
                        'success' => false,
                        'error' => "Missing required field: {$field}"
                    ]));
                    return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
                }
            }

            $commission = PartnerCommission::createFromApplication(
                $data['application_id'],
                $data['user_id'],
                $data['partner_id'],
                $data['university_name'],
                $data['program_name'] ?? null,
                $data['tuition_fee'] ?? null,
                $data['tuition_currency'] ?? 'USD'
            );

            $response->getBody()->write(json_encode([
                'success' => true,
                'commission' => $commission->toArray(),
                'message' => 'Commission record created'
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Create commission error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to create commission record'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update commission status
     * PATCH /api/admin/commissions/{id}
     */
    public function updateCommission(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $data = json_decode($request->getBody()->getContents(), true);

            $commission = PartnerCommission::find($id);
            if (!$commission) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Commission not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Update fields
            $allowedFields = [
                'university_name', 'program_name', 'intake_year', 'intake_month',
                'tuition_fee', 'tuition_currency', 'commission_percentage',
                'partner_reference', 'offer_letter_url', 'notes'
            ];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $commission->$field = $data[$field];
                }
            }

            // Update status if provided
            if (!empty($data['status'])) {
                $commission->updateStatus($data['status'], $data['status_note'] ?? null);
            }

            // Recalculate expected commission if tuition changed
            if (isset($data['tuition_fee'])) {
                $commission->updateExpectedCommission();
            }

            // Mark as paid if actual_commission provided
            if (isset($data['actual_commission']) && $data['status'] === 'commission_paid') {
                $commission->markAsPaid($data['actual_commission'], $data['payment_note'] ?? null);
            }

            $commission->save();

            $response->getBody()->write(json_encode([
                'success' => true,
                'commission' => $commission->toArray(),
                'message' => 'Commission updated'
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Update commission error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update commission'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get commission revenue report
     * GET /api/admin/commissions/report
     */
    public function getReport(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            $startDate = $params['start_date'] ?? date('Y-m-01'); // Default: this month
            $endDate = $params['end_date'] ?? date('Y-m-d');

            $db = PartnerCommission::getConnectionResolver()->connection();

            // Monthly breakdown
            $monthlyReport = $db->select("
                SELECT
                    DATE_FORMAT(enrolled_at, '%Y-%m') as month,
                    COUNT(*) as enrollments,
                    SUM(expected_commission) as expected_revenue,
                    SUM(CASE WHEN status = 'commission_paid' THEN actual_commission ELSE 0 END) as actual_revenue
                FROM partner_commissions
                WHERE enrolled_at BETWEEN ? AND ?
                GROUP BY DATE_FORMAT(enrolled_at, '%Y-%m')
                ORDER BY month DESC
            ", [$startDate, $endDate]);

            // By partner
            $byPartner = $db->select("
                SELECT
                    p.name as partner_name,
                    COUNT(pc.id) as total_submissions,
                    SUM(CASE WHEN pc.status IN ('student_enrolled', 'commission_pending', 'commission_paid') THEN 1 ELSE 0 END) as conversions,
                    SUM(CASE WHEN pc.status = 'commission_paid' THEN pc.actual_commission ELSE 0 END) as revenue
                FROM partners p
                LEFT JOIN partner_commissions pc ON p.id = pc.partner_id
                    AND pc.created_at BETWEEN ? AND ?
                GROUP BY p.id, p.name
            ", [$startDate, $endDate]);

            // Pipeline value (expected from enrolled students not yet paid)
            $pipeline = $db->selectOne("
                SELECT SUM(expected_commission) as value
                FROM partner_commissions
                WHERE status IN ('student_enrolled', 'commission_pending')
            ");

            $response->getBody()->write(json_encode([
                'success' => true,
                'report' => [
                    'period' => ['start' => $startDate, 'end' => $endDate],
                    'monthly' => $monthlyReport,
                    'by_partner' => $byPartner,
                    'pipeline_value' => $pipeline->value ?? 0
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("Commission report error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to generate report'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}

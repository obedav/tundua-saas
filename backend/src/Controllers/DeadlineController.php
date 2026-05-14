<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tundua\Models\Deadline;

/**
 * DeadlineController — CRUD for university intake deadlines.
 *
 * Public GET (students browsing deadlines).
 * POST / PUT / DELETE are admin-only (enforced at the route layer via AdminMiddleware).
 */
class DeadlineController
{
    /**
     * GET /api/v1/deadlines
     * Public. Optional ?country= filter. Returns only active deadlines.
     */
    public function index(Request $request, Response $response): Response
    {
        try {
            $country = $request->getQueryParams()['country'] ?? null;
            $deadlines = Deadline::getActive($country ?: null);

            return $this->json($response, ['success' => true, 'deadlines' => $deadlines->values()]);
        } catch (\Throwable $e) {
            error_log('DeadlineController::index error: ' . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => 'Failed to load deadlines'], 500);
        }
    }

    /**
     * POST /api/v1/admin/deadlines
     */
    public function store(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody() ?? [];
            $errors = $this->validate($data);
            if (!empty($errors)) {
                return $this->json($response, ['success' => false, 'errors' => $errors], 422);
            }

            $deadline = Deadline::create($this->sanitize($data));

            return $this->json($response, ['success' => true, 'deadline' => $deadline], 201);
        } catch (\Throwable $e) {
            error_log('DeadlineController::store error: ' . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => 'Failed to create deadline'], 500);
        }
    }

    /**
     * PUT /api/v1/admin/deadlines/{id}
     */
    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $deadline = Deadline::find((int)$args['id']);
            if (!$deadline) {
                return $this->json($response, ['success' => false, 'error' => 'Deadline not found'], 404);
            }

            $data = $request->getParsedBody() ?? [];
            $errors = $this->validate($data);
            if (!empty($errors)) {
                return $this->json($response, ['success' => false, 'errors' => $errors], 422);
            }

            $deadline->update($this->sanitize($data));

            return $this->json($response, ['success' => true, 'deadline' => $deadline->fresh()]);
        } catch (\Throwable $e) {
            error_log('DeadlineController::update error: ' . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => 'Failed to update deadline'], 500);
        }
    }

    /**
     * DELETE /api/v1/admin/deadlines/{id}
     */
    public function destroy(Request $request, Response $response, array $args): Response
    {
        try {
            $deadline = Deadline::find((int)$args['id']);
            if (!$deadline) {
                return $this->json($response, ['success' => false, 'error' => 'Deadline not found'], 404);
            }

            $deadline->delete();

            return $this->json($response, ['success' => true]);
        } catch (\Throwable $e) {
            error_log('DeadlineController::destroy error: ' . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => 'Failed to delete deadline'], 500);
        }
    }

    private function validate(array $data): array
    {
        $errors = [];
        if (empty(trim((string)($data['university_name'] ?? '')))) {
            $errors['university_name'] = 'University name is required';
        }
        if (empty(trim((string)($data['country'] ?? '')))) {
            $errors['country'] = 'Country is required';
        }
        if (empty(trim((string)($data['intake'] ?? '')))) {
            $errors['intake'] = 'Intake is required';
        }
        if (empty($data['intake_year']) || !is_numeric($data['intake_year'])) {
            $errors['intake_year'] = 'Valid intake year is required';
        }
        if (empty(trim((string)($data['deadline_date'] ?? '')))) {
            $errors['deadline_date'] = 'Deadline date is required';
        }
        return $errors;
    }

    private function sanitize(array $data): array
    {
        $allowed = ['undergraduate', 'postgraduate', 'all'];
        return [
            'university_name' => mb_substr(trim((string)($data['university_name'] ?? '')), 0, 255),
            'country'         => mb_substr(trim((string)($data['country'] ?? '')), 0, 100),
            'intake'          => mb_substr(trim((string)($data['intake'] ?? '')), 0, 20),
            'intake_year'     => (int)($data['intake_year'] ?? date('Y')),
            'deadline_date'   => trim((string)($data['deadline_date'] ?? '')),
            'program_type'    => in_array($data['program_type'] ?? '', $allowed) ? $data['program_type'] : 'all',
            'notes'           => isset($data['notes']) ? mb_substr(trim((string)$data['notes']), 0, 500) : null,
            'is_active'       => isset($data['is_active']) ? (bool)$data['is_active'] : true,
        ];
    }

    private function json(Response $response, array $payload, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($payload));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}

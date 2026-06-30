<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator as v;
use Tundua\Models\Lead;
use Tundua\Services\EmailService;
use Tundua\Services\LeadScoringService;
use Tundua\Services\VepaарWebhookService;

/**
 * LeadController — accept public funnel form submissions.
 *
 * SRP: HTTP in/out + delegation. Persistence lives in the Lead model,
 * email formatting lives in EmailService. This class only orchestrates.
 *
 * Public endpoint — no auth. Rate limiting is applied at the middleware
 * layer via RateLimitMiddleware's $endpointLimits.
 */
class LeadController
{
    private EmailService $emailService;

    // Character limits on free-text fields. Stops abusive giant payloads
    // without getting in the way of real users.
    private const LIMITS = [
        'name'         => 120,
        'email'        => 255,
        'phone'        => 50,
        'country'      => 100,
        'start_date'   => 30,
        'budget'       => 100,
        'message'      => 2000,
        'source'       => 100,
        'utm_field'    => 255,
        'url'          => 500,
        'user_agent'   => 500,
    ];

    public function __construct()
    {
        $this->emailService = new EmailService();
    }

    /**
     * POST /api/v1/leads
     *
     * Body (JSON):
     *   required: name, country, start_date
     *   optional: email, phone, budget, message, source, utm { source,medium,campaign,term,content,gclid,fbclid,landing_page,referrer }
     *
     * Returns 201 { success:true, lead_id } on success; 400 on validation error; 500 on unexpected failure.
     */
    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody() ?? [];

        // 1. Validate required fields + formats.
        $errors = $this->validate($data);
        if (!empty($errors)) {
            return $this->json($response, ['success' => false, 'error' => 'Validation failed', 'details' => $errors], 400);
        }

        // 1b. At least one usable contact method is required.
        $hasEmail = trim((string)($data['email'] ?? '')) !== '';
        $hasPhone = trim((string)($data['phone'] ?? '')) !== '';
        if (!$hasEmail && !$hasPhone) {
            return $this->json($response, [
                'success' => false,
                'error'   => 'Please provide an email address or WhatsApp number so we can reach you.',
            ], 422);
        }

        // 2. Sanitize + assemble the row. Attribution block is flattened into top-level columns.
        $row = $this->buildRow($data, $request);

        // 3. Persist. If the DB is down we must return an error (no fake success — that's the original bug).
        try {
            $lead = Lead::create($row);
        } catch (\Throwable $e) {
            error_log('Lead persistence failed: ' . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => 'Could not save your submission. Please try again.'], 500);
        }

        // 4. Score the lead. Non-fatal — a scoring failure must not block the 201.
        try {
            LeadScoringService::withDefaultRules()->scoreAndSave($lead);
        } catch (\Throwable $e) {
            error_log('Lead scoring failed: ' . $e->getMessage());
        }

        // 5. Sync to Vepaar CRM. Registered as a shutdown callback so it fires
        //    after fastcgi_finish_request() — the 201 is already with the client.
        try {
            VepaарWebhookService::dispatch($lead);
        } catch (\Throwable $e) {
            error_log('Vepaar dispatch failed: ' . $e->getMessage());
        }

        // 6. Fire-and-observe admin notification. We intentionally do NOT fail the
        //    request if the email fails — the lead is safely in the DB, and the
        //    admin can work from the database if email is down.
        try {
            $this->emailService->sendLeadNotification($row);
        } catch (\Throwable $e) {
            error_log('Lead notification email failed: ' . $e->getMessage());
        }

        return $this->json($response, ['success' => true, 'lead_id' => $lead->id], 201);
    }

    /**
     * PATCH /api/v1/leads/{id}/details
     *
     * Body (JSON):
     *   optional: email, phone, budget, message
     *
     * Returns 200 { success:true } on success; 400 on validation error; 404 if not found; 500 on failure.
     */
    public function updateDetails(Request $request, Response $response, array $args): Response
    {
        $lead = Lead::find((int)($args['id'] ?? 0));
        if ($lead === null) {
            return $this->json($response, ['success' => false, 'error' => 'Lead not found'], 404);
        }

        $data = $request->getParsedBody() ?? [];

        $errors = $this->validateOptionalLengths($data, [
            'country'    => self::LIMITS['country'],
            'start_date' => self::LIMITS['start_date'],
            'phone'      => self::LIMITS['phone'],
            'budget'     => self::LIMITS['budget'],
            'message'    => self::LIMITS['message'],
        ]);

        $email = strtolower(trim((string)($data['email'] ?? '')));
        if ($email !== '' && (mb_strlen($email) > self::LIMITS['email'] || !v::email()->validate($email))) {
            $errors['email'] = 'Invalid email';
        }

        if (!empty($errors)) {
            return $this->json($response, ['success' => false, 'error' => 'Validation failed', 'details' => $errors], 400);
        }

        $updates = [];
        if ($email !== '') {
            $updates['email'] = $email;
        }
        foreach (['country', 'start_date', 'phone', 'budget', 'message'] as $field) {
            $val = $this->trimField($data, $field, self::LIMITS[$field]);
            if ($val !== null) {
                $updates[$field] = $val;
            }
        }

        if (!empty($updates)) {
            try {
                $lead->update($updates);
            } catch (\Throwable $e) {
                error_log('Lead details update failed: ' . $e->getMessage());
                return $this->json($response, ['success' => false, 'error' => 'Could not update your details. Please try again.'], 500);
            }
        }

        // Rescore whenever this endpoint is hit — country or start_date may have changed.
        try {
            LeadScoringService::withDefaultRules()->scoreAndSave($lead);
        } catch (\Throwable $e) {
            error_log('Lead rescoring failed: ' . $e->getMessage());
        }

        return $this->json($response, ['success' => true], 200);
    }

    /**
     * Validate required + optional fields for lead creation. Returns a field-keyed error map.
     */
    private function validate(array $data): array
    {
        $errors = [];

        if (empty(trim((string)($data['name'] ?? '')))) {
            $errors['name'] = 'Name is required';
        } elseif (mb_strlen((string)$data['name']) > self::LIMITS['name']) {
            $errors['name'] = 'Name is too long';
        }

        if (empty(trim((string)($data['country'] ?? '')))) {
            $errors['country'] = 'Country is required';
        } elseif (mb_strlen((string)$data['country']) > self::LIMITS['country']) {
            $errors['country'] = 'Country is too long';
        }

        if (empty(trim((string)($data['start_date'] ?? '')))) {
            $errors['start_date'] = 'Start date is required';
        } elseif (mb_strlen((string)$data['start_date']) > self::LIMITS['start_date']) {
            $errors['start_date'] = 'Start date is too long';
        }

        // Email is optional at creation; if provided it must be valid.
        $email = strtolower(trim((string)($data['email'] ?? '')));
        if ($email !== '' && (mb_strlen($email) > self::LIMITS['email'] || !v::email()->validate($email))) {
            $errors['email'] = 'Invalid email';
        }

        return array_merge($errors, $this->validateOptionalLengths($data, [
            'phone'   => self::LIMITS['phone'],
            'budget'  => self::LIMITS['budget'],
            'message' => self::LIMITS['message'],
            'source'  => self::LIMITS['source'],
        ]));
    }

    /**
     * Validate that present, non-empty optional fields don't exceed their character limits.
     * Reused by validate() and updateDetails() to keep the rule in one place.
     */
    private function validateOptionalLengths(array $data, array $fieldLimits): array
    {
        $errors = [];
        foreach ($fieldLimits as $field => $limit) {
            if (isset($data[$field]) && $data[$field] !== '' && mb_strlen((string)$data[$field]) > $limit) {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is too long';
            }
        }
        return $errors;
    }

    /**
     * Trim and truncate a string field from a source array. Returns null when absent or empty.
     */
    private function trimField(array $src, string $key, int $max): ?string
    {
        if (!isset($src[$key]) || $src[$key] === '') {
            return null;
        }
        return mb_substr(trim((string)$src[$key]), 0, $max);
    }

    /**
     * Flatten + sanitize the payload into the shape the `leads` table expects.
     * Accepts either a nested `utm` object or flat `utm_*` keys.
     */
    private function buildRow(array $data, Request $request): array
    {
        $utm = is_array($data['utm'] ?? null) ? $data['utm'] : [];

        $email = strtolower(trim((string)($data['email'] ?? '')));

        return [
            'name'       => mb_substr(trim((string)$data['name']), 0, self::LIMITS['name']),
            'email'      => $email !== '' ? mb_substr($email, 0, self::LIMITS['email']) : null,
            'phone'      => $this->trimField($data, 'phone',      self::LIMITS['phone']),
            'country'    => mb_substr(trim((string)$data['country']), 0, self::LIMITS['country']),
            'start_date' => mb_substr(trim((string)$data['start_date']), 0, self::LIMITS['start_date']),
            'budget'     => $this->trimField($data, 'budget',     self::LIMITS['budget']),
            'message'    => $this->trimField($data, 'message',    self::LIMITS['message']),
            'source'     => $this->trimField($data, 'source',     self::LIMITS['source']) ?? 'web',

            'utm_source'   => $this->trimField($utm, 'utm_source',   self::LIMITS['utm_field']) ?? $this->trimField($data, 'utm_source',   self::LIMITS['utm_field']),
            'utm_medium'   => $this->trimField($utm, 'utm_medium',   self::LIMITS['utm_field']) ?? $this->trimField($data, 'utm_medium',   self::LIMITS['utm_field']),
            'utm_campaign' => $this->trimField($utm, 'utm_campaign', self::LIMITS['utm_field']) ?? $this->trimField($data, 'utm_campaign', self::LIMITS['utm_field']),
            'utm_term'     => $this->trimField($utm, 'utm_term',     self::LIMITS['utm_field']) ?? $this->trimField($data, 'utm_term',     self::LIMITS['utm_field']),
            'utm_content'  => $this->trimField($utm, 'utm_content',  self::LIMITS['utm_field']) ?? $this->trimField($data, 'utm_content',  self::LIMITS['utm_field']),
            'gclid'        => $this->trimField($utm, 'gclid',        self::LIMITS['utm_field']) ?? $this->trimField($data, 'gclid',        self::LIMITS['utm_field']),
            'fbclid'       => $this->trimField($utm, 'fbclid',       self::LIMITS['utm_field']) ?? $this->trimField($data, 'fbclid',       self::LIMITS['utm_field']),
            'landing_page' => $this->trimField($utm, 'landing_page', self::LIMITS['url'])       ?? $this->trimField($data, 'landing_page', self::LIMITS['url']),
            'referrer'     => $this->trimField($utm, 'referrer',     self::LIMITS['url'])       ?? $this->trimField($data, 'referrer',     self::LIMITS['url']),

            'ip_address' => $this->clientIp($request),
            'user_agent' => mb_substr((string)($request->getHeaderLine('User-Agent') ?: ''), 0, self::LIMITS['user_agent']) ?: null,
            'status'     => 'new',
        ];
    }

    /**
     * Best-effort client IP. Trusts X-Forwarded-For's first entry when present
     * (our reverse proxy / CDN is the only thing that sets it in prod).
     */
    private function clientIp(Request $request): ?string
    {
        $forwarded = $request->getHeaderLine('X-Forwarded-For');
        if ($forwarded !== '') {
            $first = trim(explode(',', $forwarded)[0]);
            if ($first !== '') return mb_substr($first, 0, 45);
        }
        $server = $request->getServerParams();
        return isset($server['REMOTE_ADDR']) ? mb_substr((string)$server['REMOTE_ADDR'], 0, 45) : null;
    }

    private function json(Response $response, array $payload, int $status): Response
    {
        $response->getBody()->write(json_encode($payload));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}

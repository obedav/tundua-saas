<?php

namespace Tundua\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator as v;
use Tundua\Models\Lead;
use Tundua\Services\EmailService;

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
     *   required: name, email, source
     *   optional: phone, country, budget, message, utm { source,medium,campaign,term,content,gclid,fbclid,landing_page,referrer }
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

        // 2. Sanitize + assemble the row. Attribution block is flattened into top-level columns.
        $row = $this->buildRow($data, $request);

        // 3. Persist. If the DB is down we must return an error (no fake success — that's the original bug).
        try {
            $lead = Lead::create($row);
        } catch (\Throwable $e) {
            error_log('Lead persistence failed: ' . $e->getMessage());
            return $this->json($response, ['success' => false, 'error' => 'Could not save your submission. Please try again.'], 500);
        }

        // 4. Fire-and-observe admin notification. We intentionally do NOT fail the
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
     * Validate required + optional fields. Returns a field-keyed error map.
     */
    private function validate(array $data): array
    {
        $errors = [];

        if (empty(trim((string)($data['name'] ?? '')))) {
            $errors['name'] = 'Name is required';
        } elseif (mb_strlen((string)$data['name']) > self::LIMITS['name']) {
            $errors['name'] = 'Name is too long';
        }

        $email = strtolower(trim((string)($data['email'] ?? '')));
        if ($email === '') {
            $errors['email'] = 'Email is required';
        } elseif (mb_strlen($email) > self::LIMITS['email'] || !v::email()->validate($email)) {
            $errors['email'] = 'Invalid email';
        }

        if (empty(trim((string)($data['source'] ?? '')))) {
            $errors['source'] = 'Source is required';
        } elseif (mb_strlen((string)$data['source']) > self::LIMITS['source']) {
            $errors['source'] = 'Source is too long';
        }

        foreach (['phone' => 'phone', 'country' => 'country', 'budget' => 'budget', 'message' => 'message'] as $field => $label) {
            if (isset($data[$field]) && mb_strlen((string)$data[$field]) > self::LIMITS[$field]) {
                $errors[$field] = ucfirst($label) . ' is too long';
            }
        }

        return $errors;
    }

    /**
     * Flatten + sanitize the payload into the shape the `leads` table expects.
     * Accepts either a nested `utm` object or flat `utm_*` keys.
     */
    private function buildRow(array $data, Request $request): array
    {
        $utm = is_array($data['utm'] ?? null) ? $data['utm'] : [];

        $get = function (array $src, string $key, int $max): ?string {
            if (!isset($src[$key]) || $src[$key] === '') {
                return null;
            }
            return mb_substr(trim((string)$src[$key]), 0, $max);
        };

        return [
            'name'    => mb_substr(trim((string)$data['name']), 0, self::LIMITS['name']),
            'email'   => strtolower(mb_substr(trim((string)$data['email']), 0, self::LIMITS['email'])),
            'phone'   => $get($data, 'phone',   self::LIMITS['phone']),
            'country' => $get($data, 'country', self::LIMITS['country']),
            'budget'  => $get($data, 'budget',  self::LIMITS['budget']),
            'message' => $get($data, 'message', self::LIMITS['message']),
            'source'  => mb_substr(trim((string)$data['source']), 0, self::LIMITS['source']),

            'utm_source'   => $get($utm, 'utm_source',   self::LIMITS['utm_field']) ?? $get($data, 'utm_source',   self::LIMITS['utm_field']),
            'utm_medium'   => $get($utm, 'utm_medium',   self::LIMITS['utm_field']) ?? $get($data, 'utm_medium',   self::LIMITS['utm_field']),
            'utm_campaign' => $get($utm, 'utm_campaign', self::LIMITS['utm_field']) ?? $get($data, 'utm_campaign', self::LIMITS['utm_field']),
            'utm_term'     => $get($utm, 'utm_term',     self::LIMITS['utm_field']) ?? $get($data, 'utm_term',     self::LIMITS['utm_field']),
            'utm_content'  => $get($utm, 'utm_content',  self::LIMITS['utm_field']) ?? $get($data, 'utm_content',  self::LIMITS['utm_field']),
            'gclid'        => $get($utm, 'gclid',        self::LIMITS['utm_field']) ?? $get($data, 'gclid',        self::LIMITS['utm_field']),
            'fbclid'       => $get($utm, 'fbclid',       self::LIMITS['utm_field']) ?? $get($data, 'fbclid',       self::LIMITS['utm_field']),
            'landing_page' => $get($utm, 'landing_page', self::LIMITS['url'])       ?? $get($data, 'landing_page', self::LIMITS['url']),
            'referrer'     => $get($utm, 'referrer',     self::LIMITS['url'])       ?? $get($data, 'referrer',     self::LIMITS['url']),

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

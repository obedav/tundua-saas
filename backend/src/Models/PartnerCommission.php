<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Partner Commission Model
 * Track commissions from ApplyBoard, Edvoy, BPP Education
 * Commission = 10% of student tuition fees
 */
class PartnerCommission extends Model
{
    protected $table = 'partner_commissions';

    protected $fillable = [
        'application_id',
        'user_id',
        'partner_id',
        'university_name',
        'program_name',
        'intake_year',
        'intake_month',
        'status',
        'tuition_fee',
        'tuition_currency',
        'commission_percentage',
        'expected_commission',
        'actual_commission',
        'commission_currency',
        'partner_reference',
        'offer_letter_url',
        'submitted_at',
        'offer_received_at',
        'enrolled_at',
        'commission_received_at',
        'notes'
    ];

    protected $casts = [
        'tuition_fee' => 'decimal:2',
        'commission_percentage' => 'decimal:2',
        'expected_commission' => 'decimal:2',
        'actual_commission' => 'decimal:2',
        'submitted_at' => 'datetime',
        'offer_received_at' => 'datetime',
        'enrolled_at' => 'datetime',
        'commission_received_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Status progression:
     * pending → submitted_to_partner → offer_received → student_enrolled → commission_pending → commission_paid
     */
    const STATUS_PENDING = 'pending';
    const STATUS_SUBMITTED = 'submitted_to_partner';
    const STATUS_OFFER_RECEIVED = 'offer_received';
    const STATUS_ENROLLED = 'student_enrolled';
    const STATUS_COMMISSION_PENDING = 'commission_pending';
    const STATUS_COMMISSION_PAID = 'commission_paid';
    const STATUS_REJECTED = 'rejected';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Calculate expected commission (10% of tuition by default)
     */
    public function calculateExpectedCommission(): float
    {
        if (!$this->tuition_fee) {
            return 0;
        }

        $percentage = $this->commission_percentage ?? 10.00;
        return round($this->tuition_fee * ($percentage / 100), 2);
    }

    /**
     * Update expected commission based on tuition
     */
    public function updateExpectedCommission(): self
    {
        $this->expected_commission = $this->calculateExpectedCommission();
        $this->commission_currency = $this->tuition_currency;
        $this->save();
        return $this;
    }

    /**
     * Get commission by application
     */
    public static function getByApplication(int $applicationId): ?self
    {
        return self::where('application_id', $applicationId)->first();
    }

    /**
     * Get all commissions by status
     */
    public static function getByStatus(string $status): array
    {
        return self::where('status', $status)
            ->orderBy('created_at', 'DESC')
            ->get()
            ->toArray();
    }

    /**
     * Get commissions summary for dashboard
     */
    public static function getDashboardSummary(): array
    {
        $db = self::getConnectionResolver()->connection();

        // Total expected commission (pending + enrolled)
        $expectedResult = $db->selectOne("
            SELECT SUM(expected_commission) as total
            FROM partner_commissions
            WHERE status IN ('submitted_to_partner', 'offer_received', 'student_enrolled', 'commission_pending')
        ");

        // Total received commission
        $receivedResult = $db->selectOne("
            SELECT SUM(actual_commission) as total
            FROM partner_commissions
            WHERE status = 'commission_paid'
        ");

        // Count by status
        $statusCounts = $db->select("
            SELECT status, COUNT(*) as count
            FROM partner_commissions
            GROUP BY status
        ");

        // This month's enrollments
        $monthlyEnrollments = $db->selectOne("
            SELECT COUNT(*) as count, SUM(expected_commission) as commission
            FROM partner_commissions
            WHERE status IN ('student_enrolled', 'commission_pending', 'commission_paid')
            AND enrolled_at >= DATE_FORMAT(NOW(), '%Y-%m-01')
        ");

        // By partner breakdown
        $byPartner = $db->select("
            SELECT
                p.name as partner_name,
                COUNT(pc.id) as total_applications,
                SUM(CASE WHEN pc.status = 'student_enrolled' THEN 1 ELSE 0 END) as enrollments,
                SUM(CASE WHEN pc.status = 'commission_paid' THEN pc.actual_commission ELSE 0 END) as paid_commission,
                SUM(CASE WHEN pc.status IN ('student_enrolled', 'commission_pending') THEN pc.expected_commission ELSE 0 END) as pending_commission
            FROM partners p
            LEFT JOIN partner_commissions pc ON p.id = pc.partner_id
            GROUP BY p.id, p.name
        ");

        return [
            'expected_total' => $expectedResult->total ?? 0,
            'received_total' => $receivedResult->total ?? 0,
            'status_counts' => $statusCounts,
            'monthly_enrollments' => [
                'count' => $monthlyEnrollments->count ?? 0,
                'commission' => $monthlyEnrollments->commission ?? 0
            ],
            'by_partner' => $byPartner
        ];
    }

    /**
     * Create commission record when application is assigned to partner
     */
    public static function createFromApplication(
        int $applicationId,
        int $userId,
        int $partnerId,
        string $universityName,
        ?string $programName = null,
        ?float $tuitionFee = null,
        string $tuitionCurrency = 'USD'
    ): self {
        $commission = self::create([
            'application_id' => $applicationId,
            'user_id' => $userId,
            'partner_id' => $partnerId,
            'university_name' => $universityName,
            'program_name' => $programName,
            'status' => self::STATUS_PENDING,
            'tuition_fee' => $tuitionFee,
            'tuition_currency' => $tuitionCurrency,
            'commission_percentage' => 10.00, // Default 10%
        ]);

        if ($tuitionFee) {
            $commission->updateExpectedCommission();
        }

        return $commission;
    }

    /**
     * Update status with automatic timestamp
     */
    public function updateStatus(string $newStatus, ?string $notes = null): self
    {
        $this->status = $newStatus;

        // Set appropriate timestamp
        switch ($newStatus) {
            case self::STATUS_SUBMITTED:
                $this->submitted_at = now();
                break;
            case self::STATUS_OFFER_RECEIVED:
                $this->offer_received_at = now();
                break;
            case self::STATUS_ENROLLED:
                $this->enrolled_at = now();
                break;
            case self::STATUS_COMMISSION_PAID:
                $this->commission_received_at = now();
                break;
        }

        if ($notes) {
            $this->notes = ($this->notes ? $this->notes . "\n" : '') .
                           date('Y-m-d H:i') . ": " . $notes;
        }

        $this->save();
        return $this;
    }

    /**
     * Mark commission as paid
     */
    public function markAsPaid(float $actualAmount, ?string $notes = null): self
    {
        $this->actual_commission = $actualAmount;
        $this->updateStatus(self::STATUS_COMMISSION_PAID, $notes);
        return $this;
    }
}

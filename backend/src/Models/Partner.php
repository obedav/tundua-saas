<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Partner Model
 * ApplyBoard, Edvoy, BPP Education, etc.
 */
class Partner extends Model
{
    protected $table = 'partners';

    protected $fillable = [
        'name',
        'slug',
        'website',
        'commission_type',
        'default_commission_amount',
        'commission_currency',
        'notes',
        'is_active'
    ];

    protected $casts = [
        'default_commission_amount' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get all active partners
     */
    public static function getActive(): array
    {
        return self::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    /**
     * Get partner by slug
     */
    public static function getBySlug(string $slug): ?self
    {
        return self::where('slug', $slug)->first();
    }

    /**
     * Get partner statistics
     */
    public function getStatistics(): array
    {
        $db = self::getConnectionResolver()->connection();

        $stats = $db->selectOne("
            SELECT
                COUNT(*) as total_applications,
                SUM(CASE WHEN status = 'student_enrolled' THEN 1 ELSE 0 END) as total_enrolled,
                SUM(CASE WHEN status = 'commission_paid' THEN 1 ELSE 0 END) as commissions_paid,
                SUM(CASE WHEN status = 'commission_paid' THEN actual_commission ELSE 0 END) as total_earned,
                SUM(CASE WHEN status IN ('student_enrolled', 'commission_pending') THEN expected_commission ELSE 0 END) as pending_commission
            FROM partner_commissions
            WHERE partner_id = ?
        ", [$this->id]);

        return [
            'total_applications' => $stats->total_applications ?? 0,
            'total_enrolled' => $stats->total_enrolled ?? 0,
            'commissions_paid' => $stats->commissions_paid ?? 0,
            'total_earned' => $stats->total_earned ?? 0,
            'pending_commission' => $stats->pending_commission ?? 0,
            'conversion_rate' => $stats->total_applications > 0
                ? round(($stats->total_enrolled / $stats->total_applications) * 100, 1)
                : 0
        ];
    }
}

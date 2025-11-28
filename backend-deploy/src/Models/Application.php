<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Capsule\Manager as DB;

class Application extends Model
{
    protected $table = 'applications';

    protected $fillable = [
        'reference_number',
        'user_id',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'first_name',
        'last_name',
        'date_of_birth',
        'nationality',
        'passport_number',
        'current_country',
        'current_city',
        'highest_education',
        'field_of_study',
        'institution_name',
        'graduation_year',
        'gpa',
        'gpa_scale',
        'english_test_type',
        'english_test_score',
        'destination_country',
        'universities',
        'program_type',
        'intended_major',
        'intake_season',
        'intake_year',
        'service_tier_id',
        'service_tier_name',
        'base_price',
        'addon_services',
        'addon_total',
        'documents_complete',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'currency',
        'payment_status',
        'payment_id',
        'paid_at',
        'status',
        'current_step',
        'completion_percentage',
        'assigned_to',
        'admin_notes',
        'internal_notes',
        'rejection_reason',
        'submitted_at',
        'reviewed_at',
        'approved_at',
        'completed_at',
        'cancelled_at'
    ];

    protected $casts = [
        'universities' => 'array',
        'addon_services' => 'array',
        'base_price' => 'decimal:2',
        'addon_total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'documents_complete' => 'boolean',
        'current_step' => 'integer',
        'completion_percentage' => 'integer',
        'date_of_birth' => 'date',
        'paid_at' => 'datetime',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Create a new application
     */
    public static function createApplication(array $data): ?self
    {
        try {
            // Generate unique reference number
            $data['reference_number'] = self::generateReferenceNumber();

            // Map frontend fields to backend fields
            if (isset($data['email']) && !isset($data['applicant_email'])) {
                $data['applicant_email'] = $data['email'];
                unset($data['email']);
            }

            if (isset($data['phone']) && !isset($data['applicant_phone'])) {
                $data['applicant_phone'] = $data['phone'];
                unset($data['phone']);
            }

            // Combine first_name and last_name into applicant_name if not already set
            if ((isset($data['first_name']) || isset($data['last_name'])) && !isset($data['applicant_name'])) {
                $firstName = $data['first_name'] ?? '';
                $lastName = $data['last_name'] ?? '';
                $data['applicant_name'] = trim("$firstName $lastName");
            }

            // Set default values
            $data['status'] = $data['status'] ?? 'draft';
            $data['current_step'] = $data['current_step'] ?? 1;
            $data['completion_percentage'] = 0;
            $data['currency'] = $data['currency'] ?? 'NGN';
            $data['payment_status'] = 'pending';

            return self::create($data);
        } catch (\Exception $e) {
            error_log("Error creating application: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Generate unique reference number (format: TUND-YYYYMMDD-XXXX)
     */
    private static function generateReferenceNumber(): string
    {
        $prefix = 'TUND';
        $date = date('Ymd');

        // Get count of applications today
        $count = self::whereDate('created_at', date('Y-m-d'))->count() + 1;
        $sequence = str_pad($count, 4, '0', STR_PAD_LEFT);

        return "{$prefix}-{$date}-{$sequence}";
    }

    /**
     * Get applications by user ID
     */
    public static function getByUserId(int $userId, ?string $status = null): array
    {
        try {
            $query = self::where('user_id', $userId);

            if ($status) {
                $query->where('status', $status);
            }

            return $query->orderBy('created_at', 'DESC')->get()->toArray();
        } catch (\Exception $e) {
            error_log("Error getting applications: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get application by ID
     */
    public static function getById(int $id): ?self
    {
        try {
            return self::find($id);
        } catch (\Exception $e) {
            error_log("Error getting application: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get application by reference number
     */
    public static function getByReferenceNumber(string $referenceNumber): ?self
    {
        try {
            return self::where('reference_number', $referenceNumber)->first();
        } catch (\Exception $e) {
            error_log("Error getting application: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Update application
     */
    public static function updateApplication(int $id, array $data): bool
    {
        try {
            $application = self::find($id);

            if (!$application) {
                return false;
            }

            // Map frontend fields to backend fields
            if (isset($data['email']) && !isset($data['applicant_email'])) {
                $data['applicant_email'] = $data['email'];
                unset($data['email']);
            }

            if (isset($data['phone']) && !isset($data['applicant_phone'])) {
                $data['applicant_phone'] = $data['phone'];
                unset($data['phone']);
            }

            // Combine first_name and last_name into applicant_name if not already set
            if ((isset($data['first_name']) || isset($data['last_name'])) && !isset($data['applicant_name'])) {
                $firstName = $data['first_name'] ?? $application->first_name ?? '';
                $lastName = $data['last_name'] ?? $application->last_name ?? '';
                $data['applicant_name'] = trim("$firstName $lastName");
            }

            // Update completion percentage based on filled fields
            if (isset($data['current_step'])) {
                $data['completion_percentage'] = self::calculateCompletionPercentage($data['current_step']);
            }

            $application->update($data);
            return true;
        } catch (\Exception $e) {
            error_log("Error updating application: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Calculate completion percentage based on step
     */
    private static function calculateCompletionPercentage(int $step): int
    {
        $percentages = [
            1 => 16,  // Step 1: Personal Info
            2 => 33,  // Step 2: Academic Background
            3 => 50,  // Step 3: Universities
            4 => 66,  // Step 4: Service Tier
            5 => 83,  // Step 5: Add-ons
            6 => 100  // Step 6: Review & Submit
        ];

        return $percentages[$step] ?? 0;
    }

    /**
     * Submit application (mark as submitted, ready for payment)
     */
    public static function submitApplication(int $id): bool
    {
        try {
            $application = self::find($id);

            if (!$application) {
                error_log("Error submitting application: Application with ID {$id} not found");
                return false;
            }

            $application->status = 'payment_pending';
            $application->submitted_at = \Carbon\Carbon::now();
            $application->completion_percentage = 100;
            $application->save();

            return true;
        } catch (\Exception $e) {
            error_log("Error submitting application: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return false;
        }
    }

    /**
     * Mark application as paid
     */
    public static function markAsPaid(int $id, int $paymentId): bool
    {
        try {
            $application = self::find($id);

            if (!$application) {
                error_log("Error marking application as paid: Application with ID {$id} not found");
                return false;
            }

            $application->payment_status = 'paid';
            $application->payment_id = $paymentId;
            $application->paid_at = \Carbon\Carbon::now();
            $application->status = 'submitted';
            $application->save();

            return true;
        } catch (\Exception $e) {
            error_log("Error marking application as paid: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return false;
        }
    }

    /**
     * Delete application (only drafts can be deleted)
     */
    public static function deleteApplication(int $id): bool
    {
        try {
            $application = self::find($id);

            if (!$application) {
                return false;
            }

            // Only allow deletion of draft applications
            if ($application->status !== 'draft') {
                return false;
            }

            return $application->delete();
        } catch (\Exception $e) {
            error_log("Error deleting application: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all applications (admin)
     */
    public static function getAllApplications(?string $status = null, int $page = 1, int $perPage = 20): array
    {
        try {
            $query = self::query();

            if ($status) {
                $query->where('status', $status);
            }

            $total = $query->count();
            $applications = $query
                ->orderBy('created_at', 'DESC')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get()
                ->toArray();

            return [
                'applications' => $applications,
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'total_pages' => ceil($total / $perPage)
            ];
        } catch (\Exception $e) {
            error_log("Error getting all applications: " . $e->getMessage());
            return [
                'applications' => [],
                'total' => 0,
                'page' => 1,
                'per_page' => $perPage,
                'total_pages' => 0
            ];
        }
    }

    /**
     * Update application status (admin)
     */
    public static function updateStatus(int $id, string $status, ?string $notes = null): bool
    {
        try {
            $application = self::find($id);

            if (!$application) {
                error_log("Error updating application status: Application with ID {$id} not found");
                return false;
            }

            $application->status = $status;

            if ($notes) {
                $application->admin_notes = $notes;
            }

            // Set timestamp based on status
            switch ($status) {
                case 'under_review':
                    $application->reviewed_at = \Carbon\Carbon::now();
                    break;
                case 'approved':
                    $application->approved_at = \Carbon\Carbon::now();
                    break;
                case 'completed':
                    $application->completed_at = \Carbon\Carbon::now();
                    break;
                case 'cancelled':
                    $application->cancelled_at = \Carbon\Carbon::now();
                    break;
            }

            $application->save();
            return true;
        } catch (\Exception $e) {
            error_log("Error updating application status: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return false;
        }
    }

    /**
     * Get application statistics
     */
    public static function getStatistics(?int $userId = null): array
    {
        try {
            $query = self::query();

            if ($userId) {
                $query->where('user_id', $userId);
            }

            $total = $query->count();
            $draft = (clone $query)->where('status', 'draft')->count();
            $submitted = (clone $query)->whereIn('status', ['submitted', 'under_review', 'in_progress'])->count();
            $completed = (clone $query)->where('status', 'completed')->count();
            $cancelled = (clone $query)->where('status', 'cancelled')->count();
            $pendingPayment = (clone $query)->where('payment_status', 'pending')->count();
            $paid = (clone $query)->where('payment_status', 'paid')->count();

            $totalRevenue = self::where('payment_status', 'paid')->sum('total_amount');

            return [
                'total' => $total,
                'draft' => $draft,
                'submitted' => $submitted,
                'completed' => $completed,
                'cancelled' => $cancelled,
                'pending_payment' => $pendingPayment,
                'paid' => $paid,
                'total_revenue' => (float) $totalRevenue
            ];
        } catch (\Exception $e) {
            error_log("Error getting statistics: " . $e->getMessage());
            return [
                'total' => 0,
                'draft' => 0,
                'submitted' => 0,
                'completed' => 0,
                'cancelled' => 0,
                'pending_payment' => 0,
                'paid' => 0,
                'total_revenue' => 0.0
            ];
        }
    }

    /**
     * Clean up expired draft applications (called by cron)
     */
    public static function cleanupExpiredDrafts(): int
    {
        try {
            return self::where('auto_delete_at', '<=', date('Y-m-d H:i:s'))
                ->where('payment_status', 'pending')
                ->whereIn('status', ['draft', 'payment_pending'])
                ->delete();
        } catch (\Exception $e) {
            error_log("Error cleaning up expired drafts: " . $e->getMessage());
            return 0;
        }
    }
}

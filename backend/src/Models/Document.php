<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $table = 'documents';

    protected $fillable = [
        'application_id',
        'user_id',
        'document_type',
        'document_name',
        'original_filename',
        'file_path',
        'file_size',
        'mime_type',
        'file_extension',
        'is_verified',
        'verified_by',
        'verified_at',
        'verification_notes',
        'status',
        'rejection_reason',
        'metadata',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'file_size' => 'integer',
        'metadata' => 'array',
        'verified_at' => 'datetime',
        'uploaded_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const CREATED_AT = 'uploaded_at';
    const UPDATED_AT = 'updated_at';

    // Document types
    const TYPE_PASSPORT = 'passport';
    const TYPE_TRANSCRIPT = 'transcript';
    const TYPE_DEGREE_CERTIFICATE = 'degree_certificate';
    const TYPE_RECOMMENDATION_LETTER = 'recommendation_letter';
    const TYPE_PERSONAL_STATEMENT = 'personal_statement';
    const TYPE_CV_RESUME = 'cv_resume';
    const TYPE_ENGLISH_TEST = 'english_test_certificate';
    const TYPE_FINANCIAL_DOCUMENT = 'financial_document';
    const TYPE_OTHER = 'other';

    // Status types
    const STATUS_PENDING = 'pending';
    const STATUS_UNDER_REVIEW = 'under_review';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_NEEDS_REVISION = 'needs_revision';

    /**
     * Get the application that owns the document
     */
    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the user that uploaded the document
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who verified the document
     */
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Check if document can be deleted
     */
    public function canBeDeleted(): bool
    {
        return !$this->is_verified && $this->status !== self::STATUS_APPROVED;
    }

    /**
     * Get allowed document types
     */
    public static function getAllowedTypes(): array
    {
        return [
            self::TYPE_PASSPORT,
            self::TYPE_TRANSCRIPT,
            self::TYPE_DEGREE_CERTIFICATE,
            self::TYPE_RECOMMENDATION_LETTER,
            self::TYPE_PERSONAL_STATEMENT,
            self::TYPE_CV_RESUME,
            self::TYPE_ENGLISH_TEST,
            self::TYPE_FINANCIAL_DOCUMENT,
            self::TYPE_OTHER,
        ];
    }

    /**
     * Get allowed file extensions
     */
    public static function getAllowedExtensions(): array
    {
        return ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
    }

    /**
     * Get max file size in bytes (10MB)
     */
    public static function getMaxFileSize(): int
    {
        return 10485760; // 10MB
    }
}

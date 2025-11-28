<?php

namespace Tundua\Services;

use Respect\Validation\Validator as v;

/**
 * Validation Service
 *
 * Comprehensive input validation using Respect/Validation
 *
 * Features:
 * - Pre-built validation rules for common inputs
 * - XSS prevention
 * - SQL injection prevention
 * - File upload validation
 * - Custom error messages
 */
class ValidationService
{
    /**
     * Validate user registration data
     */
    public static function validateRegistration(array $data): array
    {
        $errors = [];

        // First name
        if (!isset($data['first_name']) || empty(trim($data['first_name']))) {
            $errors['first_name'] = 'First name is required';
        } elseif (!v::alpha(' ')->length(2, 50)->validate($data['first_name'])) {
            $errors['first_name'] = 'First name must be 2-50 characters and contain only letters';
        }

        // Last name
        if (!isset($data['last_name']) || empty(trim($data['last_name']))) {
            $errors['last_name'] = 'Last name is required';
        } elseif (!v::alpha(' ')->length(2, 50)->validate($data['last_name'])) {
            $errors['last_name'] = 'Last name must be 2-50 characters and contain only letters';
        }

        // Email
        if (!isset($data['email']) || empty(trim($data['email']))) {
            $errors['email'] = 'Email is required';
        } elseif (!v::email()->validate($data['email'])) {
            $errors['email'] = 'Invalid email format';
        }

        // Password
        if (!isset($data['password']) || empty($data['password'])) {
            $errors['password'] = 'Password is required';
        } else {
            $passwordValidation = self::validatePassword($data['password']);
            if (!empty($passwordValidation)) {
                $errors['password'] = $passwordValidation;
            }
        }

        // Phone (optional)
        if (isset($data['phone']) && !empty($data['phone'])) {
            if (!v::phone()->validate($data['phone'])) {
                $errors['phone'] = 'Invalid phone number format';
            }
        }

        return $errors;
    }

    /**
     * Validate password strength
     */
    public static function validatePassword(string $password): ?string
    {
        if (strlen($password) < 8) {
            return 'Password must be at least 8 characters long';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return 'Password must contain at least one uppercase letter';
        }

        if (!preg_match('/[a-z]/', $password)) {
            return 'Password must contain at least one lowercase letter';
        }

        if (!preg_match('/[0-9]/', $password)) {
            return 'Password must contain at least one number';
        }

        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            return 'Password must contain at least one special character';
        }

        return null;
    }

    /**
     * Validate login data
     */
    public static function validateLogin(array $data): array
    {
        $errors = [];

        if (!isset($data['email']) || empty(trim($data['email']))) {
            $errors['email'] = 'Email is required';
        } elseif (!v::email()->validate($data['email'])) {
            $errors['email'] = 'Invalid email format';
        }

        if (!isset($data['password']) || empty($data['password'])) {
            $errors['password'] = 'Password is required';
        }

        return $errors;
    }

    /**
     * Validate application data
     */
    public static function validateApplication(array $data): array
    {
        $errors = [];

        // Personal info validation
        if (isset($data['first_name']) && !v::alpha(' ')->length(2, 50)->validate($data['first_name'])) {
            $errors['first_name'] = 'First name must be 2-50 characters';
        }

        if (isset($data['last_name']) && !v::alpha(' ')->length(2, 50)->validate($data['last_name'])) {
            $errors['last_name'] = 'Last name must be 2-50 characters';
        }

        if (isset($data['email']) && !v::email()->validate($data['email'])) {
            $errors['email'] = 'Invalid email format';
        }

        if (isset($data['date_of_birth'])) {
            if (!v::date('Y-m-d')->validate($data['date_of_birth'])) {
                $errors['date_of_birth'] = 'Invalid date format (YYYY-MM-DD required)';
            } else {
                // Check age (must be at least 16)
                $dob = new \DateTime($data['date_of_birth']);
                $now = new \DateTime();
                $age = $now->diff($dob)->y;
                if ($age < 16) {
                    $errors['date_of_birth'] = 'Applicant must be at least 16 years old';
                }
            }
        }

        // Passport validation
        if (isset($data['passport_number']) && !v::alnum()->length(6, 20)->validate($data['passport_number'])) {
            $errors['passport_number'] = 'Invalid passport number format';
        }

        // Country codes
        if (isset($data['destination_country']) && !v::countryCode()->validate($data['destination_country'])) {
            $errors['destination_country'] = 'Invalid country code';
        }

        // GPA validation
        if (isset($data['gpa'])) {
            $gpa = floatval($data['gpa']);
            $scale = floatval($data['gpa_scale'] ?? 4.0);

            if ($gpa < 0 || $gpa > $scale) {
                $errors['gpa'] = "GPA must be between 0 and {$scale}";
            }
        }

        return $errors;
    }

    /**
     * Validate file upload
     */
    public static function validateFileUpload(array $file): array
    {
        $errors = [];

        // Check if file was uploaded
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            $errors['file'] = 'No file uploaded';
            return $errors;
        }

        // Check file size (max 10MB)
        $maxSize = (int)($_ENV['UPLOAD_MAX_SIZE'] ?? 10485760); // 10MB
        if ($file['size'] > $maxSize) {
            $errors['file'] = 'File size exceeds maximum allowed (' . ($maxSize / 1048576) . 'MB)';
        }

        // Check file type
        $allowedTypes = explode(',', $_ENV['ALLOWED_FILE_TYPES'] ?? 'pdf,jpg,jpeg,png,docx,doc');
        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($fileExtension, $allowedTypes)) {
            $errors['file'] = 'File type not allowed. Allowed types: ' . implode(', ', $allowedTypes);
        }

        // Check MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        $allowedMimes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!in_array($mimeType, $allowedMimes)) {
            $errors['file'] = 'Invalid file type detected';
        }

        return $errors;
    }

    /**
     * Sanitize input to prevent XSS
     */
    public static function sanitize(string $input): string
    {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Sanitize array of inputs
     */
    public static function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = self::sanitize($value);
            } elseif (is_array($value)) {
                $sanitized[$key] = self::sanitizeArray($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Validate email
     */
    public static function validateEmail(string $email): bool
    {
        return v::email()->validate($email);
    }

    /**
     * Validate UUID
     */
    public static function validateUuid(string $uuid): bool
    {
        return v::uuid()->validate($uuid);
    }

    /**
     * Validate phone number
     */
    public static function validatePhone(string $phone): bool
    {
        // Accept various formats
        return v::phone()->validate($phone) ||
               preg_match('/^\+?[1-9]\d{1,14}$/', $phone); // E.164 format
    }

    /**
     * Validate date
     */
    public static function validateDate(string $date, string $format = 'Y-m-d'): bool
    {
        return v::date($format)->validate($date);
    }

    /**
     * Validate URL
     */
    public static function validateUrl(string $url): bool
    {
        return v::url()->validate($url);
    }

    /**
     * Validate amount (monetary)
     */
    public static function validateAmount(float $amount, float $min = 0, float $max = PHP_FLOAT_MAX): bool
    {
        return v::floatVal()->min($min)->max($max)->validate($amount);
    }

    /**
     * Validate integer range
     */
    public static function validateIntRange(int $value, int $min, int $max): bool
    {
        return v::intVal()->min($min)->max($max)->validate($value);
    }

    /**
     * Check for SQL injection patterns
     */
    public static function containsSqlInjection(string $input): bool
    {
        $patterns = [
            '/(\bUNION\b.*\bSELECT\b)/i',
            '/(\bSELECT\b.*\bFROM\b)/i',
            '/(\bINSERT\b.*\bINTO\b)/i',
            '/(\bUPDATE\b.*\bSET\b)/i',
            '/(\bDELETE\b.*\bFROM\b)/i',
            '/(\bDROP\b.*\bTABLE\b)/i',
            '/(\bEXEC\b|\bEXECUTE\b)/i',
            '/(--|;|\/\*|\*\/)/i'
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check for XSS patterns
     */
    public static function containsXss(string $input): bool
    {
        $patterns = [
            '/<script\b[^>]*>.*?<\/script>/is',
            '/javascript:/i',
            '/on\w+\s*=/i', // onclick, onload, etc.
            '/<iframe\b[^>]*>/i',
            '/<object\b[^>]*>/i',
            '/<embed\b[^>]*>/i'
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validate and sanitize search query
     */
    public static function validateSearchQuery(string $query): array
    {
        $errors = [];

        // Check length
        if (strlen($query) < 2) {
            $errors['query'] = 'Search query must be at least 2 characters';
        }

        if (strlen($query) > 100) {
            $errors['query'] = 'Search query too long (max 100 characters)';
        }

        // Check for SQL injection
        if (self::containsSqlInjection($query)) {
            $errors['query'] = 'Invalid search query';
        }

        // Sanitize
        $sanitized = self::sanitize($query);

        return [
            'errors' => $errors,
            'sanitized' => $sanitized
        ];
    }
}

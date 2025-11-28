<?php

namespace Tundua\Controllers;

use PDO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\UploadedFileInterface;
use Tundua\Database\Database;
use Tundua\Models\Document;
use Tundua\Models\Application;

class DocumentController
{
    private $db;
    private $storagePath;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->storagePath = __DIR__ . '/../../' . ($_ENV['DOCUMENTS_STORAGE_PATH'] ?? 'storage/documents');

        // Create storage directory if it doesn't exist
        if (!is_dir($this->storagePath)) {
            mkdir($this->storagePath, 0755, true);
        }
    }

    /**
     * Upload a document
     * POST /api/documents/upload
     */
    public function upload(Request $request, Response $response): Response
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

            /** @var UploadedFileInterface $uploadedFile */
            $uploadedFile = $uploadedFiles['file'];

            // Validate required fields
            $applicationId = $data['application_id'] ?? null;
            $documentType = $data['document_type'] ?? null;
            $documentName = $data['document_name'] ?? null;

            if (!$applicationId || !$documentType) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application ID and document type are required'
                ]));
                return $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application ID and document type are required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Check if application exists and belongs to user
            $userId = $request->getAttribute('user_id');
            $application = Application::where('id', $applicationId)
                ->where('user_id', $userId)
                ->first();

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found or access denied'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Validate file
            if ($uploadedFile->getError() !== UPLOAD_ERR_OK) {
                throw new \Exception('File upload error');
            }

            $fileSize = $uploadedFile->getSize();
            $maxSize = Document::getMaxFileSize();
            if ($fileSize > $maxSize) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'File size exceeds maximum allowed size of ' . ($maxSize / 1024 / 1024) . 'MB'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $originalFilename = $uploadedFile->getClientFilename();
            $fileExtension = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));

            if (!in_array($fileExtension, Document::getAllowedExtensions())) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'File type not allowed. Allowed types: ' . implode(', ', Document::getAllowedExtensions())
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Generate unique filename
            $filename = uniqid('doc_') . '_' . time() . '.' . $fileExtension;
            $filePath = $this->storagePath . '/' . $filename;

            // Move uploaded file
            $uploadedFile->moveTo($filePath);

            // Create document record
            $document = Document::create([
                'application_id' => $applicationId,
                'user_id' => $userId,
                'document_type' => $documentType,
                'document_name' => $documentName ?: $originalFilename,
                'original_filename' => $originalFilename,
                'file_path' => $filename, // Store relative path
                'file_size' => $fileSize,
                'mime_type' => $uploadedFile->getClientMediaType(),
                'file_extension' => $fileExtension,
                'status' => Document::STATUS_PENDING,
            ]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'document' => [
                    'id' => $document->id,
                    'document_type' => $document->document_type,
                    'document_name' => $document->document_name,
                    'file_size' => $document->file_size,
                    'status' => $document->status,
                    'uploaded_at' => $document->uploaded_at->toIso8601String(),
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
     * Get all documents for an application
     * GET /api/documents/application/{id}
     */
    public function getApplicationDocuments(Request $request, Response $response, array $args): Response
    {
        try {
            $applicationId = $args['id'] ?? null;
            $userId = $request->getAttribute('user_id');

            // Verify application belongs to user
            $application = Application::where('id', $applicationId)
                ->where('user_id', $userId)
                ->first();

            if (!$application) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Application not found or access denied'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $documents = Document::where('application_id', $applicationId)
                ->orderBy('uploaded_at', 'desc')
                ->get();

            $documentsData = $documents->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'document_type' => $doc->document_type,
                    'document_name' => $doc->document_name,
                    'original_filename' => $doc->original_filename,
                    'file_size' => $doc->file_size,
                    'file_extension' => $doc->file_extension,
                    'status' => $doc->status,
                    'is_verified' => $doc->is_verified,
                    'verification_notes' => $doc->verification_notes,
                    'uploaded_at' => $doc->uploaded_at->toIso8601String(),
                ];
            });

            $response->getBody()->write(json_encode([
                'success' => true,
                'documents' => $documentsData
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
     * Get document details
     * GET /api/documents/{id}
     */
    public function getDocument(Request $request, Response $response, array $args): Response
    {
        try {
            $documentId = $args['id'] ?? null;
            $userId = $request->getAttribute('user_id');

            $document = Document::where('id', $documentId)
                ->where('user_id', $userId)
                ->first();

            if (!$document) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Document not found or access denied'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'document' => [
                    'id' => $document->id,
                    'application_id' => $document->application_id,
                    'document_type' => $document->document_type,
                    'document_name' => $document->document_name,
                    'original_filename' => $document->original_filename,
                    'file_size' => $document->file_size,
                    'file_extension' => $document->file_extension,
                    'mime_type' => $document->mime_type,
                    'status' => $document->status,
                    'is_verified' => $document->is_verified,
                    'verification_notes' => $document->verification_notes,
                    'uploaded_at' => $document->uploaded_at->toIso8601String(),
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
     * Download document
     * GET /api/documents/{id}/download
     */
    public function download(Request $request, Response $response, array $args): Response
    {
        try {
            $documentId = $args['id'] ?? null;
            $userId = $request->getAttribute('user_id');
            $userRole = $request->getAttribute('user_role');

            // Allow admins to download any document, users can only download their own
            if ($userRole === 'admin') {
                $document = Document::find($documentId);
            } else {
                $document = Document::where('id', $documentId)
                    ->where('user_id', $userId)
                    ->first();
            }

            if (!$document) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Document not found or access denied'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $filePath = $this->storagePath . '/' . $document->file_path;

            if (!file_exists($filePath)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'File not found on server'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $fileContent = file_get_contents($filePath);
            $response->getBody()->write($fileContent);

            return $response
                ->withHeader('Content-Type', $document->mime_type)
                ->withHeader('Content-Disposition', 'attachment; filename="' . $document->original_filename . '"')
                ->withHeader('Content-Length', (string)$document->file_size);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete document
     * DELETE /api/documents/{id}
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $documentId = $args['id'] ?? null;
            $userId = $request->getAttribute('user_id');

            $document = Document::where('id', $documentId)
                ->where('user_id', $userId)
                ->first();

            if (!$document) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Document not found or access denied'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Check if document can be deleted
            if (!$document->canBeDeleted()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Cannot delete verified or approved documents'
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Delete file from storage
            $filePath = $this->storagePath . '/' . $document->file_path;
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Delete database record
            $document->delete();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Document deleted successfully'
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
     * Get document types
     * GET /api/documents/types
     */
    public function getDocumentTypes(Request $request, Response $response): Response
    {
        $types = [
            ['value' => Document::TYPE_PASSPORT, 'label' => 'Passport / ID'],
            ['value' => Document::TYPE_TRANSCRIPT, 'label' => 'Academic Transcript'],
            ['value' => Document::TYPE_DEGREE_CERTIFICATE, 'label' => 'Degree Certificate'],
            ['value' => Document::TYPE_RECOMMENDATION_LETTER, 'label' => 'Recommendation Letter'],
            ['value' => Document::TYPE_PERSONAL_STATEMENT, 'label' => 'Personal Statement / Essay'],
            ['value' => Document::TYPE_CV_RESUME, 'label' => 'CV / Resume'],
            ['value' => Document::TYPE_ENGLISH_TEST, 'label' => 'English Test Certificate (IELTS/TOEFL)'],
            ['value' => Document::TYPE_FINANCIAL_DOCUMENT, 'label' => 'Financial Document / Bank Statement'],
            ['value' => Document::TYPE_OTHER, 'label' => 'Other Document'],
        ];

        $response->getBody()->write(json_encode([
            'success' => true,
            'document_types' => $types
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Get pending documents for admin review
     * GET /api/admin/documents/pending
     */
    public function getPendingDocuments(Request $request, Response $response): Response
    {
        try {
            // Get documents with application relationship only
            $documents = Document::whereIn('status', [Document::STATUS_PENDING, Document::STATUS_UNDER_REVIEW])
                ->with(['application'])
                ->orderBy('uploaded_at', 'asc')
                ->get();

            // Get database connection for fetching user data
            $db = \Tundua\Database\Database::getConnection();

            $documentsData = $documents->map(function ($doc) use ($db) {
                // Fetch user data separately using raw query
                $userName = null;
                if ($doc->user_id) {
                    $stmt = $db->prepare("SELECT first_name, last_name FROM users WHERE id = ?");
                    $stmt->execute([$doc->user_id]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($user) {
                        $userName = "{$user['first_name']} {$user['last_name']}";
                    }
                }

                return [
                    'id' => $doc->id,
                    'application_id' => $doc->application_id,
                    'application_reference' => $doc->application->reference_number ?? null,
                    'user_name' => $userName,
                    'document_type' => $doc->document_type,
                    'document_name' => $doc->document_name,
                    'original_filename' => $doc->original_filename,
                    'file_size' => $doc->file_size,
                    'file_extension' => $doc->file_extension,
                    'status' => $doc->status,
                    'uploaded_at' => $doc->uploaded_at->toIso8601String(),
                ];
            });

            $response->getBody()->write(json_encode([
                'success' => true,
                'documents' => $documentsData
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            error_log("getPendingDocuments error: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Download document (admin only)
     * GET /api/admin/documents/{id}/download
     */
    public function adminDownload(Request $request, Response $response, array $args): Response
    {
        try {
            $documentId = $args['id'] ?? null;

            $document = Document::find($documentId);

            if (!$document) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Document not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $filePath = $this->storagePath . '/' . $document->file_path;

            if (!file_exists($filePath)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'File not found on server'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $fileContent = file_get_contents($filePath);
            $response->getBody()->write($fileContent);

            return $response
                ->withHeader('Content-Type', $document->mime_type)
                ->withHeader('Content-Disposition', 'inline; filename="' . $document->original_filename . '"')
                ->withHeader('Content-Length', (string)$document->file_size);
        } catch (\Exception $e) {
            error_log("Admin download error: " . $e->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Review a document (admin only)
     * PUT /api/admin/documents/{id}/review
     */
    public function reviewDocument(Request $request, Response $response, array $args): Response
    {
        try {
            $documentId = $args['id'] ?? null;
            $data = $request->getParsedBody();
            $adminId = $request->getAttribute('user_id');

            $document = Document::find($documentId);

            if (!$document) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Document not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $status = $data['status'] ?? null;
            $notes = $data['notes'] ?? null;

            if (!$status || !in_array($status, [
                Document::STATUS_APPROVED,
                Document::STATUS_REJECTED,
                Document::STATUS_NEEDS_REVISION,
                Document::STATUS_UNDER_REVIEW
            ])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid status'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Update document
            $document->status = $status;
            $document->verification_notes = $notes;

            if ($status === Document::STATUS_APPROVED) {
                $document->is_verified = true;
                $document->verified_by = $adminId;
                $document->verified_at = date('Y-m-d H:i:s');
            } elseif ($status === Document::STATUS_REJECTED) {
                $document->rejection_reason = $notes;
            }

            $document->save();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Document review completed',
                'document' => [
                    'id' => $document->id,
                    'status' => $document->status,
                    'is_verified' => $document->is_verified,
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
}

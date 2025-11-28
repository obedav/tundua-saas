"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  Download,
  Trash2,
  Eye,
  AlertCircle,
  Clock,
  XCircle,
  Image as ImageIcon,
  FileCheck,
  Loader2,
  RefreshCw,
  Camera,
  Crop,
  ZoomIn,
  Shield,
  FileWarning,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { validateDocumentQuality, getQualityLabel, type QualityCheckResult } from "@/lib/document-quality";

interface Document {
  id: number;
  document_type: string;
  document_name: string;
  original_filename: string;
  file_size: number;
  file_extension: string;
  status: string;
  is_verified: boolean;
  verification_notes?: string;
  uploaded_at: string;
}

interface DocumentType {
  value: string;
  label: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error' | 'checking';
  error?: string;
  preview?: string;
  qualityCheck?: QualityCheckResult;
}

interface EnhancedDocumentManagerProps {
  applicationId: number;
  onDocumentsChange?: (documents: Document[]) => void;
}

export default function EnhancedDocumentManager({
  applicationId,
  onDocumentsChange,
}: EnhancedDocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, UploadingFile>>(new Map());
  const [dragActive, setDragActive] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Document | null>(null);
  const [liveRegionMessage, setLiveRegionMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);

  // Announce message to screen readers
  const announce = (message: string) => {
    setLiveRegionMessage(message);
    setTimeout(() => setLiveRegionMessage(""), 1000);
  };

  useEffect(() => {
    fetchDocuments();
    fetchDocumentTypes();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.getApplicationDocuments(applicationId);
      const docs = response.data?.documents || [];
      setDocuments(docs);
      onDocumentsChange?.(docs);
      announce(`Loaded ${docs.length} documents`);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
      announce("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await apiClient.getDocumentTypes();
      setDocumentTypes(response.data?.document_types || []);
    } catch (error: any) {
      console.error("Error fetching document types:", error);
    }
  };

  // Generate preview for images
  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  // Compress image if needed
  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) return file;
    if (file.size < 1024 * 1024) return file; // Skip if less than 1MB

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;
          const maxDimension = 1920;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            file.type,
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Enhanced validation with MIME type checking and security
  const validateFile = async (file: File): Promise<{ valid: boolean; error?: string; warning?: string }> => {
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Define allowed MIME types with their extensions
    const allowedTypes = {
      'application/pdf': ['pdf'],
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'application/msword': ['doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
      'image/webp': ['webp'], // Modern format support
    };

    const extension = file.name.split('.').pop()?.toLowerCase();

    // Size validation
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    // Minimum size check (avoid empty files or suspicious tiny files)
    if (file.size < 100) {
      return { valid: false, error: 'File is too small or corrupted' };
    }

    // MIME type validation (security enhancement)
    const validMimeTypes = Object.keys(allowedTypes);
    if (!validMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: PDF, JPG, PNG, DOCX, WebP (Detected: ${file.type || 'unknown'})`
      };
    }

    // Cross-check extension with MIME type
    const expectedExtensions = allowedTypes[file.type as keyof typeof allowedTypes];
    if (!extension || !expectedExtensions?.includes(extension)) {
      return {
        valid: false,
        error: 'File extension does not match file type. This may indicate file tampering.'
      };
    }

    // File signature validation (magic bytes) for images
    if (file.type.startsWith('image/')) {
      try {
        const buffer = await file.slice(0, 12).arrayBuffer();
        const bytes = new Uint8Array(buffer);

        // Check magic bytes
        const signatures = {
          jpeg: [0xFF, 0xD8, 0xFF],
          png: [0x89, 0x50, 0x4E, 0x47],
          webp: [0x52, 0x49, 0x46, 0x46], // "RIFF"
        };

        let validSignature = false;
        if (file.type === 'image/jpeg' && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
          validSignature = true;
        } else if (file.type === 'image/png' && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
          validSignature = true;
        } else if (file.type === 'image/webp' && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
          validSignature = true;
        }

        if (!validSignature) {
          return {
            valid: false,
            error: 'File appears to be corrupted or not a valid image file'
          };
        }
      } catch (error) {
        console.error('File signature check failed:', error);
        return {
          valid: true,
          warning: 'Could not verify file integrity, but proceeding with upload'
        };
      }
    }

    // PDF signature check
    if (file.type === 'application/pdf') {
      try {
        const buffer = await file.slice(0, 5).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const signature = String.fromCharCode(...bytes);

        if (!signature.startsWith('%PDF')) {
          return {
            valid: false,
            error: 'File does not appear to be a valid PDF'
          };
        }
      } catch (error) {
        console.error('PDF signature check failed:', error);
        return {
          valid: true,
          warning: 'Could not verify PDF integrity, but proceeding with upload'
        };
      }
    }

    return { valid: true };
  };

  const handleFileUpload = async (files: File[], documentType?: string) => {
    for (const file of files) {
      const validation = await validateFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`, {
          icon: <Shield className="h-4 w-4" />,
          duration: 5000,
        });
        continue;
      }

      // Show warning if present
      if (validation.warning) {
        toast.warning(`${file.name}: ${validation.warning}`, {
          icon: <FileWarning className="h-4 w-4" />,
        });
      }

      const fileId = `${file.name}-${Date.now()}`;
      const preview = await generatePreview(file);

      // Add to uploading state with checking status
      setUploadingFiles((prev) => {
        const newMap = new Map(prev);
        newMap.set(fileId, {
          file,
          progress: 0,
          status: 'checking',
          preview,
        });
        return newMap;
      });

      // Perform quality check for images
      let qualityCheck: QualityCheckResult | undefined;
      if (file.type.startsWith('image/')) {
        try {
          qualityCheck = await validateDocumentQuality(file);

          // Update with quality check results
          setUploadingFiles((prev) => {
            const newMap = new Map(prev);
            const current = newMap.get(fileId);
            if (current) {
              newMap.set(fileId, { ...current, qualityCheck });
            }
            return newMap;
          });

          // Show quality warnings
          if (qualityCheck.warnings.length > 0) {
            const qualityLabel = getQualityLabel(qualityCheck.score);
            toast.warning(
              `${file.name}: Quality ${qualityLabel.label} (${qualityCheck.score}%). ${qualityCheck.warnings[0]}`,
              {
                description: qualityCheck.suggestions[0],
                duration: 6000,
              }
            );
          }

          // Block upload if quality is very poor (optional - can be adjusted)
          if (qualityCheck.score < 40) {
            setUploadingFiles((prev) => {
              const newMap = new Map(prev);
              newMap.set(fileId, {
                file,
                progress: 0,
                status: 'error',
                error: `Quality too low (${qualityCheck?.score}%). ${qualityCheck?.suggestions[0] || 'Please upload a clearer image'}`,
                preview,
                qualityCheck,
              });
              return newMap;
            });
            toast.error(`${file.name}: Quality too low to upload`, {
              description: qualityCheck.suggestions[0] || 'Please upload a clearer image',
            });
            continue;
          }
        } catch (error) {
          console.error('Quality check failed:', error);
          // Continue with upload even if quality check fails
        }
      }

      // Update to uploading status
      setUploadingFiles((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(fileId);
        if (current) {
          newMap.set(fileId, { ...current, status: 'uploading', progress: 0 });
        }
        return newMap;
      });

      // Compress image if needed
      const processedFile = await compressImage(file);

      // Upload file
      try {
        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append('application_id', applicationId.toString());
        formData.append('document_type', documentType || 'other');
        formData.append('document_name', file.name);

        // Simulate progress (since apiClient doesn't support progress tracking)
        const progressInterval = setInterval(() => {
          setUploadingFiles((prev) => {
            const newMap = new Map(prev);
            const current = newMap.get(fileId);
            if (current && current.progress < 90) {
              newMap.set(fileId, { ...current, progress: current.progress + 10 });
            }
            return newMap;
          });
        }, 200);

        await apiClient.uploadDocument(formData);
        clearInterval(progressInterval);

        // Mark as success
        setUploadingFiles((prev) => {
          const newMap = new Map(prev);
          newMap.set(fileId, {
            file,
            progress: 100,
            status: 'success',
            preview,
          });
          return newMap;
        });

        // Remove from uploading after delay
        setTimeout(() => {
          setUploadingFiles((prev) => {
            const newMap = new Map(prev);
            newMap.delete(fileId);
            return newMap;
          });
        }, 2000);

        toast.success(`${file.name} uploaded successfully`);
        announce(`${file.name} uploaded successfully`);

        // Refresh documents list
        await fetchDocuments();
      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadingFiles((prev) => {
          const newMap = new Map(prev);
          newMap.set(fileId, {
            file,
            progress: 0,
            status: 'error',
            error: error.response?.data?.error || 'Upload failed',
            preview,
          });
          return newMap;
        });
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Show type selection modal if multiple files or no default type
      await handleFileUpload(files);
    }
  }, [applicationId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      await handleFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await apiClient.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async (doc: Document) => {
    setShowDeleteModal(doc);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;

    try {
      await apiClient.deleteDocument(showDeleteModal.id);
      toast.success('Document deleted successfully');
      announce(`Document ${showDeleteModal.document_name} deleted`);
      await fetchDocuments();
      setShowDeleteModal(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
      announce('Failed to delete document');
    }
  };

  const retryUpload = (fileId: string) => {
    const uploadingFile = uploadingFiles.get(fileId);
    if (uploadingFile) {
      setUploadingFiles((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileId);
        return newMap;
      });
      handleFileUpload([uploadingFile.file]);
    }
  };

  const getStatusIcon = (status: string, isVerified: boolean) => {
    if (isVerified || status === 'approved') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    const icons: Record<string, any> = {
      pending: <Clock className="h-4 w-4 text-yellow-600" />,
      under_review: <AlertCircle className="h-4 w-4 text-blue-600" />,
      rejected: <XCircle className="h-4 w-4 text-red-600" />,
      needs_revision: <AlertCircle className="h-4 w-4 text-orange-600" />,
    };
    return icons[status] || icons['pending'];
  };

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified || status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          {getStatusIcon(status, isVerified)}
          Approved
        </span>
      );
    }

    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      under_review: { color: 'bg-blue-100 text-blue-700', text: 'Under Review' },
      rejected: { color: 'bg-red-100 text-red-700', text: 'Rejected' },
      needs_revision: { color: 'bg-orange-100 text-orange-700', text: 'Needs Revision' },
    };

    const badge = badges[status] || badges['pending'];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {getStatusIcon(status, isVerified)}
        {badge.text}
      </span>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileIcon = (extension: string, preview?: string) => {
    if (preview) {
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          <img src={preview} alt="" className="w-full h-full object-cover" />
        </div>
      );
    }

    const iconClass = "h-6 w-6";
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase())) {
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <ImageIcon className={`${iconClass} text-blue-600`} />
        </div>
      );
    }
    if (extension.toLowerCase() === 'pdf') {
      return (
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <FileText className={`${iconClass} text-red-600`} />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <FileCheck className={`${iconClass} text-gray-600`} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6" role="region" aria-label="Document Management" aria-busy="true">
        {/* Skeleton for Upload Zone */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 animate-pulse">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-56 mx-auto" />
            </div>
          </div>
        </div>

        {/* Skeleton for Documents List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-5 bg-gray-200 rounded w-48" />
                      <div className="h-5 bg-gray-200 rounded w-20" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="flex items-center gap-4">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                      <div className="h-3 bg-gray-200 rounded w-16" />
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                    <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="sr-only">Loading documents...</span>
      </div>
    );
  }

  const uploadingArray = Array.from(uploadingFiles.entries());

  // Keyboard navigation for upload zone
  const handleUploadZoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Document Management">
      {/* ARIA Live Region for Screen Reader Announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveRegionMessage}
      </div>

      {/* Upload Zone */}
      <div
        ref={uploadZoneRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onKeyDown={handleUploadZoneKeyDown}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          dragActive
            ? 'border-primary-500 bg-primary-50 scale-[1.02]'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload documents. Press Enter or Space to select files, or drag and drop files here"
        aria-describedby="upload-help-text"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp,application/pdf,image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="sr-only"
          id="file-upload"
          aria-label="Choose files to upload"
        />

        <div className="text-center">
          <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            dragActive ? 'bg-primary-100' : 'bg-gray-100'
          }`}>
            <Upload className={`h-8 w-8 ${dragActive ? 'text-primary-600' : 'text-gray-400'}`} />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {dragActive ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop files or{' '}
            <label htmlFor="file-upload" className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
              browse
            </label>
          </p>
          <p className="text-xs text-gray-500" id="upload-help-text">
            Supported: PDF, JPG, PNG, DOCX, WebP • Max 10MB per file
          </p>
        </div>
      </div>

      {/* Uploading Files */}
      {uploadingArray.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading {uploadingArray.length} file(s)
          </h3>
          {uploadingArray.map(([fileId, { file, progress, status, error, preview, qualityCheck }]) => (
            <div key={fileId} className="space-y-2">
              <div className="flex items-center gap-3">
                {getFileIcon(file.name.split('.').pop() || '', preview)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    {qualityCheck && (
                      <span className={`font-medium ${getQualityLabel(qualityCheck.score).color}`}>
                        • Quality: {getQualityLabel(qualityCheck.score).label} ({qualityCheck.score}%)
                      </span>
                    )}
                  </div>
                </div>
                {status === 'checking' && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
                )}
                {status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                {status === 'error' && (
                  <button
                    onClick={() => retryUpload(fileId)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    aria-label="Retry upload"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
              {status === 'checking' && (
                <div className="text-xs text-blue-600 flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Checking document quality and security...
                </div>
              )}
              {status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Uploading ${progress}%`}
                  />
                </div>
              )}
              {status === 'error' && error && (
                <div className="text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {qualityCheck && qualityCheck.warnings.length > 0 && status !== 'error' && (
                <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="font-medium mb-1">Quality Warnings:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {qualityCheck.warnings.slice(0, 2).map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Uploaded Documents ({documents.length})
          </h2>
          <button
            onClick={fetchDocuments}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refresh documents list"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No documents uploaded yet</p>
            <p className="text-sm text-gray-500">
              Upload your first document using the upload zone above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-gray-50 transition-colors"
                role="article"
                aria-label={`Document: ${doc.document_name}`}
              >
                <div className="flex items-start gap-4">
                  {getFileIcon(doc.file_extension)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {doc.document_name}
                      </h3>
                      {getStatusBadge(doc.status, doc.is_verified)}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {documentTypes.find((t) => t.value === doc.document_type)?.label || doc.document_type}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{doc.original_filename}</span>
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    </div>

                    {doc.verification_notes && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        <strong>Note:</strong> {doc.verification_notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Download"
                      aria-label={`Download ${doc.document_name}`}
                    >
                      <Download className="h-5 w-5" />
                    </button>

                    {!doc.is_verified && doc.status !== 'approved' && (
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        aria-label={`Delete ${doc.document_name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="complementary">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Document Guidelines & Security</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Images are automatically compressed to optimize upload speed</li>
              <li>All documents must be clear and legible</li>
              <li>Maximum file size: 10MB per document</li>
              <li>All files are validated for security (MIME type, file signature)</li>
              <li>Supports: PDF, JPG, PNG, DOCX, WebP formats</li>
              <li>Documents are reviewed within 2-3 business days</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accessible Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(null);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 id="delete-modal-title" className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Document?
                </h2>
                <p id="delete-modal-description" className="text-sm text-gray-600">
                  Are you sure you want to delete "<strong>{showDeleteModal.document_name}</strong>"?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  FileCheck,
  Upload,
  Plus,
  X,
  Shield,
  FileWarning,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

interface Document {
  id: number;
  application_id: number;
  application_reference?: string;
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

interface Application {
  id: number;
  reference_number: string;
  destination_country: string;
  status: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function AllDocumentsManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Upload state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string>("");
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, UploadingFile>>(new Map());
  const [dragActive, setDragActive] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAllDocuments();
    fetchDocumentTypes();
  }, []);

  const fetchAllDocuments = async () => {
    try {
      setLoading(true);
      // Get all user applications first
      const appsResponse = await apiClient.getApplications();
      const apps = appsResponse.data?.applications || [];
      setApplications(apps);

      // Fetch documents for each application
      const allDocs: Document[] = [];
      for (const app of apps) {
        try {
          const docsResponse = await apiClient.getApplicationDocuments(app.id);
          const docs = docsResponse.data?.documents || [];

          // Add application reference to each document
          const docsWithRef = docs.map((doc: any) => ({
            ...doc,
            application_id: app.id,
            application_reference: app.reference_number,
          }));

          allDocs.push(...docsWithRef);
        } catch (error) {
          console.error(`Error fetching documents for application ${app.id}:`, error);
        }
      }

      // Sort by upload date (newest first)
      allDocs.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());

      setDocuments(allDocs);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      if (!showUploadForm) {
        setShowUploadForm(true);
      }
    }
  }, [showUploadForm]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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

    // Minimum size check
    if (file.size < 100) {
      return { valid: false, error: 'File is too small or corrupted' };
    }

    // MIME type validation
    const validMimeTypes = Object.keys(allowedTypes);
    if (!validMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: PDF, JPG, PNG, DOCX, WebP`
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

    return { valid: true };
  };

  const handleUpload = async () => {
    if (!selectedApplication) {
      toast.error("Please select an application");
      return;
    }

    if (!selectedDocType) {
      toast.error("Please select a document type");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    for (const file of selectedFiles) {
      const validation = await validateFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`, {
          icon: <Shield className="h-4 w-4" />,
          duration: 5000,
        });
        continue;
      }

      if (validation.warning) {
        toast.warning(`${file.name}: ${validation.warning}`, {
          icon: <FileWarning className="h-4 w-4" />,
        });
      }

      const fileId = `${file.name}-${Date.now()}`;

      setUploadingFiles((prev) => {
        const newMap = new Map(prev);
        newMap.set(fileId, {
          file,
          progress: 0,
          status: "uploading",
        });
        return newMap;
      });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("application_id", selectedApplication);
        formData.append("document_type", selectedDocType);
        formData.append("document_name", file.name);

        // Simulate progress
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

        setUploadingFiles((prev) => {
          const newMap = new Map(prev);
          newMap.set(fileId, {
            file,
            progress: 100,
            status: "success",
          });
          return newMap;
        });

        setTimeout(() => {
          setUploadingFiles((prev) => {
            const newMap = new Map(prev);
            newMap.delete(fileId);
            return newMap;
          });
        }, 2000);

        toast.success(`${file.name} uploaded successfully`);
      } catch (error: any) {
        console.error("Upload error:", error);
        setUploadingFiles((prev) => {
          const newMap = new Map(prev);
          newMap.set(fileId, {
            file,
            progress: 0,
            status: "error",
            error: error.response?.data?.error || "Upload failed",
          });
          return newMap;
        });
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    // Reset form after all uploads complete
    setTimeout(() => {
      setSelectedFiles([]);
      setSelectedApplication("");
      setSelectedDocType("");
      setShowUploadForm(false);
      fetchAllDocuments();
    }, 2500);
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await apiClient.getDocumentTypes();
      setDocumentTypes(response.data?.document_types || []);
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await apiClient.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async (doc: Document) => {
    setShowDeleteModal(doc);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;

    try {
      await apiClient.deleteDocument(showDeleteModal.id);
      toast.success("Document deleted successfully");
      await fetchAllDocuments();
      setShowDeleteModal(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.application_reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && (doc.is_verified || doc.status === "approved")) ||
      doc.status === statusFilter;

    const matchesType = typeFilter === "all" || doc.document_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string, isVerified: boolean) => {
    if (isVerified || status === "approved") {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    const icons: Record<string, any> = {
      pending: <Clock className="h-4 w-4 text-yellow-600" />,
      under_review: <AlertCircle className="h-4 w-4 text-blue-600" />,
      rejected: <XCircle className="h-4 w-4 text-red-600" />,
      needs_revision: <AlertCircle className="h-4 w-4 text-orange-600" />,
    };
    return icons[status] || icons["pending"];
  };

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified || status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          {getStatusIcon(status, isVerified)}
          Approved
        </span>
      );
    }

    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", text: "Pending" },
      under_review: { color: "bg-blue-100 text-blue-700", text: "Under Review" },
      rejected: { color: "bg-red-100 text-red-700", text: "Rejected" },
      needs_revision: { color: "bg-orange-100 text-orange-700", text: "Needs Revision" },
    };

    const badge = badges[status] || badges["pending"];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>
        {getStatusIcon(status, isVerified)}
        {badge?.text}
      </span>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileIcon = (extension: string) => {
    const iconClass = "h-6 w-6";
    if (["jpg", "jpeg", "png", "gif"].includes(extension.toLowerCase())) {
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <ImageIcon className={`${iconClass} text-blue-600`} />
        </div>
      );
    }
    if (extension.toLowerCase() === "pdf") {
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

  const getStats = () => {
    const total = documents.length;
    const approved = documents.filter((d) => d.is_verified || d.status === "approved").length;
    const pending = documents.filter((d) => d.status === "pending").length;
    const rejected = documents.filter((d) => d.status === "rejected").length;

    return { total, approved, pending, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-6" role="region" aria-label="All Documents" aria-busy="true">
        {/* Skeleton for Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton for Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg w-32" />
            <div className="h-10 bg-gray-200 rounded-lg w-32" />
            <div className="h-10 bg-gray-200 rounded-lg w-10" />
          </div>
        </div>

        {/* Skeleton for Documents List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-48" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </div>
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

        <span className="sr-only">Loading all documents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Quick Upload Section */}
      {applications.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Upload</h3>
                <p className="text-sm text-gray-600">
                  {showUploadForm
                    ? "Select application and document type to upload"
                    : "Upload documents with enhanced security validation and quality checks"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center gap-2"
            >
              {showUploadForm ? (
                <>
                  <X className="h-5 w-5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Upload Documents
                </>
              )}
            </button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Application Selection */}
                <div>
                  <label htmlFor="quick-upload-application" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Application *
                  </label>
                  <select
                    id="quick-upload-application"
                    value={selectedApplication}
                    onChange={(e) => setSelectedApplication(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose an application...</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.reference_number} - {app.destination_country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Type Selection */}
                <div>
                  <label htmlFor="quick-upload-doc-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    id="quick-upload-doc-type"
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose document type...</option>
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Selection Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="sr-only"
                  id="quick-file-upload"
                />

                {selectedFiles.length === 0 ? (
                  <label htmlFor="quick-file-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        Click to browse
                      </span>{" "}
                      or drag and drop files here
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG, DOCX, WebP • Max 10MB • Security validated • Quality checked
                    </p>
                  </label>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 mb-3">
                      {selectedFiles.length} file(s) selected
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-left"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-gray-200 rounded"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label
                      htmlFor="quick-file-upload"
                      className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer mt-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add more files
                    </label>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              {selectedFiles.length > 0 && (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedFiles([]);
                      setSelectedApplication("");
                      setSelectedDocType("");
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedApplication || !selectedDocType}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Upload with Security Check
                  </button>
                </div>
              )}

              {/* Uploading Files Progress */}
              {uploadingFiles.size > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading {uploadingFiles.size} file(s)
                  </h4>
                  {Array.from(uploadingFiles.entries()).map(([fileId, { file, progress, status, error }]) => (
                    <div key={fileId} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        {status === "success" && (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                        {status === "error" && (
                          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      {status === "uploading" && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                      {status === "error" && error && (
                        <p className="text-xs text-red-600">{error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <div className="flex gap-2">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Enhanced Security & Quality Validation</p>
                    <ul className="text-xs space-y-0.5">
                      <li>✓ MIME type verification to prevent file spoofing</li>
                      <li>✓ File signature (magic bytes) validation</li>
                      <li>✓ Image quality analysis (resolution, brightness, contrast)</li>
                      <li>✓ Supports modern formats including WebP</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <label htmlFor="document-search" className="sr-only">Search documents</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              id="document-search"
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Search documents by name or reference"
            />
          </div>

          {/* Status Filter */}
          <label htmlFor="status-filter" className="sr-only">Filter by status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            aria-label="Filter documents by status"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="rejected">Rejected</option>
            <option value="needs_revision">Needs Revision</option>
          </select>

          {/* Type Filter */}
          <label htmlFor="type-filter" className="sr-only">Filter by document type</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            aria-label="Filter documents by type"
          >
            <option value="all">All Types</option>
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchAllDocuments}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            title="Refresh documents"
            aria-label="Refresh documents list"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Documents ({filteredDocuments.length})
          </h2>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {documents.length === 0 ? "No documents uploaded yet" : "No documents match your filters"}
            </p>
            <p className="text-sm text-gray-500">
              {documents.length === 0
                ? "Upload documents from your application pages"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {getFileIcon(doc.file_extension)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{doc.document_name}</h3>
                        {doc.application_reference && (
                          <Link
                            href={`/dashboard/applications/${doc.application_id}/documents`}
                            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 mt-1"
                          >
                            {doc.application_reference}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
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
                    <Link
                      href={`/dashboard/applications/${doc.application_id}/documents`}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View in application"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>

                    {!doc.is_verified && doc.status !== "approved" && (
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
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
            <p className="font-medium mb-1">Document Management & Security</p>
            <p className="mb-2">
              This page shows all documents across all your applications. To upload new documents, visit the
              specific application&apos;s document page. You can click on the application reference to navigate
              there directly.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>All files are validated for security (MIME type, file signature)</li>
              <li>Supports: PDF, JPG, PNG, DOCX, WebP formats</li>
              <li>Maximum file size: 10MB per document</li>
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
                  Are you sure you want to delete &quot;<strong>{showDeleteModal.document_name}</strong>&quot;?
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

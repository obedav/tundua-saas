"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

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

export default function DocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    fetchDocuments();
    fetchDocumentTypes();
  }, [params.id]);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.getApplicationDocuments(Number(params.id));
      setDocuments(response.data.documents);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await apiClient.getDocumentTypes();
      setDocumentTypes(response.data.document_types);
    } catch (error: any) {
      console.error("Error fetching document types:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10485760) {
        toast.error("File size must not exceed 10MB");
        return;
      }

      // Validate file type
      const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast.error("Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX");
        return;
      }

      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      toast.error("Please select a file and document type");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("application_id", params.id as string);
      formData.append("document_type", selectedType);
      formData.append("document_name", documentName || selectedFile.name);

      await apiClient.uploadDocument(Number(params.id), formData);
      toast.success("Document uploaded successfully");

      // Reset form
      setSelectedFile(null);
      setSelectedType("");
      setDocumentName("");
      setShowUploadForm(false);

      // Refresh documents list
      await fetchDocuments();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId: number, filename: string) => {
    try {
      const response = await apiClient.downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await apiClient.deleteDocument(documentId);
      toast.success("Document deleted successfully");
      await fetchDocuments();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.error || "Failed to delete document");
    }
  };

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified || status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <CheckCircle className="h-3 w-3" />
          Approved
        </span>
      );
    }

    const badges: Record<string, { color: string; icon: any; text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pending Review" },
      under_review: { color: "bg-blue-100 text-blue-700", icon: AlertCircle, text: "Under Review" },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Rejected" },
      needs_revision: { color: "bg-orange-100 text-orange-700", icon: AlertCircle, text: "Needs Revision" },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/applications/${params.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Application
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Documents</h1>
            <p className="text-gray-600 mt-1">Upload and manage your application documents</p>
          </div>

          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Document</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select document type...</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name (Optional)
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter a custom name for this document"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose File *
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Click to select file or drag and drop"}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Allowed formats: PDF, JPG, PNG, DOC, DOCX. Maximum size: 10MB
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedType || uploading}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  !selectedFile || !selectedType || uploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFile(null);
                  setSelectedType("");
                  setDocumentName("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded Documents ({documents.length})</h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No documents uploaded yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Upload your application documents to get started
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>

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
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(doc.id, doc.original_filename)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>

                    {!doc.is_verified && doc.status !== "approved" && (
                      <button
                        onClick={() => handleDelete(doc.id)}
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Document Requirements</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All documents must be clear and legible</li>
              <li>Files should be in PDF, JPG, PNG, DOC, or DOCX format</li>
              <li>Maximum file size is 10MB per document</li>
              <li>Official documents should be certified or notarized if required</li>
              <li>Documents will be reviewed by our team within 2-3 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

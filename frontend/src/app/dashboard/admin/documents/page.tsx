"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface Document {
  id: number;
  application_id: number;
  application_reference: string;
  user_name: string;
  document_type: string;
  document_name: string;
  original_filename: string;
  file_size: number;
  file_extension: string;
  status: string;
  uploaded_at: string;
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingDoc, setReviewingDoc] = useState<number | null>(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<Document | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle Escape key to close preview
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewingDoc) {
        closePreview();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [previewingDoc]);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.getPendingDocuments();
      const docs = response.data?.documents || [];
      console.log('Fetched documents:', docs.length, 'documents');
      setDocuments(docs);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (documentId: number) => {
    setReviewingDoc(documentId);
    setReviewStatus("");
    setReviewNotes("");
  };

  const handleSubmitReview = async () => {
    if (!reviewStatus) {
      toast.error("Please select a review status");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.reviewDocument(reviewingDoc!, reviewStatus, reviewNotes);
      toast.success("Document review submitted successfully");
      setReviewingDoc(null);
      setReviewStatus("");
      setReviewNotes("");
      await fetchDocuments();
    } catch (error: any) {
      console.error("Review error:", error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = async (doc: Document) => {
    setPreviewingDoc(doc);
    setPreviewLoading(true);
    try {
      console.log('Attempting to download document:', doc.id);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      const response = await apiClient.downloadDocument(doc.id);
      console.log('Download successful, response:', response);
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error: any) {
      console.error("Preview error details:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      let errorMessage = "Failed to load document preview";
      if (error.response?.status === 404) {
        errorMessage = "Document not found or endpoint not available. Please restart the backend server.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to view this document";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(errorMessage);
      setPreviewingDoc(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }
    setPreviewingDoc(null);
    setPreviewUrl(null);
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pending" },
      under_review: { color: "bg-blue-100 text-blue-700", icon: AlertCircle, text: "Under Review" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Rejected" },
      needs_revision: { color: "bg-orange-100 text-orange-700", icon: AlertCircle, text: "Needs Revision" },
    };

    const badge = badges[status] || badges['pending'];
    const Icon = badge!.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge!.color}`}>
        <Icon className="h-3 w-3" />
        {badge?.text}
      </span>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      passport: "Passport / ID",
      transcript: "Academic Transcript",
      degree_certificate: "Degree Certificate",
      recommendation_letter: "Recommendation Letter",
      personal_statement: "Personal Statement",
      cv_resume: "CV / Resume",
      english_test_certificate: "English Test Certificate",
      financial_document: "Financial Document",
      other: "Other Document",
    };
    return labels[type] || type;
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
        <h1 className="text-3xl font-bold text-gray-900">Document Review</h1>
        <p className="text-gray-600 mt-1">Review and approve documents submitted by applicants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{documents.length}</h3>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {documents.filter((d) => d.status === "under_review").length}
              </h3>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {documents.filter((d) => d.status === "pending").length}
              </h3>
              <p className="text-sm text-gray-600">New Documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">All caught up!</p>
            <p className="text-sm text-gray-500">No documents pending review</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div key={doc.id} className="p-6">
                {reviewingDoc === doc.id ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{doc.document_name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {getDocumentTypeLabel(doc.document_type)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span>Application: {doc.application_reference}</span>
                            <span>User: {doc.user_name}</span>
                            <span>{formatFileSize(doc.file_size)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Decision *
                        </label>
                        <select
                          value={reviewStatus}
                          onChange={(e) => setReviewStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select decision...</option>
                          <option value="under_review">Mark as Under Review</option>
                          <option value="approved">Approve Document</option>
                          <option value="rejected">Reject Document</option>
                          <option value="needs_revision">Request Revision</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes / Feedback
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add notes or feedback for the applicant..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSubmitReview}
                          disabled={!reviewStatus || submitting}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                            !reviewStatus || submitting
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-primary-600 text-white hover:bg-primary-700"
                          }`}
                        >
                          {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                          onClick={() => setReviewingDoc(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="font-semibold text-gray-900 hover:text-blue-600 text-left transition-colors"
                            title="Click to preview"
                          >
                            {doc.document_name}
                          </button>
                          {getStatusBadge(doc.status)}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {getDocumentTypeLabel(doc.document_type)}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <Link
                            href={`/dashboard/applications/${doc.application_id}`}
                            className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            {doc.application_reference}
                          </Link>
                          <span>{doc.user_name}</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(doc)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview Document"
                      >
                        <Eye className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleDownload(doc.id, doc.original_filename)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleReview(doc.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewingDoc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePreview();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <h2 id="preview-modal-title" className="text-lg font-semibold text-gray-900 truncate">
                  {previewingDoc.document_name}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span>{getDocumentTypeLabel(previewingDoc.document_type)}</span>
                  <span>•</span>
                  <span>{formatFileSize(previewingDoc.file_size)}</span>
                  <span>•</span>
                  <span>{previewingDoc.user_name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleDownload(previewingDoc.id, previewingDoc.original_filename)}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {previewLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading document...</p>
                  </div>
                </div>
              ) : previewUrl ? (
                <div className="flex items-center justify-center min-h-full">
                  {/* Image Preview */}
                  {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(previewingDoc.file_extension.toLowerCase()) && (
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-full">
                      <img
                        src={previewUrl}
                        alt={previewingDoc.document_name}
                        className="max-w-full max-h-[calc(90vh-200px)] object-contain"
                      />
                    </div>
                  )}

                  {/* PDF Preview */}
                  {previewingDoc.file_extension.toLowerCase() === 'pdf' && (
                    <div className="w-full h-full bg-white rounded-lg shadow-lg">
                      <iframe
                        src={previewUrl}
                        className="w-full h-[calc(90vh-200px)] rounded-lg"
                        title={previewingDoc.document_name}
                      />
                    </div>
                  )}

                  {/* Other Document Types */}
                  {!['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'].includes(previewingDoc.file_extension.toLowerCase()) && (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                      <button
                        onClick={() => handleDownload(previewingDoc.id, previewingDoc.original_filename)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                      >
                        <Download className="h-5 w-5" />
                        Download to View
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer - Quick Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {getStatusBadge(previewingDoc.status)}
                  {previewingDoc.application_reference && (
                    <Link
                      href={`/dashboard/applications/${previewingDoc.application_id}`}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      onClick={closePreview}
                    >
                      <Eye className="h-4 w-4" />
                      View Application
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      closePreview();
                      handleReview(previewingDoc.id);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Start Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

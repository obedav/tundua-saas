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

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.getPendingDocuments();
      setDocuments(response.data.documents || []);
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
                          <h3 className="font-semibold text-gray-900">{doc.document_name}</h3>
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
    </div>
  );
}

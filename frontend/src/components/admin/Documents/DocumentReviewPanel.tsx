"use client";

import { useState } from "react";
import { FileText, Download, Check, X, AlertCircle } from "lucide-react";

interface DocumentReviewPanelProps {
  documentId: number;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function DocumentReviewPanel({
  documentId,
  onApprove,
  onReject
}: DocumentReviewPanelProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = () => {
    if (onApprove) onApprove();
  };

  const handleReject = () => {
    if (rejectionReason.trim() && onReject) {
      onReject();
      setShowRejectModal(false);
      setRejectionReason("");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Document Review</h3>
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Document Preview Area */}
      <div className="bg-gray-100 rounded-lg p-8 mb-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-2" />
          <p>Document preview will appear here</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleApprove}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Check className="h-5 w-5" />
          Approve Document
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <X className="h-5 w-5" />
          Reject Document
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this document:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-4"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

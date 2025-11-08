"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Upload, X, FileText } from "lucide-react";

interface MissingDocument {
  id: number;
  name: string;
  application_reference: string;
  deadline?: string;
  urgent?: boolean;
}

interface DocumentUploadAlertProps {
  missingDocuments?: MissingDocument[];
  onDismiss?: () => void;
}

export default function DocumentUploadAlert({
  missingDocuments = [],
  onDismiss,
}: DocumentUploadAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || missingDocuments.length === 0) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const urgentDocs = missingDocuments.filter((doc) => doc.urgent);
  const isUrgent = urgentDocs.length > 0;

  return (
    <div
      className={`rounded-lg border-2 p-6 ${
        isUrgent
          ? "bg-red-50 border-red-300"
          : "bg-yellow-50 border-yellow-300"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`p-2 rounded-full flex-shrink-0 ${
            isUrgent ? "bg-red-100" : "bg-yellow-100"
          }`}
        >
          <AlertCircle
            className={`h-6 w-6 ${isUrgent ? "text-red-600" : "text-yellow-600"}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  isUrgent ? "text-red-900" : "text-yellow-900"
                }`}
              >
                {isUrgent ? "⚠️ Urgent: " : ""}
                {missingDocuments.length} Document{missingDocuments.length > 1 ? "s" : ""} Required
              </h3>
              <p
                className={`text-sm mb-4 ${
                  isUrgent ? "text-red-700" : "text-yellow-700"
                }`}
              >
                Please upload the following documents to continue processing your application
                {urgentDocs.length > 0 && ` (${urgentDocs.length} urgent)`}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className={`text-gray-400 hover:text-gray-600 transition-colors`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Document List */}
          <div className="space-y-2 mb-4">
            {missingDocuments.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
              >
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-600">
                    For: {doc.application_reference}
                    {doc.deadline && (
                      <span className="text-red-600 font-medium ml-2">
                        • Due: {new Date(doc.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                {doc.urgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                    URGENT
                  </span>
                )}
              </div>
            ))}

            {missingDocuments.length > 3 && (
              <p className="text-sm text-gray-600 italic">
                And {missingDocuments.length - 3} more document{missingDocuments.length - 3 > 1 ? "s" : ""}...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/documents"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                isUrgent
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              <Upload className="h-5 w-5" />
              Upload Documents Now
            </Link>

            <Link
              href="/dashboard/applications"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              View Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

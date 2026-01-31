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
          ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
          : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`p-2 rounded-full flex-shrink-0 ${
            isUrgent ? "bg-red-100 dark:bg-red-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"
          }`}
        >
          <AlertCircle
            className={`h-6 w-6 ${isUrgent ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  isUrgent ? "text-red-900 dark:text-red-300" : "text-yellow-900 dark:text-yellow-300"
                }`}
              >
                {isUrgent ? "⚠️ Urgent: " : ""}
                {missingDocuments.length} Document{missingDocuments.length > 1 ? "s" : ""} Required
              </h3>
              <p
                className={`text-sm mb-4 ${
                  isUrgent ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"
                }`}
              >
                Please upload the following documents to continue processing your application
                {urgentDocs.length > 0 && ` (${urgentDocs.length} urgent)`}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className={`text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Document List */}
          <div className="space-y-2 mb-4">
            {missingDocuments.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    For: {doc.application_reference}
                    {doc.deadline && (
                      <span className="text-red-600 dark:text-red-400 font-medium ml-2">
                        • Due: {new Date(doc.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                {doc.urgent && (
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded">
                    URGENT
                  </span>
                )}
              </div>
            ))}

            {missingDocuments.length > 3 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              View Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

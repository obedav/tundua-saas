"use client";

import { FileText, User, DollarSign, Calendar } from "lucide-react";

interface ApplicationDetailsProps {
  applicationId: number;
}

export default function ApplicationDetails({ applicationId }: ApplicationDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">Application #{applicationId}</p>
        {/* Detailed view will be implemented */}
      </div>
    </div>
  );
}

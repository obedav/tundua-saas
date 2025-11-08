"use client";

import Link from "next/link";
import { Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";

interface Application {
  id: number;
  reference_number: string;
  destination_country: string;
  service_tier_name: string;
  status: string;
  total_amount: string | number;
  created_at: string;
}

interface RecentApplicationsListProps {
  applications: Application[];
  maxItems?: number;
}

export default function RecentApplicationsList({
  applications,
  maxItems = 5,
}: RecentApplicationsListProps) {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; text: string }> = {
      draft: { color: "bg-gray-100 text-gray-700", icon: Clock, text: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-700", icon: Clock, text: "Submitted" },
      under_review: { color: "bg-yellow-100 text-yellow-700", icon: AlertCircle, text: "Under Review" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Rejected" },
      completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Completed" },
    };

    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
  };

  const displayedApplications = applications.slice(0, maxItems);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedApplications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{app.reference_number}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {app.destination_country || "Not specified"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {app.service_tier_name || "Not selected"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(app.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${typeof app.total_amount === 'number' ? app.total_amount.toFixed(2) : parseFloat(app.total_amount || "0").toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    href={`/dashboard/applications/${app.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

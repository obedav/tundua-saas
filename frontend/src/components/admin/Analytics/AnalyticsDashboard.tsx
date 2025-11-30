"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { SkeletonDashboardStats, SkeletonTable } from "@/components/ui";

interface Stats {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  total_revenue: number;
  pending_documents: number;
  total_users: number;
  applications_this_month: number;
  revenue_this_month: number;
}

interface RecentApplication {
  id: number;
  reference_number: string;
  applicant_name: string;
  destination_country: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from API
      const [analyticsResponse, applicationsResponse] = await Promise.all([
        apiClient.getAnalytics(),
        apiClient.getAllApplications({ limit: 5, order: "desc" } as any),
      ]);

      setStats(analyticsResponse.data.analytics.overview);
      setRecentApplications(applicationsResponse.data.data?.applications || []);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);

      // NO MOCK DATA! Show real zeros/empty data instead
      const emptyStats: Stats = {
        total_applications: 0,
        pending_applications: 0,
        approved_applications: 0,
        rejected_applications: 0,
        total_revenue: 0,
        pending_documents: 0,
        total_users: 0,
        applications_this_month: 0,
        revenue_this_month: 0,
      };

      setStats(emptyStats);
      setRecentApplications([]);

      // Show error toast
      toast.error(
        error.response?.status === 403
          ? "Access denied. Please logout and login as admin."
          : error.response?.status === 401
          ? "Not logged in. Please login again."
          : "Failed to load dashboard data. Please refresh."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      draft: { color: "bg-gray-100 text-gray-700", text: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-700", text: "Submitted" },
      under_review: { color: "bg-yellow-100 text-yellow-700", text: "Under Review" },
      approved: { color: "bg-green-100 text-green-700", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", text: "Rejected" },
      completed: { color: "bg-green-100 text-green-700", text: "Completed" },
    };

    const badge = badges[status] || badges['draft'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge!.color}`}>
        {badge!.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Page Header Skeleton */}
        <div>
          <div className="h-9 w-72 bg-gray-200 rounded-lg animate-skeleton mb-2" />
          <div className="h-6 w-96 bg-gray-100 rounded-lg animate-skeleton" />
        </div>

        {/* Stats Grid Skeleton */}
        <SkeletonDashboardStats />

        {/* Recent Applications Table Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-7 w-48 bg-gray-200 rounded-lg animate-skeleton mb-6" />
          <SkeletonTable rows={5} columns={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform performance and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Applications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">All Time</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats?.total_applications || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Applications</p>
          <div className="mt-3 flex items-center text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>{stats?.applications_this_month || 0} this month</span>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xs text-yellow-600 font-medium">Action Needed</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats?.pending_applications || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Pending Review</p>
        </div>

        {/* Approved Applications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats?.approved_applications || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Approved</p>
          <div className="mt-3 text-xs text-gray-500">
            {stats?.rejected_applications || 0} rejected
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ₦{(stats?.total_revenue || 0).toLocaleString('en-NG')}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
          <div className="mt-3 text-xs text-green-600">
            ₦{(stats?.revenue_this_month || 0).toLocaleString('en-NG')} this month
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{stats?.total_users || 0}</h3>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{stats?.pending_documents || 0}</h3>
              <p className="text-sm text-gray-600">Pending Documents</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {stats?.applications_this_month || 0}
              </h3>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No applications yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-primary-600">
                        {application.reference_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{application.applicant_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{application.destination_country}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ₦{(application.total_amount || 0).toLocaleString('en-NG')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FileText,
  CheckCircle,
  Clock,
  Banknote,
  Users,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import {
  getAdminDashboardStats,
  getAdminApplications,
  getAdminActivity,
} from "@/lib/actions/admin";

/**
 * Modern Admin Dashboard (2025-2026 Best Practices)
 * - Server Component for better performance
 * - Real data from API (no mock data)
 * - Honest error handling (shows zeros, not fake data)
 * - Modern card-based design
 * - Dark mode ready
 */
export default async function AdminDashboardPage() {
  // Verify admin access
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'admin' && user.role !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch real data from server
  const [stats, applicationsData, _activities] = await Promise.all([
    getAdminDashboardStats(),
    getAdminApplications({ limit: 5, order: 'desc' }),
    getAdminActivity(5),
  ]);

  // Backend returns: { success: true, data: { applications: [...], total: X } }
  const recentApplications = applicationsData?.data?.applications || applicationsData?.applications || [];
  console.log('Admin dashboard - applications data:', applicationsData);
  console.log('Admin dashboard - recent applications:', recentApplications.length);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      draft: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", text: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", text: "Submitted" },
      payment_pending: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", text: "Payment Pending" },
      under_review: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", text: "Under Review" },
      approved: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", text: "Rejected" },
      completed: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", text: "Completed" },
    };

    const badge = badges[status] || badges['draft'];
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge?.color}`}>
        {badge?.text}
      </span>
    );
  };

  // Calculate trend percentages (honest - show 0 if no data)
  const appTrend = stats.total_applications > 0
    ? Math.round((stats.applications_this_month / stats.total_applications) * 100)
    : 0;

  const revenueTrend = stats.total_revenue > 0
    ? Math.round((stats.revenue_this_month / stats.total_revenue) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Real-time platform overview and analytics
        </p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">All Time</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total_applications.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Applications</p>
          <div className="mt-4 flex items-center gap-2">
            <div className={`flex items-center text-xs font-medium ${appTrend > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
              {appTrend > 0 && <TrendingUp className="h-3 w-3 mr-1" />}
              <span>{stats.applications_this_month} this month</span>
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            {stats.pending_applications > 0 && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                Action Needed
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.pending_applications.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Review</p>
          {stats.pending_applications > 0 && (
            <Link
              href="/dashboard/admin/applications?status=pending"
              className="mt-4 inline-flex items-center text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium"
            >
              Review Now <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          )}
        </div>

        {/* Approved Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.approved_applications.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Approved</p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {stats.rejected_applications} rejected
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Banknote className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium opacity-90">Revenue</span>
          </div>
          <h3 className="text-3xl font-bold">
            ₦{stats.total_revenue.toLocaleString('en-NG')}
          </h3>
          <p className="text-sm opacity-90 mt-1">Total Revenue</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center text-xs font-medium opacity-90">
              {revenueTrend > 0 && <TrendingUp className="h-3 w-3 mr-1" />}
              <span>₦{stats.revenue_this_month.toLocaleString('en-NG')} this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total_users.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pending_documents.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Documents</p>
            </div>
          </div>
          {stats.pending_documents > 0 && (
            <Link
              href="/dashboard/admin/documents"
              className="mt-3 inline-flex items-center text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
            >
              Review Documents <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.applications_this_month.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
          <Link
            href="/dashboard/admin/applications"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-1"
          >
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No applications yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Applications will appear here when users submit them
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentApplications.map((application: any) => (
                  <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/admin/applications/${application.id}`}
                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {application.reference_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">{application.applicant_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{application.destination_country}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ₦{parseFloat(application.total_amount || "0").toLocaleString('en-NG')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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

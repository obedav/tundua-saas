import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/actions/auth";
import { getApplications } from "@/lib/actions/applications";
import { redirect } from "next/navigation";

// Import modular dashboard components
import DashboardStats from "@/components/dashboard/Core/DashboardStats";
import DashboardQuickActions from "@/components/dashboard/Core/DashboardQuickActions";
import DashboardActivityFeed from "@/components/dashboard/Core/DashboardActivityFeed";
import DashboardNotifications from "@/components/dashboard/Core/DashboardNotifications";
import SmartProgressTracker from "@/components/dashboard/Core/SmartProgressTracker";
import RecentApplicationsList from "@/components/dashboard/Applications/RecentApplicationsList";
import EmptyApplicationState from "@/components/dashboard/Applications/EmptyApplicationState";
import DocumentUploadAlert from "@/components/dashboard/Applications/DocumentUploadAlert";
import DashboardConversionWrapper from "@/components/dashboard/DashboardConversionWrapper";
import QuickStartChecklist from "@/components/dashboard/Onboarding/QuickStartChecklist";

interface Application {
  id: number;
  reference_number: string;
  destination_country: string;
  service_tier_name: string;
  status: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
}

/**
 * Server Component - Dashboard Overview
 *
 * Benefits of Server Component approach:
 * - Data fetching happens on the server
 * - No client-side API calls or loading states
 * - Automatic streaming with Suspense
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 */
export default async function DashboardPage() {
  // Fetch user data on the server
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch applications data on the server
  const applicationsResponse = await getApplications();
  const applications: Application[] = applicationsResponse?.applications || [];

  // Calculate stats on the server
  const stats = {
    total_applications: applications.length,
    pending_applications: applications.filter(
      (app) => app.status === "draft" || app.status === "submitted" || app.status === "under_review"
    ).length,
    approved_applications: applications.filter((app) => app.status === "approved").length,
    rejected_applications: applications.filter((app) => app.status === "rejected").length,
    total_spent: applications.reduce((sum, app) => sum + parseFloat(app.total_amount || "0"), 0),
  };

  const recentApplications = applications.slice(0, 5);
  const latestApplication = recentApplications.length > 0 ? recentApplications[0] : null;

  return (
    <DashboardConversionWrapper>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s an overview of your study abroad journey
          </p>
        </div>

        {/* Document Upload Alerts */}
        <DocumentUploadAlert
          missingDocuments={[
            // TODO: Replace with actual missing documents from API
          ]}
        />

        {/* Stats Cards with Trends */}
        <DashboardStats
          totalApplications={stats.total_applications}
          pendingApplications={stats.pending_applications}
          approvedApplications={stats.approved_applications}
          totalSpent={stats.total_spent}
          trends={{
            applications: 12, // TODO: Calculate from historical data
            pending: -5,
            approved: 25,
            spending: 8,
          }}
        />

        {/* Two-Column Layout for Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <DashboardQuickActions />

            {/* Progress Tracker - Show only if user has active applications */}
            {latestApplication && (
              <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg" />}>
                <SmartProgressTracker
                  applicationId={latestApplication.id}
                  applicationStatus={latestApplication.status}
                />
              </Suspense>
            )}

            {/* Recent Applications */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Applications</h2>
                {recentApplications.length > 0 && (
                  <Link
                    href="/dashboard/applications"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All →
                  </Link>
                )}
              </div>

              {recentApplications.length === 0 ? (
                <EmptyApplicationState type="recent" />
              ) : (
                <RecentApplicationsList applications={recentApplications} maxItems={5} />
              )}
            </div>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Quick Start Checklist - Show for users with 0 applications */}
            {recentApplications.length === 0 && <QuickStartChecklist />}

            {/* Notifications */}
            <Suspense fallback={<div className="animate-pulse bg-gray-100 h-48 rounded-lg" />}>
              <DashboardNotifications />
            </Suspense>

            {/* Activity Feed */}
            <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg" />}>
              <DashboardActivityFeed maxItems={5} />
            </Suspense>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our support team is here to help you every step of the way.
              </p>
              <Link
                href="/dashboard/support"
                className="inline-block bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>

            {/* Add-Ons Recommendation Card - Show for users with at least 1 application */}
            {recentApplications.length > 0 && (
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Boost Your Application</h3>
                <p className="text-purple-100 text-sm mb-4">
                  95% of approved students used our Essay Review service. Enhance your chances today!
                </p>
                <Link
                  href="/dashboard/addons"
                  className="inline-block bg-white text-purple-600 px-4 py-3 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors"
                >
                  Browse Add-Ons →
                </Link>
              </div>
            )}

            {/* Referral Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Refer & Earn</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get ₦10,000 off your next application for every friend you refer!
              </p>
              <Link
                href="/dashboard/referrals"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardConversionWrapper>
  );
}

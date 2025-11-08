"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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

interface DashboardStats {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  total_spent: number;
}

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_applications: 0,
    pending_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
    total_spent: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the most recent application for progress tracking
  const latestApplication = recentApplications.length > 0 ? recentApplications[0] : null;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.getApplications();
      const applications = response.data.applications || [];

      // Calculate stats
      const calculatedStats: DashboardStats = {
        total_applications: applications.length,
        pending_applications: applications.filter(
          (app: Application) => app.status === "draft" || app.status === "submitted" || app.status === "under_review"
        ).length,
        approved_applications: applications.filter((app: Application) => app.status === "approved").length,
        rejected_applications: applications.filter((app: Application) => app.status === "rejected").length,
        total_spent: applications.reduce((sum: number, app: Application) => sum + parseFloat(app.total_amount || "0"), 0),
      };

      setStats(calculatedStats);
      setRecentApplications(applications.slice(0, 5));
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <DashboardConversionWrapper>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your study abroad journey
          </p>
        </div>

        {/* Document Upload Alerts */}
        <DocumentUploadAlert
          missingDocuments={[
            // TODO: Replace with actual missing documents from API
            // Example data structure:
            // {
            //   id: 1,
            //   name: "Passport Copy",
            //   application_reference: "TUND-2025-0001",
            //   deadline: "2025-02-15",
            //   urgent: true
            // }
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
              <SmartProgressTracker
                applicationId={latestApplication.id}
                applicationStatus={latestApplication.status}
              />
            )}

            {/* Recent Applications */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
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
            <DashboardNotifications />

            {/* Activity Feed */}
            <DashboardActivityFeed maxItems={5} />

            {/* Help Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our support team is here to help you every step of the way.
              </p>
              <Link
                href="/dashboard/support"
                className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
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
                  className="inline-block bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors"
                >
                  Browse Add-Ons →
                </Link>
              </div>
            )}

            {/* Referral Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Refer & Earn</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get $50 off your next application for every friend you refer!
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

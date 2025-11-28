import { redirect } from "next/navigation";
import { Banknote, TrendingUp, TrendingDown, BarChart3, ArrowUp, ArrowDown, Info } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import { getAdminDashboardStats, getComprehensiveAnalytics, getRevenueChartData } from "@/lib/actions/admin";

interface RevenueByTier {
  tier: string;
  amount: number;
  count: number;
}

/**
 * Revenue Analytics Page (2025 Best Practices)
 * - Server Component for performance
 * - Real data from API (NO MOCK DATA)
 * - Honest empty states when no data
 * - Dark mode ready
 */
export default async function RevenueAnalyticsPage() {
  // Verify admin access
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'admin' && user.role !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch real revenue data
  const stats = await getAdminDashboardStats();
  const analyticsData = await getComprehensiveAnalytics(30);

  // Calculate honest metrics (show 0 if no data)
  const totalRevenue = stats?.total_revenue || 0;
  const monthlyRevenue = stats?.revenue_this_month || 0;
  const totalApplications = stats?.total_applications || 0;
  const averageOrderValue = totalApplications > 0 ? totalRevenue / totalApplications : 0;
  const growthRate = totalRevenue > 0 && monthlyRevenue > 0
    ? ((monthlyRevenue / (totalRevenue - monthlyRevenue)) * 100)
    : 0;

  // Get revenue by service tier from analytics
  const revenueByTier: RevenueByTier[] = (analyticsData?.service_tiers || []).map((tier: any) => ({
    tier: tier.name || 'Unknown',
    amount: parseFloat(tier.revenue) || 0,
    count: tier.count || 0,
  }));

  // Get monthly revenue trend (last 6 months)
  const revenueChartData = await getRevenueChartData('daily', 180);
  const monthlyRevenueTrend = revenueChartData ?
    Object.values(
      revenueChartData.reduce((acc: any, day: any) => {
        const monthKey = new Date(day.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, amount: 0, orders: 0 };
        }
        acc[monthKey].amount += parseFloat(day.revenue) || 0;
        acc[monthKey].orders += parseInt(day.count) || 0;
        return acc;
      }, {})
    ).slice(-6) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time revenue insights and trends
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Banknote className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm opacity-90">Total Revenue</p>
          <h3 className="text-3xl font-bold mt-1">
            ₦{totalRevenue.toLocaleString('en-NG')}
          </h3>
        </div>

        {/* This Month */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            ₦{monthlyRevenue.toLocaleString('en-NG')}
          </h3>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            ₦{averageOrderValue.toLocaleString('en-NG')}
          </h3>
          {totalApplications === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">No orders yet</p>
          )}
        </div>

        {/* Growth Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              growthRate > 0
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-700'
            }`}>
              {growthRate > 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 flex items-center gap-2">
            {growthRate > 0 && <ArrowUp className="h-6 w-6 text-green-600 dark:text-green-400" />}
            {Math.abs(growthRate).toFixed(1)}%
          </h3>
        </div>
      </div>

      {/* Revenue by Service Tier */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Service Tier</h3>

        {revenueByTier.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No revenue data available yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Revenue will appear here when applications with service tiers are completed
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {revenueByTier.map((tier, index) => {
              const percentage = totalRevenue > 0 ? (tier.amount / totalRevenue) * 100 : 0;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tier.tier}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">₦{tier.amount.toLocaleString('en-NG')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({tier.count} orders)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(1)}% of total revenue</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Revenue Trend</h3>

        {monthlyRevenueTrend.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No historical revenue data yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Revenue trends will appear as you process more payments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {monthlyRevenueTrend.map((month: any, index: number) => {
              const maxAmount = Math.max(...monthlyRevenueTrend.map((m: any) => m.amount));
              const percentage = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{month.month}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ₦{month.amount.toLocaleString('en-NG')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({month.orders} orders)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-500 dark:to-emerald-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

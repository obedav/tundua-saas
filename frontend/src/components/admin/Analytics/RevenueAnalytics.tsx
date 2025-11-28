"use client";

import { useState, useEffect } from "react";
import { Banknote, TrendingUp, TrendingDown, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

interface RevenueData {
  total_revenue: number;
  this_month: number;
  average_order_value: number;
  revenue_by_tier: { tier: string; amount: number }[];
  revenue_by_month: { month: string; amount: number }[];
  growth_rate: number;
}

export default function RevenueAnalytics() {
  const [data, setData] = useState<RevenueData>({
    total_revenue: 0,
    this_month: 0,
    average_order_value: 0,
    revenue_by_tier: [],
    revenue_by_month: [],
    growth_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/analytics?period=' + timeRange, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch revenue data');

      const result = await response.json();
      const analytics = result.analytics;

      // Calculate total applications for average order value
      const totalApps = analytics.overview?.total_applications || 1;
      const totalRevenue = analytics.overview?.total_revenue || 0;
      const monthlyRevenue = analytics.overview?.revenue_this_month || 0;

      // Transform revenue by tier
      const revenueByTier = (analytics.service_tiers || []).map((tier: any) => ({
        tier: tier.name || 'Unknown',
        amount: parseFloat(tier.revenue) || 0,
      }));

      // Transform monthly revenue (aggregate daily data into months)
      const monthlyData: Record<string, number> = {};
      (analytics.revenue?.daily || []).forEach((day: any) => {
        const monthKey = new Date(day.date).toLocaleDateString('en-US', { month: 'short' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + parseFloat(day.revenue);
      });

      const revenueByMonth = Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount,
      })).slice(-6); // Last 6 months

      setData({
        total_revenue: totalRevenue,
        this_month: monthlyRevenue,
        average_order_value: totalApps > 0 ? totalRevenue / totalApps : 0,
        growth_rate: analytics.revenue?.growth_percentage || 0,
        revenue_by_tier: revenueByTier,
        revenue_by_month: revenueByMonth,
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast.error("Failed to load revenue analytics");
      // Set zeros on error
      setData({
        total_revenue: 0,
        this_month: 0,
        average_order_value: 0,
        revenue_by_tier: [],
        revenue_by_month: [],
        growth_rate: 0,
      });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ₦{data.total_revenue.toLocaleString('en-NG')}
              </h3>
            </div>
            <Banknote className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ₦{data.this_month.toLocaleString('en-NG')}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Order Value</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ₦{data.average_order_value.toLocaleString('en-NG')}
              </h3>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 flex items-center gap-1">
                {data.growth_rate > 0 ? (
                  <ArrowUp className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-red-600" />
                )}
                {Math.abs(data.growth_rate).toFixed(1)}%
              </h3>
            </div>
            {data.growth_rate > 0 ? (
              <TrendingUp className="h-8 w-8 text-green-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Revenue by Service Tier */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service Tier</h3>
        <div className="space-y-4">
          {data.revenue_by_tier.map((tier, index) => {
            const percentage = (tier.amount / data.total_revenue) * 100;
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{tier.tier}</span>
                  <span className="text-sm font-bold text-gray-900">₦{tier.amount.toLocaleString('en-NG')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total revenue</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Trend</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.revenue_by_month.map((month, index) => {
            const maxRevenue = Math.max(...data.revenue_by_month.map(m => m.amount));
            const heightPercentage = (month.amount / maxRevenue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col items-center">
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1">
                    ₦{month.amount.toLocaleString('en-NG')}
                  </div>
                  <div
                    className="w-full bg-primary-600 rounded-t hover:bg-primary-700 transition-all duration-300"
                    style={{ height: `${heightPercentage}%`, minHeight: '20px' }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{month.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

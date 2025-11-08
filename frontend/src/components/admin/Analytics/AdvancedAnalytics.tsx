"use client";

import { useState, useEffect } from "react";
import { TrendingUp, BarChart3, PieChart, Users, DollarSign, FileText, Target } from "lucide-react";

interface AnalyticsData {
  applications_by_status: { status: string; count: number; color: string }[];
  revenue_trend: { date: string; revenue: number }[];
  conversion_funnel: { stage: string; count: number; percentage: number }[];
  top_countries: { country: string; applications: number }[];
}

export default function AdvancedAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [data, setData] = useState<AnalyticsData>({
    applications_by_status: [],
    revenue_trend: [],
    conversion_funnel: [],
    top_countries: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Mock data
      const mockData: AnalyticsData = {
        applications_by_status: [
          { status: "Draft", count: 15, color: "bg-gray-500" },
          { status: "Submitted", count: 45, color: "bg-blue-500" },
          { status: "Under Review", count: 32, color: "bg-yellow-500" },
          { status: "Approved", count: 67, color: "bg-green-500" },
          { status: "Rejected", count: 8, color: "bg-red-500" },
        ],
        revenue_trend: [
          { date: "Week 1", revenue: 8500 },
          { date: "Week 2", revenue: 9200 },
          { date: "Week 3", revenue: 10500 },
          { date: "Week 4", revenue: 12450 },
        ],
        conversion_funnel: [
          { stage: "Website Visitors", count: 1250, percentage: 100 },
          { stage: "Sign Ups", count: 425, percentage: 34 },
          { stage: "Started Application", count: 275, percentage: 22 },
          { stage: "Submitted", count: 167, percentage: 13.4 },
          { stage: "Paid", count: 142, percentage: 11.4 },
        ],
        top_countries: [
          { country: "Kenya", applications: 95 },
          { country: "Nigeria", applications: 68 },
          { country: "Ghana", applications: 42 },
          { country: "South Africa", applications: 28 },
          { country: "Tanzania", applications: 18 },
        ],
      };
      setData(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
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

  const totalApplications = data.applications_by_status.reduce((sum, status) => sum + status.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("7")}
            className={`px-4 py-2 text-sm rounded-lg ${
              timeRange === "7"
                ? "bg-primary-600 text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange("30")}
            className={`px-4 py-2 text-sm rounded-lg ${
              timeRange === "30"
                ? "bg-primary-600 text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange("90")}
            className={`px-4 py-2 text-sm rounded-lg ${
              timeRange === "90"
                ? "bg-primary-600 text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <div className="space-y-4">
            {data.applications_by_status.map((status, index) => {
              const percentage = (status.count / totalApplications) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${status.color}`} />
                      <span className="text-sm font-medium text-gray-700">{status.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                      <span className="text-sm font-bold text-gray-900">{status.count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${status.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends</h3>
          <div className="h-64 flex items-end justify-between gap-4">
            {data.revenue_trend.map((week, index) => {
              const maxRevenue = Math.max(...data.revenue_trend.map(w => w.revenue));
              const heightPercentage = (week.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex flex-col items-center">
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      ${week.revenue.toLocaleString()}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t hover:from-primary-700 hover:to-primary-500 transition-all duration-300"
                      style={{ height: `${heightPercentage}%`, minHeight: '30px' }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{week.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
        </div>
        <div className="space-y-2">
          {data.conversion_funnel.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{stage.percentage}%</span>
                  <span className="text-sm font-bold text-gray-900">{stage.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded h-10 flex items-center">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded flex items-center justify-center text-white text-sm font-medium transition-all duration-500"
                  style={{ width: `${stage.percentage}%`, minWidth: stage.percentage > 10 ? 'auto' : '60px' }}
                >
                  {stage.percentage > 10 && `${stage.percentage}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Countries */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries by Applications</h3>
        <div className="space-y-3">
          {data.top_countries.map((country, index) => {
            const maxApplications = data.top_countries[0].applications;
            const widthPercentage = (country.applications / maxApplications) * 100;
            return (
              <div key={index} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300 w-8">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{country.country}</span>
                    <span className="text-sm font-bold text-gray-900">{country.applications} applications</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-600 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${widthPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

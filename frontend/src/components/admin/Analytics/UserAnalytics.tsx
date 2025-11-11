"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, UserCheck, UserX, Globe, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface UserAnalyticsData {
  total_users: number;
  new_this_month: number;
  active_users: number;
  inactive_users: number;
  users_by_country: { country: string; count: number }[];
  users_by_month: { month: string; count: number }[];
  conversion_rate: number;
}

export default function UserAnalytics() {
  const [data, setData] = useState<UserAnalyticsData>({
    total_users: 0,
    new_this_month: 0,
    active_users: 0,
    inactive_users: 0,
    users_by_country: [],
    users_by_month: [],
    conversion_rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAnalytics();
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      // Mock data until API is ready
      const mockData: UserAnalyticsData = {
        total_users: 247,
        new_this_month: 34,
        active_users: 189,
        inactive_users: 58,
        conversion_rate: 76.5,
        users_by_country: [
          { country: "Kenya", count: 95 },
          { country: "Nigeria", count: 68 },
          { country: "Ghana", count: 42 },
          { country: "South Africa", count: 28 },
          { country: "Others", count: 14 },
        ],
        users_by_month: [
          { month: "Jan", count: 28 },
          { month: "Feb", count: 32 },
          { month: "Mar", count: 41 },
          { month: "Apr", count: 38 },
          { month: "May", count: 45 },
          { month: "Jun", count: 34 },
        ],
      };
      setData(mockData);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      toast.error("Failed to load user analytics");
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
      <h2 className="text-2xl font-bold text-gray-900">User Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.total_users}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.new_this_month}</h3>
            </div>
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.active_users}</h3>
            </div>
            <UserCheck className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.conversion_rate}%</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Country */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Users by Country</h3>
          </div>
          <div className="space-y-3">
            {data.users_by_country.map((country, index) => {
              const percentage = (country.count / data.total_users) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{country.country}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                      <span className="text-sm font-bold text-gray-900">{country.count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly User Growth */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly User Growth</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {data.users_by_month.map((month, index) => {
              const maxUsers = Math.max(...data.users_by_month.map(m => m.count));
              const heightPercentage = (month.count / maxUsers) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex flex-col items-center">
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1">
                      {month.count} users
                    </div>
                    <div
                      className="w-full bg-green-600 rounded-t hover:bg-green-700 transition-all duration-300"
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

      {/* User Status Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <UserCheck className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{data.active_users}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-lg font-semibold text-green-600">
                {((data.active_users / data.total_users) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <UserX className="h-10 w-10 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900">{data.inactive_users}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-lg font-semibold text-gray-600">
                {((data.inactive_users / data.total_users) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

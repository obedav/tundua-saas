"use client";

import { FileText, Clock, CheckCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

interface DashboardStatsProps {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalSpent: number;
  trends?: {
    applications?: number;
    pending?: number;
    approved?: number;
    spending?: number;
  };
}

const StatsCard = ({ title, value, icon: Icon, trend, iconColor = "text-gray-400" }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}%
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default function DashboardStats({
  totalApplications,
  pendingApplications,
  approvedApplications,
  totalSpent,
  trends,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Applications"
        value={totalApplications}
        icon={FileText}
        iconColor="text-primary-600"
        trend={trends?.applications ? {
          value: trends.applications,
          isPositive: trends.applications > 0
        } : undefined}
      />

      <StatsCard
        title="Pending Review"
        value={pendingApplications}
        icon={Clock}
        iconColor="text-yellow-500"
        trend={trends?.pending ? {
          value: trends.pending,
          isPositive: trends.pending < 0 // Lower pending is better
        } : undefined}
      />

      <StatsCard
        title="Approved"
        value={approvedApplications}
        icon={CheckCircle}
        iconColor="text-green-500"
        trend={trends?.approved ? {
          value: trends.approved,
          isPositive: trends.approved > 0
        } : undefined}
      />

      <StatsCard
        title="Total Spent"
        value={`₦${typeof totalSpent === 'number' ? totalSpent.toLocaleString('en-NG') : totalSpent}`}
        icon={DollarSign}
        iconColor="text-primary-600"
        trend={trends?.spending ? {
          value: trends.spending,
          isPositive: trends.spending > 0
        } : undefined}
      />
    </div>
  );
}

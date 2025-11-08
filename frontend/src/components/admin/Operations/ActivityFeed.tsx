"use client";

import { Activity, FileText, User, DollarSign } from "lucide-react";

export default function ActivityFeed() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
        <p className="text-gray-600 mt-1">Real-time system activity monitoring</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>

        <div className="space-y-4">
          <div className="text-center text-gray-500 py-12">
            <Activity className="h-16 w-16 mx-auto mb-2 text-gray-400" />
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { BarChart3, Download } from "lucide-react";

export default function RevenueReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
          <p className="text-gray-600 mt-1">Detailed financial reports and analytics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-2" />
            <p>Revenue reports will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

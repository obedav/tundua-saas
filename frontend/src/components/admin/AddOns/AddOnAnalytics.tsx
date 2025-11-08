"use client";

import { TrendingUp, DollarSign } from "lucide-react";

export default function AddOnAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add-On Service Analytics</h1>
        <p className="text-gray-600 mt-1">Track which services are most popular</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Services</h3>
          <div className="text-center text-gray-500 py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-2 text-gray-400" />
            <p>Analytics data will appear here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service</h3>
          <div className="text-center text-gray-500 py-12">
            <DollarSign className="h-16 w-16 mx-auto mb-2 text-gray-400" />
            <p>Revenue breakdown will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

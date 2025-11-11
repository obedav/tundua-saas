"use client";

import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Notifications</h1>
        <p className="text-gray-600 mt-1">Manage admin notification center</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <Bell className="h-16 w-16 mx-auto mb-2 text-gray-400" />
          <p>No new notifications</p>
        </div>
      </div>
    </div>
  );
}

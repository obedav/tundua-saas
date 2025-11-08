"use client";

import { Settings } from "lucide-react";

export default function AddOnSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add-On Service Settings</h1>
        <p className="text-gray-600 mt-1">Configure add-on services and pricing</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <Settings className="h-16 w-16 mx-auto mb-2 text-gray-400" />
          <p>Service configuration will be available here</p>
        </div>
      </div>
    </div>
  );
}

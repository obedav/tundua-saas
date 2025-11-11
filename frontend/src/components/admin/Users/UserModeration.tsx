"use client";

import { Shield } from "lucide-react";

export default function UserModeration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Moderation</h1>
        <p className="text-gray-600 mt-1">Suspend, ban, or verify user accounts</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <Shield className="h-16 w-16 mx-auto mb-2 text-gray-400" />
          <p>Moderation tools will be available here</p>
        </div>
      </div>
    </div>
  );
}

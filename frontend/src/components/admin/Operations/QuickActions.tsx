"use client";

import { Zap, Mail, FileText, UserPlus } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { icon: UserPlus, label: "Add User", color: "bg-blue-100 text-blue-600" },
    { icon: FileText, label: "New Application", color: "bg-green-100 text-green-600" },
    { icon: Mail, label: "Send Email", color: "bg-purple-100 text-purple-600" },
    { icon: Zap, label: "Quick Action", color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-gray-50 transition-colors"
          >
            <div className={`p-3 rounded-lg ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

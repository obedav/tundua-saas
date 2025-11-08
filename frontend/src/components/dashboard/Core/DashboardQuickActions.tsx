"use client";

import Link from "next/link";
import {
  Plus,
  FileUp,
  MessageCircle,
  BookOpen,
  DollarSign,
  FileText,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  {
    title: "New Application",
    description: "Start a new study abroad application",
    icon: Plus,
    href: "/dashboard/applications/new",
    color: "text-primary-600",
    bgColor: "bg-primary-50",
  },
  {
    title: "Upload Documents",
    description: "Upload required documents",
    icon: FileUp,
    href: "/dashboard/documents",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "View Applications",
    description: "Check your application status",
    icon: FileText,
    href: "/dashboard/applications",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Add-On Services",
    description: "Browse additional services",
    icon: DollarSign,
    href: "/dashboard/addons",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Knowledge Base",
    description: "Get help and answers",
    icon: BookOpen,
    href: "/dashboard/knowledge-base",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Contact Support",
    description: "Get help from our team",
    icon: MessageCircle,
    href: "/dashboard/support",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export default function DashboardQuickActions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <div className={`${action.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

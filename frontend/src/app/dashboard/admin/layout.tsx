"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  BarChart3,
  Menu,
  X,
  LogOut,
  Shield,
  Users,
  DollarSign,
  Package,
  Zap,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Bell,
  Mail,
  School,
  ListTodo,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface NavigationSection {
  name: string;
  items: {
    name: string;
    href: string;
    icon: any;
  }[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Analytics",
    "Applications",
    "Financial",
    "Users",
    "Add-On Services",
    "Operations",
    "Content",
    "Settings"
  ]);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== "admin" && user.role !== "super_admin") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((name) => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const navigationSections: NavigationSection[] = [
    {
      name: "Analytics",
      items: [
        { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Advanced Analytics", href: "/dashboard/admin/analytics/advanced", icon: TrendingUp },
        { name: "Revenue", href: "/dashboard/admin/analytics/revenue", icon: DollarSign },
        { name: "User Analytics", href: "/dashboard/admin/analytics/users", icon: Users },
      ],
    },
    {
      name: "Applications",
      items: [
        { name: "All Applications", href: "/dashboard/admin/applications", icon: FileText },
        { name: "Documents Review", href: "/dashboard/admin/documents", icon: CheckSquare },
      ],
    },
    {
      name: "Financial",
      items: [
        { name: "Billing & Payments", href: "/dashboard/admin/financial/billing", icon: CreditCard },
        { name: "Pricing Management", href: "/dashboard/admin/financial/pricing", icon: DollarSign },
        { name: "Refund Requests", href: "/dashboard/admin/financial/refunds", icon: DollarSign },
        { name: "Revenue Reports", href: "/dashboard/admin/financial/reports", icon: BarChart3 },
      ],
    },
    {
      name: "Users",
      items: [
        { name: "User Management", href: "/dashboard/admin/users", icon: Users },
        { name: "User Moderation", href: "/dashboard/admin/users/moderation", icon: Shield },
      ],
    },
    {
      name: "Add-On Services",
      items: [
        { name: "Fulfillment", href: "/dashboard/admin/addons/fulfillment", icon: Package },
        { name: "Analytics", href: "/dashboard/admin/addons/analytics", icon: TrendingUp },
        { name: "Settings", href: "/dashboard/admin/addons/settings", icon: Settings },
      ],
    },
    {
      name: "Operations",
      items: [
        { name: "Task Management", href: "/dashboard/admin/operations/tasks", icon: ListTodo },
        { name: "Activity Feed", href: "/dashboard/admin/operations/activity", icon: Bell },
        { name: "Quick Actions", href: "/dashboard/admin/operations/quick-actions", icon: Zap },
      ],
    },
    {
      name: "Content",
      items: [
        { name: "Knowledge Base", href: "/dashboard/admin/content/knowledge-base", icon: BookOpen },
        { name: "Email Templates", href: "/dashboard/admin/content/email-templates", icon: Mail },
        { name: "University Directory", href: "/dashboard/admin/content/universities", icon: School },
      ],
    },
    {
      name: "Settings",
      items: [
        { name: "General Settings", href: "/dashboard/admin/settings", icon: Settings },
        { name: "Team Management", href: "/dashboard/admin/settings/team", icon: Users },
        { name: "Integrations", href: "/dashboard/admin/settings/integrations", icon: Zap },
      ],
    },
  ];

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
          style={{ display: 'block' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '256px',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          zIndex: 50,
          display: sidebarOpen ? 'block' : 'none',
        }}
        className="lg:!block"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            padding: '0 24px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Link href="/dashboard/admin" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }} className="space-y-1">
            {navigationSections.map((section) => {
              const isExpanded = expandedSections.includes(section.name);
              return (
                <div key={section.name} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                  >
                    <span>{section.name}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {/* Section Items */}
                  {isExpanded && (
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-primary-50 text-primary-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User info */}
          <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.first_name?.charAt(0).toUpperCase()}
                  {user?.last_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="block w-full px-4 py-2 text-sm text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mb-2"
            >
              User Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: 0 }} className="lg:!ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Shield className="h-5 w-5 text-primary-600" />
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-gray-600">
              {user?.first_name} {user?.last_name}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {user?.first_name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

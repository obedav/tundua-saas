"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Globe,
  Bell,
  Settings,
  Shield,
  FolderOpen,
  ShoppingBag,
  CreditCard,
  Gift,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Compass
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const navigationBase = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Applications", href: "/dashboard/applications", icon: FileText },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Add-On Services", href: "/dashboard/addons", icon: ShoppingBag },
  { name: "Billing & Payments", href: "/dashboard/billing", icon: CreditCard },
  { name: "Referrals", href: "/dashboard/referrals", icon: Gift },
  { name: "Refunds", href: "/dashboard/refunds", icon: RotateCcw },
  { name: "Resources", href: "/dashboard/resources", icon: Compass },
  { name: "Knowledge Base", href: "/dashboard/help", icon: BookOpen },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Add admin link for admin users
  const navigation = user?.role === "admin" || user?.role === "super_admin"
    ? [
        ...navigationBase,
        { name: "Admin Panel", href: "/dashboard/admin", icon: Shield },
      ]
    : navigationBase;

  const handleLogout = async () => {
    await logout();
  };

  // If on admin routes, don't render this layout - let admin layout handle it
  const isAdminRoute = pathname?.startsWith('/dashboard/admin');

  if (isAdminRoute) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Globe className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">Tundua</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              {/* New Application Button */}
              <Link
                href="/dashboard/applications/new"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors mt-4"
                onClick={() => setSidebarOpen(false)}
              >
                <Plus className="h-5 w-5" />
                New Application
              </Link>
            </nav>

            {/* User Menu */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            {/* Right side items */}
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

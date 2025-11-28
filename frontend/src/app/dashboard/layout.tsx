"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home, FileText, Plus, User, LogOut, Menu, X, Settings, Shield,
  FolderOpen, ShoppingBag, CreditCard, Gift, BookOpen, HelpCircle,
  Compass, Globe, ChevronLeft, ChevronRight, Search, ChevronDown,
  Moon, Sun, Monitor
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useBadgeCounts } from "@/hooks/useBadgeCounts";
import NotificationCenter from "@/components/NotificationCenter";

// Navigation structure with grouping (2025 best practice)
const navigationGroups = [
  {
    id: "main",
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home, badgeKey: null, description: "Overview and statistics" },
      { name: "Applications", href: "/dashboard/applications", icon: FileText, badgeKey: "applications", description: "Manage your applications" },
      { name: "Documents", href: "/dashboard/documents", icon: FolderOpen, badgeKey: "documents", description: "Upload and manage documents" },
    ]
  },
  {
    id: "services",
    title: "Services & Billing",
    items: [
      { name: "Add-Ons", href: "/dashboard/addons", icon: ShoppingBag, badgeKey: null, description: "Enhance your application" },
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard, badgeKey: null, description: "Payments and invoices" },
      { name: "Referrals", href: "/dashboard/referrals", icon: Gift, badgeKey: null, description: "Earn rewards" },
    ]
  },
  {
    id: "support",
    title: "Help & Support",
    items: [
      { name: "Knowledge Base", href: "/dashboard/help", icon: BookOpen, badgeKey: null, description: "Guides and tutorials" },
      { name: "Support", href: "/dashboard/support", icon: HelpCircle, badgeKey: "support", description: "Get help from our team" },
      { name: "Resources", href: "/dashboard/resources", icon: Compass, badgeKey: null, description: "Helpful resources" },
    ]
  },
  {
    id: "account",
    title: "Account",
    items: [
      { name: "Profile", href: "/dashboard/profile", icon: User, badgeKey: null, description: "Manage your profile" },
      { name: "Settings", href: "/dashboard/settings", icon: Settings, badgeKey: null, description: "Account preferences" },
    ]
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, effectiveTheme, setTheme } = useTheme();
  const { counts } = useBadgeCounts();
  const commandInputRef = useRef<HTMLInputElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapsed = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  // Command Palette (Cmd+K) with Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setThemeMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    };

    if (themeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [themeMenuOpen]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const adminGroup = user?.role === "admin" || user?.role === "super_admin"
    ? {
        id: "admin",
        title: "Administration",
        items: [{ name: "Admin Panel", href: "/dashboard/admin", icon: Shield, badgeKey: null, description: "Manage the platform" }]
      }
    : null;

  const allGroups = adminGroup ? [...navigationGroups, adminGroup] : navigationGroups;

  // Flatten all items for command palette keyboard navigation
  const allItems = allGroups.flatMap(group => group.items);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!commandPaletteOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (allItems[selectedIndex]) {
          window.location.href = allItems[selectedIndex].href;
          setCommandPaletteOpen(false);
        }
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const isAdminRoute = pathname?.startsWith('/dashboard/admin');

  if (isAdminRoute) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  // Breadcrumb type
  interface Breadcrumb {
    name: string;
    href: string;
    isLast: boolean;
    isDynamic: boolean;
  }

  // Breadcrumbs
  const getBreadcrumbs = (): Breadcrumb[] => {
    const paths = pathname.split('/').filter(Boolean);
    return paths
      .map((path, index) => {
        // Check if this is a dynamic route segment (e.g., [id])
        const isDynamic = path.startsWith('[') && path.endsWith(']');

        // For dynamic segments, use a placeholder name
        const name = isDynamic
          ? path.slice(1, -1).charAt(0).toUpperCase() + path.slice(2, -1) // Remove brackets and capitalize
          : path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return {
          name,
          href: '/' + paths.slice(0, index + 1).join('/'),
          isLast: index === paths.length - 1,
          isDynamic
        };
      })
      .filter(crumb => !crumb.isDynamic || crumb.isLast); // Filter out dynamic segments unless they're the last one
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Command Palette with Keyboard Navigation */}
        {commandPaletteOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          >
            <div
              className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={commandInputRef}
                  type="text"
                  placeholder="Search for pages, actions, or help..."
                  className="flex-1 outline-none text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  ESC
                </kbd>
              </div>
              <div className="p-2 max-h-96 overflow-y-auto">
                {allGroups.map((group) => (
                  <div key={group.id} className="mb-4">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {group.title}
                    </div>
                    {group.items.map((item, itemIndex) => {
                      const globalIndex = allItems.findIndex(i => i.href === item.href);
                      const isSelected = selectedIndex === globalIndex;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setCommandPaletteOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-primary-50 dark:bg-primary-900/20'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-2xl text-xs text-gray-500 dark:text-gray-400">
                Use <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd> to select
              </div>
            </div>
          </div>
        )}

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar with Dark Mode */}
        <div
          className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}`}
        >
          <div className="flex h-full flex-col">
            {/* Logo Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
              <Link
                href="/dashboard"
                className={`flex items-center transition-all hover:opacity-80 ${sidebarCollapsed ? 'lg:hidden' : ''}`}
                title="Dashboard Home"
              >
                <Image
                  src="/images/logo.png"
                  alt="Tundua"
                  width={140}
                  height={47}
                  className="h-10 w-auto"
                  priority
                />
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>

              <button
                onClick={toggleCollapsed}
                className="hidden lg:block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
            </div>

            {/* Search Button */}
            <div className="px-3 pt-4 pb-2">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                  sidebarCollapsed ? 'lg:justify-center' : ''
                }`}
                aria-label="Search (Cmd+K)"
              >
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-1">Search...</span>
                    <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                      ⌘K
                    </kbd>
                  </>
                )}
              </button>
            </div>

            {/* Navigation with Real-time Badge Counts */}
            <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <Link
                href="/dashboard/applications/new"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all ${
                  sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>New Application</span>}
              </Link>

              {allGroups.map((group) => (
                <div key={group.id}>
                  {!sidebarCollapsed && (
                    <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {group.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                      const badgeCount = item.badgeKey ? counts[item.badgeKey as keyof typeof counts] : 0;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                          } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                          onClick={() => setSidebarOpen(false)}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />

                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1">{item.name}</span>
                              {badgeCount > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                                  {badgeCount > 9 ? '9+' : badgeCount}
                                </span>
                              )}
                            </>
                          )}

                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 dark:bg-primary-500 rounded-r-full" />
                          )}

                          {sidebarCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                              {item.name}
                              {badgeCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-4 px-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                                  {badgeCount}
                                </span>
                              )}
                              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-0 h-0 border-4 border-transparent border-r-gray-900" />
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!sidebarCollapsed && (
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  onClick={() => setSidebarOpen(false)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span>Visit Website</span>
                </Link>
              )}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-3" ref={profileMenuRef}>
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    sidebarCollapsed ? 'lg:justify-center' : ''
                  }`}
                  aria-label="User menu"
                >
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm ring-2 ring-white dark:ring-gray-800 shadow-md">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                  </div>

                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && !sidebarCollapsed && (
                  <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
          {/* Top bar with Theme Toggle and Notification Center */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <div key={`${crumb.href}-${index}`} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                  )}
                  {crumb.isLast || crumb.isDynamic ? (
                    <span className="font-semibold text-gray-900 dark:text-white">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex-1" />

            {/* Theme Toggle */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Change theme"
              >
                {effectiveTheme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <button
                    onClick={() => { setTheme('light'); setThemeMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); setThemeMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </button>
                  <button
                    onClick={() => { setTheme('system'); setThemeMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === 'system' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </button>
                </div>
              )}
            </div>

            {/* Notification Center */}
            <NotificationCenter />
          </header>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

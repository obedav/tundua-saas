"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to prevent premature redirects
    const timer = setTimeout(() => {
      if (!loading) {
        console.log('🛡️ ProtectedRoute check:', { isAuthenticated, loading, user: user?.email });

        if (!isAuthenticated) {
          console.log('❌ Not authenticated, redirecting to login');
          router.push("/auth/login");
        } else if (requireAdmin && user?.role !== "admin" && user?.role !== "super_admin") {
          console.log('❌ Not admin, redirecting to dashboard');
          router.push("/dashboard");
        } else {
          console.log('✅ Access granted');
        }
      }
    }, 300); // Wait 300ms before checking

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, requireAdmin, router]);

  // Show loading state for longer to prevent flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // During the auth check, show loading instead of redirecting immediately
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && user?.role !== "admin" && user?.role !== "super_admin") {
    return null;
  }

  return <>{children}</>;
}

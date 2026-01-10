"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userRole = searchParams.get("user_role");
    const error = searchParams.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      router.push("/auth/login");
      return;
    }

    if (accessToken && refreshToken) {
      // Store tokens - IMPORTANT: path: '/' ensures cookies are available site-wide
      Cookies.set("auth_token", accessToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/", // Required for cookie to be available on all routes
      });

      Cookies.set("refresh_token", refreshToken, {
        expires: 30, // 30 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/", // Required for cookie to be available on all routes
      });

      toast.success("Successfully logged in with Google!");

      // Redirect based on role
      if (userRole === "admin" || userRole === "super_admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      toast.error("Authentication failed. Please try again.");
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Authentication
        </h2>
        <p className="text-gray-600">
          Please wait while we sign you in...
        </p>
      </div>
    </div>
  );
}

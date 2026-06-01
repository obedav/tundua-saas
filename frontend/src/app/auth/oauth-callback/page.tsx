"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

const LoadingCard = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Completing Authentication
      </h2>
      <p className="text-gray-600">Please wait while we sign you in...</p>
    </div>
  </div>
);

// Separated into its own component so the Suspense boundary above it
// can satisfy Next.js App Router's requirement for useSearchParams().
// Without this, searchParams is empty on initial render and the user
// gets redirected back to /auth/login even with valid tokens in the URL.
function OAuthCallbackHandler() {
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
      Cookies.set("auth_token", accessToken, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      Cookies.set("refresh_token", refreshToken, {
        expires: 30,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      toast.success("Successfully logged in with Google!");

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

  return <LoadingCard />;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <OAuthCallbackHandler />
    </Suspense>
  );
}

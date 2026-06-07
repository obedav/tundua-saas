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
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      router.push("/auth/login");
      return;
    }

    if (!code) {
      toast.error("Authentication failed. Please try again.");
      router.push("/auth/login");
      return;
    }

    // Exchange the one-time code for tokens via a POST request.
    // Tokens are never placed in the URL, so they are not captured by
    // analytics scripts, server logs, or browser history.
    async function exchangeCode() {
      try {
        const res = await fetch(
          `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/auth/exchange`,
          {
            method: "POST",
            credentials: "include", // sends the PHP session cookie
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        if (!res.ok) {
          toast.error("Authentication failed. Please try again.");
          router.push("/auth/login");
          return;
        }

        const data = await res.json();

        if (!data.success || !data.access_token) {
          toast.error(data.error || "Authentication failed. Please try again.");
          router.push("/auth/login");
          return;
        }

        Cookies.set("auth_token", data.access_token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        Cookies.set("refresh_token", data.refresh_token, {
          expires: 30,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        toast.success("Successfully logged in with Google!");

        // Use a full page navigation instead of SPA router.push so that
        // AuthContext re-initialises AFTER the cookies are in the browser.
        // router.push would preserve the stale isAuthenticated=false state
        // that was set before the tokens arrived, causing an immediate
        // redirect back to /auth/login by ProtectedRoute.
        const destination =
          data.user_role === "admin" || data.user_role === "super_admin"
            ? "/dashboard/admin"
            : "/dashboard";
        window.location.href = destination;
      } catch {
        toast.error("Authentication failed. Please try again.");
        router.push("/auth/login");
      }
    }

    exchangeCode();
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

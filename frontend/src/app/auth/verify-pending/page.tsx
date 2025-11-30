"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function VerifyPendingPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const response = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL']}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error(data.message || data.error || "Failed to resend email.");
      }
    } catch (_error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We&apos;ve sent a verification link to:
            </p>
            <p className="text-lg font-semibold text-primary-600 mt-2 break-all">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Next Steps:
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Check your email inbox for a message from Tundua</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>You&apos;ll be redirected to login once verified</span>
              </li>
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              📬 Didn&apos;t receive the email?
            </p>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes - it may be delayed</li>
              <li>• Click the button below to resend</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Resend Verification Email
                </>
              )}
            </button>

            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Already Verified? Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            The verification link will expire in 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { clientEnv } from "@/lib/env";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const passwordValue = watch("password") || "";

  // Password strength indicators
  const passwordChecks = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  };

  useEffect(() => {
    if (!token) {
      setTokenError("Missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
      } else {
        if (result.error?.includes("expired") || result.error?.includes("invalid")) {
          setTokenError("This reset link has expired. Please request a new one.");
        } else {
          toast.error(result.error || "Failed to reset password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show token error state
  if (tokenError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Invalid Reset Link
        </h2>

        <p className="text-gray-600 mb-8">
          {tokenError}
        </p>

        <Link href="/auth/forgot-password">
          <Button variant="primary" size="lg" className="w-full">
            Request New Reset Link
          </Button>
        </Link>
      </motion.div>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Password Reset!
        </h2>

        <p className="text-gray-600 mb-8">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>

        <Link href="/auth/login">
          <Button variant="primary" size="lg" className="w-full">
            Sign in
          </Button>
        </Link>
      </motion.div>
    );
  }

  // Show form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Create new password
        </h2>
        <p className="text-gray-600">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.password
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-primary-500 hover:border-gray-300"
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          )}

          {/* Password Strength Indicators */}
          {passwordValue && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {Object.entries(passwordChecks).map(([key, passed]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      passed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span>
                      {key === "length" && "8+ characters"}
                      {key === "uppercase" && "Uppercase"}
                      {key === "lowercase" && "Lowercase"}
                      {key === "number" && "Number"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.confirmPassword
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-primary-500 hover:border-gray-300"
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 z-10"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      {/* Back Link */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="flex min-h-screen">
        {/* Left Side - Brand */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-primary-50/50 via-white to-blue-50/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/40 to-blue-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-100/30 to-purple-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
            {/* Logo */}
            <div>
              <Link href="/" className="inline-block group">
                <Image
                  src="/images/logo.png"
                  alt="Tundua Edu Consults - Home"
                  width={180}
                  height={60}
                  className="h-12 w-auto transition-opacity group-hover:opacity-80"
                  priority
                />
              </Link>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
                  Almost there!
                  <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Set your new password
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                  Create a strong password to keep your account secure.
                </p>
              </motion.div>

              {/* Security Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-3">Password tips:</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>Use at least 8 characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>Mix uppercase and lowercase letters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>Include at least one number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>Avoid using personal information</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <div />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 xl:w-[55%] flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo.png"
                  alt="Tundua Edu Consults - Home"
                  width={160}
                  height={53}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            <Suspense fallback={
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-gray-900 transition-colors">
                  Terms
                </Link>
                <span>•</span>
                <Link href="/support" className="hover:text-gray-900 transition-colors">
                  Support
                </Link>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                © 2025 Tundua Edu Consults. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

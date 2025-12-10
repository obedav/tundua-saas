"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Input, Button, Alert } from "@/components/ui";
import { loginAction } from "@/lib/actions/auth";
import { useAuthContext } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Client Component - Login Form
 * Uses Server Actions for secure authentication with HttpOnly cookies
 */
export default function LoginForm() {
  // Router not needed - using checkAuth callback
  const { checkAuth } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");



  const handleSocialLogin = async (_provider: 'google') => {
    window.location.href = `${process.env['NEXT_PUBLIC_API_URL']}/api/auth/google?user_type=student`;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Create FormData for server action
      const formData = new FormData();
      formData.append('email', data.email.trim());
      formData.append('password', data.password);

      // Call server action
      const result = await loginAction(null, formData);

      if (result.success) {
        // Show success state
        setLoginSuccess(true);
        toast.success("Login successful! Redirecting...");

        // Wait for cookie to be fully set and propagated
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Refresh auth context
        console.log('🔄 Refreshing auth context after login...');
        await checkAuth();
        console.log('✅ Auth context refreshed, isAuthenticated should be true');

        // Wait a bit more to ensure auth context is fully updated
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect based on role with full page reload
        console.log('🚀 Redirecting to dashboard...');
        if (result.data?.user?.role === "admin" || result.data?.user?.role === "super_admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        // Check if email verification is required
        if (result.error?.includes('verify your email') || (result as any).email_not_verified) {
          toast.error(result.error || "Please verify your email address first.");
          // Redirect to verify-pending page after a short delay
          setTimeout(() => {
            window.location.href = `/auth/verify-pending?email=${encodeURIComponent(data.email)}`;
          }, 2000);
        } else {
          toast.error(result.error || "Login failed. Please check your credentials.");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      if (!loginSuccess) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Success Animation */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900">Login Successful!</p>
              <p className="text-gray-600 mt-2">Redirecting to your dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Card */}
      <motion.div
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10"
      >
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to continue your journey
          </p>
        </div>

        {/* Trust Signal */}
        <Alert variant="info" showIcon={false} className="mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm">
              <span className="font-semibold">Secure login.</span> Your data is encrypted and protected.
            </p>
          </div>
        </Alert>

        {/* Social Login Button */}
        <div className="mb-8">
          <Button
            type="button"
            onClick={() => handleSocialLogin('google')}
            variant="outline"
            size="lg"
            className="w-full"
            leftIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          >
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">
              or sign in with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <Input
              {...register("email")}
              type="email"
              label="Email address"
              placeholder="your@email.com"
              leftIcon={<Mail className="h-5 w-5" />}
              rightIcon={touchedFields.email && emailValue && !errors.email ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : undefined}
              error={errors.email?.message}
              state={errors.email ? "error" : touchedFields.email && emailValue ? "success" : "default"}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" aria-hidden="true" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : touchedFields.password && passwordValue
                    ? "border-green-300 focus:border-primary-500"
                    : "border-gray-200 focus:border-primary-500 hover:border-gray-300"
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1 z-10"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                <span className="font-medium">{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer transition-colors"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700 select-none group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading}
            rightIcon={!isLoading ? <ArrowRight className="h-5 w-5" /> : undefined}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Keyboard Hint */}
          <p className="text-xs text-center text-gray-500 mt-3">
            Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter ↵</kbd> to sign in
          </p>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
}

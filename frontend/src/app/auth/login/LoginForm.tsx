"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { useAuthContext } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const inputBase = "w-full pl-11 pr-4 py-3 border-2 rounded-xl text-sm text-gray-900 dark:text-white dark:bg-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all";
const inputDefault = `${inputBase} border-gray-300 dark:border-gray-600 focus:border-primary-500 hover:border-primary-400`;
const inputError = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-500/20`;

export default function LoginForm() {
  const { checkAuth } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const handleSocialLogin = () => {
    window.location.href = `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/auth/google?user_type=student`;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', data.email.trim());
      formData.append('password', data.password);

      const result = await loginAction(null, formData);

      if (result.success) {
        setLoginSuccess(true);
        toast.success("Welcome back!");
        await new Promise(r => setTimeout(r, 1000));
        await checkAuth();
        await new Promise(r => setTimeout(r, 500));

        if (result.data?.user?.role === "admin" || result.data?.user?.role === "super_admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        if (result.error?.includes('verify your email') || (result as any).email_not_verified) {
          toast.error(result.error || "Please verify your email address first.");
          setTimeout(() => {
            window.location.href = `/auth/verify-pending?email=${encodeURIComponent(data.email)}`;
          }, 2000);
        } else {
          toast.error(result.error || "Invalid email or password.");
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      if (!loginSuccess) setIsLoading(false);
    }
  };

  return (
    <>
      {/* Success Overlay */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">You&apos;re in!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Redirecting to dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800/95 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 border border-gray-200 dark:border-gray-700/50 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to continue your journey
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleSocialLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400 dark:text-gray-500">or</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                {...register("email")}
                type="email"
                id="email"
                autoComplete="email"
                className={errors.email ? inputError : inputDefault}
                placeholder="you@email.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                className={errors.password ? inputError : inputDefault}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 select-none group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Keep me signed in
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign in <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        {/* Sign Up */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          New here?{" "}
          <Link href="/auth/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}

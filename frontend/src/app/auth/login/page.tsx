"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Users, Award, Globe, Shield, CheckCircle2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Auto-focus email field on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSocialLogin = async (provider: 'google') => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?user_type=student`;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await apiClient.login(data.email, data.password);

      if (response.data.success) {
        // Set cookies
        const cookieExpiry = data.rememberMe ? 30 : 7;

        Cookies.set("auth_token", response.data.data.access_token, {
          expires: cookieExpiry,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        Cookies.set("refresh_token", response.data.data.refresh_token, {
          expires: cookieExpiry,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Show success state
        setLoginSuccess(true);
        toast.success("Login successful! Redirecting...");

        // Redirect after brief delay
        setTimeout(() => {
          if (response.data.data.user.role === "admin" || response.data.data.user.role === "super_admin") {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
    } finally {
      if (!loginSuccess) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="flex min-h-screen">
        {/* Left Side - Brand & Marketing */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-primary-50/50 via-white to-blue-50/50 relative overflow-hidden">
          {/* Brand color gradient accents */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/40 to-blue-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-100/30 to-purple-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-blue-100/20 to-primary-100/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

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
            <div className="space-y-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    Welcome back to your
                    <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      study abroad journey
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                    Continue exploring opportunities at world-class universities and manage your applications with ease.
                  </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-3 gap-6 mt-12"
                >
                  <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <Globe className="w-8 h-8 text-primary-600 mx-auto mb-3" aria-hidden="true" />
                    <div className="text-3xl font-bold text-gray-900">906</div>
                    <div className="text-sm text-gray-600 mt-1">Universities</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" aria-hidden="true" />
                    <div className="text-3xl font-bold text-gray-900">5K+</div>
                    <div className="text-sm text-gray-600 mt-1">Students</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <Award className="w-8 h-8 text-primary-700 mx-auto mb-3" aria-hidden="true" />
                    <div className="text-3xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600 mt-1">Success Rate</div>
                  </div>
                </motion.div>
              </div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4"
              >
                {[
                  { icon: CheckCircle2, text: "Track all your applications in one place" },
                  { icon: CheckCircle2, text: "Get personalized university recommendations" },
                  { icon: CheckCircle2, text: "Access expert guidance 24/7" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="text-base">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-primary-500 mb-3" aria-hidden="true" />
              <p className="text-gray-700 italic mb-4">
                "Tundua made my study abroad journey seamless. The platform is intuitive and the support is exceptional."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md" aria-hidden="true">
                  SJ
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">University of Manchester</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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

            {/* Success Animation */}
            <AnimatePresence>
              {loginSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back
                </h2>
                <p className="text-gray-600">
                  Sign in to continue your journey
                </p>
              </div>

              {/* Trust Signal */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-primary-50 rounded-xl border border-primary-100">
                <Shield className="w-5 h-5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Secure login.</span> Your data is encrypted and protected.
                </p>
              </div>

              {/* Social Login Button */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full h-12 flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm transition-all text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Sign in with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                    <input
                      {...register("email")}
                      ref={(e) => {
                        register("email").ref(e);
                        emailInputRef.current = e;
                      }}
                      type="email"
                      id="email"
                      autoComplete="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                        errors.email
                          ? "border-red-300 focus:border-red-500"
                          : touchedFields.email && emailValue
                          ? "border-green-300 focus:border-primary-500"
                          : "border-gray-200 focus:border-primary-500 hover:border-gray-300"
                      }`}
                      placeholder="your@email.com"
                      disabled={isLoading}
                    />
                    {touchedFields.email && emailValue && !errors.email && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" aria-hidden="true" />
                    )}
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                      <span className="font-medium">{errors.email.message}</span>
                    </p>
                  )}
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
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
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
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer transition-colors"
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 px-4 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98]"
                  aria-label="Sign in to your account"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" aria-hidden="true" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </button>

                {/* Keyboard Hint */}
                <p className="text-xs text-center text-gray-500 mt-3">
                  Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter ↵</kbd> to sign in
                </p>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <Link href="/privacy" className="hover:text-gray-900 transition-colors focus:outline-none focus:underline">
                  Privacy
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/terms" className="hover:text-gray-900 transition-colors focus:outline-none focus:underline">
                  Terms
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/support" className="hover:text-gray-900 transition-colors focus:outline-none focus:underline">
                  Support
                </Link>
              </div>
              <p className="text-xs text-gray-500 mt-3">© 2025 Tundua Edu Consults. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

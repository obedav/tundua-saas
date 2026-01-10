"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { clientEnv } from "@/lib/env";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  const emailValue = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email.trim().toLowerCase() }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmittedEmail(data.email);
        setIsSuccess(true);
        toast.success("Password reset instructions sent!");
      } else {
        toast.error(result.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="flex min-h-screen">
        {/* Left Side - Brand */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-primary-50/50 via-white to-blue-50/50 relative overflow-hidden">
          {/* Brand color gradient accents */}
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
                  Forgot your
                  <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    password?
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                  No worries! Enter your email address and we&apos;ll send you instructions to reset your password.
                </p>
              </motion.div>

              {/* Help Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-semibold">1</span>
                      <span>Check your email inbox for a reset link</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-semibold">2</span>
                      <span>Click the link to create a new password</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-semibold">3</span>
                      <span>Sign in with your new password</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-gray-600"
            >
              <p>
                Need help?{" "}
                <Link href="/support" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Contact Support
                </Link>
              </p>
            </motion.div>
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

            {/* Back Link */}
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to sign in</span>
            </Link>

            {!isSuccess ? (
              /* Form Card */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10"
              >
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Reset password
                  </h2>
                  <p className="text-gray-600">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  {/* Email */}
                  <div>
                    <Input
                      {...register("email")}
                      type="email"
                      label="Email address"
                      placeholder="your@email.com"
                      leftIcon={<Mail className="h-5 w-5" />}
                      rightIcon={
                        touchedFields.email && emailValue && !errors.email ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : undefined
                      }
                      error={errors.email?.message}
                      state={
                        errors.email
                          ? "error"
                          : touchedFields.email && emailValue
                          ? "success"
                          : "default"
                      }
                      disabled={isLoading}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isLoading}
                    rightIcon={!isLoading ? <Send className="h-5 w-5" /> : undefined}
                  >
                    {isLoading ? "Sending..." : "Send reset link"}
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Check your email
                </h2>

                <p className="text-gray-600 mb-6">
                  We&apos;ve sent password reset instructions to:
                </p>

                <p className="font-semibold text-gray-900 bg-gray-50 rounded-lg py-3 px-4 mb-8">
                  {submittedEmail}
                </p>

                <div className="space-y-4 text-sm text-gray-600 mb-8">
                  <p>
                    Didn&apos;t receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      try again
                    </button>
                  </p>
                </div>

                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Button>
                </Link>
              </motion.div>
            )}

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

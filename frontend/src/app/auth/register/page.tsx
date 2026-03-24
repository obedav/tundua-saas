"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Phone, Eye, EyeOff, ArrowRight, ArrowLeft,
  CheckCircle, GraduationCap, Briefcase, Check, Globe, Users, Target,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

const registerSchema = z.object({
  first_name: z.string().min(2, "Min 2 characters"),
  last_name: z.string().min(2, "Min 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Need one uppercase")
    .regex(/[a-z]/, "Need one lowercase")
    .regex(/[0-9]/, "Need one number"),
  confirm_password: z.string(),
  user_type: z.enum(["student", "partner"]),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const inputBase = "w-full pl-11 pr-4 py-3 border-2 rounded-xl text-sm text-gray-900 dark:text-white dark:bg-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all";
const inputDefault = `${inputBase} border-gray-300 dark:border-gray-600 focus:border-primary-500 hover:border-primary-400`;
const inputError = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-500/20`;

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<"student" | "partner" | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const password = watch("password");
  const checks = {
    "8+": password?.length >= 8,
    "A-Z": /[A-Z]/.test(password || ""),
    "a-z": /[a-z]/.test(password || ""),
    "0-9": /[0-9]/.test(password || ""),
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          toast.success("Account created! Check your email.");
          router.push(`/auth/verify-pending?email=${encodeURIComponent(data.email)}`);
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToStep2 = () => {
    const v = watch();
    if (!v.first_name || !v.last_name || !v.email || !v.password || !v.confirm_password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (Object.keys(errors).some(k => ["first_name", "last_name", "email", "password", "confirm_password"].includes(k))) {
      toast.error("Please fix errors first");
      return;
    }
    setCurrentStep(2);
  };

  const selectType = (type: "student" | "partner") => {
    setSelectedType(type);
    register("user_type").onChange({ target: { name: "user_type", value: type } } as any);
  };

  return (
    <AuthLayout
      heading="Begin your journey to"
      headingAccent="world-class education"
      subtitle="Join thousands of students who have successfully applied to their dream universities."
      stats={[
        { icon: <Globe className="w-5 h-5 text-white" />, value: "906", label: "Universities" },
        { icon: <Users className="w-5 h-5 text-white" />, value: "20+", label: "Countries" },
        { icon: <Target className="w-5 h-5 text-white" />, value: "7-14", label: "Days Process" },
      ]}
      features={[
        "Smart university matching based on your profile",
        "Streamlined application management",
        "Expert support throughout your journey",
      ]}
      testimonial={{
        quote: "Creating an account was seamless, and the application process was incredibly smooth!",
        name: "Michael Chen",
        school: "University of Toronto",
        initials: "MC",
      }}
    >
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
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
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Account created!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check your email to verify...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-900 dark:text-white">Step {currentStep} of 2</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentStep === 1 ? "Your details" : "Account type"}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            animate={{ width: currentStep === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800/95 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 border border-gray-200 dark:border-gray-700/50 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start your study abroad journey</p>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() => { window.location.href = `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/auth/google?user_type=student`; }}
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
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400 dark:text-gray-500">or</span>
                </div>
              </div>

              <form className="space-y-3">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">First name</label>
                    <input {...register("first_name")} className={errors.first_name ? inputError : inputDefault} placeholder="Ade" disabled={isLoading} style={{ paddingLeft: '0.75rem' }} />
                    {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Last name</label>
                    <input {...register("last_name")} className={errors.last_name ? inputError : inputDefault} placeholder="Ogundimu" disabled={isLoading} style={{ paddingLeft: '0.75rem' }} />
                    {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input {...register("email")} type="email" className={errors.email ? inputError : inputDefault} placeholder="you@email.com" disabled={isLoading} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input {...register("phone")} type="tel" className={inputDefault} placeholder="+234 801 234 5678" disabled={isLoading} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input {...register("password")} type={showPassword ? "text" : "password"} className={errors.password ? inputError : inputDefault} placeholder="Create a password" disabled={isLoading} style={{ paddingRight: '2.75rem' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" tabIndex={-1}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                  {password && (
                    <div className="flex gap-1.5 mt-2">
                      {Object.entries(checks).map(([label, ok]) => (
                        <span key={label} className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${ok ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"}`}>
                          {ok && <Check className="inline h-2.5 w-2.5 mr-0.5" />}{label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input {...register("confirm_password")} type={showConfirm ? "text" : "password"} className={errors.confirm_password ? inputError : inputDefault} placeholder="Repeat password" disabled={isLoading} style={{ paddingRight: '2.75rem' }} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" tabIndex={-1}>
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && <p className="mt-1 text-xs text-red-600">{errors.confirm_password.message}</p>}
                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={goToStep2}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">Sign in</Link>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose your path</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">How will you use Tundua?</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {[
                  { type: "student" as const, icon: GraduationCap, title: "Student", desc: "I want to study abroad" },
                  { type: "partner" as const, icon: Briefcase, title: "Agency Partner", desc: "I'm an education agency" },
                ].map(({ type, icon: Icon, title, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => selectType(type)}
                    className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedType === type
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg transition-colors ${selectedType === type ? "bg-primary-600" : "bg-gray-100 dark:bg-gray-700"}`}>
                        <Icon className={`h-5 w-5 ${selectedType === type ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                      </div>
                      {selectedType === type && (
                        <div className="bg-primary-600 rounded-full p-1">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {errors.user_type && <p className="text-xs text-red-600 text-center">{errors.user_type.message}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !selectedType}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-500/20"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Create account <CheckCircle className="h-4 w-4" /></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}

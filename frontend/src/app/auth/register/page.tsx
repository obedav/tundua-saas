"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {

  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Check,
  Sparkles,
  Globe,
  Users,
  Target,
  Info
} from "lucide-react";
import { Input, Button, Badge, Tooltip } from "@/components/ui";

const registerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirm_password: z.string(),
  user_type: z.enum(["student", "partner"]),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<"student" | "partner" | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
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
          toast.success("Registration successful! Please check your email to verify your account.");
          router.push(`/auth/verify-pending?email=${encodeURIComponent(data.email)}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    const firstName = watch("first_name");
    const lastName = watch("last_name");
    const email = watch("email");
    const password = watch("password");
    const confirmPassword = watch("confirm_password");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    const step1Fields = ["first_name", "last_name", "email", "password", "confirm_password"];
    if (Object.keys(errors).some(key => step1Fields.includes(key as any))) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    setCurrentStep(2);
  };

  const handleSelectUserType = (type: "student" | "partner") => {
    setSelectedUserType(type);
    const event = {
      target: {
        name: "user_type",
        value: type,
      },
    };
    register("user_type").onChange(event as any);
  };

  const handleSocialSignup = async (provider: 'google' | 'microsoft' | 'apple') => {
    if (provider === 'google') {
      window.location.href = `${process.env['NEXT_PUBLIC_API_URL']}/api/auth/google?user_type=student`;
    } else {
      toast.info(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup coming soon!`);
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
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo.png"
                  alt="Tundua Edu Consults"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
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
                  <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    Begin your journey to
                    <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      world-class education
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                    Join thousands of students who have successfully applied to their dream universities through our platform.
                  </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-12"
                >
                  <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm">
                    <Globe className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900">906</div>
                    <div className="text-sm text-gray-600 mt-1">Universities</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 shadow-sm">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900">20+</div>
                    <div className="text-sm text-gray-600 mt-1">Countries</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm">
                    <Target className="w-8 h-8 text-primary-700 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900">7-14</div>
                    <div className="text-sm text-gray-600 mt-1">Days Process</div>
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
                  { icon: "✓", text: "Smart university matching based on your profile" },
                  { icon: "✓", text: "Streamlined application management" },
                  { icon: "✓", text: "Expert support throughout your journey" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {item.icon}
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
              <Sparkles className="w-5 h-5 text-primary-500 mb-3" />
              <p className="text-gray-700 italic mb-4">
                &quot;Creating an account was seamless, and the application process was incredibly smooth!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md">
                  MC
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-600">University of Toronto</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 xl:w-[55%] flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo.png"
                  alt="Tundua Edu Consults"
                  width={160}
                  height={53}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="bg-white rounded-full p-8 shadow-2xl"
                  >
                    <CheckCircle className="w-20 h-20 text-green-500" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">
                  Step {currentStep} of 2
                </span>
                <span className="text-sm text-gray-600">
                  {currentStep === 1 ? "Personal Information" : "Account Type"}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Form Card */}
            <motion.div
              layout
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10"
            >
              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Create account
                      </h2>
                      <p className="text-gray-600">
                        Start your study abroad journey today
                      </p>
                    </div>

                    {/* Social Signup Buttons */}
                    <div className="space-y-3 mb-8">
                      <Button
                        type="button"
                        onClick={() => handleSocialSignup('google')}
                        variant="outline"
                        size="lg"
                        className="w-full"
                        leftIcon={
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                          or continue with email
                        </span>
                      </div>
                    </div>

                    <form className="space-y-5">
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          {...register("first_name")}
                          label="First name"
                          placeholder="John"
                          error={errors.first_name?.message}
                          disabled={isLoading}
                          state={errors.first_name ? "error" : "default"}
                        />
                        <Input
                          {...register("last_name")}
                          label="Last name"
                          placeholder="Doe"
                          error={errors.last_name?.message}
                          disabled={isLoading}
                          state={errors.last_name ? "error" : "default"}
                        />
                      </div>

                      {/* Email */}
                      <Input
                        {...register("email")}
                        type="email"
                        label="Email address"
                        placeholder="your@email.com"
                        leftIcon={<Mail className="h-5 w-5" />}
                        error={errors.email?.message}
                        disabled={isLoading}
                        state={errors.email ? "error" : "default"}
                      />

                      {/* Phone (Optional) */}
                      <Input
                        {...register("phone")}
                        type="tel"
                        label="Phone"
                        placeholder="+1 (555) 123-4567"
                        leftIcon={<Phone className="h-5 w-5" />}
                        disabled={isLoading}
                      />

                      {/* Password */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-900"
                          >
                            Password
                          </label>
                          <Tooltip content="Must contain at least 8 characters, one uppercase, one lowercase, and one number">
                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                          <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 placeholder:text-gray-400 ${
                              errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                            }`}
                            placeholder="••••••••"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
                        )}

                        {/* Password Strength Indicators */}
                        {password && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge
                              variant={passwordChecks.length ? "success" : "default"}
                              size="sm"
                              dot={passwordChecks.length}
                            >
                              8+ characters
                            </Badge>
                            <Badge
                              variant={passwordChecks.uppercase ? "success" : "default"}
                              size="sm"
                              dot={passwordChecks.uppercase}
                            >
                              Uppercase
                            </Badge>
                            <Badge
                              variant={passwordChecks.lowercase ? "success" : "default"}
                              size="sm"
                              dot={passwordChecks.lowercase}
                            >
                              Lowercase
                            </Badge>
                            <Badge
                              variant={passwordChecks.number ? "success" : "default"}
                              size="sm"
                              dot={passwordChecks.number}
                            >
                              Number
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label
                          htmlFor="confirm_password"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Confirm password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                          <input
                            {...register("confirm_password")}
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm_password"
                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 placeholder:text-gray-400 ${
                              errors.confirm_password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                            }`}
                            placeholder="••••••••"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.confirm_password && (
                          <p className="mt-1.5 text-xs text-red-600">{errors.confirm_password.message}</p>
                        )}
                      </div>

                      {/* Next Button */}
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        variant="primary"
                        size="lg"
                        className="w-full mt-6"
                        rightIcon={<ArrowRight className="h-5 w-5" />}
                        disabled={isLoading}
                      >
                        Continue
                      </Button>

                      {/* Sign In Link */}
                      <div className="text-center mt-6">
                        <p className="text-gray-600">
                          Already have an account?{" "}
                          <Link
                            href="/auth/login"
                            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Choose your path
                      </h2>
                      <p className="text-gray-600">
                        Select the type of account you want to create
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Role Selection Cards */}
                      <div className="space-y-4">
                        {/* Student Card */}
                        <motion.button
                          type="button"
                          onClick={() => handleSelectUserType("student")}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`relative w-full p-5 sm:p-6 rounded-2xl border-2 transition-all text-left ${
                            selectedUserType === "student"
                              ? "border-primary-600 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-100"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-4 rounded-xl transition-all ${
                                selectedUserType === "student"
                                  ? "bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg"
                                  : "bg-gray-100"
                              }`}
                            >
                              <GraduationCap
                                className={`h-7 w-7 ${
                                  selectedUserType === "student"
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
                                Student
                              </h3>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                I want to study abroad and need help with my application
                              </p>
                            </div>
                            {selectedUserType === "student" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-6 right-6"
                              >
                                <div className="bg-primary-600 rounded-full p-1.5 shadow-lg">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.button>

                        {/* Partner Card */}
                        <motion.button
                          type="button"
                          onClick={() => handleSelectUserType("partner")}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`relative w-full p-5 sm:p-6 rounded-2xl border-2 transition-all text-left ${
                            selectedUserType === "partner"
                              ? "border-primary-600 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-100"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-4 rounded-xl transition-all ${
                                selectedUserType === "partner"
                                  ? "bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg"
                                  : "bg-gray-100"
                              }`}
                            >
                              <Briefcase
                                className={`h-7 w-7 ${
                                  selectedUserType === "partner"
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
                                Agency Partner
                              </h3>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                I&apos;m an education agency or recruitment partner
                              </p>
                            </div>
                            {selectedUserType === "partner" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-6 right-6"
                              >
                                <div className="bg-primary-600 rounded-full p-1.5 shadow-lg">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      </div>

                      {errors.user_type && (
                        <p className="text-sm text-red-600 text-center">
                          {errors.user_type.message}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          variant="secondary"
                          size="lg"
                          className="flex-1"
                          leftIcon={<ArrowLeft className="h-5 w-5" />}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading || !selectedUserType}
                          variant="primary"
                          size="lg"
                          className="flex-1"
                          loading={isLoading}
                          rightIcon={!isLoading ? <CheckCircle className="h-5 w-5" /> : undefined}
                        >
                          {isLoading ? "Creating account..." : "Create account"}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

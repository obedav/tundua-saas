"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Users, Award, Globe, CheckCircle2 } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex min-h-screen">
        {/* Left Side - Brand & Marketing */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-primary-800 dark:via-primary-900 dark:to-gray-950 relative overflow-hidden">
          {/* Premium gradient overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-400/30 to-blue-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/20 to-primary-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-white/5 to-primary-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

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
                  <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                    Welcome back to your
                    <span className="block mt-2 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                      study abroad journey
                    </span>
                  </h1>
                  <p className="text-lg text-primary-100 mt-6 leading-relaxed">
                    Continue exploring opportunities at world-class universities and manage your applications with ease.
                  </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mt-12"
                >
                  <div className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-bold text-white">906</div>
                    <div className="text-sm text-primary-200 mt-1 font-medium">Universities</div>
                  </div>
                  <div className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-bold text-white">5K+</div>
                    <div className="text-sm text-primary-200 mt-1 font-medium">Students</div>
                  </div>
                  <div className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-bold text-white">98%</div>
                    <div className="text-sm text-primary-200 mt-1 font-medium">Success Rate</div>
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
                  <div key={index} className="flex items-center gap-4 text-white/90">
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-base font-medium">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
            >
              <Sparkles className="w-5 h-5 text-primary-200 mb-3" aria-hidden="true" />
              <p className="text-white/90 italic mb-4 leading-relaxed">
                &ldquo;Tundua made my study abroad journey seamless. The platform is intuitive and the support is exceptional.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20" aria-hidden="true">
                  SJ
                </div>
                <div>
                  <div className="font-semibold text-white">Sarah Johnson</div>
                  <div className="text-sm text-primary-200">University of Manchester</div>
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

            {/* Login Form Component */}
            <LoginForm />

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:underline">
                  Privacy
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:underline">
                  Terms
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/support" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:underline">
                  Support
                </Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">© 2026 Tundua Edu Consults. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

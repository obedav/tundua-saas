"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Users, Award, Globe, CheckCircle2 } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {

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
                  <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
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
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-12"
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
                &ldquo;Tundua made my study abroad journey seamless. The platform is intuitive and the support is exceptional.&rdquo;
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

            {/* Login Form Component */}
            <LoginForm />

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

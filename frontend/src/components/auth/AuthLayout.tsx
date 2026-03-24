"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  headingAccent: string;
  subtitle: string;
  stats: Stat[];
  features: string[];
  testimonial: {
    quote: string;
    name: string;
    school: string;
    initials: string;
  };
}

export default function AuthLayout({
  children,
  heading,
  headingAccent,
  subtitle,
  stats,
  features,
  testimonial,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex min-h-screen">
        {/* Left Panel — Brand */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden">
          {/* Multi-layer background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900" />

          {/* Mesh gradient orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-500/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] bg-violet-600/30 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px]" />

          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Diagonal lines accent */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, white 40px, white 41px)',
            }}
          />

          {/* Glow line at the edge */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
            {/* Logo */}
            <Link href="/" className="inline-block group w-fit">
              <Image
                src="/images/logo.png"
                alt="Tundua Edu Consults"
                width={180}
                height={60}
                className="h-10 w-auto transition-opacity group-hover:opacity-80"
                priority
              />
            </Link>

            {/* Main content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl xl:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight">
                  {heading}
                  <span className="block mt-1 bg-gradient-to-r from-primary-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                    {headingAccent}
                  </span>
                </h1>
                <p className="text-base text-gray-400 mt-5 leading-relaxed max-w-sm">{subtitle}</p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-3 gap-3"
              >
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="text-center p-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-white/15 transition-all">
                      {stat.icon}
                    </div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2.5"
              >
                {features.map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-primary-400" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-4 rounded-xl bg-white/[0.06] border border-white/[0.08]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-violet-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-primary-500/20">
                  {testimonial.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-semibold text-white">{testimonial.name}</span>
                    <span className="text-[10px] text-gray-500">&bull; {testimonial.school}</span>
                  </div>
                  <p className="text-sm text-gray-400 italic leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full lg:w-1/2 xl:w-[55%] flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-block">
                <Image src="/images/logo.png" alt="Tundua" width={160} height={53} className="h-12 w-auto" priority />
              </Link>
            </div>

            {children}

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
                <span aria-hidden="true">&bull;</span>
                <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
                <span aria-hidden="true">&bull;</span>
                <Link href="/support" className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                &copy; {new Date().getFullYear()} Tundua Edu Consults. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CheckCircle, Users, Shield,
  Star, BookOpen, Target, Menu, X, Sparkles,
  GraduationCap, FileCheck, MessageSquare, Clock,
  Award, ChevronDown, ChevronUp,
  CheckCircle2, Zap, Heart, MapPin, Calendar,
  Trophy, Rocket, Briefcase, Sun, Moon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  FadeIn,
  Stagger,
  StaggerItem,
  ScaleIn,
  CountUp,
  ParallaxScroll,
  MagneticButton,
  PulseGlow,
  FloatingElement,
  CardHover,
} from "@/components/animations/PageAnimations";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [liveActivity, setLiveActivity] = useState({ action: "Just submitted application to MIT", location: "Lagos, Nigeria", time: "2 mins ago" });
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);

  // Theme toggle hook
  const { effectiveTheme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // First-time theme tooltip - shows once for new visitors
  useEffect(() => {
    if (!mounted) return undefined;

    const hasSeenTooltip = localStorage.getItem('theme-tooltip-seen');
    if (!hasSeenTooltip) {
      // Delay showing tooltip for better UX
      const timer = setTimeout(() => {
        setShowThemeTooltip(true);
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowThemeTooltip(false);
          localStorage.setItem('theme-tooltip-seen', 'true');
        }, 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [mounted]);

  const dismissTooltip = () => {
    setShowThemeTooltip(false);
    localStorage.setItem('theme-tooltip-seen', 'true');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2026 Standard: Real-time social proof with rotating activities
  useEffect(() => {
    const activities = [
      { action: "Just submitted application to MIT", location: "Lagos, Nigeria", time: "2 mins ago" },
      { action: "Accepted to University of Toronto", location: "Nairobi, Kenya", time: "5 mins ago" },
      { action: "Generated AI SOP for Oxford", location: "Accra, Ghana", time: "8 mins ago" },
      { action: "Completed application to Stanford", location: "Kampala, Uganda", time: "12 mins ago" },
      { action: "AI Resume optimized", location: "Abuja, Nigeria", time: "15 mins ago" },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % activities.length;
      setLiveActivity(activities[currentIndex]!);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Smooth scroll handling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll(".fade-in-section");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted]);

  const quizQuestions = [
    {
      question: "What's your current academic status?",
      options: ["High School Senior", "Undergraduate", "Graduate", "Professional"]
    },
    {
      question: "When do you plan to apply?",
      options: ["This Year", "Next Year", "In 2+ Years", "Not Sure Yet"]
    },
    {
      question: "How many universities are you targeting?",
      options: ["1-3", "4-6", "7-10", "10+"]
    }
  ];

  const getRecommendation = () => {
    const numUniversities = quizAnswers[2];
    if (numUniversities === "1-3") return "Seeker";
    if (numUniversities === "4-6") return "Scholar";
    return "Fellow";
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers({ ...quizAnswers, [quizStep]: answer });
    setTimeout(() => {
      if (quizStep < quizQuestions.length - 1) {
        setQuizStep(quizStep + 1);
      } else {
        setQuizStep(quizQuestions.length);
      }
    }, 300);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 transition-colors duration-300">
      <style jsx global>{`
        /* 2027 Standard: Enhanced Animation Keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(20, 184, 166, 0.3);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* 2027 Standard: Scroll-triggered animations */
        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .fade-in-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* 2027 Standard: Enhanced glassmorphism */
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .glass-effect:hover {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .dark .glass-effect {
          background: rgba(41, 37, 36, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark .glass-effect:hover {
          background: rgba(41, 37, 36, 0.92);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        /* 2027 Standard: Animated gradient border */
        .gradient-border {
          position: relative;
          background: white;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .dark .gradient-border {
          background: rgb(41, 37, 36);
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #3b82f6, #14b8a6, #06b6d4, #8b5cf6, #3b82f6);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s;
          animation: gradient-shift 3s ease infinite;
        }

        .gradient-border:hover::before {
          opacity: 1;
        }

        .gradient-border:hover {
          transform: translateY(-4px);
        }

        /* 2027 Standard: Warm mesh gradient background for dark mode */
        .dark-mesh-bg {
          background-image:
            radial-gradient(at 40% 20%, rgba(180, 83, 9, 0.08) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(217, 119, 6, 0.06) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgba(20, 184, 166, 0.08) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.05) 0px, transparent 50%);
        }

        /* 2027 Standard: Enhanced button interactions */
        .btn-shine {
          position: relative;
          overflow: hidden;
        }

        .btn-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .btn-shine:hover::after {
          left: 100%;
        }

        /* 2027 Standard: Card hover with 3D effect */
        .card-3d {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .card-3d:hover {
          transform: translateY(-8px) rotateX(2deg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .dark .card-3d:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* 2027 Standard: Floating animation */
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* 2027 Standard: Subtle bounce for tooltip */
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        /* 2027 Standard: Glow effect for interactive elements */
        .glow-on-hover {
          transition: all 0.3s ease;
        }

        .glow-on-hover:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
        }

        .dark .glow-on-hover:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
        }

        /* 2027 Standard: Shimmer loading effect */
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        /* 2027 Standard: Respect user preferences */
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          .fade-in-section {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .glass-effect:hover,
          .gradient-border:hover,
          .card-3d:hover {
            transform: none;
          }
          .animate-float {
            animation: none;
          }
          .btn-shine::after {
            display: none;
          }
        }

        /* 2027 Standard: Smooth color mode transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-duration: 200ms;
          transition-timing-function: ease-out;
        }
      `}</style>

      {/* Modern Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-effect shadow-lg dark:shadow-stone-950/50' : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="container-custom py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center group relative"
            aria-label="Tundua - Home"
          >
            <Image
              src="/images/logo.png"
              alt="Tundua Edu Consults"
              width={180}
              height={60}
              priority
              className="h-12 w-auto transition-transform group-hover:scale-105"
            />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <button
              onClick={() => scrollToSection('services')}
              className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('quiz')}
              className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors relative group"
            >
              Find Your Plan
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <Link href="/auth/login" className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
              Login
            </Link>

            {/* 2027 Standard: Theme Toggle with Tooltip */}
            <div className="relative">
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-full bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 transition-all duration-300 group overflow-hidden"
                aria-label={`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`}
              >
                {/* Sun icon */}
                <Sun
                  className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                    effectiveTheme === 'light'
                      ? 'opacity-100 rotate-0 scale-100 text-amber-500'
                      : 'opacity-0 rotate-90 scale-0 text-amber-500'
                  }`}
                />
                {/* Moon icon */}
                <Moon
                  className={`w-5 h-5 transition-all duration-500 ${
                    effectiveTheme === 'dark'
                      ? 'opacity-100 rotate-0 scale-100 text-blue-400'
                      : 'opacity-0 -rotate-90 scale-0 text-blue-400'
                  }`}
                />
                {/* Glow effect on hover */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 dark:from-blue-400 dark:to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </button>

              {/* First-time Tooltip */}
              {showThemeTooltip && (
                <div className="absolute top-full right-0 mt-3 w-64 z-50">
                  <div className="relative bg-white dark:bg-stone-800 rounded-xl shadow-2xl dark:shadow-stone-950/50 p-4 border border-slate-200 dark:border-stone-700 animate-bounce-subtle">
                    {/* Arrow */}
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-stone-800 border-l border-t border-slate-200 dark:border-stone-700 transform rotate-45"></div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-stone-100 mb-1">
                          Try Dark Mode!
                        </p>
                        <p className="text-xs text-slate-600 dark:text-stone-400">
                          Click the {effectiveTheme === 'light' ? 'sun' : 'moon'} icon to switch themes.
                        </p>
                      </div>
                      <button
                        onClick={dismissTooltip}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-stone-300 transition-colors"
                        aria-label="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all font-semibold"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 hover:bg-slate-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900 dark:text-stone-100" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900 dark:text-stone-100" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-stone-700">
            <nav className="container-custom py-4 flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('services')}
                className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium text-left py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('quiz')}
                className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium text-left py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                Find Your Plan
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium text-left py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                Pricing
              </button>
              <Link
                href="/auth/login"
                className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                <div className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                  <Sun
                    className={`w-5 h-5 absolute transition-all duration-500 ${
                      effectiveTheme === 'light'
                        ? 'opacity-100 rotate-0 scale-100 text-amber-500'
                        : 'opacity-0 rotate-90 scale-0 text-amber-500'
                    }`}
                  />
                  <Moon
                    className={`w-5 h-5 absolute transition-all duration-500 ${
                      effectiveTheme === 'dark'
                        ? 'opacity-100 rotate-0 scale-100 text-blue-400'
                        : 'opacity-0 -rotate-90 scale-0 text-blue-400'
                    }`}
                  />
                </div>
                <span>{effectiveTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-full hover:shadow-lg transition-all font-semibold text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Modern Hero with Bento Grid */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-white dark:bg-stone-900 transition-colors duration-300">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 opacity-50 dark:opacity-100"></div>
        {/* Warm gradient overlay for dark mode */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-amber-950/10 via-stone-900 to-orange-950/10"></div>
        {/* 2027 Standard: Mesh gradient overlay for dark mode */}
        <div className="absolute inset-0 dark:dark-mesh-bg"></div>
        <ParallaxScroll speed={0.3}>
          <FloatingElement duration={4}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
          </FloatingElement>
        </ParallaxScroll>
        <ParallaxScroll speed={0.5}>
          <FloatingElement duration={5}>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          </FloatingElement>
        </ParallaxScroll>

        <div className="container-custom relative z-10">
          {/* 2027 Standard: Live Activity Feed - Floating Social Proof */}
          {mounted && (
            <div className="fixed bottom-6 left-6 z-50 max-w-sm hidden lg:block">
              <div className="bg-white dark:bg-stone-800/95 rounded-2xl shadow-2xl dark:shadow-stone-950/50 p-4 border border-slate-200 dark:border-stone-700/50 animate-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {liveActivity.location.charAt(0)}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-stone-800 animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-stone-100 truncate">{liveActivity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 dark:text-stone-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 dark:text-stone-400 truncate">{liveActivity.location}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{liveActivity.time}</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div>
              <FadeIn direction="up" delay={0.1}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 border border-blue-200 dark:border-blue-700/50 rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Your Application Success Partner</span>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.2}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                  Turn Your Study Abroad Dreams Into
                  <span className="block mt-2 bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 dark:from-blue-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    Acceptance Letters
                  </span>
                </h1>
              </FadeIn>

              <FadeIn direction="up" delay={0.3}>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-stone-300 mb-8 leading-relaxed">
                  Professional application management with expert guidance, document review, and submission support.
                  Join students getting accepted to their dream universities.
                </p>
              </FadeIn>

              {/* Trust Indicators */}
              <Stagger className="flex flex-wrap gap-6 mb-10" staggerDelay={0.15}>
                <StaggerItem>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-stone-100">Expert Counselors</div>
                      <div className="text-sm text-slate-600 dark:text-stone-400">Experienced guidance</div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-stone-100">Secure Platform</div>
                      <div className="text-sm text-slate-600 dark:text-stone-400">Data protected</div>
                    </div>
                  </div>
                </StaggerItem>
              </Stagger>

              {/* CTAs */}
              <FadeIn direction="up" delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <MagneticButton strength={0.2}>
                    <PulseGlow>
                      <Link
                        href="/auth/register"
                        className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-teal-500/30 transition-all inline-flex items-center justify-center gap-2"
                      >
                        Start Free Application
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </PulseGlow>
                  </MagneticButton>
                  <MagneticButton strength={0.2}>
                    <button
                      onClick={() => scrollToSection('quiz')}
                      className="group bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-200 dark:border-stone-600 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-lg dark:hover:shadow-teal-500/20 transition-all inline-flex items-center justify-center gap-2"
                    >
                      Find Your Package
                      <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </button>
                  </MagneticButton>
                </div>
              </FadeIn>
            </div>

            {/* Right Column - Bento Grid */}
            <Stagger className="grid grid-cols-2 gap-4" staggerDelay={0.12}>
              {/* Large Card */}
              <StaggerItem>
                <ScaleIn className="col-span-2 glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900 dark:text-stone-100">
                        <CountUp end={100} suffix="+" />
                      </div>
                      <div className="text-sm text-slate-600 dark:text-stone-400">Universities</div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-stone-300">Partner universities across US, UK, Canada, and Australia</p>
                </ScaleIn>
              </StaggerItem>

              {/* Small Card 1 */}
              <StaggerItem>
                <CardHover className="glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-shadow">
                  <FileCheck className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-stone-100">
                    <CountUp end={95} suffix="%" />
                  </div>
                  <div className="text-sm text-slate-600 dark:text-stone-400">Document Accuracy</div>
                </CardHover>
              </StaggerItem>

              {/* Small Card 2 */}
              <StaggerItem>
                <CardHover className="glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-shadow">
                  <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-stone-100">
                    <CountUp end={7} suffix=" Days" />
                  </div>
                  <div className="text-sm text-slate-600 dark:text-stone-400">Avg Response</div>
                </CardHover>
              </StaggerItem>

              {/* Wide Card */}
              <StaggerItem>
                <ScaleIn delay={0.2} className="col-span-2 glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-stone-600 dark:to-stone-500 border-2 border-white dark:border-stone-700 flex items-center justify-center text-white font-bold">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-stone-400">Trusted by students worldwide</p>
                    </div>
                  </div>
                </ScaleIn>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      {/* AI-Powered Quick Services Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 fade-in-section relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-teal-400/10 dark:from-blue-500/10 dark:to-teal-500/10 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 border border-blue-200 dark:border-blue-700/50 rounded-full px-5 py-2.5 mb-5" role="status" aria-label="New feature announcement">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-sm font-bold text-blue-900 dark:text-blue-300">NEW: AI-Powered Instant Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Quick Start: Get Documents Ready Today
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-300 max-w-3xl mx-auto">
              Need something specific fast? Our AI services deliver professional documents instantly.
              <span className="block mt-2 text-base text-slate-500 dark:text-stone-400">
                Perfect for getting started or complementing your application package
              </span>
            </p>
            {/* 2027 Standard: Sustainability & Green Tech Badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-700/50">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Carbon-neutral AI processing • Green powered servers</span>
            </div>
          </div>

          {/* AI Services Cards - FREE to attract users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {/* AI SOP Generator */}
            <div className="group bg-white dark:bg-stone-800/80 rounded-2xl shadow-lg dark:shadow-stone-950/50 hover:shadow-2xl transition-all duration-300 p-7 border-2 border-blue-100 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-600 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                100% FREE
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                <FileCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">AI SOP Generator</h3>
              <p className="text-slate-600 dark:text-stone-400 mb-4 text-sm min-h-[40px]">
                Professional Statement of Purpose in minutes
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                <span className="text-sm text-slate-400 line-through">Worth ₦25,000</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-stone-400 mb-4">
                <Clock className="w-4 h-4" />
                <span>Instant delivery</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span>Unlimited revisions</span>
              </div>
              <Link
                href="/auth/register"
                className="block w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
                aria-label="Generate Statement of Purpose with AI"
              >
                Try Free Now
              </Link>
            </div>

            {/* AI Resume Optimizer */}
            <div className="group bg-white dark:bg-stone-800/80 rounded-2xl shadow-lg dark:shadow-stone-950/50 hover:shadow-2xl transition-all duration-300 p-7 border-2 border-teal-100 dark:border-teal-800/50 hover:border-teal-300 dark:hover:border-teal-600 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                100% FREE
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/25">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">AI Resume Optimizer</h3>
              <p className="text-slate-600 dark:text-stone-400 mb-4 text-sm min-h-[40px]">
                Optimize your resume for maximum impact
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                <span className="text-sm text-slate-400 line-through">Worth ₦15,000</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-stone-400 mb-4">
                <Clock className="w-4 h-4" />
                <span>Instant delivery</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span>Unlimited revisions</span>
              </div>
              <Link
                href="/auth/register"
                className="block w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
                aria-label="Optimize your resume with AI"
              >
                Try Free Now
              </Link>
            </div>

            {/* AI University Report */}
            <div className="group bg-white dark:bg-stone-800/80 rounded-2xl shadow-lg dark:shadow-stone-950/50 hover:shadow-2xl transition-all duration-300 p-7 border-2 border-green-100 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-600 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                100% FREE
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">AI University Report</h3>
              <p className="text-slate-600 dark:text-stone-400 mb-4 text-sm min-h-[40px]">
                Get 10 personalized university recommendations
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                <span className="text-sm text-slate-400 line-through">Worth ₦18,000</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-stone-400 mb-4">
                <Clock className="w-4 h-4" />
                <span>Instant delivery</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span>Personalized results</span>
              </div>
              <Link
                href="/auth/register"
                className="block w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
                aria-label="Get personalized university recommendations"
              >
                Try Free Now
              </Link>
            </div>
          </div>

          {/* Strategic Comparison CTA - This is KEY to driving traffic to full packages */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-stone-800/80 dark:to-blue-900/30 border-2 border-slate-200 dark:border-stone-700 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                      Need More Than Documents?
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-stone-100 mb-2">
                    Complete Application Support with Expert Counselors
                  </h3>
                  <p className="text-slate-600 dark:text-stone-300">
                    Our full packages include everything above <span className="font-semibold">PLUS</span> personalized counseling,
                    essay editing, multiple university applications, deadline management, and dedicated support.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3.5 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    View Full Packages
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollToSection('quiz')}
                    className="bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-200 px-6 py-3 rounded-lg font-semibold border-2 border-slate-200 dark:border-stone-600 hover:border-slate-300 dark:hover:border-stone-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Find My Package
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2027 Standard: Enhanced Trust Indicators with Verification */}
          <div className="mt-12">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-700/50">
                <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Instant AI Generation</span>
                <CheckCircle2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700/50">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Expert Review Available</span>
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full border border-green-200 dark:border-green-700/50">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-900 dark:text-green-300">256-bit Encrypted</span>
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            {/* 2027 Standard: Real-time usage indicator */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-600 dark:text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="font-semibold text-slate-900 dark:text-stone-100">247 students</span> used our services this week
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quiz Section */}
      <section id="quiz" className="py-20 bg-white dark:bg-stone-900 fade-in-section scroll-mt-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Find Your Perfect Package
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Not Sure Which Package to Choose?
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-stone-300">Answer 3 quick questions to get a personalized recommendation</p>
            </div>

            <div className="glass-effect rounded-3xl p-8 md:p-12">
              {quizStep < quizQuestions.length ? (
                <div>
                  <div className="mb-8">
                    <div className="flex gap-2 mb-4">
                      {quizQuestions.map((_, index) => (
                        <div
                          key={index}
                          className={`flex-1 h-2 rounded-full transition-all ${
                            index <= quizStep ? 'bg-gradient-to-r from-blue-600 to-teal-600' : 'bg-slate-200 dark:bg-stone-700'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-stone-400">Question {quizStep + 1} of {quizQuestions.length}</p>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-stone-100 mb-6">
                    {quizQuestions[quizStep]!.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizQuestions[quizStep]!.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleQuizAnswer(option)}
                        className="group text-left p-6 rounded-xl border-2 border-slate-200 dark:border-stone-600 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-stone-100">{option}</span>
                          <ArrowRight className="w-5 h-5 text-slate-400 dark:text-stone-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-4">
                    We recommend the {getRecommendation()} Package
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-stone-300 mb-8">
                    Based on your answers, this package best fits your needs
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
                    >
                      View {getRecommendation()} Package
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 px-8 py-4 rounded-full font-semibold border-2 border-slate-200 dark:border-stone-600 hover:border-slate-300 dark:hover:border-stone-500 transition-all"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Services Bento Grid */}
      <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-stone-900 dark:to-stone-900 fade-in-section scroll-mt-20 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400 max-w-2xl mx-auto">
              Comprehensive support from application to acceptance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2 gradient-border rounded-3xl p-8 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-stone-800/50 dark:to-stone-800/30 hover:shadow-2xl dark:hover:shadow-stone-950/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-4">
                Expert Application Counseling
              </h3>
              <p className="text-lg text-slate-600 dark:text-stone-300 mb-6">
                Work one-on-one with experienced education consultants who have helped hundreds of students get accepted to their dream universities. Get personalized guidance throughout your entire journey.
              </p>
              <ul className="space-y-3">
                {[
                  "Personalized university selection strategy",
                  "One-on-one video consultations",
                  "Application timeline planning",
                  "Deadline management and reminders"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-stone-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Small Feature Cards */}
            {[
              {
                icon: BookOpen,
                title: "Essay Excellence",
                description: "Professional review and feedback on all application essays",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: FileCheck,
                title: "Document Review",
                description: "Thorough verification of all application materials",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Target,
                title: "Smart Tracking",
                description: "Real-time dashboard to monitor all applications",
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: MessageSquare,
                title: "24/7 Support",
                description: "Quick responses to all your questions",
                color: "from-teal-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Fast Processing",
                description: "Quick turnaround on all reviews",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Award,
                title: "Quality Guarantee",
                description: "Multiple rounds of review before submission",
                color: "from-indigo-500 to-teal-500"
              }
            ].map((service, index) => (
              <div
                key={index}
                className="gradient-border rounded-2xl p-6 bg-white dark:bg-stone-800 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-all group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-stone-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-stone-900 fade-in-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-300">From registration to acceptance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: 1,
                icon: Rocket,
                title: "Sign Up",
                description: "Create your account and select your package"
              },
              {
                step: 2,
                icon: Calendar,
                title: "Get Matched",
                description: "We assign you a dedicated counselor"
              },
              {
                step: 3,
                icon: FileCheck,
                title: "Build & Review",
                description: "Work together on your applications"
              },
              {
                step: 4,
                icon: Trophy,
                title: "Submit & Track",
                description: "Submit applications and monitor progress"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-slate-900 text-sm shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-stone-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-stone-900 dark:to-stone-800 fade-in-section transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400">Real stories from real students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah M.",
                location: "Kenya",
                university: "Stanford University",
                program: "Computer Science",
                text: "The counseling was exceptional. They helped me refine my essays and navigate the entire application process smoothly.",
                rating: 5
              },
              {
                name: "James O.",
                location: "Nigeria",
                university: "University of Oxford",
                program: "Economics",
                text: "Got accepted to 4 out of 5 universities I applied to. The document review service caught errors I would have missed.",
                rating: 5
              },
              {
                name: "Amina H.",
                location: "Tanzania",
                university: "MIT",
                program: "Engineering",
                text: "Professional, responsive, and knowledgeable. Worth every penny for the peace of mind and expert guidance.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-stone-300 mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-stone-100">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 dark:text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-stone-400">{testimonial.university}</div>
                    <div className="text-xs text-slate-500 dark:text-stone-500">{testimonial.program}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-stone-900 fade-in-section scroll-mt-20 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400 mb-4">Choose the package that fits your needs</p>

            {/* Strategic Note Connecting AI Services to Full Packages */}
            <div className="max-w-3xl mx-auto mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 inline-flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-stone-300 text-left">
                  <span className="font-semibold text-slate-900 dark:text-stone-100">Need individual documents only?</span> Check out our
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold mx-1 underline"
                  >
                    AI-powered services
                  </button>
                  starting at ₦5,000. These packages below include expert human counseling + unlimited document support.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Seeker",
                price: "$0",
                priceNGN: "₦0",
                description: "Perfect for students exploring their options",
                features: [
                  { name: "University Search", limit: "5 searches/month" },
                  { name: "Document Checklist", limit: "1 application draft" },
                  { name: "Eligibility Check", limit: "1 check/month" },
                  { name: "Application Dashboard", limit: "" },
                  { name: "University Comparison", limit: "Up to 3 schools" },
                  { name: "Community Forum", limit: "" },
                  { name: "Email Support", limit: "72hr response" }
                ],
                highlighted: false,
                isFree: true,
                isCustom: false
              },
              {
                name: "Scholar",
                price: "$29.99",
                priceNGN: "₦49,999",
                description: "For serious applicants - All limits removed + human support",
                features: [
                  { name: "Unlimited University Search", limit: "" },
                  { name: "Unlimited Document Review", limit: "" },
                  { name: "Unlimited Eligibility Checks", limit: "" },
                  { name: "Essay Review & Editing", limit: "" },
                  { name: "Priority Email Support", limit: "24hr response" },
                  { name: "Deadline Management", limit: "" },
                  { name: "University Recommendations", limit: "" },
                  { name: "Scholarship Search", limit: "" },
                  { name: "Expert Human Support", limit: "Live counselor" }
                ],
                highlighted: true,
                isFree: false,
                isCustom: false
              },
              {
                name: "Fellow",
                price: "Custom",
                priceNGN: "Custom",
                description: "End-to-end support from application to visa",
                features: [
                  { name: "Everything in Scholar", limit: "" },
                  { name: "Unlimited Applications", limit: "" },
                  { name: "Complete SOP Writing", limit: "" },
                  { name: "Full Document Preparation", limit: "" },
                  { name: "Visa Application Support", limit: "" },
                  { name: "Interview Coaching", limit: "" },
                  { name: "Dedicated Account Manager", limit: "" },
                  { name: "WhatsApp Priority Support", limit: "" },
                  { name: "Pre-departure Orientation", limit: "" }
                ],
                highlighted: false,
                isFree: false,
                isCustom: true
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all hover:scale-105 z-10 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-2xl shadow-teal-500/30'
                    : plan.isCustom
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-600/50 hover:border-amber-400 dark:hover:border-amber-500 shadow-lg dark:shadow-stone-950/50'
                    : plan.isFree
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-300 dark:border-emerald-600/50 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-lg dark:shadow-stone-950/50'
                    : 'bg-white dark:bg-stone-800 border-2 border-slate-200 dark:border-stone-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-lg dark:shadow-stone-950/50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-6 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                {plan.isFree && !plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-1 rounded-full text-sm font-bold">
                    Free Forever
                  </div>
                )}
                {plan.isCustom && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-bold">
                    VIP Service
                  </div>
                )}
                <div className="mb-4 md:mb-6">
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-stone-100'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm md:text-base ${plan.highlighted ? 'text-blue-100' : 'text-slate-600 dark:text-stone-400'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="mb-4 md:mb-6">
                  {plan.isCustom ? (
                    <>
                      <div className={`text-4xl md:text-5xl font-bold text-amber-600 dark:text-amber-400`}>
                        Custom
                      </div>
                      <p className="text-amber-700 dark:text-amber-400 mt-1 font-medium">
                        Contact for quote
                      </p>
                    </>
                  ) : plan.isFree ? (
                    <>
                      <div className={`text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400`}>
                        FREE
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-400 mt-1">
                        No credit card required
                      </p>
                    </>
                  ) : (
                    <>
                      <div className={`text-4xl md:text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-stone-100'}`}>
                        {plan.price}
                      </div>
                      <p className={plan.highlighted ? 'text-blue-100 mt-1' : 'text-slate-500 dark:text-stone-400 mt-1'}>
                        {plan.priceNGN} • One-time payment
                      </p>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-green-300' : plan.isFree ? 'text-emerald-500 dark:text-emerald-400' : plan.isCustom ? 'text-amber-500 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                      }`} />
                      <div>
                        <span className={plan.highlighted ? 'text-white font-medium' : 'text-slate-900 dark:text-stone-100 font-medium'}>
                          {feature.name}
                        </span>
                        {feature.limit && (
                          <span className={plan.highlighted ? 'text-blue-200 ml-1' : 'text-slate-500 dark:text-stone-400 ml-1'}>
                            {feature.limit}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {plan.isCustom ? (
                  <a
                    href="mailto:hello@tundua.com?subject=Fellow Package Inquiry"
                    className="block w-full text-center px-6 py-4 rounded-full font-semibold transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl"
                  >
                    Contact Us
                  </a>
                ) : (
                  <Link
                    href="/auth/register"
                    className={`block w-full text-center px-6 py-4 rounded-full font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-white text-teal-600 hover:bg-blue-50'
                        : plan.isFree
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-xl'
                    }`}
                  >
                    {plan.isFree ? 'Get Started Free' : 'Get Started'}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-stone-900 dark:to-stone-800 fade-in-section transition-colors duration-300">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400">Everything you need to know</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "How long does the application process take?",
                  answer: "The timeline varies depending on your package and university deadlines, but most applications are completed within 4-6 weeks from when you submit all required documents."
                },
                {
                  question: "Do you guarantee university acceptance?",
                  answer: "While we can't guarantee acceptance (as that decision is made by universities), we ensure your application is polished, complete, and presents you in the best possible light. Our clients have high success rates."
                },
                {
                  question: "Can I change my package after signing up?",
                  answer: "Yes! You can upgrade your package at any time by paying the difference. We'll apply all work already completed to your new package."
                },
                {
                  question: "What if I need help with more universities than my package includes?",
                  answer: "You can add additional universities to any package for a supplemental fee. Contact our team for pricing details."
                },
                {
                  question: "How do I communicate with my counselor?",
                  answer: "You'll have access to email support, scheduled video calls, and our application dashboard messaging system. Premium and Concierge packages get priority response times."
                }
              ].map((faq, index) => (
                <div key={index} className="glass-effect rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-stone-700/50 transition-colors"
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-semibold text-slate-900 dark:text-stone-100 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 dark:text-stone-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 dark:text-stone-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5">
                      <p className="text-slate-600 dark:text-stone-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - 2027 Standard with enhanced dark mode */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-teal-600 to-cyan-600 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 text-white relative overflow-hidden fade-in-section transition-colors duration-500">
        {/* Background pattern - visible in light mode */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10 dark:opacity-5"></div>

        {/* 2027 Standard: Animated glow orbs - more visible in dark mode */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/20 dark:bg-teal-500/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/0 dark:bg-purple-500/20 rounded-full blur-3xl"></div>

        {/* Dark mode gradient border effect */}
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-blue-500/10 dark:via-transparent dark:to-teal-500/10"></div>

        <div className="container-custom text-center relative z-10">
          <Heart className="w-16 h-16 mx-auto mb-6 text-pink-200 dark:text-pink-400 animate-float drop-shadow-lg dark:drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 dark:opacity-80 max-w-2xl mx-auto">
            Join students who are turning their study abroad dreams into reality with expert guidance every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="group bg-white text-teal-600 dark:bg-gradient-to-r dark:from-blue-500 dark:to-teal-500 dark:text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-blue-50 dark:hover:from-blue-400 dark:hover:to-teal-400 transition-all shadow-xl hover:shadow-2xl dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40 inline-flex items-center justify-center gap-2"
            >
              Start Your Application Now
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => scrollToSection('quiz')}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/20 dark:hover:bg-white/10 transition-all border-2 border-white/30 dark:border-white/20 dark:hover:border-white/40 inline-flex items-center justify-center gap-2"
            >
              Take the Quiz First
              <Sparkles className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-8 text-white/80 dark:text-white/60 text-sm">
            Free to start • No credit card required • Cancel anytime
          </p>
          {/* 2027 Standard: PWA & Offline Capability Hint */}
          <p className="mt-4 text-white/60 dark:text-white/40 text-xs flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Works seamlessly on all devices • Install as app for offline access
          </p>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 dark:bg-stone-950 text-white py-16 transition-colors duration-300">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Tundua Edu Consults"
                  width={200}
                  height={67}
                  className="h-14 w-auto"
                />
              </div>
              <p className="text-slate-400 dark:text-stone-500 mb-6 max-w-md">
                Your trusted partner in making study abroad dreams a reality. Professional application support with personalized guidance.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 dark:bg-stone-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Twitter">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 dark:bg-stone-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  in
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 dark:bg-stone-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                  IG
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3 text-slate-400 dark:text-stone-500">
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">
                    Pricing
                  </button>
                </li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-400 dark:text-stone-500">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li>
                  <div className="mt-6">
                    <p className="text-sm mb-2">Email us:</p>
                    <a href="mailto:support@tundua.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                      support@tundua.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 dark:border-stone-800 pt-8 text-center text-sm text-slate-400 dark:text-stone-500">
            <p>&copy; 2026 Tundua. All rights reserved. Made with <Heart className="w-4 h-4 inline text-red-400" /> for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

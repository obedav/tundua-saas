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
  Trophy, Rocket
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    if (numUniversities === "1-3") return "Standard";
    if (numUniversities === "4-6") return "Premium";
    return "Concierge";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <style jsx global>{`
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

        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .fade-in-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .gradient-border {
          position: relative;
          background: white;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .gradient-border:hover::before {
          opacity: 1;
        }

        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          .fade-in-section {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      {/* Modern Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
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
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('quiz')}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors relative group"
            >
              Find Your Plan
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all font-semibold"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200">
            <nav className="container-custom py-4 flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('services')}
                className="text-slate-600 hover:text-slate-900 font-medium text-left"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('quiz')}
                className="text-slate-600 hover:text-slate-900 font-medium text-left"
              >
                Find Your Plan
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-slate-600 hover:text-slate-900 font-medium text-left"
              >
                Pricing
              </button>
              <Link
                href="/auth/login"
                className="text-slate-600 hover:text-slate-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Modern Hero with Bento Grid */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Your Application Success Partner</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Turn Your Study Abroad Dreams Into
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Acceptance Letters
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Professional application management with expert guidance, document review, and submission support.
                Join students getting accepted to their dream universities.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Expert Counselors</div>
                    <div className="text-sm text-slate-600">Experienced guidance</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Secure Platform</div>
                    <div className="text-sm text-slate-600">Data protected</div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all inline-flex items-center justify-center gap-2"
                >
                  Start Free Application
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => scrollToSection('quiz')}
                  className="group bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
                >
                  Find Your Package
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </button>
              </div>
            </div>

            {/* Right Column - Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Large Card */}
              <div className="col-span-2 glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-900">100+</div>
                    <div className="text-sm text-slate-600">Universities</div>
                  </div>
                </div>
                <p className="text-slate-600">Partner universities across US, UK, Canada, and Australia</p>
              </div>

              {/* Small Card 1 */}
              <div className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <FileCheck className="w-8 h-8 text-green-600 mb-3" />
                <div className="text-2xl font-bold text-slate-900">95%</div>
                <div className="text-sm text-slate-600">Document Accuracy</div>
              </div>

              {/* Small Card 2 */}
              <div className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <Clock className="w-8 h-8 text-blue-600 mb-3" />
                <div className="text-2xl font-bold text-slate-900">7 Days</div>
                <div className="text-sm text-slate-600">Avg Response</div>
              </div>

              {/* Wide Card */}
              <div className="col-span-2 glass-effect rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white flex items-center justify-center text-white font-bold">
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
                    <p className="text-sm text-slate-600">Trusted by students worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quiz Section */}
      <section id="quiz" className="py-20 bg-white fade-in-section scroll-mt-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Find Your Perfect Package
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Not Sure Which Package to Choose?
              </h2>
              <p className="text-xl text-slate-600">Answer 3 quick questions to get a personalized recommendation</p>
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
                            index <= quizStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600">Question {quizStep + 1} of {quizQuestions.length}</p>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    {quizQuestions[quizStep]!.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizQuestions[quizStep]!.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleQuizAnswer(option)}
                        className="group text-left p-6 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{option}</span>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    We recommend the {getRecommendation()} Package
                  </h3>
                  <p className="text-lg text-slate-600 mb-8">
                    Based on your answers, this package best fits your needs
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
                    >
                      View {getRecommendation()} Package
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="bg-white text-slate-900 px-8 py-4 rounded-full font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all"
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
      <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white fade-in-section scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive support from application to acceptance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2 gradient-border rounded-3xl p-8 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Expert Application Counseling
              </h3>
              <p className="text-lg text-slate-600 mb-6">
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
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
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
                color: "from-purple-500 to-pink-500"
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
                color: "from-indigo-500 to-purple-500"
              }
            ].map((service, index) => (
              <div
                key={index}
                className="gradient-border rounded-2xl p-6 bg-white hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white fade-in-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-slate-600">From registration to acceptance</p>
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
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-slate-900 text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white fade-in-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-xl text-slate-600">Real stories from real students</p>
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
              <div key={index} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                    <div className="text-sm text-slate-600">{testimonial.university}</div>
                    <div className="text-xs text-slate-500">{testimonial.program}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Pricing Section */}
      <section id="pricing" className="py-20 bg-white fade-in-section scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">Choose the package that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Standard",
                price: "$299",
                description: "Perfect for getting started",
                features: [
                  "3 University Applications",
                  "Document Review",
                  "Email Support",
                  "Application Dashboard",
                  "Progress Tracking"
                ],
                highlighted: false
              },
              {
                name: "Premium",
                price: "$599",
                description: "Most popular choice",
                features: [
                  "5 University Applications",
                  "Essay Review & Feedback",
                  "Document Verification",
                  "Priority Email Support",
                  "Strategy Consultation",
                  "Interview Tips"
                ],
                highlighted: true
              },
              {
                name: "Concierge",
                price: "$999",
                description: "Complete white-glove service",
                features: [
                  "8 University Applications",
                  "Comprehensive Essay Support",
                  "Visa Application Guidance",
                  "Interview Coaching",
                  "Dedicated Counselor",
                  "Priority Support",
                  "Post-Acceptance Help"
                ],
                highlighted: false
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl shadow-purple-500/30'
                    : 'gradient-border bg-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-6 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={plan.highlighted ? 'text-blue-100' : 'text-slate-600'}>
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <div className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </div>
                  <p className={plan.highlighted ? 'text-blue-100 mt-1' : 'text-slate-500 mt-1'}>
                    One-time payment
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-green-300' : 'text-green-600'
                      }`} />
                      <span className={plan.highlighted ? 'text-blue-100' : 'text-slate-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`block w-full text-center px-6 py-4 rounded-full font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-white text-purple-600 hover:bg-blue-50'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white fade-in-section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">Everything you need to know</p>
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
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5">
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden fade-in-section">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="container-custom text-center relative z-10">
          <Heart className="w-16 h-16 mx-auto mb-6 text-pink-200" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join students who are turning their study abroad dreams into reality with expert guidance every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="group bg-white text-purple-600 px-10 py-5 rounded-full text-lg font-bold hover:bg-blue-50 transition-all shadow-xl inline-flex items-center justify-center gap-2"
            >
              Start Your Application Now
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => scrollToSection('quiz')}
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/20 transition-all border-2 border-white/30 inline-flex items-center justify-center gap-2"
            >
              Take the Quiz First
              <Sparkles className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-8 text-white/80 text-sm">
            Free to start • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white py-16">
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
              <p className="text-slate-400 mb-6 max-w-md">
                Your trusted partner in making study abroad dreams a reality. Professional application support with personalized guidance.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Twitter">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  in
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                  IG
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3 text-slate-400">
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
              <ul className="space-y-3 text-slate-400">
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

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 Tundua. All rights reserved. Made with <Heart className="w-4 h-4 inline text-red-400" /> for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

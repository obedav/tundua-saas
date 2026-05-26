import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CheckCircle, Users, Shield,
  Star, BookOpen, Target, Sparkles,
  GraduationCap, FileCheck, MessageSquare, Clock,
  Award, CheckCircle2, Zap, Heart, MapPin,
  Trophy, Rocket, Calendar,
} from "lucide-react";
import {
  FadeIn, Stagger, StaggerItem, ScaleIn, CountUp,
  ParallaxScroll, MagneticButton, PulseGlow, FloatingElement, CardHover,
} from "@/components/animations/PageAnimations";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { FAQStructuredData, ReviewsStructuredData } from "@/components/StructuredData";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { LiveActivityFeed } from "@/components/home/LiveActivityFeed";
import { PackageQuiz } from "@/components/home/PackageQuiz";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { ScrollSectionButton } from "@/components/home/ScrollSectionButton";
import { PLANS } from "@/lib/plans";
import { ScrollAnimations } from "@/components/home/ScrollAnimations";
import AIToolsSection from "@/components/home/AIToolsSection";

const FAQS = [
  {
    question: "How long does the application process take?",
    answer: "The timeline varies depending on your package and university deadlines, but most applications are completed within 4-6 weeks from when you submit all required documents.",
  },
  {
    question: "Do you guarantee university acceptance?",
    answer: "While we can't guarantee acceptance (as that decision is made by universities), we ensure your application is polished, complete, and presents you in the best possible light. Our clients have high success rates.",
  },
  {
    question: "Can I change my package after signing up?",
    answer: "Yes! You can upgrade your package at any time by paying the difference. We'll apply all work already completed to your new package.",
  },
  {
    question: "What if I need help with more universities than my package includes?",
    answer: "You can add additional universities to any package for a supplemental fee. Contact our team for pricing details.",
  },
  {
    question: "How do I communicate with my counselor?",
    answer: "You'll have access to email support, scheduled video calls, and our application dashboard messaging system. Premium and Concierge packages get priority response times.",
  },
];

const SERVICES = [
  { icon: BookOpen, title: "Essay Excellence", description: "Professional review and feedback on all application essays", color: "from-orange-500 to-red-500" },
  { icon: FileCheck, title: "Document Review", description: "Thorough verification of all application materials", color: "from-green-500 to-emerald-500" },
  { icon: Target, title: "Smart Tracking", description: "Real-time dashboard to monitor all applications", color: "from-blue-500 to-indigo-500" },
  { icon: MessageSquare, title: "24/7 Support", description: "Quick responses to all your questions", color: "from-teal-500 to-cyan-500" },
  { icon: FileCheck, title: "Document Verification", description: "AI-assisted OCR plus human review", color: "from-yellow-500 to-orange-500" },
  { icon: Award, title: "Quality Guarantee", description: "Multiple rounds of review before submission", color: "from-indigo-500 to-teal-500" },
];

const HOW_IT_WORKS = [
  { step: 1, icon: Rocket, title: "Sign Up", description: "Create your account and select your package" },
  { step: 2, icon: Calendar, title: "Get Matched", description: "We assign you a dedicated counselor" },
  { step: 3, icon: FileCheck, title: "Build & Review", description: "Work together on your applications" },
  { step: 4, icon: Trophy, title: "Submit & Track", description: "Submit applications and monitor progress" },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.", location: "Kenya", university: "University of Birmingham", program: "Computer Science",
    text: "The counseling was exceptional. They helped me refine my essays and navigate the entire application process smoothly.",
    rating: 5,
  },
  {
    name: "James O.", location: "Nigeria", university: "University of Leeds", program: "Economics",
    text: "Got accepted to 4 out of 5 universities I applied to. The document review service caught errors I would have missed.",
    rating: 5,
  },
  {
    name: "Amina H.", location: "Tanzania", university: "University of Calgary", program: "Engineering",
    text: "Professional, responsive, and knowledgeable. Worth every penny for the peace of mind and expert guidance.",
    rating: 5,
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 transition-colors duration-300">
      <ScrollAnimations />
      <HomeNavbar />
      <LiveActivityFeed />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-white dark:bg-stone-900 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 opacity-50 dark:opacity-100" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-amber-950/10 via-stone-900 to-orange-950/10" />
        <div className="absolute inset-0 dark:dark-mesh-bg" />
        <ParallaxScroll speed={0.3}>
          <FloatingElement duration={4}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl" />
          </FloatingElement>
        </ParallaxScroll>
        <ParallaxScroll speed={0.5}>
          <FloatingElement duration={5}>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl" />
          </FloatingElement>
        </ParallaxScroll>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                  Trusted by students worldwide.
                </p>
              </FadeIn>
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
              <FadeIn direction="up" delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <MagneticButton strength={0.2}>
                    <PulseGlow>
                      <Link
                        href="/apply"
                        className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-teal-500/30 transition-all inline-flex items-center justify-center gap-2"
                      >
                        Start Free Application
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </PulseGlow>
                  </MagneticButton>
                  <MagneticButton strength={0.2}>
                    <ScrollSectionButton
                      sectionId="quiz"
                      className="group bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-200 dark:border-stone-600 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-lg dark:hover:shadow-teal-500/20 transition-all inline-flex items-center justify-center gap-2"
                    >
                      Take the Quiz to Find Your Package
                      <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </ScrollSectionButton>
                  </MagneticButton>
                </div>
              </FadeIn>
            </div>

            {/* Right — Bento grid */}
            <Stagger className="grid grid-cols-2 gap-4" staggerDelay={0.12}>
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
              <StaggerItem>
                <CardHover className="glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-shadow">
                  <FileCheck className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-stone-100"><CountUp end={95} suffix="%" /></div>
                  <div className="text-sm text-slate-600 dark:text-stone-400">Document Accuracy</div>
                </CardHover>
              </StaggerItem>
              <StaggerItem>
                <CardHover className="glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-shadow">
                  <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-stone-100"><CountUp end={7} suffix=" Days" /></div>
                  <div className="text-sm text-slate-600 dark:text-stone-400">Avg Response</div>
                </CardHover>
              </StaggerItem>
              <StaggerItem>
                <ScaleIn delay={0.2} className="col-span-2 glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {["A", "B", "C", "D"].map((l) => (
                        <div key={l} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-stone-600 dark:to-stone-500 border-2 border-white dark:border-stone-700 flex items-center justify-center text-white font-bold">
                          {l}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
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

      {/* AI Services */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 fade-in-section relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-teal-400/10 dark:from-blue-500/10 dark:to-teal-500/10 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 border border-blue-200 dark:border-blue-700/50 rounded-full px-5 py-2.5 mb-5">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-sm font-bold text-blue-900 dark:text-blue-300">NEW: AI-Powered Instant Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Quick, Professional, AI-Powered Document Services
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-300 max-w-3xl mx-auto">
              Need something specific fast? Our AI services deliver professional documents instantly.
            </p>
          </div>

          <AIToolsSection />

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
                  <ScrollSectionButton
                    sectionId="pricing"
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3.5 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    View Full Packages <ArrowRight className="w-5 h-5" />
                  </ScrollSectionButton>
                  <ScrollSectionButton
                    sectionId="quiz"
                    className="bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-200 px-6 py-3 rounded-lg font-semibold border-2 border-slate-200 dark:border-stone-600 hover:border-slate-300 dark:hover:border-stone-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Find My Package
                  </ScrollSectionButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
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
        </div>
      </section>

      {/* Quiz */}
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
            <PackageQuiz />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-stone-900 dark:to-stone-900 fade-in-section scroll-mt-20 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400 max-w-2xl mx-auto">Comprehensive support from application to acceptance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="md:col-span-2 md:row-span-2 gradient-border rounded-3xl p-8 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-stone-800/50 dark:to-stone-800/30 hover:shadow-2xl dark:hover:shadow-stone-950/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-4">Expert Application Counseling</h3>
              <p className="text-lg text-slate-600 dark:text-stone-300 mb-6">
                Work one-on-one with experienced education consultants who have helped hundreds of students get accepted to their dream universities.
              </p>
              <ul className="space-y-3">
                {["Personalized university selection strategy", "One-on-one video consultations", "Application timeline planning", "Deadline management and reminders"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-stone-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {SERVICES.map((s) => (
              <div key={s.title} className="gradient-border rounded-2xl p-6 bg-white dark:bg-stone-800 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-all group">
                <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">{s.title}</h3>
                <p className="text-slate-600 dark:text-stone-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-stone-900 fade-in-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Simple 4-Step Process</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-300">From registration to acceptance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
                    <s.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-slate-900 text-sm shadow-lg">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">{s.title}</h3>
                <p className="text-slate-600 dark:text-stone-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-stone-900 dark:to-stone-800 fade-in-section transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Real Results, Real Stories</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400">Trusted by students worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-effect rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-stone-950/50 transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 dark:text-stone-300 mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-stone-100">{t.name}</div>
                    <div className="text-sm text-slate-600 dark:text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{t.location}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-stone-400">{t.university}</div>
                    <div className="text-xs text-slate-500 dark:text-stone-500">{t.program}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white dark:bg-stone-900 fade-in-section scroll-mt-20 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              From Application to Acceptance – We Guide You Every Step
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400 mb-4">Choose the package that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 transition-all hover:scale-105 z-10 shadow-lg dark:shadow-stone-950/50 ${plan.cardColor}`}
              >
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.badgeColor} px-6 py-1 rounded-full text-sm font-bold text-white`}>
                  {plan.badge}
                </div>
                <div className="mb-4 md:mb-6">
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${plan.headingColor}`}>{plan.name}</h3>
                  <p className={`text-sm md:text-base ${plan.descColor}`}>{plan.description}</p>
                </div>
                <div className="mb-4 md:mb-6">
                  <div className={`text-4xl md:text-5xl font-bold ${plan.priceColor}`}>
                    {plan.isFree ? "FREE" : plan.price}
                  </div>
                  <p className={`mt-1 ${plan.subPriceColor}`}>
                    {plan.isFree
                      ? "No credit card required"
                      : plan.isCustom
                      ? `${plan.priceNGN} · Contact for quote`
                      : `${plan.priceNGN} • per year`}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.name} className="flex items-start gap-3">
                      <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.checkColor}`} />
                      <div>
                        <span className={`font-medium ${plan.featureTextColor}`}>{f.name}</span>
                        {f.limit && <span className={`ml-1 ${plan.featureLimitColor}`}>{f.limit}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href={plan.ctaHref} className={`block w-full text-center px-6 py-4 rounded-full font-semibold transition-all ${plan.ctaColor} hover:shadow-xl`}>
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-stone-900 dark:to-stone-800 fade-in-section transition-colors duration-300">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-stone-400">Everything you need to know</p>
            </div>
            <FAQAccordion faqs={FAQS} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-teal-600 to-cyan-600 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 text-white relative overflow-hidden fade-in-section transition-colors duration-500">
        <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] " />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/20 dark:bg-teal-500/40 rounded-full blur-3xl animate-pulse" />
        <div className="container-custom text-center relative z-10">
          <Heart className="w-16 h-16 mx-auto mb-6 text-pink-200 dark:text-pink-400 animate-float drop-shadow-lg" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 dark:opacity-80 max-w-2xl mx-auto">
            Join students who are turning their study abroad dreams into reality with expert guidance every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="group bg-white text-teal-600 dark:bg-gradient-to-r dark:from-blue-500 dark:to-teal-500 dark:text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl inline-flex items-center justify-center gap-2"
            >
              Start Your Application Now
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <ScrollSectionButton
              sectionId="quiz"
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/20 transition-all border-2 border-white/30 inline-flex items-center justify-center gap-2"
            >
              Take the Quiz First <Sparkles className="h-6 w-6" />
            </ScrollSectionButton>
          </div>
          <p className="mt-8 text-white/80 dark:text-white/60 text-sm">Free to start • No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-stone-950 text-white py-16 transition-colors duration-300">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Image src="/images/logo.png" alt="Tundua Edu Consults" width={200} height={67} className="h-14 w-auto" />
              </div>
              <p className="text-slate-400 dark:text-stone-500 mb-6 max-w-md">
                Your trusted partner in making study abroad dreams a reality. Professional application support with personalized guidance.
              </p>
              <div className="flex gap-4">
                <a href="https://x.com/tundua" className="w-10 h-10 bg-slate-800 dark:bg-stone-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Twitter">𝕏</a>
                <a href="https://www.linkedin.com/company/tundua" className="w-10 h-10 bg-slate-800 dark:bg-stone-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="LinkedIn">in</a>
                <a href="https://www.instagram.com/tundua" className="w-10 h-10 bg-slate-800 dark:bg-stone-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">IG</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3 text-slate-400 dark:text-stone-500">
                <li><ScrollSectionButton sectionId="services" className="hover:text-white transition-colors">Services</ScrollSectionButton></li>
                <li><ScrollSectionButton sectionId="pricing" className="hover:text-white transition-colors">Pricing</ScrollSectionButton></li>
                <li><ScrollSectionButton sectionId="quiz" className="hover:text-white transition-colors">Take the Quiz</ScrollSectionButton></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
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
                    <a href="mailto:support@tundua.com" className="text-blue-400 hover:text-blue-300 transition-colors">support@tundua.com</a>
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

      <FAQStructuredData faqs={FAQS} />
      <ReviewsStructuredData reviews={TESTIMONIALS} />
      <ExitIntentPopup />
    </div>
  );
}

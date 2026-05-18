import Link from "next/link";
import Image from "next/image";
import {
  CheckSquare,
  FileEdit,
  MessageCircle,
  Calendar,
  Shield,
  GraduationCap,
  ArrowRight,
  Check,
  Sparkles,
  Globe,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Visa Assistant — Tundua",
  description:
    "AI-powered visa guidance for Nigerian passport holders. Step-by-step document checklists, AI cover letter writer, and 24/7 expert chat. Free to start.",
};

const DESTINATIONS = [
  { flag: "🇬🇧", name: "UK" },
  { flag: "🇺🇸", name: "USA" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇳🇱", name: "Netherlands" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇦🇪", name: "UAE" },
];

const STATS = [
  { n: "50+", label: "Visa types covered" },
  { n: "30+", label: "Destination countries" },
  { n: "Free", label: "No hidden charges" },
];

const PRICING = [
  {
    name: "Free",
    price: "₦0",
    per: "forever",
    features: ["Destination guide", "Document checklist", "3 AI chat questions/day"],
    cta: "Start free",
    primary: false,
  },
  {
    name: "Pro",
    price: "₦3,000",
    per: "per month",
    features: [
      "Everything in Free",
      "Unlimited AI chat",
      "AI cover letter generation",
      "Application timeline",
    ],
    cta: "Get Pro",
    primary: true,
  },
  {
    name: "Premium",
    price: "₦10,000",
    per: "one-time",
    features: [
      "Everything in Pro",
      "Expert document review",
      "1-on-1 counsellor session",
      "Priority support",
    ],
    cta: "Get Premium",
    primary: false,
  },
];

const GRID_PATTERN = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
  backgroundSize: "60px 60px",
};

export default function VisaLandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* ── Sticky glassmorphism nav ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-white/10 px-6 py-3 flex items-center justify-between backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Tundua"
            width={120}
            height={40}
            className="h-9 w-auto"
          />
          <span className="text-xs font-bold tracking-wide px-2.5 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm">
            VISA
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600">
        {/* subtle grid overlay */}
        <div className="absolute inset-0" style={GRID_PATTERN} />
        {/* radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.12)_0%,transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-medium text-white/80 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            Powered by Claude AI · Built for Nigeria 🇳🇬
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-4">
            Your Visa Application,{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white via-sky-100 to-violet-200 bg-clip-text text-transparent">
              Done Right — First Time
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto mb-8 leading-relaxed">
            Step-by-step guidance, smart document checklists, AI-written cover letters, and timeline
            tracking. No agents. No confusion. No fraud.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-all shadow-xl shadow-black/20"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-all"
            >
              Already have an account
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mb-8">
            {STATS.map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white">
                  {n}
                </div>
                <div className="text-sm text-white/65 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Country pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {DESTINATIONS.map(({ flag, name }) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm text-white/85 font-medium"
              >
                {flag} {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 dark:bg-gray-900 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-14">
            Four steps from signup to travel day
          </h2>

          {/* Steps */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* connecting line — desktop only */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary-400 via-violet-400 to-emerald-400 opacity-30" />

            {[
              {
                icon: Globe,
                gradient: "from-sky-500 to-blue-600",
                shadow: "shadow-sky-500/30",
                n: "1",
                label: "Choose destination & visa type",
                desc: "Select from 30+ countries and 6 visa categories.",
              },
              {
                icon: CheckSquare,
                gradient: "from-violet-500 to-purple-700",
                shadow: "shadow-violet-500/30",
                n: "2",
                label: "Get your document checklist",
                desc: "AI generates a tailored list for your exact application.",
              },
              {
                icon: FileEdit,
                gradient: "from-amber-400 to-orange-500",
                shadow: "shadow-amber-500/30",
                n: "3",
                label: "Generate your cover letter",
                desc: "One-click AI-written letter, personalised to your situation.",
              },
              {
                icon: MessageCircle,
                gradient: "from-emerald-400 to-teal-600",
                shadow: "shadow-emerald-500/30",
                n: "4",
                label: "Ask questions, track your timeline",
                desc: "Chat with the AI anytime and follow your application calendar.",
              },
            ].map(({ icon: Icon, gradient, shadow, n, label, desc }) => (
              <div key={n} className="flex flex-col items-center text-center relative">
                <div className="relative mb-4">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm">
                    {n}
                  </span>
                </div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5 leading-snug">
                  {label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features bento grid ── */}
      <section className="bg-white dark:bg-gray-900 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            Everything built for Nigerian applicants
          </h2>

          {/* Asymmetric bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Row 1 — large + small */}
            <div className="md:col-span-2 rounded-4xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/5" />
              <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/5" />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                  <FileEdit className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Cover Letter Writer</h3>
                <p className="text-primary-200 text-sm leading-relaxed max-w-sm">
                  Personalised cover letters that address the key concerns of visa officers reviewing
                  Nigerian applications. Powered by Claude AI — in seconds.
                </p>
              </div>
            </div>

            <div className="rounded-4xl bg-gradient-to-br from-violet-600 to-purple-800 p-7 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/5" />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">24/7 AI Visa Expert</h3>
                <p className="text-violet-200 text-sm leading-relaxed">
                  Instant answers on rejection reasons, financial requirements, and embassy-specific
                  rules — at any hour.
                </p>
              </div>
            </div>

            {/* Row 2 — 3 equal */}
            <div className="rounded-4xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-7">
              <div className="h-11 w-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                <CheckSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Smart Checklists</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Country-specific and visa-type-specific lists tailored to Nigerian applicants. Exactly
                what your embassy requires.
              </p>
            </div>

            <div className="rounded-4xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-7">
              <div className="h-11 w-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Application Timeline</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Know exactly when to book appointments, what deadlines to hit, and how long
                processing really takes.
              </p>
            </div>

            <div className="rounded-4xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-7">
              <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-5">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Zero Fraud Risk</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                No middlemen. No inflated fees. No fake visa agents. Your documents go directly to
                the embassy — through you.
              </p>
            </div>

            {/* Bonus card spanning full */}
            <div className="md:col-span-3 rounded-4xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Connected to study abroad
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already on Tundua for university applications? Your visa support is one click away
                  — same account.
                </p>
              </div>
              <Link
                href="/auth/register"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-gray-50 dark:bg-slate-950 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-3">
            Simple, honest pricing
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-14 text-sm">
            Less than what you&apos;d pay an agent — with better results
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            {PRICING.map(({ name, price, per, features, cta, primary }) => (
              <div
                key={name}
                className={`relative rounded-3xl p-7 ${
                  primary
                    ? "bg-gradient-to-b from-primary-600 to-primary-800 text-white scale-105 shadow-2xl shadow-primary-900/40 z-10"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                }`}
              >
                {primary && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 text-xs font-bold shadow-md whitespace-nowrap">
                    <Star className="h-3 w-3" /> Most popular
                  </span>
                )}

                <div
                  className={`font-bold text-lg mb-1 ${
                    primary ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {name}
                </div>
                <div className={`text-3xl font-extrabold mb-0.5 ${primary ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  {price}
                </div>
                <div
                  className={`text-xs mb-6 ${primary ? "text-primary-200" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {per}
                </div>

                <ul className="space-y-2.5 mb-7">
                  {features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${
                        primary ? "text-primary-100" : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 flex-shrink-0 ${primary ? "text-white" : "text-green-500"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className={`block text-center py-2.5 rounded-full text-sm font-semibold transition-all ${
                    primary
                      ? "bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
                      : "border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600"
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600">
        <div className="absolute inset-0" style={GRID_PATTERN} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,rgba(255,255,255,0.10)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-medium text-white/80 mb-8">
            <Star className="h-3.5 w-3.5 text-yellow-300" />
            Trusted by Nigerian students & travellers
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Ready to get your visa{" "}
            <span className="bg-gradient-to-r from-white via-sky-100 to-violet-200 bg-clip-text text-transparent">
              the smart way
            </span>
            ?
          </h2>

          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of Nigerians who use Tundua to navigate visa applications without the
            stress, the agents, or the confusion.
          </p>

          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-all shadow-2xl shadow-black/20"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 border-t border-white/10 px-6 py-8 text-center">
        <p className="text-sm text-slate-500">
          Tundua Visa is part of{" "}
          <Link href="/" className="text-primary-400 hover:underline">
            tundua.com
          </Link>{" "}
          — Nigeria&apos;s study abroad &amp; international travel platform.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          This tool provides guidance only. Always verify requirements on official embassy websites
          before applying. Questions?{" "}
          <a href="mailto:tunduaedu@gmail.com" className="text-primary-400 hover:underline">
            tunduaedu@gmail.com
          </a>
        </p>
      </footer>
    </main>
  );
}

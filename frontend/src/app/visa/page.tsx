import Link from "next/link";
import Image from "next/image";
import VisaGatedCTA from "@/components/VisaGatedCTA";
import { FAQStructuredData, BreadcrumbStructuredData } from "@/components/StructuredData";

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] || "https://tundua.com";
import {
  CheckSquare,
  FileEdit,
  MessageCircle,
  Calendar,
  Shield,
  GraduationCap,
  Check,
  Sparkles,
  Globe,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Visa Assistant — AI-Powered Visa Guidance for Nigerians | Tundua",
  description:
    "AI-powered visa guidance for Nigerian passport holders. Step-by-step document checklists, AI cover letter writer, and 24/7 expert chat. Free to start.",
  alternates: {
    canonical: `${APP_URL}/visa`,
  },
  openGraph: {
    title: "Visa Assistant — AI-Powered Visa Guidance for Nigerians | Tundua",
    description:
      "Step-by-step visa guidance, smart document checklists, and AI-written cover letters built specifically for Nigerian applicants. Free to start.",
    url: `${APP_URL}/visa`,
    type: "website" as const,
  },
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
    price: "₦5,000",
    per: "one-time payment",
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
    price: "₦15,000",
    per: "one-time payment",
    features: [
      "Everything in Pro",
      "Expert document review (up to 5 docs)",
      "1-on-1 counsellor session (45 min)",
      "Priority WhatsApp support",
    ],
    cta: "Get Premium",
    primary: false,
  },
];

const WHATSAPP_URL = "https://wa.me/2349047185482?text=Hi%2C%20I%20need%20help%20with%20my%20visa%20application";

const VISA_FAQS = [
  {
    question: "Can Nigerians really get a UK visa without an agent?",
    answer:
      "Yes. The UK visa application process is fully self-service through the UKVI website. You do not need an agent — and using an unlicensed agent increases your fraud risk. Tundua walks you through every step: checklist, cover letter, and timeline. You submit directly to the embassy yourself.",
  },
  {
    question: "What are the most common reasons Nigerian visa applications are refused?",
    answer:
      "The top refusal reasons for Nigerians are: insufficient proof of financial ties to Nigeria (funds in bank account), weak cover letter that doesn't address officer concerns, incomplete or inconsistent documents, and missing proof of accommodation or travel insurance. Tundua's AI cover letter writer and smart checklist are specifically designed to address all of these.",
  },
  {
    question: "How much money do I need in my bank account for a UK/Schengen visa?",
    answer:
      "For a UK standard visitor visa, UKVI recommends at least £1,000–£2,000 (roughly ₦1.8M–₦3.6M) in your account for a short trip, with funds present for at least 3–6 months. For Schengen, the requirement is typically €50–€100 per day of stay. The exact amount varies — Tundua's AI will tell you the specific requirement for your destination and duration.",
  },
  {
    question: "Is Tundua's visa service really free?",
    answer:
      "The Free plan is genuinely free — no credit card required. You get destination guides, a document checklist, and 3 AI questions per day. The paid Pro plan (₦5,000 one-time) adds unlimited AI chat and the AI cover letter writer. There are no hidden fees, no subscriptions, and no automatic charges.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept payments via Paystack — Nigerian debit/credit cards, USSD (*737#, *901#, etc.), and bank transfers are all supported. No foreign card is required. You will never be charged automatically — all payments are one-time.",
  },
  {
    question: "How is Tundua different from a visa agent?",
    answer:
      "Traditional visa agents in Lagos charge ₦50,000–₦200,000, and many are unlicensed or fraudulent. Tundua is a self-service AI platform: we provide the guidance, checklists, and documents — but you submit directly to the embassy. No middlemen, no inflated fees, and no risk of your documents being mishandled.",
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
          <VisaGatedCTA
            variant="plan"
            label="Get started free"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30"
          />
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
            <VisaGatedCTA variant="primary" label="Start for free" />
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
                <p className="text-primary-200 text-sm leading-relaxed max-w-sm mb-5">
                  Personalised cover letters that address the key concerns of visa officers reviewing
                  Nigerian applications. Powered by Claude AI — in seconds.
                </p>
                <VisaGatedCTA
                  variant="plan"
                  label="Write My Cover Letter"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold transition-all"
                />
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
                href="/auth/login"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                Sign in to your account
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

          {/* Payment trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Pay with:</span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium">Paystack</span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium">Debit / Credit Card</span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium">USSD</span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium">Bank Transfer</span>
            <span className="text-slate-400">·</span>
            <span>One-time · No subscriptions</span>
          </div>

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

                <VisaGatedCTA
                  variant="plan"
                  label={cta}
                  className={`block text-center py-2.5 rounded-full text-sm font-semibold transition-all ${
                    primary
                      ? "bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
                      : "border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="bg-white dark:bg-gray-900 px-6 py-10 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl px-7 py-5">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Have questions before you start?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chat with our team on WhatsApp — we reply within minutes.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 dark:bg-slate-950 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            Common visa questions, answered
          </h2>
          <div className="space-y-3">
            {VISA_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors list-none text-sm leading-snug">
                  {faq.question}
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-4 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </details>
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

          <VisaGatedCTA
            variant="primary"
            label="Get started free"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-all shadow-2xl shadow-black/20"
          />
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

      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Visa Assistant", url: "/visa" },
        ]}
      />
      <FAQStructuredData faqs={VISA_FAQS} />
    </main>
  );
}

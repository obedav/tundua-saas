"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Globe, Plane, FileEdit, MessageCircle, Calendar,
  Check, ChevronRight, ChevronLeft, Copy, RefreshCw, Send,
  Loader2, AlertCircle, Info, Lightbulb, CheckSquare,
  GraduationCap, Briefcase, Users, Building, Heart,
} from "lucide-react";

type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

interface ChatMessage {
  role: "bot" | "user";
  text: string;
}

const STEP_CONFIG = [
  { n: 1 as StepNumber, label: "Destination", icon: Globe },
  { n: 2 as StepNumber, label: "Visa Type", icon: Plane },
  { n: 3 as StepNumber, label: "Documents", icon: CheckSquare },
  { n: 4 as StepNumber, label: "Cover Letter", icon: FileEdit },
  { n: 5 as StepNumber, label: "AI Chat", icon: MessageCircle },
  { n: 6 as StepNumber, label: "Timeline", icon: Calendar },
];

const POPULAR_DESTINATIONS = [
  { label: "🇬🇧 United Kingdom", value: "United Kingdom" },
  { label: "🇨🇦 Canada", value: "Canada" },
  { label: "🇺🇸 United States", value: "United States" },
  { label: "🇪🇺 Schengen Zone", value: "Schengen Zone" },
  { label: "🇦🇪 UAE / Dubai", value: "UAE" },
  { label: "🇦🇺 Australia", value: "Australia" },
  { label: "🇩🇪 Germany", value: "Germany" },
];

const ALL_COUNTRIES = [
  "United Kingdom", "United States", "Canada", "Germany", "France",
  "Netherlands", "Italy", "Spain", "Australia", "UAE", "South Africa",
  "China", "Japan", "Ireland", "Portugal", "Belgium", "Sweden", "Norway",
  "Denmark", "Finland", "Switzerland", "Austria", "New Zealand",
];

const VISA_TYPES = [
  { id: "tourist", label: "Tourist / Visitor", sub: "B1/B2 · Standard Visitor", icon: Plane },
  { id: "student", label: "Student", sub: "Tier 4 · F1 · Student Visa", icon: GraduationCap },
  { id: "work", label: "Work", sub: "Skilled Worker · H1B · LMIA", icon: Briefcase },
  { id: "family", label: "Family Reunion", sub: "Spouse · Dependent · Settlement", icon: Users },
  { id: "business", label: "Business", sub: "Short stays · Conferences", icon: Building },
  { id: "medical", label: "Medical", sub: "Treatment · Specialist visit", icon: Heart },
];

const DOCUMENT_SECTIONS = [
  {
    title: "Identity & Travel",
    badge: "Required",
    badgeColor: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    docs: [
      { id: "passport", name: "International Passport", note: "Valid 6+ months beyond your travel date. Must have 2+ blank pages.", required: true },
      { id: "national_id", name: "National ID Card or Driver's License", note: "Supporting ID document — original and photocopy.", required: true },
      { id: "photos", name: "Recent Passport Photographs", note: "2 photos, white background, taken within 6 months. Check embassy size requirements.", required: true },
    ],
  },
  {
    title: "Financial Documents",
    badge: "3 documents",
    badgeColor: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400",
    docs: [
      { id: "bank_stmt", name: "Bank Statement (last 6 months)", note: "Show consistent balance and regular transactions. Avoid large deposits right before applying.", required: true },
      { id: "employment", name: "Proof of Income / Employment Letter", note: "On company letterhead — states salary, position, and duration of employment.", required: true },
      { id: "tax", name: "Tax Clearance Certificate", note: "FIRS or LIRS certificate for the last 3 years.", required: false },
    ],
  },
  {
    title: "Travel Plans & Accommodation",
    badge: "Time-sensitive",
    badgeColor: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    docs: [
      { id: "flight", name: "Flight Booking Confirmation", note: "Book refundable/flexible — most embassies accept reservations, not full payment.", required: true },
      { id: "hotel", name: "Hotel Reservation or Host Invitation Letter", note: "If staying with family/friend, include their ID, proof of residence, and signed invitation.", required: true },
      { id: "insurance", name: "Travel Insurance", note: "Minimum €30,000 coverage for Schengen. Highly recommended for all other destinations.", required: true },
    ],
  },
  {
    title: "Supporting Documents",
    badge: "Strengthens application",
    badgeColor: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    docs: [
      { id: "cover_letter_doc", name: "Cover Letter / Visa Application Letter", note: "A well-written letter explaining your purpose, itinerary, and intention to return to Nigeria.", required: true },
    ],
  },
];

const TOTAL_DOCS = DOCUMENT_SECTIONS.reduce((sum, s) => sum + s.docs.length, 0);

const QUICK_QUESTIONS = [
  "What are common rejection reasons?",
  "How much money should my account show?",
  "Do I need travel insurance?",
  "Can I use a refundable ticket?",
];

const TIMELINE_ITEMS = [
  { label: "Document preparation started", date: "Today — Week 1", status: "done" as const },
  { label: "Gather all required documents", date: "Week 1–2 · Estimated 10 days", status: "active" as const },
  { label: "Book embassy appointment (VFS / TLS)", date: "Week 2 · As soon as docs are ready", status: "pending" as const },
  { label: "Submit visa application + biometrics", date: "Week 3 · Attend appointment in person", status: "pending" as const },
  { label: "Processing & decision period", date: "Week 3–6 · Allow 3–15 business days", status: "pending" as const },
  { label: "Passport returned with visa decision", date: "Week 6–7 · Check VFS tracking portal", status: "pending" as const },
  { label: "Travel day!", date: "Week 8 — Your intended travel date", status: "target" as const },
];

export default function VisaAssistantPage() {
  const { user } = useAuth();

  const [step, setStep] = useState<StepNumber>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepNumber>>(new Set());

  // Step 1
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [stayDuration, setStayDuration] = useState("1–3 months");
  const [visitedBefore, setVisitedBefore] = useState("No, first time");

  // Step 2
  const [visaType, setVisaType] = useState("");
  const [travelPurpose, setTravelPurpose] = useState("");

  // Step 3
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);

  // Step 4
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantJob, setApplicantJob] = useState("");
  const [specialCircumstances, setSpecialCircumstances] = useState("");
  const [copied, setCopied] = useState(false);

  // Step 5
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hello! I'm your Tundua Visa Assistant 🇳🇬. I can help with document requirements, embassy interview tips, financial proof, and more. What would you like to know?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.first_name && user?.last_name) {
      setApplicantName(`${user.first_name} ${user.last_name}`);
    }
  }, [user]);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 56);
    setTravelDate(d.toISOString().split("T")[0] ?? "");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const fetchAiTips = async () => {
    if (aiTips.length > 0 || !destination || !visaType) return;
    setTipsLoading(true);
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "application_tips",
          applicationData: { country: destination, visaType, purpose: travelPurpose, stayDuration },
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAiTips(data.data.slice(0, 4));
      }
    } catch {
      // tips are supplementary — silent fail
    } finally {
      setTipsLoading(false);
    }
  };

  const generateCoverLetter = async (overrides?: { name?: string; job?: string; circumstances?: string }) => {
    setCoverLetterLoading(true);
    try {
      const res = await fetch("/api/visa/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          visaType,
          travelPurpose,
          stayDuration,
          applicantName: overrides?.name ?? applicantName,
          applicantJob: overrides?.job ?? applicantJob,
          specialCircumstances: overrides?.circumstances ?? specialCircumstances,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoverLetter(data.data.letter);
      } else {
        setCoverLetter("Unable to generate letter. Please check your connection and try again.");
      }
    } catch {
      setCoverLetter("Unable to generate letter. Please check your connection and try again.");
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const sendChatMessage = async (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg || chatLoading) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/visa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context: { country: destination, visaType } }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.success ? data.data.answer : "Sorry, I couldn't get an answer right now. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Connection error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const goToStep = (n: StepNumber) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    if (n === 3) fetchAiTips();
    if (n === 4 && !coverLetter) generateCoverLetter();
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyLetter = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkedCount = checkedDocs.size;
  const progressPct = Math.round((checkedCount / TOTAL_DOCS) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Page header ── */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-2">
          {/* Gradient icon badge */}
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 opacity-20 blur-sm -z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Visa Assistant</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              AI-powered guidance for Nigerian passport holders
            </p>
          </div>
        </div>
        {/* Gradient accent line */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-transparent opacity-40" />
      </div>

      {/* ── Step progress indicator (above card) ── */}
      <div className="mb-6">
        {/* Desktop progress stepper */}
        <div className="hidden sm:flex items-start justify-between relative">
          {/* Background line */}
          <div className="absolute top-3.5 left-[4%] right-[4%] h-px bg-gray-200 dark:bg-gray-700" />
          {/* Progress fill */}
          <div
            className="absolute top-3.5 left-[4%] h-px bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700"
            style={{ width: `${((step - 1) / 5) * 92}%` }}
          />
          {STEP_CONFIG.map(({ n, label }) => {
            const isActive = step === n;
            const isDone = completedSteps.has(n) && !isActive;
            return (
              <button
                key={n}
                onClick={() => setStep(n)}
                className="flex flex-col items-center gap-2 z-10 group"
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isDone
                      ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-md shadow-primary-500/30"
                      : isActive
                      ? "bg-white dark:bg-gray-800 border-2 border-primary-500 text-primary-600 dark:text-primary-400 shadow-md shadow-primary-500/20 scale-110"
                      : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 group-hover:border-primary-300 group-hover:text-primary-500 transition-colors"
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : n}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : isDone
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile fallback */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Step {step} of 6 —{" "}
              <span className="text-primary-600 dark:text-primary-400">
                {STEP_CONFIG.find((s) => s.n === step)?.label}
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{step}/6</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700"
              style={{ width: `${((step - 1) / 5) * 100 + 100 / 6}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Wizard card ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-fade-in-up">
        <div className="p-6 sm:p-7">

          {/* ─────────── STEP 1: Destination ─────────── */}
          {step === 1 && (
            <div>
              {/* Left border accent */}
              <div className="border-l-4 border-primary-500 pl-4 mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Where are you going?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Select your destination and travel details</p>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-6 text-sm text-primary-700 dark:text-primary-300">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Applications are tailored to Nigerian passport holders</span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Popular destinations</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {POPULAR_DESTINATIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setDestination(value)}
                    className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                      destination === value
                        ? "border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/20 text-primary-700 dark:text-primary-300 shadow-sm shadow-primary-500/10"
                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-600 dark:hover:text-primary-400 bg-white dark:bg-gray-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Or select any country</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  >
                    <option value="">Choose country...</option>
                    {ALL_COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Intended travel date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Duration of stay</label>
                  <select
                    value={stayDuration}
                    onChange={(e) => setStayDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  >
                    {["Less than 1 month", "1–3 months", "3–6 months", "6–12 months", "More than 1 year"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Have you visited before?</label>
                  <select
                    value={visitedBefore}
                    onChange={(e) => setVisitedBefore(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  >
                    {["No, first time", "Yes, once", "Yes, multiple times"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => goToStep(2)}
                  disabled={!destination}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────── STEP 2: Visa Type ─────────── */}
          {step === 2 && (
            <div>
              <div className="border-l-4 border-secondary-500 pl-4 mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">What type of visa?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Select the category that matches your purpose of travel</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {VISA_TYPES.map(({ id, label, sub, icon: Icon }) => {
                  const isSelected = visaType === label;
                  return (
                    <button
                      key={id}
                      onClick={() => setVisaType(label)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected
                          ? "border-primary-500 bg-gradient-to-b from-primary-50 to-secondary-50 dark:from-primary-900/25 dark:to-secondary-900/15 shadow-md shadow-primary-500/15"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-br from-primary-500 to-secondary-500 shadow-md shadow-primary-500/30"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${isSelected ? "text-primary-700 dark:text-primary-300" : "text-gray-900 dark:text-white"}`}>
                          {label}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mb-7">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Brief purpose of travel</label>
                <textarea
                  value={travelPurpose}
                  onChange={(e) => setTravelPurpose(e.target.value)}
                  placeholder="e.g. I plan to visit my brother in London and tour the country for 3 weeks..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => goToStep(3)}
                  disabled={!visaType}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200"
                >
                  Generate Checklist <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────── STEP 3: Documents ─────────── */}
          {step === 3 && (
            <div>
              <div className="border-l-4 border-emerald-500 pl-4 mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your document checklist</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Tailored for {destination} — {visaType} visa. Tick items as you gather them.
                </p>
              </div>

              {/* Circular progress + label */}
              <div className="flex items-center gap-5 mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                {/* SVG circular ring */}
                <div className="relative flex-shrink-0 h-16 w-16">
                  <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32" cy="32" r="26"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-gray-200 dark:text-gray-600"
                    />
                    <circle
                      cx="32" cy="32" r="26"
                      fill="none"
                      stroke="url(#docProgress)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - progressPct / 100)}`}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="docProgress" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{progressPct}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {checkedCount} of {TOTAL_DOCS} ready
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {progressPct === 100
                      ? "All documents gathered — you're ready!"
                      : `${TOTAL_DOCS - checkedCount} document${TOTAL_DOCS - checkedCount !== 1 ? "s" : ""} still needed`}
                  </div>
                </div>
              </div>

              {/* Document sections */}
              {DOCUMENT_SECTIONS.map((section) => (
                <div key={section.title} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">{section.title}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${section.badgeColor}`}>{section.badge}</span>
                  </div>
                  <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-700 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {section.docs.map((doc) => {
                      const isChecked = checkedDocs.has(doc.id);
                      return (
                        <div
                          key={doc.id}
                          className={`flex items-start gap-3.5 p-4 transition-colors ${
                            isChecked
                              ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                          }`}
                        >
                          {/* Square check button */}
                          <button
                            onClick={() => {
                              setCheckedDocs((prev) => {
                                const next = new Set(prev);
                                if (isChecked) { next.delete(doc.id); } else { next.add(doc.id); }
                                return next;
                              });
                            }}
                            className={`mt-0.5 h-6 w-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              isChecked
                                ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-transparent scale-110 shadow-md shadow-emerald-500/30"
                                : "border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:scale-105"
                            }`}
                          >
                            {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${isChecked ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
                              {doc.name}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{doc.note}</div>
                            <span className={`inline-block text-xs font-semibold mt-1.5 px-2 py-0.5 rounded-full ${
                              doc.required
                                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            }`}>
                              {doc.required ? "Required" : "Recommended"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* AI Tips */}
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 mb-7">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    AI tips for your {destination} {visaType} visa
                  </span>
                </div>
                {tipsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating personalised tips...
                  </div>
                ) : aiTips.length > 0 ? (
                  <ul className="space-y-2">
                    {aiTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-amber-700 dark:text-amber-300">
                        <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Could not load AI tips. Try refreshing, or continue to the next step.
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Generate Cover Letter <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────── STEP 4: Cover Letter ─────────── */}
          {step === 4 && (
            <div>
              <div className="border-l-4 border-violet-500 pl-4 mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI-generated cover letter</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">A personalised draft based on your details — edit before submitting</p>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 mb-5 text-sm text-amber-700 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Personalise this letter with your real details before submitting. Fill in all placeholder fields marked with [ ].</span>
              </div>

              {/* macOS-style document viewer */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden mb-6 shadow-md">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  {/* Traffic lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="h-3 w-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer" />
                    <div className="h-3 w-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                  {/* Filename */}
                  <div className="flex-1 text-center">
                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500">visa_cover_letter.txt</span>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => generateCoverLetter({ name: applicantName, job: applicantJob, circumstances: specialCircumstances })}
                      disabled={coverLetterLoading}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                      {coverLetterLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                      Regenerate
                    </button>
                    <button
                      onClick={copyLetter}
                      disabled={!coverLetter || coverLetterLoading}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Paper document body */}
                <div className="min-h-[220px] bg-[#fafaf9] dark:bg-gray-50 p-6">
                  {coverLetterLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                      <p className="text-sm text-gray-500">Generating your cover letter...</p>
                    </div>
                  ) : (
                    <p className="font-serif text-sm text-gray-800 leading-7 whitespace-pre-wrap">
                      {coverLetter || "Click Regenerate to generate your letter."}
                    </p>
                  )}
                </div>
              </div>

              {/* Personalisation form */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-600 p-5 mb-7 bg-gray-50/50 dark:bg-gray-700/20">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Personalise and regenerate</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Your full name</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Chukwuemeka Adeyemi"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Your profession</label>
                    <input
                      type="text"
                      value={applicantJob}
                      onChange={(e) => setApplicantJob(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Special circumstances to mention</label>
                    <input
                      type="text"
                      value={specialCircumstances}
                      onChange={(e) => setSpecialCircumstances(e.target.value)}
                      placeholder="e.g. attending sister's graduation, business conference..."
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => generateCoverLetter({ name: applicantName, job: applicantJob, circumstances: specialCircumstances })}
                    disabled={coverLetterLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Apply & Regenerate
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => goToStep(5)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Ask AI Questions <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────── STEP 5: AI Chat ─────────── */}
          {step === 5 && (
            <div>
              <div className="border-l-4 border-primary-500 pl-4 mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ask the visa assistant</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Instant answers about your application, embassy requirements, and common mistakes
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden mb-7 shadow-sm">
                {/* Chat header — gradient */}
                <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    🤖
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">Tundua Visa AI</div>
                    <div className="text-xs opacity-75">
                      {destination ? `${destination} ${visaType} specialist` : "Nigerian visa specialist"}
                    </div>
                  </div>
                  {/* Online indicator with pulse */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs opacity-75">Online</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 max-h-72 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex flex-col gap-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {/* Bot avatar */}
                      {msg.role === "bot" && (
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-0.5">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-br-sm shadow-md shadow-primary-500/20"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-end gap-2 justify-start">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-0.5">
                        AI
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                        <div className="flex gap-1.5">
                          {[0, 0.2, 0.4].map((delay, i) => (
                            <div
                              key={i}
                              className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce"
                              style={{ animationDelay: `${delay}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick chips */}
                <div className="flex gap-2 flex-wrap px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendChatMessage(q)}
                      disabled={chatLoading}
                      className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 disabled:opacity-50 transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2 p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                    placeholder="Ask anything about your visa application..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={() => sendChatMessage()}
                    disabled={!chatInput.trim() || chatLoading}
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/25 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => goToStep(6)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  View Timeline <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────── STEP 6: Timeline ─────────── */}
          {step === 6 && (
            <div>
              <div className="border-l-4 border-secondary-500 pl-4 mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application timeline</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track your progress from preparation to travel day</p>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-7 text-sm text-primary-700 dark:text-primary-300">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  Based on a target travel date in <strong>8 weeks</strong>
                  {travelDate ? ` (${new Date(travelDate).toLocaleDateString("en-GB", { day: "numeric", month: "long" })})` : ""}.
                </span>
              </div>

              {/* Timeline */}
              <div className="relative pl-12 mb-8">
                {/* Background connecting line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 dark:bg-gray-700" />
                {/* Gradient progress line for completed portion */}
                <div
                  className="absolute left-5 top-5 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500 transition-all duration-700"
                  style={{ height: `${(1 / TIMELINE_ITEMS.length) * 100}%` }}
                />

                {TIMELINE_ITEMS.map((item, i) => (
                  <div key={i} className="relative flex gap-4 mb-7 last:mb-0">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-7 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-300 ${
                        item.status === "done"
                          ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                          : item.status === "active"
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-100 dark:ring-amber-900/30"
                          : item.status === "target"
                          ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30"
                          : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-400 shadow-sm"
                      }`}
                    >
                      {item.status === "done" ? (
                        <Check className="h-5 w-5" />
                      ) : item.status === "active" ? (
                        <span className="text-base">→</span>
                      ) : item.status === "target" ? (
                        <span className="text-base">✈</span>
                      ) : (
                        i + 1
                      )}
                    </div>

                    <div className="pt-1.5">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.date}</div>
                      <span
                        className={`inline-block text-xs font-semibold mt-1.5 px-2.5 py-0.5 rounded-full ${
                          item.status === "done"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : item.status === "active"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                            : item.status === "target"
                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                        }`}
                      >
                        {item.status === "done"
                          ? "Completed"
                          : item.status === "active"
                          ? "In progress"
                          : item.status === "target"
                          ? "Target"
                          : "Upcoming"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA banner */}
              <div className="relative rounded-2xl overflow-hidden p-5 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-600 to-secondary-600" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                  <div>
                    <div className="font-bold text-base mb-1">Need expert support?</div>
                    <div className="text-sm opacity-80">
                      Tundua&apos;s Fellow package includes full visa application support with a dedicated counsellor.
                    </div>
                  </div>
                  <a
                    href="mailto:tunduaedu@gmail.com?subject=Fellow Package — Visa Support"
                    className="flex-shrink-0 bg-white text-primary-600 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-primary-50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Talk to a human →
                  </a>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(5)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => { setStep(1); setCompletedSteps(new Set()); }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 text-sm font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Start new application
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-5">
        This tool provides guidance only. Always verify requirements on official embassy websites before applying.
      </p>
    </div>
  );
}

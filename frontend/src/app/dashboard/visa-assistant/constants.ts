import {
  Plane, GraduationCap, Briefcase, Users, Building, Heart,
} from "lucide-react";

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface ChatMessage {
  role: "bot" | "user";
  text: string;
}

export const STEP_CONFIG = [
  { n: 1 as StepNumber, label: "Destination" },
  { n: 2 as StepNumber, label: "Visa Type" },
  { n: 3 as StepNumber, label: "Documents" },
  { n: 4 as StepNumber, label: "Cover Letter" },
  { n: 5 as StepNumber, label: "AI Chat" },
  { n: 6 as StepNumber, label: "Timeline" },
];

export const POPULAR_DESTINATIONS = [
  { label: "🇬🇧 United Kingdom", value: "United Kingdom" },
  { label: "🇨🇦 Canada", value: "Canada" },
  { label: "🇺🇸 United States", value: "United States" },
  { label: "🇪🇺 Schengen Zone", value: "Schengen Zone" },
  { label: "🇦🇪 UAE / Dubai", value: "UAE" },
  { label: "🇦🇺 Australia", value: "Australia" },
  { label: "🇩🇪 Germany", value: "Germany" },
];

export const ALL_COUNTRIES = [
  "United Kingdom", "United States", "Canada", "Germany", "France",
  "Netherlands", "Italy", "Spain", "Australia", "UAE", "South Africa",
  "China", "Japan", "Ireland", "Portugal", "Belgium", "Sweden", "Norway",
  "Denmark", "Finland", "Switzerland", "Austria", "New Zealand",
];

export const VISA_TYPES = [
  { id: "tourist", label: "Tourist / Visitor", sub: "B1/B2 · Standard Visitor", icon: Plane },
  { id: "student", label: "Student", sub: "Tier 4 · F1 · Student Visa", icon: GraduationCap },
  { id: "work", label: "Work", sub: "Skilled Worker · H1B · LMIA", icon: Briefcase },
  { id: "family", label: "Family Reunion", sub: "Spouse · Dependent · Settlement", icon: Users },
  { id: "business", label: "Business", sub: "Short stays · Conferences", icon: Building },
  { id: "medical", label: "Medical", sub: "Treatment · Specialist visit", icon: Heart },
];

export const DOCUMENT_SECTIONS = [
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

export const TOTAL_DOCS = DOCUMENT_SECTIONS.reduce((sum, s) => sum + s.docs.length, 0);

export const QUICK_QUESTIONS = [
  "What are common rejection reasons?",
  "How much money should my account show?",
  "Do I need travel insurance?",
  "Can I use a refundable ticket?",
];

export const TIMELINE_ITEMS = [
  { label: "Document preparation started", date: "Today — Week 1", status: "done" as const },
  { label: "Gather all required documents", date: "Week 1–2 · Estimated 10 days", status: "active" as const },
  { label: "Book embassy appointment (VFS / TLS)", date: "Week 2 · As soon as docs are ready", status: "pending" as const },
  { label: "Submit visa application + biometrics", date: "Week 3 · Attend appointment in person", status: "pending" as const },
  { label: "Processing & decision period", date: "Week 3–6 · Allow 3–15 business days", status: "pending" as const },
  { label: "Passport returned with visa decision", date: "Week 6–7 · Check VFS tracking portal", status: "pending" as const },
  { label: "Travel day!", date: "Week 8 — Your intended travel date", status: "target" as const },
];

export type PlanFeature = { name: string; limit: string };

export type Plan = {
  name: string;
  price: string;
  priceNGN: string;
  description: string;
  features: PlanFeature[];
  ctaHref: string;
  ctaLabel: string;
  badge: string;
  badgeColor: string;
  cardColor: string;
  ctaColor: string;
  priceColor: string;
  isFree?: boolean;
  isCustom?: boolean;
  isAnnual?: boolean;
  highlighted?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Seeker",
    price: "Free",
    priceNGN: "₦0",
    description: "Perfect for students exploring their options",
    features: [
      { name: "University Search", limit: "5 searches/month" },
      { name: "Document Checklist", limit: "1 application draft" },
      { name: "Eligibility Check", limit: "1 check/month" },
      { name: "Application Dashboard", limit: "" },
      { name: "University Comparison", limit: "Up to 3 schools" },
      { name: "Community Forum", limit: "" },
      { name: "Email Support", limit: "72hr response" },
    ],
    ctaHref: "/apply",
    ctaLabel: "Get Started Free",
    badge: "Free Forever",
    badgeColor: "from-emerald-500 to-teal-500",
    cardColor: "from-emerald-50 to-teal-50 border-2 border-emerald-300",
    ctaColor: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    priceColor: "text-emerald-600",
    isFree: true,
  },
  {
    name: "Scholar",
    price: "$29.99",
    priceNGN: "₦49,999",
    description: "For serious applicants — all limits removed + human support",
    features: [
      { name: "Unlimited University Search", limit: "" },
      { name: "Unlimited Document Review", limit: "" },
      { name: "Unlimited Eligibility Checks", limit: "" },
      { name: "Essay Review & Editing", limit: "" },
      { name: "Priority Email Support", limit: "24hr response" },
      { name: "Deadline Management", limit: "" },
      { name: "University Recommendations", limit: "" },
      { name: "Scholarship Search", limit: "" },
      { name: "Expert Human Support", limit: "Live counselor" },
    ],
    ctaHref: "/dashboard/billing?plan=scholar",
    ctaLabel: "Get Started",
    badge: "Most Popular",
    badgeColor: "from-yellow-400 to-orange-400 text-slate-900",
    cardColor: "bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-2xl shadow-teal-500/30",
    ctaColor: "bg-white text-teal-600 hover:bg-blue-50",
    priceColor: "text-white",
    isAnnual: true,
    highlighted: true,
  },
  {
    name: "Fellow",
    price: "$149",
    priceNGN: "Custom pricing",
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
      { name: "Pre-departure Orientation", limit: "" },
    ],
    ctaHref: "mailto:hello@tundua.com?subject=Fellow Package Inquiry",
    ctaLabel: "Contact Us",
    badge: "VIP Service",
    badgeColor: "from-amber-500 to-orange-500",
    cardColor: "from-amber-50 to-orange-50 border-2 border-amber-300",
    ctaColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    priceColor: "text-amber-600",
    isCustom: true,
  },
];

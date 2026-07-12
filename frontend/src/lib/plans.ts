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
  headingColor: string;
  descColor: string;
  subPriceColor: string;
  featureTextColor: string;
  featureLimitColor: string;
  checkColor: string;
  isFree?: boolean;
  isAnnual?: boolean;
  highlighted?: boolean;
  paymentNote?: string;
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
    cardColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-300 dark:border-emerald-600/50",
    ctaColor: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    priceColor: "text-emerald-600 dark:text-emerald-400",
    headingColor: "text-slate-900 dark:text-stone-100",
    descColor: "text-slate-600 dark:text-stone-400",
    subPriceColor: "text-slate-500 dark:text-stone-400",
    featureTextColor: "text-slate-900 dark:text-stone-100",
    featureLimitColor: "text-slate-500 dark:text-stone-400",
    checkColor: "text-green-600 dark:text-green-400",
    isFree: true,
  },
  {
    name: "Scholar",
    price: "$49",
    priceNGN: "₦75,000",
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
    ctaHref: "/apply",
    ctaLabel: "Get Started",
    badge: "Annual Plan",
    badgeColor: "from-blue-500 to-indigo-500",
    cardColor: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-300 dark:border-blue-600/50",
    ctaColor: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
    priceColor: "text-blue-700 dark:text-blue-400",
    headingColor: "text-slate-900 dark:text-stone-100",
    descColor: "text-slate-600 dark:text-stone-400",
    subPriceColor: "text-slate-500 dark:text-stone-400",
    featureTextColor: "text-slate-900 dark:text-stone-100",
    featureLimitColor: "text-slate-500 dark:text-stone-400",
    checkColor: "text-blue-600 dark:text-blue-400",
    isAnnual: true,
  },
  {
    name: "Application Support",
    price: "$159",
    priceNGN: "₦250,000",
    description: "We handle your application from start to offer letter",
    features: [
      { name: "Everything in Scholar", limit: "" },
      { name: "Dedicated counselor assigned", limit: "" },
      { name: "University shortlist", limit: "Up to 5 schools" },
      { name: "Full document preparation", limit: "" },
      { name: "Application submission on your behalf", limit: "" },
      { name: "Offer letter management", limit: "" },
      { name: "WhatsApp support", limit: "" },
      { name: "Payment plan available", limit: "50% now, 50% on offer letter" },
    ],
    ctaHref: "/apply",
    ctaLabel: "Get Started",
    badge: "Most Popular",
    badgeColor: "from-yellow-400 to-orange-400 text-slate-900",
    cardColor: "bg-gradient-to-br from-blue-600 to-teal-600 shadow-2xl shadow-teal-500/30",
    ctaColor: "bg-white text-teal-600 hover:bg-blue-50",
    priceColor: "text-white",
    headingColor: "text-white",
    descColor: "text-blue-100",
    subPriceColor: "text-blue-100",
    featureTextColor: "text-white",
    featureLimitColor: "text-blue-200",
    checkColor: "text-green-300",
    highlighted: true,
    paymentNote: "Pay 50% now, 50% on offer letter",
  },
  {
    name: "Fellow",
    price: "$315",
    priceNGN: "₦500,000",
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
    ctaHref: "/apply",
    ctaLabel: "Get Started",
    badge: "Full Service",
    badgeColor: "from-amber-500 to-orange-500",
    cardColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-600/50",
    ctaColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    priceColor: "text-amber-600 dark:text-amber-400",
    headingColor: "text-slate-900 dark:text-stone-100",
    descColor: "text-slate-600 dark:text-stone-400",
    subPriceColor: "text-slate-500 dark:text-stone-400",
    featureTextColor: "text-slate-900 dark:text-stone-100",
    featureLimitColor: "text-slate-500 dark:text-stone-400",
    checkColor: "text-green-600 dark:text-green-400",
    paymentNote: "Pay ₦250,000 now, ₦250,000 on offer letter",
  },
  {
    name: "Premium Concierge",
    price: "$625+",
    priceNGN: "₦1,000,000+",
    description: "For complex cases that need personal expert attention",
    features: [
      { name: "Everything in Fellow", limit: "" },
      { name: "Multiple country applications", limit: "" },
      { name: "Complex profile handling", limit: "3rd class, gaps, prior visa refusals" },
      { name: "Dedicated personal advisor", limit: "Direct line" },
      { name: "Unlimited application attempts", limit: "" },
      { name: "Family package available", limit: "" },
      { name: "Direct WhatsApp to senior counselor", limit: "" },
    ],
    ctaHref: "/contact",
    ctaLabel: "Contact Us",
    badge: "VIP Service",
    badgeColor: "from-purple-500 to-violet-500",
    cardColor: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-2 border-purple-300 dark:border-purple-600/50",
    ctaColor: "bg-gradient-to-r from-purple-600 to-violet-600 text-white",
    priceColor: "text-purple-700 dark:text-purple-400",
    headingColor: "text-slate-900 dark:text-stone-100",
    descColor: "text-slate-600 dark:text-stone-400",
    subPriceColor: "text-slate-500 dark:text-stone-400",
    featureTextColor: "text-slate-900 dark:text-stone-100",
    featureLimitColor: "text-slate-500 dark:text-stone-400",
    checkColor: "text-green-600 dark:text-green-400",
    paymentNote: "Contact for exact quote",
  },
];

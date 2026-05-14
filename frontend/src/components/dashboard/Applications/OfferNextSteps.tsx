import Link from "next/link";
import { Home, DollarSign, BookOpen, ArrowRight, PartyPopper } from "lucide-react";

const SERVICES = [
  {
    icon: Home,
    title: "Book Student Accommodation",
    description:
      "Find verified student housing near your university. Secure your room before they fill up.",
    cta: "Find Accommodation",
    href: "/dashboard/support?subject=Accommodation+Assistance",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
  },
  {
    icon: DollarSign,
    title: "Pay Tuition at Best GBP Rate",
    description:
      "Send your tuition fee abroad at competitive exchange rates. Save on every transfer.",
    cta: "Get Forex Guidance",
    href: "/dashboard/support?subject=Forex+Tuition+Payment",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700",
  },
  {
    icon: BookOpen,
    title: "Apply for a Student Loan",
    description:
      "Explore financing options to cover tuition and living costs. Our team will guide you through eligibility.",
    cta: "Explore Loans",
    href: "/dashboard/support?subject=Student+Loan+Enquiry",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700",
  },
];

interface Props {
  universityName?: string;
}

export default function OfferNextSteps({ universityName }: Props) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 p-6">
      <div className="flex items-center gap-3 mb-2">
        <PartyPopper className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Congratulations{universityName ? ` on your offer from ${universityName}` : " on your offer!"}
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Here&apos;s what to do next to prepare for your arrival.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className={`rounded-xl border p-5 ${service.bg} flex flex-col gap-3`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <Link
                href={service.href}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                {service.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

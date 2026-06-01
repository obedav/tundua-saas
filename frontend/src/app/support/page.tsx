import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle, Mail, Phone, Clock, Zap, LogIn, ExternalLink } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import SupportFAQ from "./SupportFAQ";

export const metadata: Metadata = {
  title: "Help Center | Tundua",
  description:
    "Find answers to common questions about study abroad applications, visa guidance, payments, and technical issues. Reach our Lagos-based support team via WhatsApp, email, or phone.",
  openGraph: {
    title: "Help Center | Tundua Edu Consults",
    description:
      "Browse FAQs or contact our team directly. We respond within 2 hours on WhatsApp.",
    url: "https://tundua.com/support",
  },
};

const channels = [
  {
    icon: MessageCircle,
    name: "WhatsApp",
    href: "https://wa.me/2349047185482",
    responseTime: "Under 2 hours",
    badge: "Fastest",
    badgeColor: "bg-green-100 text-green-700",
    description: "Best for quick questions and document issues",
    cta: "Chat on WhatsApp",
    external: true,
  },
  {
    icon: Mail,
    name: "Email",
    href: "mailto:support@tundua.com",
    responseTime: "Within 24 hours",
    badge: "Detailed",
    badgeColor: "bg-blue-100 text-blue-700",
    description: "Best for billing issues and formal requests",
    cta: "Send Email",
    external: false,
  },
  {
    icon: Phone,
    name: "Phone",
    href: "tel:+2349047185482",
    responseTime: "Mon–Fri, 9AM–5PM",
    badge: "Direct",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Best for urgent application deadlines",
    cta: "Call Now",
    external: false,
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-violet-500 rounded-2xl mb-5 shadow-lg shadow-primary-200">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Find answers to common questions or reach us directly — we typically respond in under 2
            hours on WhatsApp.
          </p>
        </div>

        {/* Interactive FAQ + Categories (client component) */}
        <SupportFAQ />

        {/* Contact Channels */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-sm text-gray-600 mb-6">
            Our support team is based in Lagos and available during business hours.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.name}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-700" />
                      <span className="font-semibold text-gray-900 text-sm">{ch.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ch.badgeColor}`}
                    >
                      {ch.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{ch.description}</p>
                  <div className="flex items-center gap-1.5 mt-auto pt-3">
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500">{ch.responseTime}</span>
                  </div>
                  <a
                    href={ch.href}
                    target={ch.external ? "_blank" : undefined}
                    rel={ch.external ? "noopener noreferrer" : undefined}
                    className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    {ch.cta}
                    {ch.external && <ExternalLink className="w-3.5 h-3.5" />}
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-4">
            <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Fastest response:</strong> WhatsApp during business hours (Mon–Fri 9AM–5PM,
              Sat 10AM–2PM WAT). For urgent application deadlines, always use WhatsApp.
            </p>
          </div>
        </section>

        {/* CTA — existing clients */}
        <section className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-8 text-center text-white">
          <LogIn className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h2 className="text-xl font-bold mb-2">Already a Tundua client?</h2>
          <p className="text-primary-100 text-sm mb-5 max-w-md mx-auto">
            Log in to submit a support ticket, track its status, and get priority assistance from
            your dedicated consultant.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-primary-700 font-semibold text-sm rounded-xl hover:bg-primary-50 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In for Priority Support
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 border border-white/20 transition-colors"
            >
              General Enquiry
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua Edu Consults. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

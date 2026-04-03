import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { ApplyForm } from "./ApplyForm";
import { GraduationCap, CheckCircle, Users, Globe, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Apply to Study Abroad - Free Consultation",
  description:
    "Start your study abroad application with Tundua. Get matched with affordable universities, expert guidance on documents, and step-by-step admission support.",
  alternates: {
    canonical: `${process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'}/apply`,
  },
};

const STATS = [
  { icon: Users, label: "Students Helped", value: "500+" },
  { icon: Globe, label: "Universities", value: "100+" },
  { icon: Shield, label: "Success Rate", value: "95%" },
];

const BENEFITS = [
  "Free school selection guidance",
  "Document preparation support",
  "Application review by experts",
  "Visa guidance included",
  "Affordable packages from ₦89,000",
  "90-day money-back guarantee",
];

export default function ApplyPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Apply", url: "/apply" },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Value proposition */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full mb-4">
              <GraduationCap className="w-4 h-4" />
              Free Consultation
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apply to Study Abroad with Expert Guidance
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Tell us your goals and we&apos;ll match you with affordable universities.
              Get step-by-step support from school selection to visa.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-8">
              {STATS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What you get:</h3>
              <ul className="space-y-2">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Start Your Application</h2>
            <p className="text-sm text-gray-500 mb-6">
              Fill in your details and we&apos;ll reach out within 24 hours.
            </p>
            <ApplyForm />
          </div>
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

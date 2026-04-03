import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle } from "lucide-react";

interface BlogCTAProps {
  variant: "inline" | "banner";
}

const BENEFITS = [
  "Choose affordable universities",
  "Prepare strong applications",
  "Secure admission faster",
];

export function BlogCTA({ variant }: BlogCTAProps) {
  if (variant === "inline") {
    return (
      <div className="my-8 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              Need help applying to these universities?
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Tundua guides you from school selection to visa — step by step.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Start your application
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-8 text-white">
      <div className="max-w-lg mx-auto text-center">
        <GraduationCap className="w-10 h-10 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-bold mb-2">Ready to study abroad in 2026?</h3>
        <p className="text-white/80 mb-5">
          Tundua helps Nigerian students apply to affordable universities with expert guidance.
        </p>
        <ul className="space-y-2 text-left max-w-xs mx-auto mb-6">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000"}?text=${encodeURIComponent("Hi, I want help studying abroad")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

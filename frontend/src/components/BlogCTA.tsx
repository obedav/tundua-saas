import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle, MessageCircle, Clock, Shield, Users, Star } from "lucide-react";

interface BlogCTAProps {
  variant: "inline" | "mid" | "banner";
}

const WHATSAPP_URL = `https://wa.me/${process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000"}?text=${encodeURIComponent("Hi, I need help choosing the right university and applying")}`;

export function BlogCTA({ variant }: BlogCTAProps) {
  if (variant === "inline") {
    return (
      <div className="my-8 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              Confused about which UK university you can afford?
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Let Tundua help you choose the cheapest university, prepare your documents, and secure admission without mistakes.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Start your application in 2 minutes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "mid") {
    return (
      <div className="my-10 bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-3 mb-4">
          <Star className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="font-bold text-gray-900 text-lg">
            Not sure which of these universities you qualify for?
          </p>
        </div>
        <p className="text-gray-700 mb-4 ml-9">
          Most students apply to the wrong schools and get rejected. Don&apos;t waste money on applications that won&apos;t work.
        </p>
        <ul className="space-y-2 ml-9 mb-5">
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            Choose the right universities for your budget
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            Avoid costly application mistakes
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            Secure admission faster with expert review
          </li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 ml-9">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
          >
            Get Free Guidance
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp Now
          </a>
        </div>
      </div>
    );
  }

  // banner variant - bottom of article
  return (
    <div className="my-10 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-8 md:p-10 text-white">
      <div className="max-w-xl mx-auto text-center">
        <GraduationCap className="w-10 h-10 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-bold mb-2">Ready to study abroad in 2026?</h3>
        <p className="text-white/80 mb-6">
          Don&apos;t do it alone. Tundua helps Nigerian students apply to affordable universities — from school selection to visa.
        </p>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4" /> 500+ students helped
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" /> 95% success rate
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4" /> Built for Nigerian students
          </span>
        </div>

        <ul className="space-y-2 text-left max-w-xs mx-auto mb-6">
          <li className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
            Choose affordable universities that match your budget
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
            Expert document preparation and review
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
            Step-by-step guidance from application to visa
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Apply Now — It&apos;s Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Urgency */}
        <p className="flex items-center justify-center gap-1.5 text-xs text-white/70">
          <Clock className="w-3.5 h-3.5" />
          Limited application slots for September 2026 intake — start early to avoid missing deadlines
        </p>
      </div>
    </div>
  );
}

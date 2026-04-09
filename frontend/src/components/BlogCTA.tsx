import { ArrowRight, GraduationCap, CheckCircle, MessageCircle, Clock, Shield, Users, Star, Quote, FileText } from "lucide-react";
import { TrackedApplyLink, TrackedWhatsAppLink } from "./TrackedCTA";

interface BlogCTAProps {
  variant: "inline" | "mid" | "banner";
}

const WHATSAPP_URL = `https://wa.me/${process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000"}?text=${encodeURIComponent("Hi, I need help choosing the right university and applying. I found you on tundua.com")}`;

const TESTIMONIALS = [
  {
    text: "Tundua helped me secure admission to a UK university without stress. They handled everything from school selection to documents.",
    name: "Chioma A.",
    detail: "Admitted to University of Bolton, 2025",
  },
  {
    text: "I didn't know where to start, but they guided me step by step. Now I'm studying in the UK and paying less than I expected.",
    name: "Emeka O.",
    detail: "Admitted to Teesside University, 2025",
  },
];

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
            <TrackedApplyLink
              href="/apply"
              source="blog-cta-inline"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Apply to UK universities now — takes less than 2 minutes
              <ArrowRight className="w-4 h-4" />
            </TrackedApplyLink>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "mid") {
    return (
      <div className="my-10 space-y-4">
        {/* Lead Magnet - Free PDF */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-3 mb-3">
            <FileText className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-lg">
                Free Download: 2026 UK University Fees Guide for Nigerians
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Compare tuition fees, living costs, and scholarship options across 50+ UK universities — all in one PDF.
              </p>
            </div>
          </div>
          <div className="ml-9">
            <TrackedApplyLink
              href="/apply?lead_magnet=uk-fees-guide"
              source="blog-cta-lead-magnet"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
            >
              Download Free Guide
              <ArrowRight className="w-4 h-4" />
            </TrackedApplyLink>
            <p className="text-xs text-gray-400 mt-2">Drop your WhatsApp number on the next page and we&apos;ll send the PDF instantly.</p>
          </div>
        </div>

        {/* Original mid CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8">
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
            <TrackedApplyLink
              href="/apply"
              source="blog-cta-mid"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
            >
              Get Free Guidance
              <ArrowRight className="w-4 h-4" />
            </TrackedApplyLink>
            <TrackedWhatsAppLink
              href={WHATSAPP_URL}
              source="blog-cta-mid"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with an Advisor Now
            </TrackedWhatsAppLink>
          </div>
        </div>
      </div>
    );
  }

  // banner variant - bottom of article (full conversion section)
  return (
    <div className="my-10 space-y-6">
      {/* Testimonials */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Quote className="w-5 h-5 text-primary-500" />
          What Students Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-700 mb-3 italic">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm font-semibold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Our Application Packages</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Free Consultation</p>
              <p className="text-sm text-gray-600">Get guidance on your options — no commitment</p>
            </div>
            <span className="ml-auto font-bold text-green-600 whitespace-nowrap">FREE</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Application Support</p>
              <p className="text-sm text-gray-600">School selection + document prep + application review</p>
            </div>
            <span className="ml-auto font-bold text-gray-900 whitespace-nowrap">₦89,000</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <Star className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Full Admission + Visa Support</p>
              <p className="text-sm text-gray-600">Everything included — from application to visa guidance</p>
            </div>
            <span className="ml-auto font-bold text-primary-700 whitespace-nowrap">₦149,000+</span>
          </div>
        </div>
      </div>

      {/* Main CTA */}
      <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-8 md:p-10 text-white">
        <div className="max-w-xl mx-auto text-center">
          <GraduationCap className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Ready to study abroad in 2026?</h3>
          <p className="text-white/80 mb-6">
            Don&apos;t do it alone. Join 500+ Nigerian students who secured admission with Tundua&apos;s expert guidance.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4" /> 500+ students helped
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4" /> 95% success rate
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4" /> 90-day money-back guarantee
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <TrackedApplyLink
              href="/apply"
              source="blog-cta-banner"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply Now — It&apos;s Free to Start
              <ArrowRight className="w-4 h-4" />
            </TrackedApplyLink>
            <TrackedWhatsAppLink
              href={WHATSAPP_URL}
              source="blog-cta-banner"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Get Instant Answers on WhatsApp
            </TrackedWhatsAppLink>
          </div>

          {/* Urgency */}
          <p className="flex items-center justify-center gap-1.5 text-xs text-white/70">
            <Clock className="w-3.5 h-3.5" />
            Limited slots for September 2026 intake — start early to avoid missing deadlines
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, GraduationCap } from "lucide-react";
import { trackApplyClick, trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = process.env['NEXT_PUBLIC_WHATSAPP_NUMBER'] || "2348000000000";
const DEFAULT_MESSAGE = "Hi, I need help choosing the right university and applying. I found you on tundua.com";

/**
 * Sticky bottom CTA bar — mobile only.
 * Shows after the user scrolls 400px so it doesn't interfere with the hero/featured snippet.
 *
 * Mobile is the dominant traffic channel for Nigerian students, so this is the highest-impact
 * conversion surface on the site.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2">
        <Link
          href="/apply"
          onClick={() => trackApplyClick("sticky-mobile-bar")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-3 py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          <GraduationCap className="w-4 h-4" />
          Apply Now
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("sticky-mobile-bar")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

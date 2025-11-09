"use client";

import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyBottomCTAProps {
  text: string;
  onClick: () => void;
  showAfterScroll?: number;
  badge?: string;
}

export function StickyBottomCTA({
  text,
  onClick,
  showAfterScroll = 500,
  badge
}: StickyBottomCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > showAfterScroll && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= showAfterScroll) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, isDismissed]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 shadow-2xl">
            <div className="container-custom flex items-center justify-between gap-3">
              <div className="flex-1">
                {badge && (
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full mb-1">
                    {badge}
                  </span>
                )}
                <p className="font-semibold text-sm line-clamp-1">{text}</p>
              </div>

              <button
                onClick={onClick}
                className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg whitespace-nowrap"
              >
                Start Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

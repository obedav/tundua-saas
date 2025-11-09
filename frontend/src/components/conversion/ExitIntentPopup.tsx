"use client";

import { useState, useEffect } from "react";
import { X, Gift, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExitIntentPopupProps {
  onAccept: (discountCode: string) => void;
  onDecline: () => void;
  discountPercentage?: number;
  discountCode?: string;
}

export function ExitIntentPopup({
  onAccept,
  onDecline,
  discountPercentage = 20,
  discountCode = "STUDY20"
}: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('exit-intent-shown');
      if (shown) {
        setHasShown(true);
        return;
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of page
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('exit-intent-shown', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleAccept = () => {
    onAccept(discountCode);
    setIsOpen(false);
  };

  const handleDecline = () => {
    onDecline();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleDecline}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary-100 to-secondary-200 rounded-full blur-3xl opacity-50" />

              {/* Close button */}
              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Wait! Don't Leave Empty-Handed
                </h2>

                <p className="text-gray-600 text-center mb-6">
                  Get <span className="font-bold text-primary-600 text-2xl">{discountPercentage}% OFF</span> your first application package!
                </p>

                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    <p className="font-semibold text-gray-900">Your Exclusive Code:</p>
                  </div>
                  <div className="bg-white border-2 border-dashed border-primary-400 rounded-xl p-4 text-center">
                    <code className="text-2xl font-bold text-primary-600 tracking-wider">
                      {discountCode}
                    </code>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    ✓ Valid for 24 hours only • ✓ No minimum purchase
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAccept}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    Claim My {discountPercentage}% Discount
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleDecline}
                    className="w-full text-gray-500 hover:text-gray-700 text-sm transition-colors"
                  >
                    No thanks, I'll pay full price
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

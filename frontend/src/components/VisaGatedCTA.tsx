"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AIToolGateModal from "@/components/AIToolGateModal";

interface VisaGatedCTAProps {
  /** Visual style variant */
  variant?: "primary" | "outline" | "plan";
  label?: string;
  className?: string;
}

export default function VisaGatedCTA({
  variant = "primary",
  label,
  className,
}: VisaGatedCTAProps) {
  const [open, setOpen] = useState(false);

  const defaultLabel = label ?? (variant === "outline" ? "Already have an account" : "Start for free");

  const baseClass =
    variant === "primary"
      ? "inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-all shadow-xl shadow-black/20"
      : variant === "outline"
      ? "inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-all"
      : "block text-center py-2.5 rounded-full text-sm font-semibold transition-all border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? baseClass}
      >
        {defaultLabel}
        {variant === "primary" && <ArrowRight className="h-4 w-4" />}
      </button>

      <AIToolGateModal
        tool="visa"
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="glass-effect rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-stone-700/50 transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-slate-900 dark:text-stone-100 pr-4">{faq.question}</span>
            {open === i ? (
              <ChevronUp className="w-5 h-5 text-slate-400 dark:text-stone-500 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-stone-500 flex-shrink-0" />
            )}
          </button>
          {open === i && (
            <div className="px-6 pb-5">
              <p className="text-slate-600 dark:text-stone-300 leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

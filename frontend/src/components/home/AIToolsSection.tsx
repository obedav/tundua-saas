"use client";

import { useState } from "react";
import { FileCheck, Briefcase, GraduationCap, Clock } from "lucide-react";
import AIToolGateModal from "@/components/AIToolGateModal";

type ToolKey = "sop" | "resume" | "university-report";

const TOOLS: {
  key: ToolKey;
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  shadow: string;
}[] = [
  {
    key: "sop",
    icon: FileCheck,
    title: "AI SOP Generator",
    desc: "Professional Statement of Purpose in minutes",
    color: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/25",
  },
  {
    key: "resume",
    icon: Briefcase,
    title: "AI Resume Optimizer",
    desc: "Optimize your resume for maximum impact",
    color: "from-teal-500 to-teal-600",
    shadow: "shadow-teal-500/25",
  },
  {
    key: "university-report",
    icon: GraduationCap,
    title: "AI University Report",
    desc: "Get 10 personalized university recommendations",
    color: "from-green-500 to-green-600",
    shadow: "shadow-green-500/25",
  },
];

export default function AIToolsSection() {
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {TOOLS.map(({ key, icon: Icon, title, desc, color, shadow }) => (
          <div
            key={key}
            className="group bg-white dark:bg-stone-800/80 rounded-2xl shadow-lg dark:shadow-stone-950/50 hover:shadow-2xl transition-all duration-300 p-7 border-2 border-blue-100 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-600 relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              100% FREE
            </div>
            <div
              className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg ${shadow}`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-2">{title}</h3>
            <p className="text-slate-600 dark:text-stone-400 mb-4 text-sm">{desc}</p>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-stone-400 mb-4">
              <Clock className="w-4 h-4" />
              <span>Instant delivery</span>
              <span className="w-1 h-1 bg-slate-400 rounded-full" />
              <span>Unlimited revisions</span>
            </div>
            <button
              onClick={() => setActiveTool(key)}
              className="block w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Try Free Now
            </button>
          </div>
        ))}
      </div>

      {activeTool && (
        <AIToolGateModal
          tool={activeTool}
          isOpen={true}
          onClose={() => setActiveTool(null)}
        />
      )}
    </>
  );
}

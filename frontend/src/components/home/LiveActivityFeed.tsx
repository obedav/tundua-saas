"use client";

import { useState, useEffect } from "react";
import { MapPin, CheckCircle2 } from "lucide-react";

const ACTIVITIES = [
  { action: "Just submitted application to University of Toronto", location: "Lagos, Nigeria", time: "2 mins ago" },
  { action: "Accepted to University of Birmingham", location: "Nairobi, Kenya", time: "5 mins ago" },
  { action: "Generated AI SOP for University of Leeds", location: "Accra, Ghana", time: "8 mins ago" },
  { action: "Completed application to University of Calgary", location: "Kampala, Uganda", time: "12 mins ago" },
  { action: "AI Resume optimized for MSc application", location: "Abuja, Nigeria", time: "15 mins ago" },
];

export function LiveActivityFeed() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const id = setInterval(() => setIndex((i) => (i + 1) % ACTIVITIES.length), 5000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const activity = ACTIVITIES[index]!;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm hidden lg:block">
      <div className="bg-white dark:bg-stone-800/95 rounded-2xl shadow-2xl dark:shadow-stone-950/50 p-4 border border-slate-200 dark:border-stone-700/50 backdrop-blur-sm">
        <p className="text-[10px] text-slate-400 dark:text-stone-500 mb-2 font-medium uppercase tracking-wide">Example activity</p>
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
              {activity.location.charAt(0)}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-stone-800 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-stone-100 truncate">{activity.action}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 dark:text-stone-500 flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-stone-400 truncate">{activity.location}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { CheckCircle, User, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: number;
  name: string;
  country: string;
  flag: string;
  action: string;
  university?: string;
  time: string;
}

const sampleActivities: Activity[] = [
  { id: 1, name: "Sarah M.", country: "Kenya", flag: "🇰🇪", action: "just submitted application to", university: "University of Toronto", time: "2 minutes ago" },
  { id: 2, name: "James O.", country: "Nigeria", flag: "🇳🇬", action: "got accepted to", university: "University of Manchester", time: "5 minutes ago" },
  { id: 3, name: "Amina K.", country: "Tanzania", flag: "🇹🇿", action: "started application for", university: "Harvard University", time: "8 minutes ago" },
  { id: 4, name: "David W.", country: "Uganda", flag: "🇺🇬", action: "just paid for", university: "Stanford University", time: "12 minutes ago" },
  { id: 5, name: "Grace M.", country: "Ghana", flag: "🇬🇭", action: "submitted documents for", university: "Oxford University", time: "15 minutes ago" },
  { id: 6, name: "Peter N.", country: "Rwanda", flag: "🇷🇼", action: "got visa approval for", university: "MIT", time: "18 minutes ago" },
];

export function LiveActivityCounter() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % sampleActivities.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activity = sampleActivities[currentActivity];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-green-200 rounded-2xl p-4 shadow-xl max-w-md mx-auto"
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">{activity.name}</span>
                <span className="text-xl">{activity.flag}</span>
                <MapPin className="w-3 h-3 text-gray-400" />
              </div>

              <p className="text-sm text-gray-700">
                {activity.action}{' '}
                <span className="font-semibold text-primary-600">{activity.university}</span>
              </p>

              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {activity?.time}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

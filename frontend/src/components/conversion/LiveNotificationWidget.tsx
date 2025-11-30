"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, TrendingUp, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  type: "success" | "activity" | "milestone";
  message: string;
  icon: typeof CheckCircle;
}

const sampleNotifications: Notification[] = [
  {
    id: 1,
    type: "success",
    message: "3 students got accepted to top universities today!",
    icon: CheckCircle
  },
  {
    id: 2,
    type: "activity",
    message: "127 applications submitted this week",
    icon: TrendingUp
  },
  {
    id: 3,
    type: "milestone",
    message: "50,000+ students helped since 2020",
    icon: Users
  },
  {
    id: 4,
    type: "success",
    message: "98.7% of our students get accepted!",
    icon: CheckCircle
  }
];

export function LiveNotificationWidget() {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % sampleNotifications.length);
        setIsVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const notification = sampleNotifications[currentNotification];
  
  if (!notification) return null;
  
  const Icon = notification.icon;

  const colors = {
    success: "from-green-500 to-emerald-500",
    activity: "from-blue-500 to-indigo-500",
    milestone: "from-purple-500 to-pink-500"
  };

  return (
    <div className="fixed bottom-6 left-6 z-30 hidden md:block">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl p-4 max-w-sm border-2 border-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[notification.type]} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {notification?.type}
                  </span>
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {notification?.message}
                </p>
              </div>

              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0 mt-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

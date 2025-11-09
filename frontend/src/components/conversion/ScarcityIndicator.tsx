"use client";

import { useState, useEffect } from "react";
import { Users, TrendingDown, AlertTriangle } from "lucide-react";

interface ScarcityIndicatorProps {
  initialSlots?: number;
  message?: string;
  variant?: "default" | "urgent" | "minimal";
}

export function ScarcityIndicator({
  initialSlots = 5,
  message = "spots left for today's discounted rate",
  variant = "default"
}: ScarcityIndicatorProps) {
  const [slots, setSlots] = useState(initialSlots);

  useEffect(() => {
    // Randomly decrease slots to create urgency (simulated)
    const interval = setInterval(() => {
      setSlots(prev => {
        if (prev <= 1) return Math.floor(Math.random() * 3) + 3; // Reset between 3-5
        return prev - (Math.random() > 0.7 ? 1 : 0); // 30% chance to decrease
      });
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, []);

  if (variant === "minimal") {
    return (
      <div className="inline-flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-gray-700">
          Only <span className="font-bold text-red-600">{slots}</span> {message}
        </span>
      </div>
    );
  }

  if (variant === "urgent") {
    return (
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
          <div>
            <p className="font-bold text-lg">
              ⚡ Only {slots} {message}!
            </p>
            <p className="text-sm opacity-90">Don't miss out - secure your spot now</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Users className="w-8 h-8 text-orange-600" />
          <TrendingDown className="w-4 h-4 text-red-500 absolute -top-1 -right-1 animate-bounce" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            High Demand Alert
          </p>
          <p className="text-gray-700">
            Only <span className="font-bold text-red-600 text-lg">{slots}</span> {message}
          </p>
        </div>
      </div>
    </div>
  );
}

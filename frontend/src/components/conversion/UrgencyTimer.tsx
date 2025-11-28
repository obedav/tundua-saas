"use client";

import { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";

interface UrgencyTimerProps {
  variant?: "hero" | "inline" | "compact";
  offerText?: string;
  discount?: string;
  endDate?: Date;
}

export function UrgencyTimer({
  variant = "inline",
  offerText = "Special offer ends in",
  discount = "₦15,000",
  endDate
}: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set offer end time to midnight tonight if not provided
    const targetDate = endDate || (() => {
      const tomorrow = new Date();
      tomorrow.setHours(23, 59, 59, 999);
      return tomorrow;
    })();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className={`
        ${variant === "hero" ? "w-16 h-16 text-2xl" : "w-12 h-12 text-xl"}
        bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-lg
        flex items-center justify-center font-bold shadow-lg
        animate-pulse
      `}>
        {String(value).padStart(2, '0')}
      </div>
      <span className={`
        ${variant === "hero" ? "text-sm" : "text-xs"}
        text-gray-600 mt-1 font-medium
      `}>
        {label}
      </span>
    </div>
  );

  if (variant === "hero") {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flame className="w-6 h-6 text-red-500 animate-bounce" />
          <p className="text-lg font-semibold text-gray-900">
            {offerText} • Save {discount}!
          </p>
          <Flame className="w-6 h-6 text-red-500 animate-bounce" />
        </div>
        <div className="flex justify-center gap-3">
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <div className="text-3xl font-bold text-red-500 flex items-center">:</div>
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <div className="text-3xl font-bold text-red-500 flex items-center">:</div>
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        <Clock className="w-4 h-4 text-red-500" />
        <span className="text-sm font-medium text-gray-900">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-gray-900">{offerText}</span>
        </div>
        <div className="flex gap-2">
          <TimeUnit value={timeLeft.hours} label="Hrs" />
          <TimeUnit value={timeLeft.minutes} label="Min" />
          <TimeUnit value={timeLeft.seconds} label="Sec" />
        </div>
      </div>
    </div>
  );
}

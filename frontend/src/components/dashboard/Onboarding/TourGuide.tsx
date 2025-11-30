"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LayoutDashboard,
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
  position: "top" | "bottom" | "left" | "right";
}

interface TourGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: "dashboard",
    title: "Welcome to Your Dashboard",
    description:
      "This is your command center. View your application status, quick actions, and recent activity all in one place.",
    target: "#dashboard-stats",
    icon: <LayoutDashboard className="w-6 h-6" />,
    position: "bottom",
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description:
      "Start a new application, upload documents, or manage your services with one click.",
    target: "#quick-actions",
    icon: <Sparkles className="w-6 h-6" />,
    position: "bottom",
  },
  {
    id: "applications",
    title: "Your Applications",
    description:
      "Track all your visa applications, check their status, and see what documents are needed.",
    target: "#applications-section",
    icon: <FileText className="w-6 h-6" />,
    position: "top",
  },
  {
    id: "documents",
    title: "Document Vault",
    description:
      "Securely store and manage all your important documents. Upload once, use everywhere.",
    target: "#documents-vault",
    icon: <FileText className="w-6 h-6" />,
    position: "top",
  },
  {
    id: "payments",
    title: "Billing & Payments",
    description:
      "View payment history, manage payment methods, and download invoices anytime.",
    target: "#billing-section",
    icon: <CreditCard className="w-6 h-6" />,
    position: "top",
  },
  {
    id: "notifications",
    title: "Stay Updated",
    description:
      "Get real-time notifications about your application status, document requests, and important updates.",
    target: "#notifications-bell",
    icon: <Bell className="w-6 h-6" />,
    position: "bottom",
  },
  {
    id: "settings",
    title: "Account Settings",
    description:
      "Customize your profile, notification preferences, and security settings.",
    target: "#user-menu",
    icon: <Settings className="w-6 h-6" />,
    position: "bottom",
  },
];

export default function TourGuide({ onComplete, onSkip }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const currentTourStep = tourSteps[currentStep];

  useEffect(() => {
    // Find the target element and calculate position
    const updateTargetPosition = () => {
      if (currentTourStep?.target) {
        const element = document.querySelector(currentTourStep.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });
        } else {
          // Target not found, use center of screen
          setTargetPosition({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            width: 0,
            height: 0,
          });
        }
      }
    };

    updateTargetPosition();

    // Recalculate on resize
    window.addEventListener("resize", updateTargetPosition);
    return () => window.removeEventListener("resize", updateTargetPosition);
  }, [currentStep, currentTourStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("tour_completed", "true");
    onComplete();
  };

  const getTooltipPosition = () => {
    if (!targetPosition) return {};

    const tooltipWidth = 400;
    const tooltipHeight = 250;
    const offset = 20;

    switch (currentTourStep?.position) {
      case "bottom":
        return {
          top: targetPosition.top + targetPosition.height + offset,
          left: targetPosition.left + targetPosition.width / 2 - tooltipWidth / 2,
        };
      case "top":
        return {
          top: targetPosition.top - tooltipHeight - offset,
          left: targetPosition.left + targetPosition.width / 2 - tooltipWidth / 2,
        };
      case "left":
        return {
          top: targetPosition.top + targetPosition.height / 2 - tooltipHeight / 2,
          left: targetPosition.left - tooltipWidth - offset,
        };
      case "right":
        return {
          top: targetPosition.top + targetPosition.height / 2 - tooltipHeight / 2,
          left: targetPosition.left + targetPosition.width + offset,
        };
      default:
        return {
          top: window.innerHeight / 2 - tooltipHeight / 2,
          left: window.innerWidth / 2 - tooltipWidth / 2,
        };
    }
  };

  if (!currentTourStep) return null;

  const tooltipPosition = getTooltipPosition();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {/* Overlay with spotlight effect */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm">
          {targetPosition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute rounded-lg"
              style={{
                top: targetPosition.top - 8,
                left: targetPosition.left - 8,
                width: targetPosition.width + 16,
                height: targetPosition.height + 16,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.5)",
                border: "2px solid rgb(59, 130, 246)",
              }}
            />
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="absolute bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden"
          style={tooltipPosition}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                {currentTourStep?.icon}
              </div>
              <button
                onClick={onSkip}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Skip tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold mb-2">{currentTourStep?.title}</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              {currentTourStep?.description}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
                <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                />
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex gap-2 mb-6">
              {tourSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-blue-600"
                      : index < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentStep === tourSteps.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <Check className="w-5 h-5" />
                  Finish Tour
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={onSkip}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip tour
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  completedAt?: string;
}

interface SmartProgressTrackerProps {
  applicationId?: number;
  applicationStatus?: string;
}

export default function SmartProgressTracker({
  applicationId: _applicationId,
  applicationStatus = "draft",
}: SmartProgressTrackerProps) {
  // Generate steps based on application status
  const getSteps = (): ProgressStep[] => {
    const statusMap: Record<string, number> = {
      draft: 0,
      submitted: 1,
      under_review: 2,
      documents_requested: 2,
      approved: 3,
      completed: 4,
    };

    const currentStep = statusMap[applicationStatus] || 0;

    return [
      {
        id: 1,
        title: "Application Created",
        description: "Start your study abroad journey",
        status: currentStep >= 0 ? "completed" : "pending",
        completedAt: currentStep >= 0 ? new Date().toISOString() : undefined,
      },
      {
        id: 2,
        title: "Application Submitted",
        description: "Submit your application for review",
        status: currentStep > 0 ? "completed" : currentStep === 0 ? "current" : "pending",
      },
      {
        id: 3,
        title: "Under Review",
        description: "Our team is reviewing your application",
        status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending",
      },
      {
        id: 4,
        title: "Approved",
        description: "Your application has been approved",
        status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending",
      },
      {
        id: 5,
        title: "Completed",
        description: "All services delivered successfully",
        status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending",
      },
    ];
  };

  const steps = getSteps();
  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Application Progress</h2>
          <span className="text-sm font-medium text-gray-600">
            {completedSteps} of {steps.length} completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  {step.status === "completed" ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  ) : step.status === "current" ? (
                    <div className="bg-primary-500 rounded-full p-2">
                      <Clock className="h-5 w-5 text-white animate-pulse" />
                    </div>
                  ) : (
                    <div className="border-2 border-gray-300 rounded-full p-2">
                      <Circle className="h-5 w-5 text-gray-300" />
                    </div>
                  )}

                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-1/2 top-10 w-0.5 h-12 -ml-px ${
                        step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <h3
                    className={`font-semibold mb-1 ${
                      step.status === "completed"
                        ? "text-gray-900"
                        : step.status === "current"
                        ? "text-primary-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>

                  {step.completedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Completed on {new Date(step.completedAt).toLocaleDateString()}
                    </p>
                  )}

                  {step.status === "current" && (
                    <div className="mt-3">
                      <button className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

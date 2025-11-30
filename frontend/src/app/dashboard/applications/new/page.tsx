"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Save, Clock } from "lucide-react";

import { toast } from "sonner";
import Step1Personal from "@/components/wizard/Step1Personal";
import Step2Academic from "@/components/wizard/Step2Academic";
import Step3Destination from "@/components/wizard/Step3Destination";
import Step4ServiceTier from "@/components/wizard/Step4ServiceTier";
import Step5AddOns from "@/components/wizard/Step5AddOns";
import Step6Review from "@/components/wizard/Step6Review";
import { apiClient } from "@/lib/api-client";

const STEPS = [
  {
    number: 1,
    title: "Personal Info",
    description: "Basic information",
    estimatedTime: "2-3 min",
  },
  {
    number: 2,
    title: "Academic",
    description: "Education background",
    estimatedTime: "2-3 min",
  },
  {
    number: 3,
    title: "Destination",
    description: "Universities & program",
    estimatedTime: "3-5 min",
  },
  {
    number: 4,
    title: "Service Tier",
    description: "Choose your package",
    estimatedTime: "1-2 min",
  },
  {
    number: 5,
    title: "Add-Ons",
    description: "Optional services",
    estimatedTime: "1-2 min",
  },
  {
    number: 6,
    title: "Review",
    description: "Review & submit",
    estimatedTime: "2-3 min",
  },
];

export type ApplicationData = {
  // Step 1: Personal Information
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  passport_number?: string;
  current_country?: string;
  current_city?: string;

  // Step 2: Academic Background
  highest_education?: string;
  field_of_study?: string;
  institution_name?: string;
  institution_start_date?: string;
  institution_end_date?: string;
  graduation_year?: number;
  gpa?: number; // Optional for High School students
  english_test_type?: string;
  english_test_score?: string;

  // Step 3: Destination & Universities
  destination_country?: string;
  universities?: string[];
  program_type?: string;
  intended_major?: string;
  intake_season?: string;
  intake_year?: number;

  // Step 4: Service Tier
  service_tier_id?: number;
  service_tier_name?: string;
  base_price?: number;

  // Step 5: Add-Ons
  addon_services?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  addon_total?: number;

  // Totals
  subtotal?: number;
  total_amount?: number;
};

export default function NewApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ApplicationData>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const updateFormData = (data: Partial<ApplicationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / STEPS.length) * 100);

  // Auto-save indicator
  useEffect(() => {
    if (lastSaved) {
      const timer = setTimeout(() => setLastSaved(null), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [lastSaved]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      ) {
        return;
      }

      if (e.key === "ArrowRight" && currentStep < 6 && !isSaving) {
        e.preventDefault();
        const submitBtn = document.getElementById(
          `step${currentStep}-submit-btn`,
        );
        if (submitBtn) {
          submitBtn.click();
        } else {
          handleNext();
        }
      } else if (e.key === "ArrowLeft" && currentStep > 1 && !isSaving) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, isSaving]);

  const handleNext = async () => {
    // Save draft to backend before moving to next step
    setIsSaving(true);
    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([, v]) => v !== undefined)
      );

      if (!applicationId) {
        // Create new application
        const response = await apiClient.createApplication(cleanData as any);
        setApplicationId(response.data.application.id);
      } else {
        // Update existing application
        await apiClient.updateApplication(applicationId, cleanData as any);
      }

      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      setLastSaved(new Date());
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Progress saved!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let finalApplicationId = applicationId;
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([, v]) => v !== undefined)
      );

      if (!applicationId) {
        const response = await apiClient.createApplication(cleanData as any);
        finalApplicationId = response.data.application.id;
        setApplicationId(finalApplicationId);
        if (finalApplicationId) {
          await apiClient.submitApplication(finalApplicationId);
        }
      } else {
        await apiClient.updateApplication(applicationId, cleanData as any);
        await apiClient.submitApplication(applicationId);
      }

      toast.success("Application submitted! Redirecting to payment...");

      // Redirect to payment page
      router.push(`/dashboard/applications/${finalApplicationId}/payment`);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      data: formData,
      updateData: updateFormData,
      onNext: handleNext,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 1:
        return <Step1Personal {...stepProps} />;
      case 2:
        return <Step2Academic {...stepProps} />;
      case 3:
        return <Step3Destination {...stepProps} />;
      case 4:
        return <Step4ServiceTier {...stepProps} />;
      case 5:
        return <Step5AddOns {...stepProps} />;
      case 6:
        return (
          <Step6Review
            {...stepProps}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  New Application
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                    {progressPercentage}% Complete
                  </div>
                  {lastSaved && (
                    <div className="flex items-center gap-1 text-green-600 animate-fade-in">
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Saved just now</span>
                    </div>
                  )}
                  {isSaving && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Save className="h-4 w-4 animate-pulse" />
                      <span className="text-xs">Saving...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Step {currentStep} of {STEPS.length} •{" "}
                  {STEPS[currentStep - 1]?.estimatedTime} estimated
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Save & Exit
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(step.number);
                const isCurrent = currentStep === step.number;
                const isPast = currentStep > step.number;
                const isClickable = isCompleted || isPast;

                return (
                  <li key={step.number} className="flex-1 relative">
                    <div className="flex items-center">
                      {/* Connector Line */}
                      {index !== 0 && (
                        <div
                          className={`absolute left-0 top-5 -ml-px h-0.5 w-full -translate-x-1/2 transition-colors duration-300 ${
                            isPast ? "bg-primary-600" : "bg-gray-200"
                          }`}
                          style={{ width: "calc(100% - 2.5rem)" }}
                        />
                      )}

                      {/* Step Circle */}
                      <button
                        onClick={() =>
                          isClickable && setCurrentStep(step.number)
                        }
                        disabled={!isClickable}
                        className={`relative flex flex-col items-center group ${
                          isClickable ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <div
                          className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                            isPast
                              ? "border-primary-600 bg-primary-600 hover:bg-primary-700 hover:scale-110"
                              : isCurrent
                                ? "border-primary-600 bg-white ring-4 ring-primary-100"
                                : "border-gray-300 bg-white"
                          }`}
                        >
                          {isPast ? (
                            <Check className="h-5 w-5 text-white" />
                          ) : (
                            <span
                              className={`text-sm font-semibold ${
                                isCurrent ? "text-primary-600" : "text-gray-500"
                              }`}
                            >
                              {step.number}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <p
                            className={`text-sm font-medium transition-colors ${
                              isCurrent
                                ? "text-primary-600"
                                : currentStep >= step.number
                                  ? "text-gray-900"
                                  : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                            {step.description}
                          </p>
                          {isCompleted && (
                            <span className="inline-block mt-1 text-xs text-green-600 font-medium">
                              ✓ Complete
                            </span>
                          )}
                        </div>

                        {/* Tooltip on hover for clickable steps */}
                        {isClickable && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                              Go to {step.title}
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step indicator card */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              {currentStep}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {STEPS[currentStep - 1]?.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {STEPS[currentStep - 1]?.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  Estimated time: {STEPS[currentStep - 1]?.estimatedTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step form */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          {renderStep()}
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentStep < 6 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isSaving}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back
              </button>

              <div className="hidden sm:flex flex-col items-center">
                <div className="text-sm font-medium text-gray-900">
                  Step {currentStep} of {STEPS.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {STEPS.length - currentStep}{" "}
                  {STEPS.length - currentStep === 1 ? "step" : "steps"}{" "}
                  remaining
                </div>
              </div>

              <button
                onClick={() => {
                  // Trigger form submission for current step
                  const submitBtn = document.getElementById(
                    `step${currentStep}-submit-btn`,
                  );
                  if (submitBtn) {
                    submitBtn.click();
                  } else {
                    // Fallback for steps without forms
                    handleNext();
                  }
                }}
                disabled={isSaving}
                className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isSaving ? (
                  <>
                    <Save className="h-5 w-5 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="hidden lg:flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">
                  ←
                </kbd>
                <span>Go back</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">
                  →
                </kbd>
                <span>Continue</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

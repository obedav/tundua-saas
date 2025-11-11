"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Save, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Step1Personal from "@/components/wizard/Step1Personal";
import Step2Academic from "@/components/wizard/Step2Academic";
import Step3Destination from "@/components/wizard/Step3Destination";
import Step4ServiceTier from "@/components/wizard/Step4ServiceTier";
import Step5AddOns from "@/components/wizard/Step5AddOns";
import Step6Review from "@/components/wizard/Step6Review";
import { apiClient } from "@/lib/api-client";
import { ApplicationData } from "../../new/page";

const STEPS = [
  { number: 1, title: "Personal Info", description: "Basic information", estimatedTime: "2-3 min" },
  { number: 2, title: "Academic", description: "Education background", estimatedTime: "2-3 min" },
  { number: 3, title: "Destination", description: "Universities & program", estimatedTime: "3-5 min" },
  { number: 4, title: "Service Tier", description: "Choose your package", estimatedTime: "1-2 min" },
  { number: 5, title: "Add-Ons", description: "Optional services", estimatedTime: "1-2 min" },
  { number: 6, title: "Review", description: "Review & submit", estimatedTime: "2-3 min" },
];

export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params['id'] as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<ApplicationData>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Load existing application data
  useEffect(() => {
    const loadApplication = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getApplication(Number(applicationId));
        const app = response.data.application;

        // Map API data to form data
        const loadedData: ApplicationData = {
          // Personal Info
          first_name: app.first_name || "",
          last_name: app.last_name || "",
          email: app.email || "",
          phone: app.phone || "",
          date_of_birth: app.date_of_birth || "",
          nationality: app.nationality || "",
          passport_number: app.passport_number || "",
          current_country: app.current_country || "",
          current_city: app.current_city || "",

          // Academic
          highest_education: app.highest_education || "",
          field_of_study: app.field_of_study || "",
          institution_name: app.institution_name || "",
          institution_start_date: app.institution_start_date || "",
          institution_end_date: app.institution_end_date || "",
          graduation_year: app.graduation_year || undefined,
          gpa: app.gpa || undefined,
          english_test_type: app.english_test_type || "",
          english_test_score: app.english_test_score || "",

          // Destination
          destination_country: app.destination_country || "",
          universities: app.universities ? (Array.isArray(app.universities) ? app.universities : JSON.parse(app.universities)) : [],
          program_type: app.program_type || "",
          intended_major: app.intended_major || "",
          intake_season: app.intake_season || "",
          intake_year: app.intake_year || undefined,

          // Service Tier
          service_tier_id: app.service_tier_id || undefined,
          service_tier_name: app.service_tier?.name || "",
          base_price: app.base_price ? parseFloat(app.base_price) : undefined,

          // Add-ons
          addon_services: app.addon_services ? (Array.isArray(app.addon_services) ? app.addon_services : JSON.parse(app.addon_services)) : [],
          addon_total: app.addon_total ? parseFloat(app.addon_total) : undefined,
          total_amount: app.total_amount ? parseFloat(app.total_amount) : undefined,
        };

        setFormData(loadedData);

        // Set current step based on saved progress
        if (app.current_step) {
          setCurrentStep(app.current_step);
        }

        // Mark all steps before current as completed
        const completed = [];
        for (let i = 1; i < (app.current_step || 1); i++) {
          completed.push(i);
        }
        setCompletedSteps(completed);

      } catch (error: any) {
        console.error("Failed to load application:", error);
        toast.error("Failed to load application data");
        router.push("/dashboard/applications");
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationId) {
      loadApplication();
    }
  }, [applicationId, router]);

  const updateFormData = (data: Partial<ApplicationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const progressPercentage = Math.round((currentStep / STEPS.length) * 100);

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
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' && currentStep < 6 && !isSaving) {
        e.preventDefault();
        const submitBtn = document.getElementById(`step${currentStep}-submit-btn`);
        if (submitBtn) {
          submitBtn.click();
        } else {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft' && currentStep > 1 && !isSaving) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isSaving]);

  const handleNext = async () => {
    setIsSaving(true);
    try {
      await apiClient.updateApplication(Number(applicationId), {
        ...formData,
        });

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
      await apiClient.updateApplication(Number(applicationId), formData);
      await apiClient.submitApplication(Number(applicationId));

      toast.success("Application updated and submitted! Redirecting to payment...");
      router.push(`/dashboard/applications/${applicationId}/payment`);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to submit application");
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
        return <Step6Review {...stepProps} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Edit Application #{applicationId}</h1>
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
                  Step {currentStep} of {STEPS.length} • {STEPS[currentStep - 1]?.estimatedTime} estimated
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/applications")}
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
                      {index !== 0 && (
                        <div
                          className={`absolute left-0 top-5 -ml-px h-0.5 w-full -translate-x-1/2 transition-colors duration-300 ${
                            isPast ? "bg-primary-600" : "bg-gray-200"
                          }`}
                          style={{ width: "calc(100% - 2.5rem)" }}
                        />
                      )}

                      <button
                        onClick={() => isClickable && setCurrentStep(step.number)}
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
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              {currentStep}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{STEPS[currentStep - 1]?.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{STEPS[currentStep - 1]?.description}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Estimated time: {STEPS[currentStep - 1]?.estimatedTime}</span>
              </div>
            </div>
          </div>
        </div>

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
                  {STEPS.length - currentStep} {STEPS.length - currentStep === 1 ? 'step' : 'steps'} remaining
                </div>
              </div>

              <button
                onClick={() => {
                  const submitBtn = document.getElementById(`step${currentStep}-submit-btn`);
                  if (submitBtn) {
                    submitBtn.click();
                  } else {
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

            <div className="hidden lg:flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">←</kbd>
                <span>Go back</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">→</kbd>
                <span>Continue</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

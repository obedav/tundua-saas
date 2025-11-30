"use client";

import { useState } from "react";
import { CheckCircle, ChevronRight, User, FileText, CreditCard, Rocket } from "lucide-react";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
}

export default function WelcomeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWizard, setShowWizard] = useState(true);

  const steps: WizardStep[] = [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Add your personal information to get started",
      icon: User,
      completed: false,
    },
    {
      id: 2,
      title: "Upload Documents",
      description: "Upload required documents for faster processing",
      icon: FileText,
      completed: false,
    },
    {
      id: 3,
      title: "Choose Your Package",
      description: "Select a service tier that fits your needs",
      icon: CreditCard,
      completed: false,
    },
    {
      id: 4,
      title: "Start Your Journey",
      description: "Submit your first application and get started",
      icon: Rocket,
      completed: false,
    },
  ];

  const [wizardSteps, setWizardSteps] = useState(steps);

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      const updatedSteps = [...wizardSteps];
      if (updatedSteps[currentStep]) {
        updatedSteps[currentStep].completed = true;
      }
      setWizardSteps(updatedSteps);
      setCurrentStep(currentStep + 1);
    } else {
      // Complete wizard
      const updatedSteps = [...wizardSteps];
      if (updatedSteps[currentStep]) {
        updatedSteps[currentStep].completed = true;
      }
      setWizardSteps(updatedSteps);
      setTimeout(() => setShowWizard(false), 1000);
    }
  };

  const handleSkip = () => {
    setShowWizard(false);
  };

  if (!showWizard) {
    return null;
  }

  const currentStepData = wizardSteps[currentStep];

  if (!currentStepData) return null;

  const StepIcon = currentStepData?.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome to Tundua! 👋</h2>
          <p className="text-primary-100">
            Let&apos;s get you set up in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            {wizardSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        step.completed
                          ? "bg-green-500 text-white"
                          : index === currentStep
                          ? "bg-primary-600 text-white ring-4 ring-primary-100"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        index === currentStep ? "text-primary-600" : "text-gray-500"
                      }`}
                    >
                      Step {index + 1}
                    </span>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all ${
                        step.completed ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-8 mb-6 min-h-[300px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              {StepIcon && <StepIcon className="w-10 h-10 text-primary-600" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{currentStepData?.title}</h3>
            <p className="text-gray-600 mb-6 max-w-md">{currentStepData?.description}</p>

            {/* Step-specific content */}
            {currentStep === 0 && (
              <div className="space-y-3 w-full max-w-sm">
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">What we need:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Full name and contact info</li>
                    <li>✓ Date of birth</li>
                    <li>✓ Current location</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-3 w-full max-w-sm">
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended documents:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Passport copy</li>
                    <li>✓ Academic transcripts</li>
                    <li>✓ English proficiency test (IELTS/TOEFL)</li>
                    <li>✓ Financial statements</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                <div className="bg-white rounded-lg p-4 border border-primary-200 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Basic</h4>
                    <span className="text-primary-600 font-bold">₦89,000</span>
                  </div>
                  <p className="text-sm text-gray-600">Essential application processing</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-primary-400 text-left ring-2 ring-primary-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Standard</h4>
                    <span className="text-primary-600 font-bold">₦149,000</span>
                  </div>
                  <p className="text-sm text-gray-600">Priority processing + extras</p>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full mt-2 inline-block">
                    Most Popular
                  </span>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Premium</h4>
                    <span className="text-purple-600 font-bold">₦249,000</span>
                  </div>
                  <p className="text-sm text-gray-600">Complete support package</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3 w-full max-w-sm">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">You&apos;re all set! 🎉</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Ready to start your study abroad journey? Create your first application now!
                  </p>
                  <a
                    href="/dashboard/applications/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Rocket className="w-4 h-4" />
                    Create Application
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              {currentStep === wizardSteps.length - 1 ? "Get Started" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Step counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {wizardSteps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

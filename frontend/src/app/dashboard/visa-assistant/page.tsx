"use client";

import { Plane } from "lucide-react";
import { useVisaAssistant } from "./useVisaAssistant";
import StepProgressIndicator from "./components/StepProgressIndicator";
import Step1Destination from "./components/Step1Destination";
import Step2VisaType from "./components/Step2VisaType";
import Step3Documents from "./components/Step3Documents";
import Step4CoverLetter from "./components/Step4CoverLetter";
import Step5Chat from "./components/Step5Chat";
import Step6Timeline from "./components/Step6Timeline";

export default function VisaAssistantPage() {
  const va = useVisaAssistant();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 opacity-20 blur-sm -z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Visa Assistant</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              AI-powered guidance for Nigerian passport holders
            </p>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-transparent opacity-40" />
      </div>

      <StepProgressIndicator
        step={va.step}
        completedSteps={va.completedSteps}
        onStepClick={va.setStep}
      />

      {/* Wizard card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-fade-in-up">
        <div className="p-6 sm:p-7">
          {va.step === 1 && (
            <Step1Destination
              destination={va.destination} setDestination={va.setDestination}
              travelDate={va.travelDate} setTravelDate={va.setTravelDate}
              stayDuration={va.stayDuration} setStayDuration={va.setStayDuration}
              visitedBefore={va.visitedBefore} setVisitedBefore={va.setVisitedBefore}
              onNext={() => va.goToStep(2)}
            />
          )}
          {va.step === 2 && (
            <Step2VisaType
              visaType={va.visaType} setVisaType={va.setVisaType}
              travelPurpose={va.travelPurpose} setTravelPurpose={va.setTravelPurpose}
              onBack={() => va.setStep(1)}
              onNext={() => va.goToStep(3)}
            />
          )}
          {va.step === 3 && (
            <Step3Documents
              destination={va.destination} visaType={va.visaType}
              checkedDocs={va.checkedDocs} setCheckedDocs={va.setCheckedDocs}
              aiTips={va.aiTips} tipsLoading={va.tipsLoading}
              onBack={() => va.setStep(2)}
              onNext={() => va.goToStep(4)}
            />
          )}
          {va.step === 4 && (
            <Step4CoverLetter
              coverLetter={va.coverLetter} coverLetterLoading={va.coverLetterLoading}
              applicantName={va.applicantName} setApplicantName={va.setApplicantName}
              applicantJob={va.applicantJob} setApplicantJob={va.setApplicantJob}
              specialCircumstances={va.specialCircumstances} setSpecialCircumstances={va.setSpecialCircumstances}
              copied={va.copied} onCopy={va.copyLetter}
              onRegenerate={va.generateCoverLetter}
              onBack={() => va.setStep(3)}
              onNext={() => va.goToStep(5)}
            />
          )}
          {va.step === 5 && (
            <Step5Chat
              destination={va.destination} visaType={va.visaType}
              messages={va.messages}
              chatInput={va.chatInput} setChatInput={va.setChatInput}
              chatLoading={va.chatLoading} chatEndRef={va.chatEndRef}
              onSendMessage={va.sendChatMessage}
              onBack={() => va.setStep(4)}
              onNext={() => va.goToStep(6)}
            />
          )}
          {va.step === 6 && (
            <Step6Timeline
              travelDate={va.travelDate}
              onBack={() => va.setStep(5)}
              onReset={va.resetWizard}
            />
          )}
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-5">
        This tool provides guidance only. Always verify requirements on official embassy websites before applying.
      </p>
    </div>
  );
}

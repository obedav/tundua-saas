"use client";

import { Check, Edit2, Loader2, User, GraduationCap, Globe, Package, DollarSign, FileCheck, AlertCircle } from "lucide-react";
import { ApplicationData } from "@/app/dashboard/applications/new/page";

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// Helper function to format price with correct currency
const formatPrice = (amount: number | undefined, currency: 'NGN' | 'USD' | undefined) => {
  const num = amount || 0;
  const curr = currency || 'NGN';
  const symbol = curr === 'NGN' ? '₦' : '$';
  const decimals = curr === 'NGN' ? 0 : 2;
  const formatted = new Intl.NumberFormat(curr === 'NGN' ? 'en-NG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
  return `${symbol}${formatted}`;
};

export default function Step6Review({ data, onBack, onSubmit, isSubmitting }: Props) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100 dark:border-primary-800">
          <FileCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review & Submit</h3>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>Please review all information below carefully. You can go back to edit any section before submitting.</span>
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {data.first_name} {data.last_name}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.email}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.phone}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Nationality:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.nationality}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Current Location:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {data.current_city}, {data.current_country}
            </span>
          </div>
          {data.passport_number && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Passport:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.passport_number}</span>
            </div>
          )}
        </div>
      </div>

      {/* Academic Background */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Background</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Education Level:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.highest_education}</span>
          </div>
          {data.field_of_study && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Field of Study:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.field_of_study}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600 dark:text-gray-400">Institution:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.institution_name}</span>
          </div>
          {data.institution_start_date && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Duration:</span>
              <span className="ml-2 font-medium text-gray-900 flex items-center gap-2">
                {new Date(data.institution_start_date + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                <span className="text-gray-400 dark:text-gray-500">→</span>
                {data.institution_end_date ? (
                  <>
                    {new Date(data.institution_end_date + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {new Date(data.institution_end_date + "-01") > new Date() && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Expected</span>
                    )}
                  </>
                ) : (
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">Present</span>
                )}
              </span>
            </div>
          )}
          <div>
            <span className="text-gray-600 dark:text-gray-400">Graduation Year:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.graduation_year}</span>
          </div>
          {data.gpa && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">GPA:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.gpa}/4.0</span>
            </div>
          )}
          {data.english_test_type && (
            <>
              <div>
                <span className="text-gray-600 dark:text-gray-400">English Test:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.english_test_type}</span>
              </div>
              {data.english_test_score && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Score:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.english_test_score}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Destination & Universities */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Destination & Universities</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Destination Country:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.destination_country}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Program Type:</span>
            <span className="ml-2 font-medium text-gray-900 capitalize">{data.program_type}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Intended Major:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.intended_major}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Intake:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {data.intake_season} {data.intake_year}
            </span>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Selected Universities ({data.universities?.length || 0}):</p>
            <div className="flex flex-wrap gap-2">
              {data.universities?.map((uni, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-sm"
                >
                  <Check className="h-3 w-3" />
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Tier */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Tier</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-lg">{data.service_tier_name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Selected package</p>
          </div>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(data.base_price, data.currency)}</p>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-primary-600 dark:border-primary-500 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-300 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Service Package:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(data.base_price, data.currency)}</span>
          </div>
          <div className="border-t-2 border-primary-200 dark:border-primary-700 pt-3 mt-2 flex justify-between items-center py-3 px-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <span className="font-bold text-primary-900 dark:text-primary-300 text-lg">Total Amount:</span>
            <span className="font-bold text-primary-900 dark:text-primary-300 text-2xl">
              {formatPrice(data.total_amount || data.base_price, data.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-5">
        <p className="text-sm text-yellow-900 dark:text-yellow-300 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Important:</strong> By submitting this application, you agree to our Terms of Service and understand that payment will be required to process your application. You can review and make changes before payment.
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 font-medium transition-all hover:scale-105 active:scale-95"
        >
          ← Go Back
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:scale-105 active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="h-6 w-6" />
              Submit Application
            </>
          )}
        </button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
        🎉 After submission, you&apos;ll be redirected to complete the payment to finalize your application.
      </p>
    </div>
  );
}

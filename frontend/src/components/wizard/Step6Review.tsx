"use client";

import { Check, Edit2, Loader2, User, GraduationCap, Globe, Package, ShoppingCart, DollarSign, FileCheck, AlertCircle } from "lucide-react";
import { ApplicationData } from "@/app/dashboard/applications/new/page";

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function Step6Review({ data, onBack, onSubmit, isSubmitting }: Props) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <FileCheck className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>Please review all information below carefully. You can go back to edit any section before submitting.</span>
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium text-gray-900">
              {data.first_name} {data.last_name}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium text-gray-900">{data.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Phone:</span>
            <span className="ml-2 font-medium text-gray-900">{data.phone}</span>
          </div>
          <div>
            <span className="text-gray-600">Nationality:</span>
            <span className="ml-2 font-medium text-gray-900">{data.nationality}</span>
          </div>
          <div>
            <span className="text-gray-600">Current Location:</span>
            <span className="ml-2 font-medium text-gray-900">
              {data.current_city}, {data.current_country}
            </span>
          </div>
          {data.passport_number && (
            <div>
              <span className="text-gray-600">Passport:</span>
              <span className="ml-2 font-medium text-gray-900">{data.passport_number}</span>
            </div>
          )}
        </div>
      </div>

      {/* Academic Background */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Academic Background</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Education Level:</span>
            <span className="ml-2 font-medium text-gray-900">{data.highest_education}</span>
          </div>
          {data.field_of_study && (
            <div>
              <span className="text-gray-600">Field of Study:</span>
              <span className="ml-2 font-medium text-gray-900">{data.field_of_study}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600">Institution:</span>
            <span className="ml-2 font-medium text-gray-900">{data.institution_name}</span>
          </div>
          {data.institution_start_date && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium text-gray-900 flex items-center gap-2">
                {new Date(data.institution_start_date + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                <span className="text-gray-400">→</span>
                {data.institution_end_date ? (
                  <>
                    {new Date(data.institution_end_date + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {new Date(data.institution_end_date + "-01") > new Date() && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Expected</span>
                    )}
                  </>
                ) : (
                  <span className="text-primary-600 font-semibold">Present</span>
                )}
              </span>
            </div>
          )}
          <div>
            <span className="text-gray-600">Graduation Year:</span>
            <span className="ml-2 font-medium text-gray-900">{data.graduation_year}</span>
          </div>
          {data.gpa && (
            <div>
              <span className="text-gray-600">GPA:</span>
              <span className="ml-2 font-medium text-gray-900">{data.gpa}/4.0</span>
            </div>
          )}
          {data.english_test_type && (
            <>
              <div>
                <span className="text-gray-600">English Test:</span>
                <span className="ml-2 font-medium text-gray-900">{data.english_test_type}</span>
              </div>
              {data.english_test_score && (
                <div>
                  <span className="text-gray-600">Score:</span>
                  <span className="ml-2 font-medium text-gray-900">{data.english_test_score}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Destination & Universities */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Destination & Universities</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <span className="text-gray-600">Destination Country:</span>
            <span className="ml-2 font-medium text-gray-900">{data.destination_country}</span>
          </div>
          <div>
            <span className="text-gray-600">Program Type:</span>
            <span className="ml-2 font-medium text-gray-900 capitalize">{data.program_type}</span>
          </div>
          <div>
            <span className="text-gray-600">Intended Major:</span>
            <span className="ml-2 font-medium text-gray-900">{data.intended_major}</span>
          </div>
          <div>
            <span className="text-gray-600">Intake:</span>
            <span className="ml-2 font-medium text-gray-900">
              {data.intake_season} {data.intake_year}
            </span>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Selected Universities ({data.universities?.length || 0}):</p>
            <div className="flex flex-wrap gap-2">
              {data.universities?.map((uni, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
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
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Service Tier</h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 transition-all"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
          <div>
            <p className="font-semibold text-gray-900 text-lg">{data.service_tier_name}</p>
            <p className="text-sm text-gray-600 mt-1">Selected package</p>
          </div>
          <p className="text-2xl font-bold text-primary-600">${data.base_price?.toFixed(2)}</p>
        </div>
      </div>

      {/* Add-On Services */}
      {data.addon_services && data.addon_services.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Add-On Services</h3>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary-50 transition-all"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="space-y-2">
            {data.addon_services.map((addon, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-gray-900 font-medium">
                    {addon.name} {addon.quantity > 1 && `(×${addon.quantity})`}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  ${(addon.price * addon.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 border-2 border-primary-600 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
            <span className="text-gray-700">Service Tier:</span>
            <span className="font-semibold text-gray-900">${data.base_price?.toFixed(2) || "0.00"}</span>
          </div>
          {data.addon_total !== undefined && data.addon_total > 0 && (
            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
              <span className="text-gray-700">Add-On Services:</span>
              <span className="font-semibold text-gray-900">${data.addon_total.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 border-primary-200 pt-3 mt-2 flex justify-between items-center py-3 px-3 bg-primary-100 rounded-lg">
            <span className="font-bold text-primary-900 text-lg">Total Amount:</span>
            <span className="font-bold text-primary-900 text-2xl">
              ${data.total_amount?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
        <p className="text-sm text-yellow-900 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Important:</strong> By submitting this application, you agree to our Terms of Service and understand that payment will be required to process your application. You can review and make changes before payment.
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 font-medium transition-all hover:scale-105 active:scale-95"
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

      <p className="text-sm text-center text-gray-600 bg-gray-50 rounded-lg p-3">
        🎉 After submission, you'll be redirected to complete the payment to finalize your application.
      </p>
    </div>
  );
}

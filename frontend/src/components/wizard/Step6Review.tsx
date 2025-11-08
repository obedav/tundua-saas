"use client";

import { Check, Edit2, Loader2 } from "lucide-react";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">
          Please review all information before submitting your application. You can go back to edit any section.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Academic Background</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Education Level:</span>
            <span className="ml-2 font-medium text-gray-900">{data.highest_education}</span>
          </div>
          <div>
            <span className="text-gray-600">Field of Study:</span>
            <span className="ml-2 font-medium text-gray-900">{data.field_of_study}</span>
          </div>
          <div>
            <span className="text-gray-600">Institution:</span>
            <span className="ml-2 font-medium text-gray-900">{data.institution_name}</span>
          </div>
          <div>
            <span className="text-gray-600">Graduation Year:</span>
            <span className="ml-2 font-medium text-gray-900">{data.graduation_year}</span>
          </div>
          <div>
            <span className="text-gray-600">GPA:</span>
            <span className="ml-2 font-medium text-gray-900">{data.gpa}/4.0</span>
          </div>
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Destination & Universities</h3>
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Tier</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-900">{data.service_tier_name}</p>
            <p className="text-sm text-gray-600 mt-1">Selected package</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${data.base_price?.toFixed(2)}</p>
        </div>
      </div>

      {/* Add-On Services */}
      {data.addon_services && data.addon_services.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-On Services</h3>
          <div className="space-y-3">
            {data.addon_services.map((addon, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-gray-900">
                    {addon.name} {addon.quantity > 1 && `(×${addon.quantity})`}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(addon.price * addon.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      <div className="bg-primary-50 border-2 border-primary-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-primary-800">Service Tier:</span>
            <span className="font-semibold text-primary-900">${data.base_price?.toFixed(2) || "0.00"}</span>
          </div>
          {data.addon_total !== undefined && data.addon_total > 0 && (
            <div className="flex justify-between">
              <span className="text-primary-800">Add-On Services:</span>
              <span className="font-semibold text-primary-900">${data.addon_total.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-primary-300 pt-3 mt-3 flex justify-between text-xl">
            <span className="font-bold text-primary-900">Total Amount:</span>
            <span className="font-bold text-primary-900">
              ${data.total_amount?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> By submitting this application, you agree to our Terms of Service and understand that payment will be required to process your application. You can review and make changes before payment.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          ← Go Back
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="h-5 w-5" />
              Submit Application
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-center text-gray-500">
        After submission, you'll be redirected to complete the payment to finalize your application.
      </p>
    </div>
  );
}

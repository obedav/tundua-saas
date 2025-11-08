"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
  const params = useParams();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-yellow-200 p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <XCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Why was my payment cancelled?</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>You clicked the back or cancel button during payment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>The payment window was closed before completion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Payment authorization was declined</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">What would you like to do?</h3>
          <div className="space-y-3">
            <Link
              href={`/dashboard/applications/${params.id}/payment`}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all group"
            >
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary-100 p-2 group-hover:bg-primary-200">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Try payment again</p>
                <p className="text-sm text-gray-600">Choose a different payment method or try again</p>
              </div>
            </Link>

            <Link
              href={`/dashboard/applications/${params.id}`}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="flex-shrink-0">
                <div className="rounded-full bg-gray-100 p-2 group-hover:bg-gray-200">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Go back to application</p>
                <p className="text-sm text-gray-600">Review your application details</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Return to Dashboard →
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> If you're having trouble completing your payment,
            please contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}

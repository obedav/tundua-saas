"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";

type VerificationStatus = "verifying" | "success" | "failed";

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Check if it's a Paystack payment (has reference parameter)
      const paystackReference = searchParams.get("reference");

      // Check if it's a Stripe payment (has session_id parameter)
      const stripeSessionId = searchParams.get("session_id");

      if (paystackReference) {
        await verifyPaystackPayment(paystackReference);
      } else if (stripeSessionId) {
        await verifyStripePayment(stripeSessionId);
      } else {
        setStatus("failed");
        setErrorMessage("No payment reference found");
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setStatus("failed");
      setErrorMessage(
        error.response?.data?.error || "Failed to verify payment. Please contact support."
      );
    }
  };

  const verifyPaystackPayment = async (reference: string) => {
    try {
      const response = await apiClient.verifyPaystack(reference);

      if (response.data.success) {
        setPaymentDetails(response.data.data);
        setStatus("success");
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyStripePayment = async (sessionId: string) => {
    // For Stripe, the webhook handles the verification
    // We just need to wait a moment and check the application status
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await apiClient.getApplication(Number(params.id));
      const application = response.data.application;

      if (application.payment_status === "paid") {
        setPaymentDetails({
          payment_id: application.payment_id,
          application_id: application.id,
          amount: application.total_amount,
          status: "completed",
        });
        setStatus("success");
      } else {
        // Payment might still be processing
        setErrorMessage("Payment is being processed. Please check your application status in a few moments.");
        setStatus("failed");
      }
    } catch (error) {
      throw error;
    }
  };

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 text-primary-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
        <p className="text-gray-600">Please wait while we confirm your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/dashboard/applications/${params.id}/payment`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href={`/dashboard/applications/${params.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Application
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              If money was deducted from your account but payment verification failed,
              please contact our support team with your transaction reference.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-green-200 p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Your payment has been confirmed and your application has been submitted.
          </p>
        </div>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium text-gray-900">{paymentDetails.payment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Application ID:</span>
              <span className="font-medium text-gray-900">{paymentDetails.application_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold text-green-600 text-lg">
                ${parseFloat(paymentDetails.amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                {paymentDetails.status === "completed" ? "Completed" : paymentDetails.status}
              </span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Your application has been submitted for review</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>You will receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Our team will review your application within 2-3 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>You can track your application status in your dashboard</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/dashboard/applications/${params.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            View Application
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

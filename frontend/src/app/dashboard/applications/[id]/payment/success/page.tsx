"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle, ArrowRight, Copy, Gift } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { trackPaymentCompleted } from "@/lib/analytics";
import { toast } from "sonner";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

type VerificationStatus = "verifying" | "success" | "failed";

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    verifyPayment();
    apiClient.getUserReferrals().then((r) => {
      setReferralLink(r.data.referral_link ?? "");
    }).catch(() => {});
  }, []);

  const verifyPayment = async () => {
    try {
      // Check if it's a Paystack payment (has reference parameter)
      const paystackReference = searchParams.get("reference");

      if (paystackReference) {
        await verifyPaystackPayment(paystackReference);
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
        const details = response.data.data;
        setPaymentDetails(details);
        setStatus("success");

        // Fire GA4 purchase event. GA4 deduplicates by transaction_id, so a page
        // refresh / Strict-Mode double-render will not double-count revenue.
        const amount = parseFloat(details.amount);
        if (!Number.isNaN(amount) && amount > 0) {
          const tierName = details.service_tier_name ?? details.tier_name ?? "Study Abroad Application";
          trackPaymentCompleted(reference, amount, "NGN", tierName);
        }
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      throw error;
    }
  };


  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 text-primary-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying Payment</h2>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we confirm your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/dashboard/applications/${params['id']}/payment`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href={`/dashboard/applications/${params['id']}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Application
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
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
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800 p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your payment has been confirmed and your application has been submitted.
          </p>
        </div>

        {paymentDetails && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
              <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.payment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Application ID:</span>
              <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.application_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
              <span className="font-semibold text-green-600 text-lg">
                ₦{parseFloat(paymentDetails.amount).toLocaleString('en-NG')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                {paymentDetails.status === "completed" ? "Completed" : paymentDetails.status}
              </span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What happens next?</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
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

        {referralLink && (
          <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Gift className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Know someone who needs this?</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share your referral link — they get ₦10,000 off and so do you.</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  const msg = `I just sorted my study abroad application with Tundua — no agents, no wahala. Get ₦10,000 off yours: ${referralLink}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Share on WhatsApp
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  toast.success("Referral link copied!");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy link
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/dashboard/applications/${params['id']}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            View Application
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

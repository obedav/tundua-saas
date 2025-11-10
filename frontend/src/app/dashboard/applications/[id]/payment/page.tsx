"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Check,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface Application {
  id: number;
  reference_number: string;
  applicant_name: string;
  destination_country: string;
  service_tier_name: string;
  base_price: string;
  addon_total: string;
  total_amount: string;
  payment_status: string;
}

type PaymentMethod = "paystack" | "stripe";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (params['id']) {
      fetchApplication();
    }
  }, [params['id']]);

  const fetchApplication = async () => {
    try {
      const response = await apiClient.getApplication(Number(params['id']));
      const app = response.data.application;

      // Check if payment is still pending
      if (app.payment_status !== "pending") {
        toast.error("This application has already been paid");
        router.push(`/dashboard/applications/${params['id']}`);
        return;
      }

      setApplication(app);
    } catch (error: any) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application");
      router.push("/dashboard/applications");
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackPayment = async () => {
    setProcessing(true);
    try {
      const response = await apiClient.initializePaystack(Number(params['id']));

      if (response.data.success) {
        const { authorization_url } = response.data.data;
        // Redirect to Paystack checkout
        window.location.href = authorization_url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Paystack error:", error);
      toast.error(error.response?.data?.error || "Failed to initialize Paystack payment");
      setProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setProcessing(true);
    try {
      const successUrl = `${window.location.origin}/dashboard/applications/${params['id']}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/dashboard/applications/${params['id']}/payment`;

      const response = await apiClient.createStripeCheckout(
        Number(params['id']),
        successUrl,
        cancelUrl
      );

      if (response.data.success) {
        const { url } = response.data.data;
        // Redirect to Stripe checkout
        window.location.href = url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Stripe error:", error);
      toast.error(error.response?.data?.error || "Failed to initialize Stripe payment");
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedMethod === "paystack") {
      handlePaystackPayment();
    } else if (selectedMethod === "stripe") {
      handleStripePayment();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/applications/${params['id']}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Application
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
        <p className="text-gray-600 mt-1">
          Application: {application.reference_number}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Payment Method
            </h2>

            <div className="space-y-4">
              {/* Paystack Option */}
              <div
                onClick={() => !processing && setSelectedMethod("paystack")}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === "paystack"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === "paystack"
                          ? "border-primary-600 bg-primary-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "paystack" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Paystack</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Recommended for Africa
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay with card, bank transfer, or mobile money. Supports NGN, GHS, ZAR, KES.
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Check className="h-3 w-3" />
                      <span>Secure payment via Paystack</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stripe Option */}
              <div
                onClick={() => !processing && setSelectedMethod("stripe")}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === "stripe"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === "stripe"
                          ? "border-primary-600 bg-primary-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "stripe" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Stripe</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Global
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay securely with credit/debit card. Accepted worldwide.
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Check className="h-3 w-3" />
                      <span>Secure payment via Stripe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Secure Payment</p>
                <p>
                  All payments are processed securely through our trusted payment partners.
                  Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Summary
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Application</p>
                <p className="font-medium text-gray-900">{application.reference_number}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Service</p>
                <p className="font-medium text-gray-900">{application.service_tier_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Destination</p>
                <p className="font-medium text-gray-900">{application.destination_country}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="font-medium text-gray-900">
                    ${parseFloat(application.base_price).toFixed(2)}
                  </span>
                </div>

                {application.addon_total && parseFloat(application.addon_total) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Add-On Services:</span>
                    <span className="font-medium text-gray-900">
                      ${parseFloat(application.addon_total).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ${parseFloat(application.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedMethod || processing}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  !selectedMethod || processing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";

interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  features: string[];
}

interface AddOnPurchaseModalProps {
  addOn: AddOn;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete?: () => void;
}

export default function AddOnPurchaseModal({
  addOn,
  isOpen,
  onClose,
  onPurchaseComplete,
}: AddOnPurchaseModalProps) {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("card");

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setProcessing(true);
    try {
      // TODO: Implement actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully purchased ${addOn.name}!`);
      onPurchaseComplete?.();
      onClose();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Purchase Add-On Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Details */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-4xl">{addOn.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{addOn.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{addOn.description}</p>
              <ul className="mt-3 space-y-1">
                {addOn.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₦{addOn.price.toLocaleString('en-NG')}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard className="h-6 w-6 text-gray-700 mb-2" />
                <p className="font-semibold text-gray-900">Credit Card</p>
                <p className="text-xs text-gray-600">Visa, Mastercard</p>
              </button>

              <button
                onClick={() => setPaymentMethod("mpesa")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "mpesa"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">📱</div>
                <p className="font-semibold text-gray-900">M-Pesa</p>
                <p className="text-xs text-gray-600">Mobile Money</p>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service</span>
                <span className="font-medium text-gray-900">{addOn.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price</span>
                <span className="font-medium text-gray-900">₦{addOn.price.toLocaleString('en-NG')}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₦{addOn.price.toLocaleString('en-NG')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>90-Day Money-Back Guarantee:</strong> If you're not satisfied with this service,
              you can request a full refund within 90 days of purchase.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={processing}
            className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? "Processing..." : `Pay ₦${addOn.price.toLocaleString('en-NG')}`}
          </button>
        </div>
      </div>
    </div>
  );
}

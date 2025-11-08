"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Plus, Trash2, Check } from "lucide-react";

interface PaymentMethod {
  id: number;
  type: "card" | "mpesa";
  last_four?: string;
  brand?: string;
  phone_number?: string;
  is_default: boolean;
  expires_at?: string;
}

export default function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: "card",
      last_four: "4242",
      brand: "Visa",
      expires_at: "12/2025",
      is_default: true,
    },
    {
      id: 2,
      type: "mpesa",
      phone_number: "+254712345678",
      is_default: false,
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  const setDefaultMethod = (id: number) => {
    setMethods(methods.map(m => ({ ...m, is_default: m.id === id })));
  };

  const deleteMethod = (id: number) => {
    if (methods.find(m => m.id === id)?.is_default) {
      alert("Cannot delete default payment method");
      return;
    }
    setMethods(methods.filter(m => m.id !== id));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your payment methods for faster checkout</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Method
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
              method.is_default
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Icon */}
            <div className={`p-3 rounded-lg ${method.is_default ? "bg-primary-100" : "bg-gray-100"}`}>
              {method.type === "card" ? (
                <CreditCard className={`h-6 w-6 ${method.is_default ? "text-primary-600" : "text-gray-600"}`} />
              ) : (
                <Smartphone className={`h-6 w-6 ${method.is_default ? "text-primary-600" : "text-gray-600"}`} />
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              {method.type === "card" ? (
                <>
                  <p className="font-semibold text-gray-900">
                    {method.brand} •••• {method.last_four}
                  </p>
                  <p className="text-sm text-gray-600">Expires {method.expires_at}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-900">M-Pesa</p>
                  <p className="text-sm text-gray-600">{method.phone_number}</p>
                </>
              )}
            </div>

            {/* Default Badge */}
            {method.is_default && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                <Check className="h-3 w-3" />
                Default
              </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!method.is_default && (
                <button
                  onClick={() => setDefaultMethod(method.id)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Set Default
                </button>
              )}
              {!method.is_default && (
                <button
                  onClick={() => deleteMethod(method.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {methods.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No payment methods added</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Your First Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Your payment information is secure</h4>
            <p className="text-sm text-gray-600">
              We use industry-standard encryption to protect your payment data. Your card details are never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

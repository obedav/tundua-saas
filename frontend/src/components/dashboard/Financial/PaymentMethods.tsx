"use client";

import { useState, useEffect } from "react";
import { CreditCard, Smartphone, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

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
  const [_showAddModal, _setShowAddModal] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        setLoading(true);
        const response = await apiClient.getPaymentMethods();
        setMethods(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch payment methods:", err);
        setError("Failed to load payment methods");
        setMethods([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentMethods();
  }, []);
  

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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your payment methods for faster checkout</p>
          </div>
          <button
            onClick={() => _setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Method
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && methods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
              method.is_default
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {/* Icon */}
            <div className={`p-3 rounded-lg ${method.is_default ? "bg-primary-100 dark:bg-primary-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
              {method.type === "card" ? (
                <CreditCard className={`h-6 w-6 ${method.is_default ? "text-primary-600 dark:text-primary-400" : "text-gray-600 dark:text-gray-400"}`} />
              ) : (
                <Smartphone className={`h-6 w-6 ${method.is_default ? "text-primary-600 dark:text-primary-400" : "text-gray-600 dark:text-gray-400"}`} />
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              {method.type === "card" ? (
                <>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {method.brand} •••• {method.last_four}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expires {method.expires_at}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-900 dark:text-white">M-Pesa</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{method.phone_number}</p>
                </>
              )}
            </div>

            {/* Default Badge */}
            {method.is_default && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                <Check className="h-3 w-3" />
                Default
              </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!method.is_default && (
                <button
                  onClick={() => setDefaultMethod(method.id)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
                >
                  Set Default
                </button>
              )}
              {!method.is_default && (
                <button
                  onClick={() => deleteMethod(method.id)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {!loading && !error && methods.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No payment methods added</p>
            <button
              onClick={() => _setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Your First Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Your payment information is secure</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We use industry-standard encryption to protect your payment data. Your card details are never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CreditCard, DollarSign, AlertCircle } from "lucide-react";

interface Payment {
  id: number;
  application_id: number;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export default function BillingManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", text: "Pending" },
      completed: { color: "bg-green-100 text-green-700", text: "Completed" },
      failed: { color: "bg-red-100 text-red-700", text: "Failed" },
      refunded: { color: "bg-gray-100 text-gray-700", text: "Refunded" },
    };

    const badge = badges[status] || badges['pending'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge!.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">$0.00</h3>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">0</h3>
            </div>
            <CreditCard className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed Payments</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">0</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

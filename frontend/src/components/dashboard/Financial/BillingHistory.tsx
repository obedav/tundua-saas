"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreditCard, Download, Calendar, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import { getUserPayments } from "@/lib/actions/payments";

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded";
  method: "card" | "mpesa" | "bank_transfer";
  description: string;
  reference_number: string;
  created_at: string;
  invoice_url?: string;
}

export default function BillingHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "failed">("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getUserPayments();
      const paymentData = response?.payments || [];

      const mappedPayments: Payment[] = paymentData.map((item: any) => ({
        id: item.id,
        amount: parseFloat(item.amount),
        currency: item.currency || "NGN",
        status: item.status,
        method: item.payment_method || "card",
        description: item.description || `Payment for ${item.payable_type}`,
        reference_number: item.reference_number,
        created_at: item.created_at,
        invoice_url: item.invoice_url,
      }));

      setPayments(mappedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment history");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const badges = {
      completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Completed" },
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pending" },
      failed: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Failed" },
      refunded: { color: "bg-gray-100 text-gray-700", icon: DollarSign, text: "Refunded" },
    };
    return badges[status];
  };

  const getPaymentMethodBadge = (method: Payment["method"]) => {
    const methods = {
      card: { icon: "💳", text: "Credit Card" },
      mpesa: { icon: "📱", text: "M-Pesa" },
      bank_transfer: { icon: "🏦", text: "Bank Transfer" },
    };
    return methods[method];
  };

  const filteredPayments = filter === "all"
    ? payments
    : payments.filter(p => p.status === filter);

  const totalSpent = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-6 w-6" />
            <p className="text-sm font-medium opacity-90">Total Spent</p>
          </div>
          <p className="text-3xl font-bold">₦{totalSpent.toLocaleString('en-NG')}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Successful</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {payments.filter(p => p.status === "completed").length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-6 w-6 text-yellow-600" />
            <p className="text-sm font-medium text-gray-600">Pending</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {payments.filter(p => p.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "completed", "pending", "failed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Payment List */}
        <div className="divide-y divide-gray-200">
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No payments found</p>
            </div>
          ) : (
            filteredPayments.map((payment) => {
              const statusBadge = getStatusBadge(payment.status);
              const methodBadge = getPaymentMethodBadge(payment.method);
              const StatusIcon = statusBadge.icon;

              return (
                <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="bg-primary-50 p-3 rounded-full flex-shrink-0">
                      <CreditCard className="h-6 w-6 text-primary-600" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {payment.reference_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ₦{payment.amount.toLocaleString('en-NG')}
                          </p>
                          <p className="text-sm text-gray-600">NGN</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Status */}
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.text}
                        </span>

                        {/* Payment Method */}
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <span>{methodBadge.icon}</span>
                          {methodBadge.text}
                        </span>

                        {/* Date */}
                        <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(payment.created_at).toLocaleDateString()}
                        </span>

                        {/* Invoice Download */}
                        {payment.invoice_url && payment.status === "completed" && (
                          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1 ml-auto">
                            <Download className="h-3 w-3" />
                            Download Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { DollarSign, AlertCircle, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

interface RefundRequest {
  id: number;
  application_reference: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "processing";
  requested_at: string;
  days_until_deadline: number;
  eligible: boolean;
}

export default function RefundCenter() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: 1,
      application_reference: "TUND-20250101-0001",
      amount: 299.00,
      reason: "Service not as expected",
      status: "pending",
      requested_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      days_until_deadline: 88,
      eligible: true,
    },
  ]);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const eligibleApplications = [
    { reference: "TUND-20250105-0002", amount: 599.00, days_remaining: 85 },
    { reference: "TUND-20250107-0003", amount: 299.00, days_remaining: 83 },
  ];

  const handleSubmitRefund = () => {
    if (!selectedApplication || !refundReason) {
      toast.error("Please select an application and provide a reason");
      return;
    }

    const app = eligibleApplications.find(a => a.reference === selectedApplication);
    if (!app) return;

    const newRequest: RefundRequest = {
      id: refundRequests.length + 1,
      application_reference: selectedApplication,
      amount: app.amount,
      reason: refundReason,
      status: "pending",
      requested_at: new Date().toISOString(),
      days_until_deadline: app.days_remaining,
      eligible: true,
    };

    setRefundRequests([newRequest, ...refundRequests]);
    setShowRequestForm(false);
    setSelectedApplication("");
    setRefundReason("");
    toast.success("Refund request submitted successfully");
  };

  const getStatusBadge = (status: RefundRequest["status"]) => {
    const badges = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pending Review" },
      processing: { color: "bg-blue-100 text-blue-700", icon: Clock, text: "Processing" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Rejected" },
    };
    return badges[status];
  };

  return (
    <div className="space-y-6">
      {/* 90-Day Guarantee Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <DollarSign className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">90-Day Money-Back Guarantee</h2>
            <p className="text-white/90 mb-4">
              Not satisfied with our service? Request a full refund within 90 days of your payment, no questions asked.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Full refund within 90 days</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No questions asked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Processed within 5-7 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eligible Applications */}
      {eligibleApplications.length > 0 && !showRequestForm && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2">
                You have {eligibleApplications.length} eligible application{eligibleApplications.length > 1 ? "s" : ""} for refund
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                These applications are within the 90-day refund period. Request a refund if you're not satisfied.
              </p>
              <button
                onClick={() => setShowRequestForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Request Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Form */}
      {showRequestForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Request a Refund</h3>

          <div className="space-y-4">
            {/* Select Application */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Application
              </label>
              <select
                value={selectedApplication}
                onChange={(e) => setSelectedApplication(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose an application...</option>
                {eligibleApplications.map((app) => (
                  <option key={app.reference} value={app.reference}>
                    {app.reference} - ${app.amount.toFixed(2)} ({app.days_remaining} days remaining)
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Refund (Optional)
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Tell us why you're requesting a refund..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                While optional, providing feedback helps us improve our services
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmitRefund}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Submit Refund Request
              </button>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  setSelectedApplication("");
                  setRefundReason("");
                }}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Requests List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Your Refund Requests</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {refundRequests.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No refund requests</p>
            </div>
          ) : (
            refundRequests.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <DollarSign className="h-6 w-6 text-primary-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.application_reference}</h4>
                          <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">${request.amount.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.text}
                        </span>

                        <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Requested {new Date(request.requested_at).toLocaleDateString()}
                        </span>

                        {request.eligible && request.status === "pending" && (
                          <span className="text-xs text-green-600 font-medium">
                            {request.days_until_deadline} days remaining
                          </span>
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

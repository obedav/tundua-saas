"use client";

import { useState, useEffect } from "react";
import { DollarSign, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface RefundRequest {
  id: number;
  application_id: number;
  user_name: string;
  amount: number;
  reason: string;
  status: string;
  requested_at: string;
  days_remaining: number;
}

interface RefundStats {
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  total_refunded: number;
}

export default function RefundManagement() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [stats, setStats] = useState<RefundStats>({
    pending_count: 0,
    approved_count: 0,
    rejected_count: 0,
    total_refunded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRefunds();
  }, [statusFilter]);

  const fetchRefunds = async () => {
    try {
      const params: any = {};
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await apiClient.getAllRefunds(params);
      const refundData = response.data?.refunds || [];
      console.log('Fetched refunds:', refundData.length, 'refunds');
      setRefunds(refundData);

      // Calculate stats from data
      const pending = refundData.filter((r: RefundRequest) => r.status === "pending").length;
      const approved = refundData.filter((r: RefundRequest) => r.status === "approved").length;
      const rejected = refundData.filter((r: RefundRequest) => r.status === "rejected").length;
      const totalRefunded = refundData
        .filter((r: RefundRequest) => r.status === "approved")
        .reduce((sum: number, r: RefundRequest) => sum + r.amount, 0);

      setStats({
        pending_count: pending,
        approved_count: approved,
        rejected_count: rejected,
        total_refunded: totalRefunded,
      });
    } catch (error: any) {
      console.error("Error fetching refunds:", error);
      toast.error("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRefund = async (refundId: number, action: "approve" | "reject") => {
    try {
      await apiClient.reviewRefund(refundId, action);
      toast.success(`Refund ${action}d successfully`);
      fetchRefunds();
    } catch (error: any) {
      console.error("Error reviewing refund:", error);
      toast.error(error.response?.data?.error || "Failed to review refund");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string; icon: any }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", text: "Pending Review", icon: Clock },
      approved: { color: "bg-green-100 text-green-700", text: "Approved", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-700", text: "Rejected", icon: XCircle },
      completed: { color: "bg-blue-100 text-blue-700", text: "Completed", icon: CheckCircle },
    };

    const badge = badges[status] || badges['pending'];
    const Icon = badge!.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge!.color}`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
        <p className="text-gray-600 mt-1">Review and process refund requests (90-day policy)</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pending_count}</h3>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.approved_count}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.rejected_count}</h3>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Refunded</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₦{stats.total_refunded.toLocaleString('en-NG')}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Refunds</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Refund Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Refund Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </td>
                </tr>
              ) : refunds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No refund requests found
                  </td>
                </tr>
              ) : (
                refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {refund.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₦{refund.amount.toLocaleString('en-NG')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate">{refund.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {refund.days_remaining > 0 ? `${refund.days_remaining} days` : "Expired"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(refund.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.location.href = `/dashboard/admin/refunds/${refund.id}`}
                          className="text-blue-600 hover:text-blue-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {refund.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleReviewRefund(refund.id, "approve")}
                              className="text-green-600 hover:text-green-700"
                              title="Approve Refund"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReviewRefund(refund.id, "reject")}
                              className="text-red-600 hover:text-red-700"
                              title="Reject Refund"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Loader2, MessageSquare } from "lucide-react";
import { updateApplicationStatusAction, addAdminNotesAction } from "@/lib/actions/admin/applications";

interface Props {
  applicationId: number;
  currentStatus: string;
  paymentStatus: string;
  adminNotes?: string;
}

export default function ApplicationStatusManager({
  applicationId,
  currentStatus,
  paymentStatus,
  adminNotes,
}: Props) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState(adminNotes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateApplicationStatusAction(applicationId, newStatus);

      if (result.success) {
        toast.success(`Status updated to ${newStatus}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const result = await addAdminNotesAction(applicationId, notes);

      if (result.success) {
        toast.success("Notes saved successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save notes");
      }
    } catch (error) {
      console.error("Save notes error:", error);
      toast.error("An error occurred");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Determine available status transitions based on current status and payment
  const getAvailableStatuses = () => {
    const statuses: Array<{ value: string; label: string; color: string; icon: any }> = [];

    // Only allow status changes if payment is completed
    if (paymentStatus !== "paid") {
      return [
        {
          value: "payment_pending",
          label: "Awaiting Payment",
          color: "bg-yellow-500 hover:bg-yellow-600",
          icon: Clock,
        },
      ];
    }

    // Payment is completed, show review options
    if (currentStatus === "submitted" || currentStatus === "payment_pending") {
      statuses.push({
        value: "under_review",
        label: "Under Review",
        color: "bg-blue-500 hover:bg-blue-600",
        icon: Clock,
      });
    }

    if (currentStatus === "under_review" || currentStatus === "submitted") {
      statuses.push(
        {
          value: "approved",
          label: "Approve Application",
          color: "bg-green-500 hover:bg-green-600",
          icon: CheckCircle,
        },
        {
          value: "rejected",
          label: "Reject Application",
          color: "bg-red-500 hover:bg-red-600",
          icon: XCircle,
        }
      );
    }

    if (currentStatus === "approved") {
      statuses.push({
        value: "completed",
        label: "Mark as Completed",
        color: "bg-green-600 hover:bg-green-700",
        icon: CheckCircle,
      });
    }

    return statuses;
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Status Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Management</h3>

        {paymentStatus !== "paid" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Payment must be completed before changing application status</span>
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {availableStatuses.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                disabled={isUpdating || currentStatus === status.value}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${status.color}`}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Notes */}
      <div className="border-t border-gray-200 pt-6">
        <label htmlFor="admin-notes" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Admin Notes (Internal)
        </label>
        <textarea
          id="admin-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Add internal notes about this application..."
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSaveNotes}
            disabled={isSavingNotes || notes === adminNotes}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingNotes ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Notes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

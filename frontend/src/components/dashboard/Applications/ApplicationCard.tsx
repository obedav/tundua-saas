"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface Application {
  id: number;
  university_name: string;
  country: string;
  service_tier: string;
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "completed"
    | "cancelled";
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  progress_percentage?: number;
  missing_documents?: number;
}

interface ApplicationCardProps {
  application: Application;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  variant?: "default" | "compact" | "detailed";
}

export default function ApplicationCard({
  application,
  onView,
  onEdit,
  onDelete,
  variant = "default",
}: ApplicationCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusConfig = (status: Application["status"]) => {
    const configs = {
      draft: {
        icon: Edit,
        color: "text-gray-600",
        bg: "bg-gray-100",
        label: "Draft",
      },
      submitted: {
        icon: Clock,
        color: "text-blue-600",
        bg: "bg-blue-100",
        label: "Submitted",
      },
      under_review: {
        icon: AlertCircle,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        label: "Under Review",
      },
      approved: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        label: "Rejected",
      },
      completed: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        label: "Completed",
      },
      cancelled: {
        icon: XCircle,
        color: "text-gray-600",
        bg: "bg-gray-100",
        label: "Cancelled",
      },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onView?.(application.id)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {application.university_name}
            </h4>
            <p className="text-sm text-gray-500">{application.country}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(application.updated_at), "MMM d, yyyy")}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{application.country}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {application.university_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                {application.service_tier}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1.5 rounded-full ${statusConfig.bg} flex items-center gap-2`}>
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className={`text-sm font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {application.progress_percentage !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">
                {application.progress_percentage}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${application.progress_percentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Missing Documents Alert */}
        {application.missing_documents && application.missing_documents > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-800">
              {application.missing_documents} document
              {application.missing_documents > 1 ? "s" : ""} required
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(application.created_at), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>
              ₦{typeof application.total_amount === 'number' ? application.total_amount.toLocaleString('en-NG') : parseFloat(application.total_amount || "0").toLocaleString('en-NG')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={() => onView(application.id)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
              title="View details"
            >
              <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            </button>
          )}
          {onEdit && application.status === "draft" && (
            <button
              onClick={() => onEdit(application.id)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
              title="Edit application"
            >
              <Edit className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            </button>
          )}
          {onDelete && application.status === "draft" && (
            <button
              onClick={() => onDelete(application.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Delete application"
            >
              <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

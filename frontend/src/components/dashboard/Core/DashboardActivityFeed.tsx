"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  MessageCircle,
  DollarSign,
  Upload,
  AlertCircle,
} from "lucide-react";
import { getUserActivity } from "@/lib/actions/activity";

interface Activity {
  id: number;
  type: "application" | "document" | "payment" | "message" | "status";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

interface DashboardActivityFeedProps {
  maxItems?: number;
}

/**
 * Client Component - Dashboard Activity Feed
 * Uses Server Actions for data fetching
 */
export default function DashboardActivityFeed({ maxItems = 10 }: DashboardActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await getUserActivity({ limit: maxItems });
      const activityData = response?.activities || [];

      const mappedActivities: Activity[] = activityData.map((item: any) => {
        const activityConfig = getActivityConfig(item.entity_type, item.action);

        return {
          id: item.id,
          type: activityConfig.type,
          title: activityConfig.title,
          description: item.description || activityConfig.defaultDescription,
          timestamp: item.created_at,
          icon: activityConfig.icon,
          iconColor: activityConfig.iconColor,
          bgColor: activityConfig.bgColor,
        };
      });

      setActivities(mappedActivities.slice(0, maxItems));
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityConfig = (entityType: string, action: string) => {
    const key = `${entityType}-${action}`;

    const configs: Record<string, any> = {
      "application-created": {
        type: "application",
        title: "Application Created",
        defaultDescription: "New application created",
        icon: FileText,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      "application-submitted": {
        type: "application",
        title: "Application Submitted",
        defaultDescription: "Application submitted for review",
        icon: FileText,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      "application-status_updated": {
        type: "status",
        title: "Status Updated",
        defaultDescription: "Application status changed",
        icon: Clock,
        iconColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
      "document-uploaded": {
        type: "document",
        title: "Document Uploaded",
        defaultDescription: "Document uploaded successfully",
        icon: Upload,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
      },
      "payment-completed": {
        type: "payment",
        title: "Payment Completed",
        defaultDescription: "Payment processed successfully",
        icon: DollarSign,
        iconColor: "text-primary-600",
        bgColor: "bg-primary-50",
      },
      "payment-initiated": {
        type: "payment",
        title: "Payment Initiated",
        defaultDescription: "Payment process started",
        icon: DollarSign,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      "message-sent": {
        type: "message",
        title: "Message Sent",
        defaultDescription: "New message sent",
        icon: MessageCircle,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    };

    return configs[key] || {
      type: "status",
      title: action.charAt(0).toUpperCase() + action.slice(1).replace(/_/g, " "),
      defaultDescription: `${entityType} ${action}`,
      icon: AlertCircle,
      iconColor: "text-gray-600",
      bgColor: "bg-gray-50",
    };
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex gap-4 items-start">
                <div className={`${activity.bgColor} p-2 rounded-full`}>
                  <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

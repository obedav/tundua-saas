"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Bell, X, Check, AlertCircle, Info, CheckCircle } from "lucide-react";

interface Notification {
  id: number;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.getUserNotifications();
      const notificationData = response.data.notifications || [];

      const mappedNotifications: Notification[] = notificationData.map(
        (item: any) => ({
          id: item.id,
          type: item.type || "info",
          title: item.subject,
          message: item.message,
          timestamp: item.created_at,
          read: item.is_read === 1 || item.is_read === true,
          actionUrl: item.action_url,
        }),
      );

      setNotifications(mappedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await apiClient.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await apiClient.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return {
          Icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case "warning":
        return {
          Icon: AlertCircle,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
        };
      case "error":
        return { Icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" };
      default:
        return { Icon: Info, color: "text-blue-600", bg: "bg-blue-50" };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayNotifications = showAll
    ? notifications
    : notifications.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayNotifications.map((notification) => {
            const { Icon, color, bg } = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`flex gap-4 p-4 rounded-lg border ${
                  notification.read
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className={`${bg} p-2 rounded-full flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {notification.title}
                    </h3>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-green-600"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
                    >
                      Take Action →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {notifications.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showAll ? "Show Less" : `Show All (${notifications.length})`}
        </button>
      )}
    </div>
  );
}

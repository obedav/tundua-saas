/**
 * API Integration Guide for Tundua SaaS Dashboard Components
 *
 * This file provides integration examples for all dashboard components.
 * Replace mock data with actual API calls using your apiClient.
 */

import { apiClient } from "./api-client";

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export const fetchDashboardStats = async () => {
  try {
    const response = await apiClient.getApplications();
    const applications = response.data.applications || [];

    // Calculate current stats
    const stats = {
      total_applications: applications.length,
      pending_applications: applications.filter((app: any) =>
        ["draft", "submitted", "under_review"].includes(app.status),
      ).length,
      approved_applications: applications.filter(
        (app: any) => app.status === "approved",
      ).length,
      total_spent: applications.reduce(
        (sum: number, app: any) => sum + parseFloat(app.total_amount || "0"),
        0,
      ),
    };

    // TODO: Calculate trends from historical data
    // You'll need to add API endpoints for historical data
    const trends = {
      applications: 12, // % change vs last month
      pending: -5,
      approved: 25,
      spending: 8,
    };

    return { stats, trends };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// ============================================================================
// ACTIVITY FEED
// ============================================================================

export const fetchActivityFeed = async (maxItems = 10) => {
  try {
    // TODO: Create API endpoint: GET /api/user/activities
    // For now, return mock data
    const activities = [
      {
        id: 1,
        type: "application",
        title: "Application Submitted",
        description: "Your application has been submitted for review",
        timestamp: new Date().toISOString(),
      },
      // Add more activities
    ];

    return activities.slice(0, maxItems);
  } catch (error) {
    console.error("Error fetching activity feed:", error);
    throw error;
  }
};

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const fetchNotifications = async () => {
  try {
    // TODO: Create API endpoint: GET /api/user/notifications
    const notifications = [
      {
        id: 1,
        type: "warning",
        title: "Document Required",
        message: "Please upload your passport copy",
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: "/dashboard/documents",
      },
    ];

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    // TODO: Create API endpoint: PATCH /api/notifications/:id/read
    await (apiClient as any).request({
      method: "PATCH",
      url: `/notifications/${notificationId}/read`,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// ============================================================================
// DOCUMENTS
// ============================================================================

export const fetchDocuments = async () => {
  try {
    // TODO: Create API endpoint: GET /api/user/documents
    const response = await (apiClient as any).request({
      method: "GET",
      url: "/documents",
    });

    return response.data.documents || [];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const uploadDocument = async (file: File, metadata: any) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(metadata));

    // TODO: Create API endpoint: POST /api/documents/upload
    const response = await (apiClient as any).request({
      method: "POST",
      url: "/documents/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

export const deleteDocument = async (documentId: number) => {
  try {
    // TODO: Create API endpoint: DELETE /api/documents/:id
    await (apiClient as any).request({
      method: "DELETE",
      url: `/documents/${documentId}`,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// ============================================================================
// BILLING & PAYMENTS
// ============================================================================

export const fetchPaymentHistory = async () => {
  try {
    // TODO: Create API endpoint: GET /api/payments/history
    const response = await (apiClient as any).request({
      method: "GET",
      url: "/payments/history",
    });

    return response.data.payments || [];
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

export const fetchPaymentMethods = async () => {
  try {
    // TODO: Create API endpoint: GET /api/payment-methods
    const response = await (apiClient as any).request({
      method: "GET",
      url: "/payment-methods",
    });

    return response.data.methods || [];
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

export const addPaymentMethod = async (methodData: any) => {
  try {
    // TODO: Create API endpoint: POST /api/payment-methods
    const response = await (apiClient as any).request({
      method: "POST",
      url: "/payment-methods",
      data: methodData,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding payment method:", error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (methodId: number) => {
  try {
    // TODO: Create API endpoint: PATCH /api/payment-methods/:id/set-default
    await (apiClient as any).request({
      method: "PATCH",
      url: `/payment-methods/${methodId}/set-default`,
    });
  } catch (error) {
    console.error("Error setting default payment method:", error);
    throw error;
  }
};

// ============================================================================
// REFUNDS
// ============================================================================

export const fetchRefundRequests = async () => {
  try {
    // TODO: Create API endpoint: GET /api/refunds
    const response = await (apiClient as any).request({
      method: "GET",
      url: "/refunds",
    });

    return response.data.refunds || [];
  } catch (error) {
    console.error("Error fetching refund requests:", error);
    throw error;
  }
};

export const submitRefundRequest = async (data: {
  application_id: number;
  reason: string;
}) => {
  try {
    // TODO: Create API endpoint: POST /api/refunds
    const response = await (apiClient as any).request({
      method: "POST",
      url: "/refunds",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting refund request:", error);
    throw error;
  }
};

// ============================================================================
// ADD-ON SERVICES
// ============================================================================

export const fetchAvailableAddOns = async () => {
  try {
    // TODO: Create API endpoint: GET /api/addons/available
    const response = await (apiClient as any).request({
      method: "GET",
      url: "/addons/available",
    });

    return response.data.addons || [];
  } catch (error) {
    console.error("Error fetching available add-ons:", error);
    throw error;
  }
};

export const fetchPurchasedAddOns = async () => {
  try {
    // TODO: Create API endpoint: GET /api/addons/purchased
    const response = await (apiClient as any).request({
      method: "GET",
      url: "/addons/purchased",
    });

    return response.data.addons || [];
  } catch (error) {
    console.error("Error fetching purchased add-ons:", error);
    throw error;
  }
};

export const purchaseAddOn = async (
  addOnId: number,
  paymentMethodId: number,
) => {
  try {
    // TODO: Create API endpoint: POST /api/addons/:id/purchase
    const response = await (apiClient as any).request({
      method: "POST",
      url: `/addons/${addOnId}/purchase`,
      data: { payment_method_id: paymentMethodId },
    });

    return response.data;
  } catch (error) {
    console.error("Error purchasing add-on:", error);
    throw error;
  }
};

// ============================================================================
// ANALYTICS & TRACKING
// ============================================================================

export const trackEvent = (event: {
  type: string;
  page: string;
  metadata?: Record<string, any>;
}) => {
  try {
    // TODO: Create API endpoint: POST /api/analytics/track
    (apiClient as any).request({
      method: "POST",
      url: "/analytics/track",
      data: {
        ...event,
        timestamp: new Date().toISOString(),
      },
    });

    // Also send to third-party analytics
    if (typeof window !== "undefined") {
      // Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag("event", event.type, {
          page: event.page,
          ...event.metadata,
        });
      }

      // Mixpanel
      if ((window as any).mixpanel) {
        (window as any).mixpanel.track(event.type, {
          page: event.page,
          ...event.metadata,
        });
      }
    }
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

// ============================================================================
// EXAMPLE USAGE IN COMPONENTS
// ============================================================================

/*

// In DashboardStats component:
import { fetchDashboardStats } from "@/lib/api-integrations";

useEffect(() => {
  const loadStats = async () => {
    const { stats, trends } = await fetchDashboardStats();
    setStats(stats);
    setTrends(trends);
  };
  loadStats();
}, []);

// In DashboardActivityFeed component:
import { fetchActivityFeed } from "@/lib/api-integrations";

useEffect(() => {
  const loadActivities = async () => {
    const activities = await fetchActivityFeed(10);
    setActivities(activities);
  };
  loadActivities();
}, []);

// In DashboardNotifications component:
import { fetchNotifications, markNotificationAsRead } from "@/lib/api-integrations";

const handleMarkAsRead = async (id: number) => {
  await markNotificationAsRead(id);
  // Refresh notifications
};

// In DocumentUploader component:
import { uploadDocument } from "@/lib/api-integrations";

const handleUpload = async (file: File) => {
  await uploadDocument(file, {
    type: "passport",
    application_id: applicationId,
  });
};

// In RefundCenter component:
import { submitRefundRequest } from "@/lib/api-integrations";

const handleSubmit = async () => {
  await submitRefundRequest({
    application_id: selectedApplicationId,
    reason: refundReason,
  });
};

*/

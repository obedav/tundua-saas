import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";
import { clientEnv } from "@/lib/env";

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          Cookies.remove("auth_token");
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return this.client.post("/api/auth/register", data);
  }

  async login(email: string, password: string) {
    return this.client.post("/api/auth/login", { email, password });
  }

  async logout() {
    return this.client.post("/api/auth/logout");
  }

  async getCurrentUser() {
    return this.client.get("/api/auth/me");
  }

  async updateProfile(data: import("@/types/api").UpdateProfileRequest) {
    return this.client.put("/api/auth/me", data);
  }

  async forgotPassword(email: string) {
    return this.client.post("/api/auth/forgot-password", { email });
  }

  async resetPassword(token: string, password: string) {
    return this.client.post("/api/auth/reset-password", { token, password });
  }

  // Service tiers
  async getServiceTiers() {
    return this.client.get("/api/service-tiers");
  }

  // Add-on services
  async getAddonServices() {
    return this.client.get("/api/addon-services");
  }

  // Applications
  async createApplication(data: import("@/types/api").CreateApplicationRequest) {
    return this.client.post("/api/applications", data);
  }

  async getApplications() {
    return this.client.get("/api/applications");
  }

  async getApplication(id: number) {
    return this.client.get(`/api/applications/${id}`);
  }

  async updateApplication(id: number, data: import("@/types/api").UpdateApplicationRequest) {
    return this.client.put(`/api/applications/${id}`, data);
  }

  async submitApplication(id: number) {
    return this.client.post(`/api/applications/${id}/submit`);
  }

  async deleteApplication(id: number) {
    return this.client.delete(`/api/applications/${id}`);
  }

  async calculatePricing(id: number, data: import("@/types/api").CalculatePricingRequest) {
    return this.client.post(`/api/applications/${id}/calculate`, data);
  }

  // Documents
  async uploadDocument(formData: FormData) {
    return this.client.post("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getApplicationDocuments(applicationId: number) {
    return this.client.get(`/api/documents/application/${applicationId}`);
  }

  async deleteDocument(id: number) {
    return this.client.delete(`/api/documents/${id}`);
  }

  async downloadDocument(id: number) {
    return this.client.get(`/api/documents/${id}/download`, {
      responseType: "blob",
    });
  }

  async getDocumentTypes() {
    return this.client.get("/api/documents/types");
  }

  // Payments
  async initializePaystack(applicationId: number) {
    return this.client.post("/api/payments/paystack/initialize", {
      application_id: applicationId,
    });
  }

  async verifyPaystack(reference: string) {
    return this.client.get(`/api/payments/paystack/verify/${reference}`);
  }

  async createStripeCheckout(applicationId: number, successUrl: string, cancelUrl: string) {
    return this.client.post("/api/payments/stripe/create-checkout", {
      application_id: applicationId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async initiateMpesaPayment(applicationId: number, phoneNumber: string) {
    return this.client.post("/api/payments/mpesa/initiate", {
      application_id: applicationId,
      phone_number: phoneNumber,
    });
  }

  async getPaymentStatus(id: number) {
    return this.client.get(`/api/payments/${id}`);
  }

  // Refunds
  async requestRefund(applicationId: number, reason: string) {
    return this.client.post("/api/refunds", {
      application_id: applicationId,
      refund_reason: reason,
    });
  }

  async getUserRefunds() {
    return this.client.get("/api/refunds/user");
  }

  async getRefund(id: number) {
    return this.client.get(`/api/refunds/${id}`);
  }

  async signRefundAgreement(id: number, signatureData: string) {
    return this.client.post(`/api/refunds/${id}/sign`, {
      signature_data: signatureData,
    });
  }

  async downloadRefundAgreement(id: number) {
    return this.client.get(`/api/refunds/${id}/agreement`, {
      responseType: "blob",
    });
  }

  // Admin endpoints
  async getAllApplications(params?: import("@/types/api").AdminApplicationParams) {
    return this.client.get("/api/admin/applications", { params });
  }

  async updateApplicationStatus(id: number, status: string) {
    return this.client.put(`/api/admin/applications/${id}/status`, { status });
  }

  async addAdminNotes(id: number, notes: string) {
    return this.client.post(`/api/admin/applications/${id}/notes`, { notes });
  }

  async getPendingDocuments() {
    return this.client.get("/api/admin/documents/pending");
  }

  async reviewDocument(id: number, status: string, notes?: string) {
    return this.client.put(`/api/admin/documents/${id}/review`, { status, notes });
  }

  async getAllRefunds(params?: import("@/types/api").AdminRefundParams) {
    return this.client.get("/api/admin/refunds", { params });
  }

  async reviewRefund(id: number, action: "approve" | "reject", notes?: string) {
    return this.client.put(`/api/admin/refunds/${id}/review`, { action, notes });
  }

  async getAnalytics() {
    return this.client.get("/api/admin/analytics");
  }

  async getAllUsers(params?: import("@/types/api").AdminUserParams) {
    return this.client.get("/api/admin/users", { params });
  }

  async getUserDetails(id: number) {
    return this.client.get(`/api/admin/users/${id}`);
  }

  async updateUser(id: number, data: import("@/types/api").UpdateUserRequest) {
    return this.client.put(`/api/admin/users/${id}`, data);
  }

  async suspendUser(id: number, action: "suspend" | "unsuspend", minutes?: number) {
    return this.client.post(`/api/admin/users/${id}/suspend`, { action, minutes });
  }

  async getUserStatistics() {
    return this.client.get("/api/admin/users/statistics");
  }

  // Notifications
  async getUserNotifications(params?: { unread?: boolean; limit?: number }) {
    return this.client.get("/api/notifications", { params });
  }

  async markNotificationRead(id: number) {
    return this.client.put(`/api/notifications/${id}/read`);
  }

  async markAllNotificationsRead() {
    return this.client.put("/api/notifications/read-all");
  }

  async deleteNotification(id: number) {
    return this.client.delete(`/api/notifications/${id}`);
  }

  async getUnreadNotificationsCount() {
    return this.client.get("/api/notifications/unread-count");
  }

  // Activity Feed
  async getUserActivity(params?: { limit?: number }) {
    return this.client.get("/api/activity", { params });
  }

  async getEntityActivity(entityType: string, entityId: number, params?: { limit?: number }) {
    return this.client.get(`/api/activity/${entityType}/${entityId}`, { params });
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.client.get("/api/dashboard/stats");
  }

  async getDashboardOverview() {
    return this.client.get("/api/dashboard/overview");
  }

  // Payment History
  async getUserPayments(params?: { status?: string }) {
    return this.client.get("/api/payments/history", { params });
  }

  // Add-Ons Management
  async getUserAddOns(params?: { status?: string }) {
    return this.client.get("/api/addons/purchased", { params });
  }

  async purchaseAddOn(addonServiceId: number, applicationId: number, quantity?: number) {
    return this.client.post("/api/addons/purchase", {
      addon_service_id: addonServiceId,
      application_id: applicationId,
      quantity: quantity || 1,
    });
  }

  async getAddOnOrder(id: number) {
    return this.client.get(`/api/addons/orders/${id}`);
  }

  async getApplicationAddOns(applicationId: number) {
    return this.client.get(`/api/addons/application/${applicationId}`);
  }

  // Admin: Add-On Orders
  async getAllAddOnOrders(params?: import("@/types/api").AddonOrderParams) {
    return this.client.get("/api/admin/addons/orders", { params });
  }

  async updateAddOnOrderStatus(id: number, status: string, data?: import("@/types/api").UpdateAddonOrderStatusRequest) {
    return this.client.put(`/api/admin/addons/orders/${id}/status`, { status, ...data });
  }

  // Admin: Activity
  async getAdminActivity(params?: { limit?: number }) {
    return this.client.get("/api/admin/activity", { params });
  }

  // Referrals
  async getUserReferrals() {
    return this.client.get("/api/referrals");
  }

  async createReferral(email: string, source?: string) {
    return this.client.post("/api/referrals", { email, source: source || 'manual' });
  }

  async claimReferralReward(id: number) {
    return this.client.post(`/api/referrals/${id}/claim`);
  }

  // ============================================================================
  // KNOWLEDGE BASE
  // ============================================================================

  async getKnowledgeBaseArticles(params?: { category?: string; search?: string; limit?: number }) {
    return this.client.get("/api/knowledge-base", { params });
  }

  async getKnowledgeBaseArticle(id: number | string) {
    return this.client.get(`/api/knowledge-base/${id}`);
  }

  async getPopularArticles(params?: { limit?: number }) {
    return this.client.get("/api/knowledge-base/popular", { params });
  }

  async getFeaturedArticles(params?: { limit?: number }) {
    return this.client.get("/api/knowledge-base/featured", { params });
  }

  async getKnowledgeBaseCategories() {
    return this.client.get("/api/knowledge-base/categories");
  }

  async markArticleHelpful(id: number, helpful: boolean) {
    return this.client.post(`/api/knowledge-base/${id}/feedback`, { helpful });
  }

  // ============================================================================
  // UNIVERSITIES (Intelligence System)
  // ============================================================================

  async getCountries() {
    return this.client.get("/api/universities/countries");
  }

  async searchUniversities(params: {
    country?: string;
    budget?: number;
    gpa?: number;
    ielts?: number;
    platform?: string;
    field?: string;
    sort?: 'smart' | 'commission' | 'acceptance' | 'tuition';
    page?: number;
    per_page?: number;
  }) {
    return this.client.get("/api/universities/search", { params });
  }

  async getUniversityRecommendations(profile: {
    country?: string;
    budget?: number;
    gpa?: number;
    ielts?: number;
    field?: string;
  }) {
    return this.client.post("/api/universities/recommend", profile);
  }

  async getUniversityById(id: number) {
    return this.client.get(`/api/universities/${id}`);
  }
}

export const apiClient = new ApiClient();

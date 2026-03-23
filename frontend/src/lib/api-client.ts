import axios, { AxiosInstance, AxiosError } from "axios";
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

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    // Note: Auth token is sent automatically via httpOnly cookie (withCredentials: true)
    // The backend AuthMiddleware will read it from the cookie
    this.client.interceptors.request.use(
      (config) => {
        // For admin routes, application routes, and document routes, route through Next.js API handlers which can access HttpOnly cookies
        if (
          config.url?.includes('/api/v1/admin/') ||
          config.url?.includes('/api/v1/applications') ||
          config.url?.includes('/api/v1/documents/')
        ) {
          // Use relative URL to hit Next.js API routes instead of backend directly
          config.baseURL = '';
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
          // Token expired or invalid - redirect to login
          // The server will clear the httpOnly cookie
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
    return this.client.post("/api/v1/auth/register", data);
  }

  async login(email: string, password: string) {
    return this.client.post("/api/v1/auth/login", { email, password });
  }

  async logout() {
    return this.client.post("/api/v1/auth/logout");
  }

  async getCurrentUser() {
    return this.client.get("/api/v1/auth/me");
  }

  async updateProfile(data: import("@/types/api").UpdateProfileRequest) {
    return this.client.put("/api/v1/auth/me", data);
  }

  async forgotPassword(email: string) {
    return this.client.post("/api/v1/auth/forgot-password", { email });
  }

  async resetPassword(token: string, password: string) {
    return this.client.post("/api/v1/auth/reset-password", { token, password });
  }

  // Service tiers
  async getServiceTiers() {
    return this.client.get("/api/v1/service-tiers");
  }

  // Add-on services
  async getAddonServices() {
    return this.client.get("/api/v1/addon-services");
  }

  // Applications
  async createApplication(data: import("@/types/api").CreateApplicationRequest) {
    return this.client.post("/api/v1/applications", data);
  }

  async getApplications() {
    return this.client.get("/api/v1/applications");
  }

  async getApplication(id: number) {
    return this.client.get(`/api/v1/applications/${id}`);
  }

  async updateApplication(id: number, data: import("@/types/api").UpdateApplicationRequest) {
    return this.client.put(`/api/v1/applications/${id}`, data);
  }

  async submitApplication(id: number) {
    return this.client.post(`/api/v1/applications/${id}/submit`);
  }

  async deleteApplication(id: number) {
    return this.client.delete(`/api/v1/applications/${id}`);
  }

  async calculatePricing(id: number, data: import("@/types/api").CalculatePricingRequest) {
    return this.client.post(`/api/v1/applications/${id}/calculate`, data);
  }

  // Documents
  async uploadDocument(formData: FormData) {
    return this.client.post("/api/v1/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getApplicationDocuments(applicationId: number) {
    return this.client.get(`/api/v1/documents/application/${applicationId}`);
  }

  async deleteDocument(id: number) {
    return this.client.delete(`/api/v1/documents/${id}`);
  }

  async downloadDocument(id: number) {
    return this.client.get(`/api/v1/documents/${id}/download`, {
      responseType: "blob",
    });
  }

  async getDocumentTypes() {
    return this.client.get("/api/v1/documents/types");
  }

  // Payments
  async initializePaystack(applicationId: number) {
    return this.client.post("/api/v1/payments/paystack/initialize", {
      application_id: applicationId,
    });
  }

  async verifyPaystack(reference: string) {
    return this.client.get(`/api/v1/payments/paystack/verify/${reference}`);
  }

  async createStripeCheckout(applicationId: number, successUrl: string, cancelUrl: string) {
    return this.client.post("/api/v1/payments/stripe/create-checkout", {
      application_id: applicationId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async initiateMpesaPayment(applicationId: number, phoneNumber: string) {
    return this.client.post("/api/v1/payments/mpesa/initiate", {
      application_id: applicationId,
      phone_number: phoneNumber,
    });
  }

  async getPaymentStatus(id: number) {
    return this.client.get(`/api/v1/payments/${id}`);
  }

  // Refunds
  async requestRefund(applicationId: number, reason: string) {
    return this.client.post("/api/v1/refunds", {
      application_id: applicationId,
      refund_reason: reason,
    });
  }

  async getUserRefunds() {
    return this.client.get("/api/v1/refunds/user");
  }

  async getRefund(id: number) {
    return this.client.get(`/api/v1/refunds/${id}`);
  }

  async signRefundAgreement(id: number, signatureData: string) {
    return this.client.post(`/api/v1/refunds/${id}/sign`, {
      signature_data: signatureData,
    });
  }

  async downloadRefundAgreement(id: number) {
    return this.client.get(`/api/v1/refunds/${id}/agreement`, {
      responseType: "blob",
    });
  }

  // Admin endpoints
  async getAllApplications(params?: import("@/types/api").AdminApplicationParams) {
    return this.client.get("/api/v1/admin/applications", { params });
  }

  async updateApplicationStatus(id: number, status: string) {
    return this.client.put(`/api/v1/admin/applications/${id}/status`, { status });
  }

  async addAdminNotes(id: number, notes: string) {
    return this.client.post(`/api/v1/admin/applications/${id}/notes`, { notes });
  }

  async getPendingDocuments() {
    return this.client.get("/api/v1/admin/documents/pending");
  }

  async adminDownloadDocument(id: number) {
    return this.client.get(`/api/v1/admin/documents/${id}/download`, {
      responseType: "blob",
    });
  }

  async reviewDocument(id: number, status: string, notes?: string) {
    return this.client.put(`/api/v1/admin/documents/${id}/review`, { status, notes });
  }

  async getAllRefunds(params?: import("@/types/api").AdminRefundParams) {
    return this.client.get("/api/v1/admin/refunds", { params });
  }

  async reviewRefund(id: number, action: "approve" | "reject", notes?: string) {
    return this.client.put(`/api/v1/admin/refunds/${id}/review`, { action, notes });
  }

  async getAnalytics() {
    return this.client.get("/api/v1/admin/analytics");
  }

  async getAllUsers(params?: import("@/types/api").AdminUserParams) {
    return this.client.get("/api/v1/admin/users", { params });
  }

  async getUserDetails(id: number) {
    return this.client.get(`/api/v1/admin/users/${id}`);
  }

  async updateUser(id: number, data: import("@/types/api").UpdateUserRequest) {
    return this.client.put(`/api/v1/admin/users/${id}`, data);
  }

  async suspendUser(id: number, action: "suspend" | "unsuspend", minutes?: number) {
    return this.client.post(`/api/v1/admin/users/${id}/suspend`, { action, minutes });
  }

  async getUserStatistics() {
    return this.client.get("/api/v1/admin/users/statistics");
  }

  // Notifications
  async getUserNotifications(params?: { unread?: boolean; limit?: number }) {
    return this.client.get("/api/v1/notifications", { params });
  }

  async markNotificationRead(id: number) {
    return this.client.put(`/api/v1/notifications/${id}/read`);
  }

  async markAllNotificationsRead() {
    return this.client.put("/api/v1/notifications/read-all");
  }

  async deleteNotification(id: number) {
    return this.client.delete(`/api/v1/notifications/${id}`);
  }

  async getUnreadNotificationsCount() {
    return this.client.get("/api/v1/notifications/unread-count");
  }

  // Activity Feed
  async getUserActivity(params?: { limit?: number }) {
    return this.client.get("/api/v1/activity", { params });
  }

  async getEntityActivity(entityType: string, entityId: number, params?: { limit?: number }) {
    return this.client.get(`/api/v1/activity/${entityType}/${entityId}`, { params });
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.client.get("/api/v1/dashboard/stats");
  }

  async getDashboardOverview() {
    return this.client.get("/api/v1/dashboard/overview");
  }

  // Payment History
  async getUserPayments(params?: { status?: string }) {
    return this.client.get("/api/v1/payments/history", { params });
  }

  // Payment Methods
  async getPaymentMethods() {
    return this.client.get("/api/v1/payments/methods");
  }

  async addPaymentMethod(data: { type: "card" | "mpesa"; token?: string; phone_number?: string }) {
    return this.client.post("/api/v1/payments/methods", data);
  }

  async deletePaymentMethod(id: number) {
    return this.client.delete(`/api/v1/payments/methods/${id}`);
  }

  async setDefaultPaymentMethod(id: number) {
    return this.client.put(`/api/v1/payments/methods/${id}/default`);
  }

  // Add-Ons Management
  async getUserAddOns(params?: { status?: string }) {
    return this.client.get("/api/v1/addons/purchased", { params });
  }

  async purchaseAddOn(addonServiceId: number, applicationId: number, quantity?: number) {
    return this.client.post("/api/v1/addons/purchase", {
      addon_service_id: addonServiceId,
      application_id: applicationId,
      quantity: quantity || 1,
    });
  }

  async getAddOnOrder(id: number) {
    return this.client.get(`/api/v1/addons/orders/${id}`);
  }

  async getApplicationAddOns(applicationId: number) {
    return this.client.get(`/api/v1/addons/application/${applicationId}`);
  }

  // Admin: Add-On Orders
  async getAllAddOnOrders(params?: import("@/types/api").AddonOrderParams) {
    return this.client.get("/api/v1/admin/addons/orders", { params });
  }

  async updateAddOnOrderStatus(id: number, status: string, data?: import("@/types/api").UpdateAddonOrderStatusRequest) {
    return this.client.put(`/api/v1/admin/addons/orders/${id}/status`, { status, ...data });
  }

  // Admin: Activity
  async getAdminActivity(params?: { limit?: number }) {
    return this.client.get("/api/v1/admin/activity", { params });
  }

  // Referrals
  async getUserReferrals() {
    return this.client.get("/api/v1/referrals");
  }

  async createReferral(email: string, source?: string) {
    return this.client.post("/api/v1/referrals", { email, source: source || 'manual' });
  }

  async claimReferralReward(id: number) {
    return this.client.post(`/api/v1/referrals/${id}/claim`);
  }

  // ============================================================================
  // KNOWLEDGE BASE
  // ============================================================================

  async getKnowledgeBaseArticles(params?: { category?: string; search?: string; limit?: number }) {
    return this.client.get("/api/v1/knowledge-base", { params });
  }

  async getKnowledgeBaseArticle(id: number | string) {
    return this.client.get(`/api/v1/knowledge-base/${id}`);
  }

  async getPopularArticles(params?: { limit?: number }) {
    return this.client.get("/api/v1/knowledge-base/popular", { params });
  }

  async getFeaturedArticles(params?: { limit?: number }) {
    return this.client.get("/api/v1/knowledge-base/featured", { params });
  }

  async getKnowledgeBaseCategories() {
    return this.client.get("/api/v1/knowledge-base/categories");
  }

  async markArticleHelpful(id: number, helpful: boolean) {
    return this.client.post(`/api/v1/knowledge-base/${id}/feedback`, { helpful });
  }

  // ============================================================================
  // UNIVERSITIES (Intelligence System)
  // ============================================================================

  async getCountries() {
    return this.client.get("/api/v1/universities/countries");
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
    return this.client.get("/api/v1/universities/search", { params });
  }

  async getUniversityRecommendations(profile: {
    country?: string;
    budget?: number;
    gpa?: number;
    ielts?: number;
    field?: string;
  }) {
    return this.client.post("/api/v1/universities/recommend", profile);
  }

  async getUniversityById(id: number) {
    return this.client.get(`/api/v1/universities/${id}`);
  }
}

export const apiClient = new ApiClient();

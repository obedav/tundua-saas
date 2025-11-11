/**
 * API Type Definitions
 *
 * Centralized type definitions for all API requests and responses
 * This ensures type safety across the entire application
 */

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'admin' | 'super_admin';
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  current_password?: string;
  new_password?: string;
}

// ============================================================================
// APPLICATION TYPES
// ============================================================================

export interface Application {
  id: number;
  reference_number: string;
  destination_country: string;
  service_tier_name: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  total_amount: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationRequest {
  destination_country: string;
  service_tier_id: number;
  personal_info?: Record<string, unknown>;
  academic_info?: Record<string, unknown>;
}

export interface UpdateApplicationRequest {
  destination_country?: string;
  personal_info?: Record<string, unknown>;
  academic_info?: Record<string, unknown>;
  additional_notes?: string;
}

export interface CalculatePricingRequest {
  service_tier_id: number;
  addon_service_ids?: number[];
  promo_code?: string;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface PaymentTransaction {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'paystack' | 'stripe' | 'mpesa';
  created_at: string;
}

export interface CreateStripeCheckoutRequest {
  application_id: number;
  success_url: string;
  cancel_url: string;
}

export interface InitiateMpesaRequest {
  application_id: number;
  phone_number: string;
}

// ============================================================================
// REFUND TYPES
// ============================================================================

export interface Refund {
  id: number;
  application_id: number;
  refund_reason: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  created_at: string;
}

export interface RequestRefundRequest {
  application_id: number;
  refund_reason: string;
}

export interface SignRefundRequest {
  signature_data: string;
}

// ============================================================================
// ADDON TYPES
// ============================================================================

export interface AddonService {
  id: number;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
}

export interface PurchaseAddonRequest {
  addon_service_id: number;
  application_id: number;
  quantity?: number;
}

export interface AddonOrder {
  id: number;
  addon_service_id: number;
  application_id: number;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface UpdateAddonOrderStatusRequest {
  status: string;
  fulfillment_notes?: string;
  deliverable_url?: string;
  assigned_to?: number;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface UpdateApplicationStatusRequest {
  status: string;
}

export interface AddAdminNotesRequest {
  notes: string;
}

export interface ReviewDocumentRequest {
  status: string;
  notes?: string;
}

export interface ReviewRefundRequest {
  action: 'approve' | 'reject';
  notes?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'admin' | 'super_admin';
  is_active?: boolean;
}

export interface SuspendUserRequest {
  action: 'suspend' | 'unsuspend';
  minutes?: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

// ============================================================================
// REFERRAL TYPES
// ============================================================================

export interface Referral {
  id: number;
  email: string;
  status: 'pending' | 'accepted' | 'rewarded';
  source: string;
  created_at: string;
}

export interface CreateReferralRequest {
  email: string;
  source?: string;
}

// ============================================================================
// KNOWLEDGE BASE TYPES
// ============================================================================

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  views: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarkArticleHelpfulRequest {
  helpful: boolean;
}

// ============================================================================
// QUERY PARAMETER TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface SearchParams {
  search?: string;
  category?: string;
  status?: string;
  limit?: number;
}

export type AdminApplicationParams = PaginationParams & SearchParams;
export type AdminRefundParams = PaginationParams & SearchParams;
export type AdminUserParams = PaginationParams & SearchParams;
export type AddonOrderParams = PaginationParams & SearchParams;

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

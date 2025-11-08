export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: "user" | "admin" | "super_admin";
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  passport_number?: string;
  passport_expiry?: string;
  current_country?: string;
  current_city?: string;
  address?: string;
  postal_code?: string;
  profile_photo_url?: string;
  bio?: string;
  highest_education?: string;
  field_of_study?: string;
  institution_name?: string;
  graduation_year?: number;
  gpa?: number;
  gpa_scale?: string;
  english_test_type?: string;
  english_test_score?: string;
  work_experience_years?: number;
  current_occupation?: string;
}

export interface ServiceTier {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  features: string[];
  max_universities: number;
  includes_essay_review: boolean;
  includes_sop_writing: boolean;
  includes_visa_support: boolean;
  includes_interview_coaching: boolean;
  support_level: string;
  is_active: boolean;
  is_featured: boolean;
}

export interface AddonService {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  delivery_time_days: number;
  is_active: boolean;
  is_featured: boolean;
}

export interface Application {
  id: number;
  reference_number: string;
  user_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  highest_education?: string;
  field_of_study?: string;
  institution_name?: string;
  graduation_year?: number;
  gpa?: number;
  destination_country: string;
  universities: string[];
  program_type?: string;
  intended_major?: string;
  intake_season?: string;
  intake_year?: number;
  service_tier_id: number;
  service_tier_name: string;
  base_price: number;
  addon_services: any[];
  addon_total: number;
  documents_complete: boolean;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  status: "draft" | "submitted" | "payment_pending" | "under_review" | "documents_requested" | "in_progress" | "approved" | "rejected" | "completed" | "cancelled";
  current_step: number;
  completion_percentage: number;
  admin_notes?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  application_id: number;
  user_id: number;
  document_type: string;
  document_name: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  is_verified: boolean;
  verified_by?: number;
  verified_at?: string;
  verification_notes?: string;
  status: "pending" | "under_review" | "approved" | "rejected" | "needs_revision";
  rejection_reason?: string;
  uploaded_at: string;
}

export interface Payment {
  id: number;
  transaction_id: string;
  application_id: number;
  user_id: number;
  amount: number;
  currency: string;
  payment_method: "stripe" | "mpesa" | "paypal" | "bank_transfer" | "other";
  provider_transaction_id?: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  receipt_url?: string;
  paid_at?: string;
  created_at: string;
}

export interface Refund {
  id: number;
  refund_reference: string;
  application_id: number;
  payment_id: number;
  user_id: number;
  refund_amount: number;
  refund_reason: string;
  refund_type: "full" | "partial";
  agreement_signed: boolean;
  agreement_signed_at?: string;
  agreement_pdf_url?: string;
  status: "requested" | "pending_review" | "approved" | "rejected" | "processing" | "completed" | "cancelled";
  reviewed_by?: number;
  reviewed_at?: string;
  admin_notes?: string;
  rejection_reason?: string;
  approved_at?: string;
  refund_deadline?: string;
  business_days_remaining: number;
  refunded_at?: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  channel: "email" | "sms" | "whatsapp" | "in_app" | "push";
  subject?: string;
  message: string;
  status: "pending" | "sent" | "delivered" | "failed" | "bounced";
  sent_at?: string;
  opened: boolean;
  opened_at?: string;
  clicked: boolean;
  clicked_at?: string;
  priority: "low" | "normal" | "high" | "urgent";
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  FileText,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Globe,
  BookOpen,
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import { getAdminApplication } from "@/lib/actions/admin/applications";
import ApplicationStatusManager from "@/components/admin/Applications/ApplicationStatusManager";

interface Application {
  id: number;
  reference_number: string;
  // Personal Info
  first_name: string;
  last_name: string;
  applicant_name: string;
  email: string;
  applicant_email: string;
  phone: string;
  applicant_phone: string;
  nationality?: string;
  passport_number?: string;
  current_country?: string;
  current_city?: string;
  // Academic
  highest_education: string;
  field_of_study: string;
  institution_name: string;
  graduation_year: number;
  gpa: number;
  english_test_type?: string;
  english_test_score?: string;
  // Destination
  destination_country: string;
  universities: string[];
  program_type: string;
  intended_major: string;
  intake_season: string;
  intake_year: number;
  // Service
  service_tier_id: number;
  service_tier_name: string;
  base_price: string;
  addon_services?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  addon_total: string;
  subtotal: string;
  total_amount: string;
  // Status
  status: string;
  payment_status: string;
  payment_method?: string;
  // User Info
  user_id: number;
  user_email: string;
  user_name: string;
  // Timestamps
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  admin_notes?: string;
}

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Verify admin access
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    redirect('/dashboard');
  }

  // Fetch application data
  const data = await getAdminApplication(Number(id));

  if (!data || !data.application) {
    redirect("/dashboard/admin/applications");
  }

  const application: Application = data.application;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; text: string }> = {
      draft: { color: "bg-gray-100 text-gray-700", icon: Clock, text: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-700", icon: Clock, text: "Submitted" },
      payment_pending: { color: "bg-yellow-100 text-yellow-700", icon: AlertCircle, text: "Payment Pending" },
      under_review: { color: "bg-yellow-100 text-yellow-700", icon: AlertCircle, text: "Under Review" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Approved" },
  rejected: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Rejected" },
      completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Completed" },
      cancelled: { color: "bg-gray-100 text-gray-700", icon: XCircle, text: "Cancelled" },
    };

    const badge = badges[status] || badges['draft'];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="h-4 w-4" />
        {badge.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", text: "Pending" },
      paid: { color: "bg-green-100 text-green-700", text: "Paid" },
      failed: { color: "bg-red-100 text-red-700", text: "Failed" },
      refunded: { color: "bg-gray-100 text-gray-700", text: "Refunded" },
    };

    const badge = badges[status] || badges['pending'];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/admin/applications"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.reference_number}</h1>
            <p className="text-gray-600 mt-1">
              Created on {new Date(application.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(application.status)}
            {getPaymentStatusBadge(application.payment_status)}
          </div>
        </div>
      </div>

      {/* Status Management */}
      <ApplicationStatusManager
        applicationId={application.id}
        currentStatus={application.status}
        paymentStatus={application.payment_status}
        adminNotes={application.admin_notes}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" />
              Applicant Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="h-4 w-4" /> Full Name
                </p>
                <p className="font-medium text-gray-900">{application.applicant_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </p>
                <p className="font-medium text-gray-900">{application.email || application.applicant_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Phone
                </p>
                <p className="font-medium text-gray-900">{application.phone || application.applicant_phone || "Not provided"}</p>
              </div>
              {application.nationality && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Globe className="h-4 w-4" /> Nationality
                  </p>
                  <p className="font-medium text-gray-900">{application.nationality}</p>
                </div>
              )}
              {application.passport_number && (
                <div>
                  <p className="text-sm text-gray-600">Passport Number</p>
                  <p className="font-medium text-gray-900">{application.passport_number}</p>
                </div>
              )}
              {application.current_country && (
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="font-medium text-gray-900">
                    {application.current_city && `${application.current_city}, `}{application.current_country}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Background */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary-600" />
              Academic Background
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Education Level</p>
                <p className="font-medium text-gray-900">{application.highest_education || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Field of Study</p>
                <p className="font-medium text-gray-900">{application.field_of_study || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Institution</p>
                <p className="font-medium text-gray-900">{application.institution_name || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Graduation Year</p>
                <p className="font-medium text-gray-900">{application.graduation_year || "Not specified"}</p>
              </div>
              {application.gpa && (
                <div>
                  <p className="text-sm text-gray-600">GPA</p>
                  <p className="font-medium text-gray-900">{application.gpa}/4.0</p>
                </div>
              )}
              {application.english_test_type && (
                <div>
                  <p className="text-sm text-gray-600">English Test</p>
                  <p className="font-medium text-gray-900">
                    {application.english_test_type} - {application.english_test_score}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Destination & Universities */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              Destination & Universities
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Destination Country</p>
                  <p className="font-medium text-gray-900">{application.destination_country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program Type</p>
                  <p className="font-medium text-gray-900 capitalize">{application.program_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Intended Major</p>
                  <p className="font-medium text-gray-900">{application.intended_major}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Intake</p>
                  <p className="font-medium text-gray-900">
                    {application.intake_season} {application.intake_year}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Selected Universities ({application.universities?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {application.universities?.map((uni, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
                    >
                      <BookOpen className="h-3 w-3" />
                      {uni}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add-On Services */}
          {application.addon_services && application.addon_services.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add-On Services</h2>
              <div className="space-y-3">
                {application.addon_services.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-gray-900">
                        {addon.name} {addon.quantity > 1 && `(×${addon.quantity})`}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      ₦{(addon.price * addon.quantity).toLocaleString('en-NG')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary-600" />
              Pricing Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Tier:</span>
                <span className="font-medium text-gray-900">₦{parseFloat(application.base_price).toLocaleString('en-NG')}</span>
              </div>
              <div className="text-xs text-gray-500 pl-4">
                {application.service_tier_name}
              </div>

              {application.addon_total && parseFloat(application.addon_total) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Add-On Services:</span>
                  <span className="font-medium text-gray-900">₦{parseFloat(application.addon_total).toLocaleString('en-NG')}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-primary-600">
                  ₦{parseFloat(application.total_amount).toLocaleString('en-NG')}
                </span>
              </div>

              {application.payment_method && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{application.payment_method}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Timeline
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Created</p>
                  <p className="text-xs text-gray-500">
                    {new Date(application.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {application.submitted_at && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {application.updated_at && application.updated_at !== application.created_at && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/dashboard/admin/documents?application_id=${application.id}`}
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Documents
              </Link>
              <Link
                href={`/dashboard/admin/users/${application.user_id}`}
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View User Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

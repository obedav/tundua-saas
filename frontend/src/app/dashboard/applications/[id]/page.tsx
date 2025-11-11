"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Edit,
  Trash2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface Application {
  id: number;
  reference_number: string;
  // Personal Info
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
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
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params['id']) {
      fetchApplication();
    }
  }, [params['id']]);

  const fetchApplication = async () => {
    try {
      const response = await apiClient.getApplication(Number(params['id']));
      setApplication(response.data.application);
    } catch (error: any) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application");
      router.push("/dashboard/applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    try {
      await apiClient.deleteApplication(Number(params['id']));
      toast.success("Application deleted successfully");
      router.push("/dashboard/applications");
    } catch (error: any) {
      toast.error("Failed to delete application");
    }
  };

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
    const Icon = badge!.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge!.color}`}>
        <Icon className="h-4 w-4" />
        {badge?.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

            {application.status !== "draft" && (
              <Link
                href={`/dashboard/applications/${application.id}/documents`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Documents
              </Link>
            )}

            {application.status === "draft" && (
              <>
                <Link
                  href={`/dashboard/applications/${application.id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{application.applicant_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{application.applicant_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{application.applicant_phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
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
              <div>
                <p className="text-sm text-gray-600">GPA</p>
                <p className="font-medium text-gray-900">{application.gpa || "Not specified"}/4.0</p>
              </div>
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
              <MapPin className="h-5 w-5" />
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
                      <Check className="h-3 w-3" />
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
                      ${(addon.price * addon.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Tier:</span>
                <span className="font-medium text-gray-900">${parseFloat(application.base_price).toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 pl-4">
                {application.service_tier_name}
              </div>

              {application.addon_total && parseFloat(application.addon_total) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Add-On Services:</span>
                  <span className="font-medium text-gray-900">${parseFloat(application.addon_total).toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-primary-600">
                  ${parseFloat(application.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            {application.status === "draft" && (
              <Link
                href={`/dashboard/applications/new?id=${application.id}`}
                className="block w-full mt-6 bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Continue Application
              </Link>
            )}

            {application.payment_status === "pending" && (
              <Link
                href={`/dashboard/applications/${application.id}/payment`}
                className="block w-full mt-6 bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Pay Now
              </Link>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

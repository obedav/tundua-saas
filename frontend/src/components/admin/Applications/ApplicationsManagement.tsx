"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  Users,
  FileText,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface Application {
  id: number;
  reference_number: string;
  applicant_name: string;
  applicant_email: string;
  destination_country: string;
  program_type: string;
  service_tier_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  submitted_at?: string;
}

interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  country: string;
  start_date: string;
  budget?: string;
  source: string;
  status: string;
  lead_score?: number;
  message?: string;
  created_at: string;
}

export default function ApplicationsManagement() {
  const [activeTab, setActiveTab] = useState<"applications" | "leads">("leads");

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appSearchTerm, setAppSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [updatingAppStatus, setUpdatingAppStatus] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [updatingLeadStatus, setUpdatingLeadStatus] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchLeads();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, appSearchTerm, statusFilter, paymentFilter]);

  useEffect(() => {
    filterLeads();
  }, [leads, leadSearchTerm, leadStatusFilter]);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.getAllApplications();
      const apps = response.data?.data?.applications || response.data?.applications || [];
      setApplications(apps);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setAppsLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await apiClient.getAdminLeads({ per_page: 100 });
      const items = response.data?.data?.leads || [];
      setLeads(items);
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLeadsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];
    if (appSearchTerm) {
      const term = appSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.reference_number?.toLowerCase().includes(term) ||
          app.applicant_name?.toLowerCase().includes(term) ||
          app.applicant_email?.toLowerCase().includes(term) ||
          app.destination_country?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") filtered = filtered.filter((app) => app.status === statusFilter);
    if (paymentFilter !== "all") filtered = filtered.filter((app) => app.payment_status === paymentFilter);
    setFilteredApplications(filtered);
  };

  const filterLeads = () => {
    let filtered = [...leads];
    if (leadSearchTerm) {
      const term = leadSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.name?.toLowerCase().includes(term) ||
          l.email?.toLowerCase().includes(term) ||
          l.phone?.toLowerCase().includes(term) ||
          l.country?.toLowerCase().includes(term)
      );
    }
    if (leadStatusFilter !== "all") filtered = filtered.filter((l) => l.status === leadStatusFilter);
    setFilteredLeads(filtered);
  };

  const handleAppStatusUpdate = async (applicationId: number, newStatus: string) => {
    setUpdatingAppStatus(true);
    try {
      await apiClient.updateApplicationStatus(applicationId, newStatus);
      toast.success("Application status updated");
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingAppStatus(false);
    }
  };

  const handleLeadStatusUpdate = async (leadId: number, newStatus: string) => {
    setUpdatingLeadStatus(true);
    try {
      await apiClient.updateLeadStatus(leadId, newStatus);
      toast.success("Lead status updated");
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      setSelectedLead(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update lead status");
    } finally {
      setUpdatingLeadStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; text: string }> = {
      draft: { color: "bg-gray-100 text-gray-700", icon: Clock, text: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-700", icon: Clock, text: "Submitted" },
      payment_pending: { color: "bg-orange-100 text-orange-700", icon: Clock, text: "Payment Pending" },
      under_review: { color: "bg-yellow-100 text-yellow-700", icon: AlertCircle, text: "Under Review" },
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Rejected" },
      completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Completed" },
    };
    const badge = badges[status] || badges["draft"];
    const Icon = badge!.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge!.color}`}>
        <Icon className="h-3 w-3" />
        {badge!.text}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", text: "Pending" },
      paid: { color: "bg-green-100 text-green-700", text: "Paid" },
      failed: { color: "bg-red-100 text-red-700", text: "Failed" },
      refunded: { color: "bg-gray-100 text-gray-700", text: "Refunded" },
    };
    const badge = badges[paymentStatus] || badges["pending"];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge!.color}`}>
        {badge!.text}
      </span>
    );
  };

  const getLeadStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      new: { color: "bg-blue-100 text-blue-700", text: "New" },
      contacted: { color: "bg-yellow-100 text-yellow-700", text: "Contacted" },
      qualified: { color: "bg-purple-100 text-purple-700", text: "Qualified" },
      converted: { color: "bg-green-100 text-green-700", text: "Converted" },
      lost: { color: "bg-red-100 text-red-700", text: "Lost" },
    };
    const badge = badges[status] || badges["new"];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge!.color}`}>
        {badge!.text}
      </span>
    );
  };

  const getScoreBadge = (score?: number) => {
    if (score === undefined || score === null) return null;
    const color = score >= 70 ? "bg-green-100 text-green-700" : score >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600";
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{score}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications &amp; Leads</h1>
        <p className="text-gray-600 mt-1">View and manage student applications and inbound leads</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "leads"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Users className="h-4 w-4" />
            Leads
            {!leadsLoading && (
              <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {leads.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "applications"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FileText className="h-4 w-4" />
            Applications
            {!appsLoading && (
              <span className="ml-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {applications.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* ================================================================ */}
      {/* LEADS TAB                                                        */}
      {/* ================================================================ */}
      {activeTab === "leads" && (
        <>
          {/* Leads Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, country..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            {leadsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No leads found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start / Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {lead.email ? (
                              <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline block">{lead.email}</a>
                            ) : null}
                            {lead.phone ? (
                              <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline text-xs">{lead.phone}</a>
                            ) : null}
                            {!lead.email && !lead.phone ? (
                              <span className="text-gray-400 text-xs">No contact</span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.country}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{lead.start_date}</div>
                          {lead.budget && <div className="text-xs text-gray-500">{lead.budget}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{lead.source}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getScoreBadge(lead.lead_score)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {selectedLead === lead.id ? (
                            <select
                              defaultValue={lead.status}
                              onChange={(e) => handleLeadStatusUpdate(lead.id, e.target.value)}
                              disabled={updatingLeadStatus}
                              onBlur={() => setSelectedLead(null)}
                              autoFocus
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="converted">Converted</option>
                              <option value="lost">Lost</option>
                            </select>
                          ) : (
                            <button onClick={() => setSelectedLead(lead.id)} className="inline-flex items-center gap-1">
                              {getLeadStatusBadge(lead.status)}
                              <ChevronDown className="h-3 w-3 text-gray-400" />
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ================================================================ */}
      {/* APPLICATIONS TAB                                                 */}
      {/* ================================================================ */}
      {activeTab === "applications" && (
        <>
          {/* Applications Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by reference, name, email..."
                  value={appSearchTerm}
                  onChange={(e) => setAppSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            {appsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No applications found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/dashboard/admin/applications/${application.id}`}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {application.reference_number}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{application.applicant_name}</div>
                            <div className="text-gray-500">{application.applicant_email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900">{application.destination_country}</div>
                            <div className="text-gray-500 capitalize">{application.program_type}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            ₦{(application.total_amount || 0).toLocaleString("en-NG")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentBadge(application.payment_status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            {selectedApplication === application.id ? (
                              <select
                                value={application.status}
                                onChange={(e) => handleAppStatusUpdate(application.id, e.target.value)}
                                disabled={updatingAppStatus}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                onBlur={() => setSelectedApplication(null)}
                                autoFocus
                              >
                                <option value="draft">Draft</option>
                                <option value="submitted">Submitted</option>
                                <option value="payment_pending">Payment Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                              </select>
                            ) : (
                              <button
                                onClick={() => setSelectedApplication(application.id)}
                                className="inline-flex items-center gap-1"
                              >
                                {getStatusBadge(application.status)}
                                <ChevronDown className="h-3 w-3 text-gray-400" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/admin/applications/${application.id}`}
                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

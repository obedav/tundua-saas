"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Paperclip,
  Search
} from "lucide-react";

interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  replies_count?: number;
}

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    message: "",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // This will be implemented when backend endpoint is ready
      // const response = await apiClient.getSupportTickets();
      // setTickets(response.data);

      // Mock data for now
      setTickets([
        {
          id: 1,
          subject: "Application status inquiry",
          message: "I would like to know the status of my application #REF-2024-001",
          status: "open",
          priority: "high",
          category: "application",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          replies_count: 2,
        },
      ]);
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load support tickets");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This will be implemented when backend endpoint is ready
      // await apiClient.createSupportTicket(formData);
      toast.success("Support ticket created successfully!");
      setFormData({
        subject: "",
        category: "general",
        priority: "medium",
        message: "",
      });
      setShowNewTicket(false);
      fetchTickets();
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      toast.error(error.response?.data?.error || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { color: "bg-blue-100 text-blue-700", icon: AlertCircle, text: "Open" },
      in_progress: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "In Progress" },
      resolved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Resolved" },
      closed: { color: "bg-gray-100 text-gray-700", icon: CheckCircle, text: "Closed" },
    };
    const badge = badges[status as keyof typeof badges] || badges.open;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge?.color}`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: { color: "bg-gray-100 text-gray-700", text: "Low" },
      medium: { color: "bg-blue-100 text-blue-700", text: "Medium" },
      high: { color: "bg-orange-100 text-orange-700", text: "High" },
      urgent: { color: "bg-red-100 text-red-700", text: "Urgent" },
    };
    const badge = badges[priority as keyof typeof badges] || badges.medium;

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge?.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-2">
            Get help with your applications and account
          </p>
        </div>
        <button
          onClick={() => setShowNewTicket(!showNewTicket)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          New Ticket
        </button>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Support</h3>
              <p className="text-sm text-gray-600">24/7 Response</p>
            </div>
          </div>
          <a
            href="mailto:support@tundua.com"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            support@tundua.com
          </a>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Phone Support</h3>
              <p className="text-sm text-gray-600">Mon-Fri 9AM-5PM</p>
            </div>
          </div>
          <a
            href="tel:+1234567890"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            +1 (234) 567-890
          </a>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-600">Instant Help</p>
            </div>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Start Chat
          </button>
        </div>
      </div>

      {/* New Ticket Form */}
      {showNewTicket && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="application">Application Support</option>
                  <option value="payment">Payment & Billing</option>
                  <option value="documents">Document Issues</option>
                  <option value="technical">Technical Support</option>
                  <option value="account">Account Management</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Brief description of your issue"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Provide detailed information about your issue..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Attachment (UI only for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowNewTicket(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Support Tickets</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No support tickets yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create a ticket if you need help with anything
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {ticket.subject}
                      </h3>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {ticket.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    #{ticket.id.toString().padStart(6, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                  {ticket.replies_count && ticket.replies_count > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {ticket.replies_count} {ticket.replies_count === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                  <span className="text-primary-600 hover:text-primary-700 font-medium ml-auto">
                    View Details →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 border border-primary-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <a
            href="/dashboard/help"
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900 mb-1">
              How long does the application process take?
            </h3>
            <p className="text-sm text-gray-600">
              Learn about typical processing times and what to expect
            </p>
          </a>
          <a
            href="/dashboard/help"
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900 mb-1">
              What documents do I need to upload?
            </h3>
            <p className="text-sm text-gray-600">
              Complete checklist of required documents for your application
            </p>
          </a>
          <a
            href="/dashboard/help"
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900 mb-1">
              How do I track my application status?
            </h3>
            <p className="text-sm text-gray-600">
              Step-by-step guide to monitoring your application progress
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

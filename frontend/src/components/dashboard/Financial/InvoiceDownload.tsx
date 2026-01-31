"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Calendar, Printer, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface Invoice {
  id: number;
  invoice_number: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  status: "paid" | "pending" | "overdue";
  pdf_url?: string;
}

export default function InvoiceDownload() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        // Fetch completed payments and convert to invoices
        const response = await apiClient.getUserPayments();
        const payments = response.data.payments || [];

        // Convert completed payments to invoices
        const completedPayments = payments
          .filter((p: { status: string }) => p.status === 'completed')
          .map((payment: { id: number; transaction_id: string; amount: number; currency: string; created_at: string; application_reference?: string }) => ({
            id: payment.id,
            invoice_number: `INV-${payment.transaction_id}`,
            amount: payment.amount,
            currency: payment.currency || 'NGN',
            date: payment.created_at,
            description: payment.application_reference
              ? `Application ${payment.application_reference}`
              : 'Service Payment',
            status: 'paid' as const,
          }));

        setInvoices(completedPayments);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  const handleDownload = (invoice: Invoice) => {
    // TODO: Implement actual PDF generation/download
    toast.info(`Invoice download coming soon for ${invoice.invoice_number}`);
  };

  const handleEmail = (invoice: Invoice) => {
    toast.info(`Email invoice feature coming soon for ${invoice.invoice_number}`);
  };

  const handlePrint = (invoice: Invoice) => {
    toast.info(`Print invoice feature coming soon for ${invoice.invoice_number}`);
  };

  const getStatusColor = (status: Invoice["status"]) => {
    const colors = {
      paid: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      overdue: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    };
    return colors[status];
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : '₦';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoices & Receipts</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Download or email your invoices</p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        )}

        {!loading && invoices.map((invoice) => (
          <div key={invoice.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{invoice.invoice_number}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{invoice.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(invoice.amount, invoice.currency)}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {/* Date */}
                  <span className="text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(invoice.date).toLocaleDateString()}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => handleDownload(invoice)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>

                    <button
                      onClick={() => handleEmail(invoice)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      title="Email invoice"
                    >
                      <Mail className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handlePrint(invoice)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      title="Print invoice"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && invoices.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No invoices yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Invoices will appear here after you complete a payment</p>
          </div>
        )}
      </div>

      {/* Tax Notice */}
      {invoices.length > 0 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> All invoices are generated automatically and include applicable taxes.
            Keep these for your records and tax purposes.
          </p>
        </div>
      )}
    </div>
  );
}

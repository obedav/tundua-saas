"use client";

import { Download, FileText, Calendar, Printer, Mail } from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: number;
  invoice_number: string;
  amount: number;
  date: string;
  description: string;
  status: "paid" | "pending" | "overdue";
  pdf_url?: string;
}

interface InvoiceDownloadProps {
  invoices?: Invoice[];
}

export default function InvoiceDownload({ invoices = [] }: InvoiceDownloadProps) {
  const handleDownload = (invoice: Invoice) => {
    if (invoice.pdf_url) {
      // TODO: Implement actual download
      toast.success(`Downloading invoice ${invoice.invoice_number}`);
    } else {
      toast.error("Invoice not available for download");
    }
  };

  const handleEmail = (invoice: Invoice) => {
    toast.success(`Invoice ${invoice.invoice_number} will be emailed to you`);
  };

  const handlePrint = (invoice: Invoice) => {
    toast.success(`Opening print dialog for ${invoice.invoice_number}`);
  };

  const getStatusColor = (status: Invoice["status"]) => {
    const colors = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      overdue: "bg-red-100 text-red-700",
    };
    return colors[status];
  };

  // Mock data if none provided
  const displayInvoices = invoices.length > 0 ? invoices : [
    {
      id: 1,
      invoice_number: "INV-2025-0001",
      amount: 299.00,
      date: new Date().toISOString(),
      description: "Premium Service - United States Application",
      status: "paid" as const,
      pdf_url: "/invoices/001.pdf",
    },
    {
      id: 2,
      invoice_number: "INV-2025-0002",
      amount: 599.00,
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      description: "Elite Service - Canada Application",
      status: "paid" as const,
      pdf_url: "/invoices/002.pdf",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Invoices & Receipts</h2>
        <p className="text-sm text-gray-600 mt-1">Download or email your invoices</p>
      </div>

      <div className="divide-y divide-gray-200">
        {displayInvoices.map((invoice) => (
          <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="bg-primary-50 p-3 rounded-lg flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{invoice.invoice_number}</h3>
                    <p className="text-sm text-gray-600 mt-1">{invoice.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₦{invoice.amount.toLocaleString('en-NG')}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {/* Date */}
                  <span className="text-sm text-gray-600 inline-flex items-center gap-1">
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
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      title="Email invoice"
                    >
                      <Mail className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handlePrint(invoice)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
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

        {displayInvoices.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No invoices available</p>
          </div>
        )}
      </div>

      {/* Tax Notice */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> All invoices are generated automatically and include applicable taxes.
          Keep these for your records and tax purposes.
        </p>
      </div>
    </div>
  );
}

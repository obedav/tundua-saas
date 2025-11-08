import BillingHistory from "@/components/dashboard/Financial/BillingHistory";
import PaymentMethods from "@/components/dashboard/Financial/PaymentMethods";
import InvoiceDownload from "@/components/dashboard/Financial/InvoiceDownload";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600 mt-2">Manage your payments, invoices, and payment methods</p>
      </div>

      <BillingHistory />
      <PaymentMethods />
      <InvoiceDownload />
    </div>
  );
}

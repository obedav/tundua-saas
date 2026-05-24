import { Suspense } from "react";
import BillingHistory from "@/components/dashboard/Financial/BillingHistory";
import PaymentMethods from "@/components/dashboard/Financial/PaymentMethods";
import InvoiceDownload from "@/components/dashboard/Financial/InvoiceDownload";
import SubscriptionPanel from "@/components/dashboard/Financial/SubscriptionPanel";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your subscription, payments, invoices, and payment methods</p>
      </div>

      <Suspense>
        <SubscriptionPanel />
      </Suspense>

      <BillingHistory />
      <PaymentMethods />
      <InvoiceDownload />
    </div>
  );
}

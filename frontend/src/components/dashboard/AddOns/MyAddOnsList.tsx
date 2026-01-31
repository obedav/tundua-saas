"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle, Clock, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { getUserAddOns } from "@/lib/actions/addons";

interface PurchasedAddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  purchased_at: string;
  status: "completed" | "in_progress" | "pending";
  deliverables?: {
    name: string;
    url: string;
    uploaded_at: string;
  }[];
  notes?: string;
}

export default function MyAddOnsList() {
  const [addOns, setAddOns] = useState<PurchasedAddOn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedAddOns();
  }, []);

  const fetchPurchasedAddOns = async () => {
    try {
      const response = await getUserAddOns();
      const orders = response?.addons || [];

      // Map backend data to frontend interface
      const mappedAddOns: PurchasedAddOn[] = orders.map((item: any) => ({
        id: item.id,
        name: item.addon_service?.name || "Unknown Service",
        description: item.addon_service?.description || "",
        price: parseFloat(item.price_at_purchase || item.total_amount || 0),
        icon: item.addon_service?.metadata?.icon || "📦",
        purchased_at: item.created_at,
        status: item.status,
        deliverables: item.deliverable_url
          ? [
              {
                name: item.deliverable_url.split("/").pop() || "Deliverable",
                url: item.deliverable_url,
                uploaded_at: item.delivered_at || item.completed_at,
              },
            ]
          : [],
        notes: item.fulfillment_notes || undefined,
      }));

      setAddOns(mappedAddOns);
    } catch (error) {
      console.error("Error fetching purchased add-ons:", error);
      toast.error("Failed to load your purchased add-ons");
      setAddOns([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: PurchasedAddOn["status"]) => {
    const badges = {
      completed: { color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", icon: CheckCircle, text: "Completed" },
      in_progress: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", icon: Clock, text: "In Progress" },
      pending: { color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400", icon: Clock, text: "Pending" },
    };
    return badges[status];
  };

  const totalSpent = addOns.reduce((sum, addon) => sum + addon.price, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (addOns.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Add-Ons Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven&apos;t purchased any add-on services yet. Browse our services to enhance your application.
        </p>
        <a
          href="/dashboard/addons"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Browse Add-On Services
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Add-On Services</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your purchased services and download deliverables</p>
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg px-6 py-3">
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">Total Spent</p>
          <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">₦{totalSpent.toLocaleString('en-NG')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {addOns.filter(a => a.status === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {addOns.filter(a => a.status === "in_progress").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {addOns.filter(a => a.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add-Ons List */}
      <div className="space-y-4">
        {addOns.map((addon) => {
          const statusBadge = getStatusBadge(addon.status);
          const StatusIcon = statusBadge.icon;

          return (
            <div key={addon.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl">{addon.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{addon.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{addon.description}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusBadge.text}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Purchased {new Date(addon.purchased_at).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">₦{addon.price.toLocaleString('en-NG')}</span>
                  </div>

                  {/* Notes */}
                  {addon.notes && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-300">{addon.notes}</p>
                    </div>
                  )}

                  {/* Deliverables */}
                  {addon.deliverables && addon.deliverables.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Deliverables</h4>
                      <div className="space-y-2">
                        {addon.deliverables.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Uploaded {new Date(file.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {addOns.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No add-on services yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse our add-on services to enhance your application
            </p>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Browse Add-Ons
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

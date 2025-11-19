"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { SkeletonList } from "@/components/ui";
import AllApplicationsList from "@/components/dashboard/Applications/AllApplicationsList";
import EmptyApplicationState from "@/components/dashboard/Applications/EmptyApplicationState";

interface Application {
  id: number;
  reference_number: string;
  destination_country: string;
  service_tier_name: string;
  status: string;
  total_amount: string;
  created_at: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.getApplications();
      setApplications(response.data.applications || []);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Page Header Skeleton */}
        <div>
          <div className="h-9 w-64 bg-gray-200 rounded-lg animate-skeleton mb-2" />
          <div className="h-6 w-96 bg-gray-100 rounded-lg animate-skeleton" />
        </div>

        {/* Applications List Skeleton */}
        <SkeletonList items={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">View and manage all your study abroad applications</p>
      </div>

      {applications.length === 0 ? (
        <EmptyApplicationState type="all" />
      ) : (
        <AllApplicationsList applications={applications} />
      )}
    </div>
  );
}

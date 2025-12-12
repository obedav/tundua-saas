import { getApplications } from "@/lib/actions/applications";
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

/**
 * Server Component - Applications List Page
 *
 * Fetches all user applications server-side for optimal performance
 */
export default async function ApplicationsPage() {
  // Fetch applications on the server
  const response = await getApplications();
  const applications: Application[] = response?.applications || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Applications</h1>
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

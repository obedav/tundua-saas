import { getCurrentUser } from "@/lib/actions/auth";
import { getAdminDashboardStats, getAdminApplications } from "@/lib/actions/admin";
import { redirect } from "next/navigation";

export default async function AdminTestPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'admin' && user.role !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch data
  const stats = await getAdminDashboardStats();
  const applicationsData = await getAdminApplications({ limit: 10 });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Data Test Page</h1>

      <div className="space-y-8">
        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Stats</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>

        {/* Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Applications Data</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Raw response structure:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(applicationsData, null, 2)}
          </pre>
        </div>

        {/* Parsed Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Parsed Applications</h2>
          {(() => {
            const apps = applicationsData?.data?.applications || applicationsData?.applications || [];
            return (
              <div>
                <p className="mb-2">Found: <strong>{apps.length}</strong> applications</p>
                {apps.length > 0 && (
                  <div className="space-y-2">
                    {apps.map((app: any) => (
                      <div key={app.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <p><strong>ID:</strong> {app.id}</p>
                        <p><strong>Reference:</strong> {app.reference_number}</p>
                        <p><strong>Status:</strong> {app.status}</p>
                        <p><strong>Applicant:</strong> {app.applicant_name || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      <div className="mt-8">
        <a
          href="/dashboard/admin"
          className="text-blue-600 hover:underline"
        >
          ← Back to Admin Dashboard
        </a>
      </div>
    </div>
  );
}

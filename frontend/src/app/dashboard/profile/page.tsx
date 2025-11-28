import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import ProfileForm from "./ProfileForm";

/**
 * Server Component - Profile Page
 * Fetches user data server-side and renders profile form
 */
export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-2xl font-bold">
            {user.first_name?.[0]}
            {user.last_name?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {user.role === "admin" ? "Admin" : "User"}
              </span>
              {user.email_verified && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form (Client Component) */}
        <ProfileForm user={user} />
      </div>

      {/* Account Info */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            Member since:{" "}
            {(user as any)?.created_at
              ? new Date((user as any).created_at).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        {(user as any)?.last_login && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              Last login: {new Date((user as any).last_login).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Additional Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Account Actions
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Two-Factor Authentication
          </button>
          <button className="w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

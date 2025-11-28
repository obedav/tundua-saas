/**
 * Loading state for profile page
 */
export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div>
        <div className="h-9 w-48 bg-gray-200 rounded-lg animate-skeleton mb-2" />
        <div className="h-6 w-96 bg-gray-100 rounded-lg animate-skeleton" />
      </div>

      {/* Profile Card Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="h-20 w-20 rounded-full bg-gray-200 animate-skeleton" />
          <div className="flex-1">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-skeleton mb-2" />
            <div className="h-5 w-64 bg-gray-100 rounded-lg animate-skeleton mb-3" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-100 rounded-full animate-skeleton" />
              <div className="h-6 w-20 bg-gray-100 rounded-full animate-skeleton" />
            </div>
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-skeleton mb-2" />
              <div className="h-10 w-full bg-gray-100 rounded-lg animate-skeleton" />
            </div>
            <div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-skeleton mb-2" />
              <div className="h-10 w-full bg-gray-100 rounded-lg animate-skeleton" />
            </div>
          </div>
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-skeleton mb-2" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-skeleton" />
          </div>
          <div>
            <div className="h-5 w-40 bg-gray-200 rounded animate-skeleton mb-2" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-skeleton" />
          </div>
          <div className="flex justify-end">
            <div className="h-11 w-32 bg-gray-200 rounded-lg animate-skeleton" />
          </div>
        </div>
      </div>

      {/* Account Info Skeleton */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-3">
        <div className="h-6 w-48 bg-gray-200 rounded animate-skeleton mb-4" />
        <div className="h-5 w-64 bg-gray-100 rounded animate-skeleton" />
        <div className="h-5 w-56 bg-gray-100 rounded animate-skeleton" />
      </div>

      {/* Additional Settings Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-skeleton mb-4" />
        <div className="space-y-3">
          <div className="h-12 w-full bg-gray-100 rounded-lg animate-skeleton" />
          <div className="h-12 w-full bg-gray-100 rounded-lg animate-skeleton" />
          <div className="h-12 w-full bg-gray-100 rounded-lg animate-skeleton" />
        </div>
      </div>
    </div>
  );
}

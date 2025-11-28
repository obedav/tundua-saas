import { SkeletonList } from "@/components/ui";

/**
 * Loading state for applications page
 */
export default function ApplicationsLoading() {
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

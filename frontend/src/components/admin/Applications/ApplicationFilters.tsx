"use client";

import { Filter } from "lucide-react";

export default function ApplicationFilters() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
      </div>
      {/* Filter options will be implemented */}
    </div>
  );
}

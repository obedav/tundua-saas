import AvailableAddOns from "@/components/dashboard/AddOns/AvailableAddOns";
import AIServicesCards from "@/components/dashboard/AddOns/AIServicesCards";

export default function AddOnsPage() {
  return (
    <div className="space-y-12">
      {/* AI Services Section */}
      <AIServicesCards />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            All Add-On Services
          </span>
        </div>
      </div>

      {/* Traditional Add-Ons Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          All Services
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse all available add-on services including AI and traditional options
        </p>
        <AvailableAddOns />
      </div>
    </div>
  );
}

import AvailableAddOns from "@/components/dashboard/AddOns/AvailableAddOns";

export default function AddOnsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add-On Services</h1>
        <p className="text-gray-600 mt-2">Enhance your application with professional services</p>
      </div>

      <AvailableAddOns />
    </div>
  );
}

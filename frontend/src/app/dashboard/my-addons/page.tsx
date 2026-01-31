import MyAddOnsList from "@/components/dashboard/AddOns/MyAddOnsList";

export default function MyAddOnsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Add-On Services</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track your purchased services and download deliverables</p>
      </div>

      <MyAddOnsList />
    </div>
  );
}

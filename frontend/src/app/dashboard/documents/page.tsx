import AllDocumentsManager from "@/components/dashboard/Documents/AllDocumentsManager";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Documents</h1>
        <p className="text-gray-600 mt-2">View and manage documents from all your applications</p>
      </div>

      <AllDocumentsManager />
    </div>
  );
}

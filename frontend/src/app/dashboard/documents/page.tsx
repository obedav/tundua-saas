import DocumentVault from "@/components/dashboard/Documents/DocumentVault";
import DocumentUploader from "@/components/dashboard/Documents/DocumentUploader";

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600 mt-2">Upload and manage your application documents</p>
      </div>

      <DocumentUploader />
      <DocumentVault />
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EnhancedDocumentManager from "@/components/dashboard/Documents/EnhancedDocumentManager";

export default function DocumentsPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/applications/${params['id']}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Application
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Documents</h1>
          <p className="text-gray-600 mt-1">Upload and manage your application documents</p>
        </div>
      </div>

      {/* Enhanced Document Manager */}
      <EnhancedDocumentManager applicationId={Number(params['id'])} />
    </div>
  );
}

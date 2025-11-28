"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteApplicationAction } from "@/lib/actions/applications";

export default function DeleteApplicationButton({ applicationId }: { applicationId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    try {
      const result = await deleteApplicationAction(applicationId);

      if (result.success) {
        toast.success("Application deleted successfully");
        router.push("/dashboard/applications");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete application");
      }
    } catch (error: any) {
      toast.error("Failed to delete application");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  );
}

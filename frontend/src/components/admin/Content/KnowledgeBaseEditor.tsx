"use client";

import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";

export default function KnowledgeBaseEditor() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Editor</h1>
          <p className="text-gray-600 mt-1">Manage help articles and FAQs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus className="h-4 w-4" />
          New Article
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-2 text-gray-400" />
          <p>No articles yet</p>
          <p className="text-sm mt-1">Create your first knowledge base article</p>
        </div>
      </div>
    </div>
  );
}

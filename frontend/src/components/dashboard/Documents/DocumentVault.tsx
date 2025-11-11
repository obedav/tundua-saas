"use client";

import { useState } from "react";
import { FileText, Download, Eye, Trash2, Upload, Search } from "lucide-react";

interface Document {
  id: number;
  name: string;
  type: string;
  size: number;
  uploaded_at: string;
  application_reference?: string;
  status: "pending" | "approved" | "rejected";
  url?: string;
}

interface DocumentVaultProps {
  documents?: Document[];
}

export default function DocumentVault({ documents = [] }: DocumentVaultProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: Document["status"]) => {
    const badges = {
      pending: { color: "bg-yellow-100 text-yellow-700", text: "Pending" },
      approved: { color: "bg-green-100 text-green-700", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", text: "Rejected" },
    };
    return badges[status];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Document Vault</h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="passport">Passport</option>
            <option value="transcript">Transcript</option>
            <option value="recommendation">Recommendation Letter</option>
            <option value="essay">Essay</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      <div className="divide-y divide-gray-200">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No documents found</p>
            <button className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const statusBadge = getStatusBadge(doc.status);
            return (
              <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      {doc.application_reference && (
                        <>
                          <span>•</span>
                          <span>{doc.application_reference}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors" title="Preview">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Download">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

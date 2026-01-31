"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface DocumentType {
  value: string;
  label: string;
}

interface FileWithMeta {
  file: File;
  documentType: string;
  documentName?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadedDocument {
  id: number;
  document_type: string;
  document_name: string;
  file_size: number;
  status: string;
  uploaded_at: string;
}

interface DocumentUploaderProps {
  applicationId: number;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  onUploadComplete?: (documents: UploadedDocument[]) => void;
}

export default function DocumentUploader({
  applicationId,
  acceptedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
  maxSizeMB = 10,
  onUploadComplete,
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");

  // Fetch document types on mount
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await apiClient.getDocumentTypes();
        if (response.data.success) {
          setDocumentTypes(response.data.document_types);
          if (response.data.document_types.length > 0) {
            setSelectedType(response.data.document_types[0].value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch document types:", error);
        // Fallback document types
        setDocumentTypes([
          { value: 'passport', label: 'Passport / ID' },
          { value: 'transcript', label: 'Academic Transcript' },
          { value: 'degree_certificate', label: 'Degree Certificate' },
          { value: 'recommendation_letter', label: 'Recommendation Letter' },
          { value: 'personal_statement', label: 'Personal Statement / Essay' },
          { value: 'cv_resume', label: 'CV / Resume' },
          { value: 'english_test', label: 'English Test Certificate (IELTS/TOEFL)' },
          { value: 'financial_document', label: 'Financial Document / Bank Statement' },
          { value: 'other', label: 'Other Document' },
        ]);
        setSelectedType('passport');
      }
    };
    fetchDocumentTypes();
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`${file.name} is too large. Maximum size is ${maxSizeMB}MB`);
      return false;
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      toast.error(`${file.name} has an unsupported file type`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(validateFile);
    const filesWithMeta: FileWithMeta[] = validFiles.map(file => ({
      file,
      documentType: selectedType,
      status: 'pending'
    }));
    setFiles((prev) => [...prev, ...filesWithMeta]);
  }, [selectedType, validateFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(validateFile);
      const filesWithMeta: FileWithMeta[] = validFiles.map(file => ({
        file,
        documentType: selectedType,
        status: 'pending'
      }));
      setFiles((prev) => [...prev, ...filesWithMeta]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileType = (index: number, documentType: string) => {
    setFiles((prev) => prev.map((f, i) =>
      i === index ? { ...f, documentType } : f
    ));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (!applicationId) {
      toast.error("No application selected");
      return;
    }

    setUploading(true);
    const uploadedDocs: UploadedDocument[] = [];
    let hasErrors = false;

    // Upload files sequentially
    for (let i = 0; i < files.length; i++) {
      const fileWithMeta = files[i];
      if (!fileWithMeta) continue;

      // Skip already uploaded files
      if (fileWithMeta.status === 'success') continue;

      // Update status to uploading
      setFiles(prev => prev.map((f, idx) =>
        idx === i ? { ...f, status: 'uploading' as const } : f
      ));

      try {
        const formData = new FormData();
        formData.append('file', fileWithMeta.file);
        formData.append('application_id', applicationId.toString());
        formData.append('document_type', fileWithMeta.documentType);
        formData.append('document_name', fileWithMeta.documentName ?? fileWithMeta.file.name);

        const response = await apiClient.uploadDocument(formData);

        if (response.data.success) {
          uploadedDocs.push(response.data.document);
          setFiles(prev => prev.map((f, idx) =>
            idx === i ? { ...f, status: 'success' as const } : f
          ));
        } else {
          throw new Error(response.data.error || 'Upload failed');
        }
      } catch (error) {
        hasErrors = true;
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'error' as const, error: errorMessage } : f
        ));
        toast.error(`Failed to upload ${fileWithMeta.file.name}: ${errorMessage}`);
      }
    }

    setUploading(false);

    if (uploadedDocs.length > 0) {
      toast.success(`Successfully uploaded ${uploadedDocs.length} file(s)`);
      onUploadComplete?.(uploadedDocs);

      // Remove successfully uploaded files from list
      if (!hasErrors) {
        setFiles([]);
      } else {
        setFiles(prev => prev.filter(f => f.status !== 'success'));
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Documents</h2>

      {/* Document Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Document Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {documentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
        }`}
      >
        <Upload
          className={`h-12 w-12 mx-auto mb-4 ${
            dragActive ? "text-primary-600" : "text-gray-400 dark:text-gray-500"
          }`}
        />
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Supported formats: {acceptedTypes.join(", ")} (Max {maxSizeMB}MB)
        </p>
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 cursor-pointer transition-colors"
        >
          <Upload className="h-5 w-5" />
          Select Files
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Selected Files ({files.length})
          </h3>
          {files.map((fileWithMeta, index) => (
            <div
              key={index}
              className={`p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border ${
                fileWithMeta.status === 'error'
                  ? 'border-red-300 dark:border-red-700'
                  : fileWithMeta.status === 'success'
                  ? 'border-green-300 dark:border-green-700'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {fileWithMeta.file.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatFileSize(fileWithMeta.file.size)}
                  </p>
                </div>

                {/* Status indicator */}
                {fileWithMeta.status === 'uploading' && (
                  <Loader2 className="h-5 w-5 text-primary-500 animate-spin flex-shrink-0" />
                )}
                {fileWithMeta.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                {fileWithMeta.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                {fileWithMeta.status === 'pending' && (
                  <CheckCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}

                {/* Remove button (only for pending/error status) */}
                {(fileWithMeta.status === 'pending' || fileWithMeta.status === 'error') && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    disabled={uploading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Document type selector for each file */}
              {fileWithMeta.status === 'pending' && (
                <div className="mt-2">
                  <select
                    value={fileWithMeta.documentType}
                    onChange={(e) => updateFileType(index, e.target.value)}
                    className="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={uploading}
                  >
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Error message */}
              {fileWithMeta.status === 'error' && fileWithMeta.error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fileWithMeta.error}
                </p>
              )}
            </div>
          ))}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || files.every(f => f.status === 'success')}
            className="w-full mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${files.filter(f => f.status !== 'success').length} File(s)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

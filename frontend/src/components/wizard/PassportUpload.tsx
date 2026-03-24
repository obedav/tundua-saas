"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Check, Loader2, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { processPassportImage, PassportData } from '@/lib/passport-ocr';
import { toast } from 'sonner';

interface PassportUploadProps {
  onDataExtracted: (data: PassportData) => void;
}

export default function PassportUpload({ onDataExtracted }: PassportUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<PassportData | null>(null);
  const [showTips, setShowTips] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsProcessing(true);
    try {
      const data = await processPassportImage(file);

      if (data && (data.mrzValid || data.confidence >= 40)) {
        setExtractedData(data);
        onDataExtracted(data);
        toast.success(data.mrzValid
          ? `Passport verified! ${data.confidence}% confidence`
          : data.confidence >= 60
          ? `Data extracted! ${data.confidence}% confidence`
          : `Partial data extracted (${data.confidence}%). Please verify fields.`
        );
      } else if (data) {
        setExtractedData(data);
        onDataExtracted(data);
        toast.warning(`Low confidence (${data.confidence}%). Please verify all fields.`);
      } else {
        toast.error('Could not read passport. Please enter details manually.');
      }
    } catch (error) {
      const msg = error instanceof Error && error.message.includes("internet")
        ? 'Internet required for OCR. Enter details manually.'
        : 'Scan failed. Please enter details manually.';
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [onDataExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`relative rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.01]'
            : extractedData
            ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        } ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative">
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
              <Camera className="h-4 w-4 text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Scanning passport...</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This takes a few seconds</p>
            </div>
          </div>
        ) : preview && extractedData ? (
          <div className="flex items-center gap-4 text-left">
            <img src={preview} alt="Passport" className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border-2 border-green-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-green-700 dark:text-green-400 text-sm">Data extracted ({extractedData.confidence}%)</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {extractedData.firstName} {extractedData.lastName} &bull; {extractedData.passportNumber || 'No passport #'}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">Tap to re-scan</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {isDragActive ? 'Drop passport here' : 'Upload passport photo'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">JPG or PNG &bull; Photo of bio page</p>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Data Summary - Compact */}
      {extractedData && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {[
              ['Name', `${extractedData.firstName} ${extractedData.lastName}`],
              ['Passport', extractedData.passportNumber || 'N/A'],
              ['Nationality', extractedData.nationality],
              ['DOB', extractedData.dateOfBirth],
              ['Gender', extractedData.gender],
              ['Expires', extractedData.expiryDate],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-1.5">
                <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{label}:</span>
                <span className="font-medium text-gray-900 dark:text-gray-200 capitalize truncate">{value || '—'}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
            {extractedData.mrzValid ? 'MRZ verified (ICAO 9303)' : 'Please verify all details'}
          </p>
        </div>
      )}

      {/* Collapsible Tips */}
      <button
        type="button"
        onClick={() => setShowTips(!showTips)}
        className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        {showTips ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {showTips ? 'Hide tips' : 'Tips for best results'}
      </button>
      {showTips && (
        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-5 list-disc">
          <li>Good lighting, no glare or shadows</li>
          <li>Include the MRZ (2 lines at bottom)</li>
          <li>All text clearly visible</li>
        </ul>
      )}
    </div>
  );
}

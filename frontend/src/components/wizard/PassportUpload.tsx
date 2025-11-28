"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { processPassportImage, PassportData } from '@/lib/passport-ocr';
import { toast } from 'sonner';

interface PassportUploadProps {
  onDataExtracted: (data: PassportData) => void;
}

export default function PassportUpload({ onDataExtracted }: PassportUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<PassportData | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Process passport
    setIsProcessing(true);
    try {
      console.log("🔍 Starting passport OCR process...");
      const data = await processPassportImage(file);

      // Accept data if:
      // 1. MRZ is valid (100% reliable), OR
      // 2. Fallback extraction succeeded with confidence >= 40% (relaxed from 50%)
      if (data && (data.mrzValid || data.confidence >= 40)) {
        setExtractedData(data);
        onDataExtracted(data);

        if (data.mrzValid) {
          toast.success(`✅ Passport scanned via MRZ! Confidence: ${data.confidence}%`);
        } else if (data.confidence >= 60) {
          toast.success(`✅ Passport data extracted! Confidence: ${data.confidence}%`);
        } else {
          toast.warning(`⚠️ Partial data extracted (${data.confidence}%). Please verify and fill missing fields.`);
        }
      } else if (data) {
        // Still extract partial data but warn user
        setExtractedData(data);
        onDataExtracted(data);
        toast.warning(`⚠️ Low confidence (${data.confidence}%). Please verify all fields carefully.`);
      } else {
        console.error("❌ Passport OCR failed - check browser console for details");
        toast.error('❌ Could not read passport. Please check the console for details and enter data manually.');
      }
    } catch (error) {
      console.error("💥 Passport processing exception:", error);

      // Check for specific error types
      if (error instanceof Error) {
        if (error.message.includes("internet connection")) {
          toast.error('🌐 Internet required for OCR. Please connect or enter details manually below.');
        } else if (error.message.includes("Canvas")) {
          toast.error('⚠️ Image processing failed. Try a different image or enter manually.');
        } else {
          toast.error('OCR failed - please enter passport details manually below');
        }
      } else {
        toast.error('OCR failed - please enter passport details manually below');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [onDataExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <div>
              <p className="text-lg font-medium">Scanning passport...</p>
              <p className="text-sm text-gray-500">Processing image with OCR... (15-30 seconds)</p>
              <p className="text-xs text-gray-400 mt-2">Please wait, this takes a moment</p>
            </div>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="Passport preview" className="max-h-40 rounded" />
            {extractedData && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-medium">Data extracted successfully!</span>
              </div>
            )}
            <p className="text-sm text-gray-500">Click to upload a different image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">Upload passport photo page</p>
              <p className="text-sm text-gray-500">
                {isDragActive ? 'Drop your passport here' : 'Drag & drop or click to browse'}
              </p>
            </div>
            <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
          </div>
        )}
      </div>

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-green-800 font-medium">
            <Check className="h-5 w-5" />
            <span>Passport Information Extracted</span>
            <span className="ml-auto text-sm">Confidence: {extractedData.confidence}%</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>{' '}
              <span className="font-medium">{extractedData.firstName} {extractedData.lastName}</span>
            </div>
            <div>
              <span className="text-gray-600">Passport #:</span>{' '}
              <span className="font-medium">{extractedData.passportNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Nationality:</span>{' '}
              <span className="font-medium">{extractedData.nationality}</span>
            </div>
            <div>
              <span className="text-gray-600">Date of Birth:</span>{' '}
              <span className="font-medium">{extractedData.dateOfBirth}</span>
            </div>
            <div>
              <span className="text-gray-600">Gender:</span>{' '}
              <span className="font-medium capitalize">{extractedData.gender}</span>
            </div>
            <div>
              <span className="text-gray-600">Expiry Date:</span>{' '}
              <span className="font-medium">{extractedData.expiryDate}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {extractedData.mrzValid ? (
              <span>✓ MRZ validated according to ICAO 9303 standard</span>
            ) : (
              <span>⚠️ Extracted from readable text - Please verify all details are correct</span>
            )}
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <AlertCircle className="h-4 w-4 inline mr-2" />
        <strong>Passport OCR Scanner:</strong>
        <ul className="mt-2 ml-6 list-disc space-y-1 text-xs">
          <li><strong className="text-blue-900">Internet connection required</strong> (downloads 3MB OCR model on first use)</li>
          <li>Take photo in good lighting with all text visible</li>
          <li>Include the Machine Readable Zone (MRZ) - 2 lines at the bottom</li>
          <li>Avoid glare, shadows, or reflections</li>
          <li>Processing takes 15-30 seconds - please be patient</li>
          <li className="text-blue-900"><strong>No internet? Enter details manually below instead</strong></li>
        </ul>
      </div>
    </div>
  );
}

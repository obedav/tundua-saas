"use client";

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { FileText, Check, X } from 'lucide-react';

interface EAgreementModalProps {
  applicationRef: string;
  refundAmount: number;
  onSigned: (signatureData: string, agreementPdfUrl: string) => void;
  onCancel: () => void;
}

export default function EAgreementModal({
  applicationRef,
  refundAmount,
  onSigned,
  onCancel,
}: EAgreementModalProps) {
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
  };

  const generateAgreementPDF = (signatureDataUrl: string): Promise<Blob> => {
    return new Promise((resolve) => {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('TUNDUA REFUND E-AGREEMENT', 105, 20, { align: 'center' });

      // Agreement details
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Application Reference: ${applicationRef}`, 20, 40);
      doc.text(`Refund Amount: NGN ₦${refundAmount.toLocaleString('en-NG')}`, 20, 50);
      doc.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 60);

      // Agreement text
      doc.setFontSize(10);
      const agreementText = `
I, the undersigned, hereby request a refund for my study abroad application.

I understand and agree to the following terms:

1. PROCESSING TIME: Refund will be processed within 90 business days from approval date.

2. ELIGIBILITY: Refunds are only available for applications that have not been
   submitted to universities or where no significant work has been completed.

3. DEDUCTIONS: Administrative fees and completed service costs may be deducted from
   the refund amount.

4. NON-REFUNDABLE ITEMS:
   - Application fees already paid to universities
   - Completed add-on services (SOP writing, document translation, etc.)
   - Service costs incurred before refund request

5. PAYMENT METHOD: Refund will be processed to the original payment method or
   via bank transfer.

6. CANCELLATION OF SERVICES: Upon refund approval, all pending services will be
   cancelled and access to the platform will be limited.

7. FINAL DECISION: Tundua reserves the right to approve or reject refund requests
   based on the completion status of services.

8. LEGAL AGREEMENT: This agreement is binding and constitutes a legal contract
   between the applicant and Tundua Education Services.

By signing below, I acknowledge that I have read, understood, and agree to these terms.
`;

      const splitText = doc.splitTextToSize(agreementText, 170);
      doc.text(splitText, 20, 75);

      // Signature
      doc.text('Applicant Signature:', 20, 220);
      if (signatureDataUrl) {
        doc.addImage(signatureDataUrl, 'PNG', 20, 225, 80, 30);
      }

      doc.text(`Signed on: ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}`, 20, 265);

      // Footer
      doc.setFontSize(8);
      doc.text('Tundua Education Services | www.tundua.com | support@tundua.com', 105, 285, {
        align: 'center',
      });

      // Convert to blob
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  };

  const handleSign = async () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      alert('Please provide your signature');
      return;
    }

    if (!agreed) {
      alert('Please accept the terms to continue');
      return;
    }

    setIsSigning(true);

    try {
      // Get signature as base64
      const signatureDataUrl = signaturePadRef.current.toDataURL();

      // Generate PDF
      const pdfBlob = await generateAgreementPDF(signatureDataUrl);

      // Upload PDF to backend
      const formData = new FormData();
      formData.append('file', pdfBlob, `refund-agreement-${applicationRef}.pdf`);
      formData.append('application_ref', applicationRef);

      const response = await fetch('/api/refunds/upload-agreement', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onSigned(signatureDataUrl, data.agreement_url);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      alert('Failed to process signature. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Refund E-Agreement
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Agreement Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Application:</span>
              <span className="font-semibold">{applicationRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Refund Amount:</span>
              <span className="font-semibold text-green-600">NGN ₦{refundAmount.toLocaleString('en-NG')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">{format(new Date(), 'MMMM dd, yyyy')}</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-3">Terms & Conditions</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>1. PROCESSING TIME:</strong> Refund will be processed within 90 business
                days from approval date.
              </p>
              <p>
                <strong>2. ELIGIBILITY:</strong> Refunds are only available for applications that
                have not been submitted to universities.
              </p>
              <p>
                <strong>3. DEDUCTIONS:</strong> Administrative fees and completed services may be
                deducted.
              </p>
              <p>
                <strong>4. NON-REFUNDABLE:</strong> Application fees paid to universities and
                completed add-on services.
              </p>
              <p>
                <strong>5. CANCELLATION:</strong> All pending services will be cancelled upon
                refund approval.
              </p>
            </div>
          </div>

          {/* Signature Pad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Signature *
            </label>
            <div className="border-2 border-gray-300 rounded-lg bg-white">
              <SignatureCanvas
                ref={signaturePadRef}
                canvasProps={{
                  className: 'w-full h-40',
                }}
                backgroundColor="white"
              />
            </div>
            <button
              onClick={clearSignature}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Signature
            </button>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I have read and agree to the refund terms and conditions. I understand that this
              agreement is legally binding.
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSign}
              disabled={isSigning || !agreed}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
                ${
                  !agreed || isSigning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              <Check className="h-5 w-5" />
              {isSigning ? 'Processing...' : 'Sign & Submit Refund Request'}
            </button>
            <button
              onClick={onCancel}
              disabled={isSigning}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

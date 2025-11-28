-- ============================================================================
-- TUNDUA SAAS - KNOWLEDGE BASE ARTICLES SEEDER
-- ============================================================================
-- Created: 2025-11-08
-- Purpose: Populate knowledge_base_articles with sample help articles
-- Articles: 15 comprehensive articles across all categories
-- ============================================================================

-- Clear existing articles (OPTIONAL - USE WITH CAUTION IN PRODUCTION!)
-- DELETE FROM knowledge_base_articles;

-- ============================================================================
-- CATEGORY: APPLICATIONS (5 articles)
-- ============================================================================

INSERT INTO knowledge_base_articles (
    title, slug, content, excerpt, category, tags, author_id,
    is_published, is_featured, view_count, helpful_count, not_helpful_count,
    metadata, published_at
) VALUES

-- Article 1: How to Submit a Complete Application
(
    'How to Submit a Complete Application',
    'how-to-submit-complete-application',
    '<h2>Complete Application Submission Guide</h2>

<p>Submitting a complete application is crucial for a smooth processing experience. Follow these steps to ensure your application is ready for submission.</p>

<h3>Before You Submit</h3>
<ol>
    <li><strong>Review All Sections:</strong> Ensure every required field is filled out accurately.</li>
    <li><strong>Upload Documents:</strong> All required documents must be uploaded in the correct format (PDF, JPG, PNG).</li>
    <li><strong>Double-Check Information:</strong> Verify your personal details, especially passport information and contact details.</li>
    <li><strong>Choose Your Service Tier:</strong> Select the package that best fits your needs (Basic, Premium, or Elite).</li>
</ol>

<h3>Submission Process</h3>
<ol>
    <li>Click "Review Application" on your dashboard</li>
    <li>Go through each section and confirm accuracy</li>
    <li>Click "Submit for Processing"</li>
    <li>Complete the payment process</li>
    <li>You''ll receive a confirmation email with your reference number</li>
</ol>

<h3>After Submission</h3>
<ul>
    <li>Track your application status on the dashboard</li>
    <li>Respond promptly to any document requests</li>
    <li>Check your email regularly for updates</li>
</ul>

<div class="alert alert-info">
    <strong>Pro Tip:</strong> Submit your application at least 6-8 months before your intended start date for the best chances of success.
</div>',
    'Learn how to submit a complete application with all required documents and information for faster processing.',
    'Applications',
    '["getting-started", "submission", "process", "requirements"]',
    1,
    TRUE,
    TRUE,
    1245,
    123,
    2,
    '{"related_articles": [2, 3], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- Article 2: Understanding Application Status
(
    'Tracking Your Application Status',
    'tracking-application-status',
    '<h2>Application Status Guide</h2>

<p>Understanding your application status helps you know what to expect at each stage of the process.</p>

<h3>Status Meanings</h3>

<h4>1. Draft</h4>
<p>Your application is still being prepared. You can edit and add information.</p>

<h4>2. Submitted</h4>
<p>Your application has been submitted and payment is pending or processing.</p>

<h4>3. Under Review</h4>
<p>Our team is reviewing your application and documents. This typically takes 3-5 business days.</p>

<h4>4. Documents Requested</h4>
<p>We need additional documents from you. Check your email and dashboard for details.</p>

<h4>5. Processing</h4>
<p>Your application is being prepared for submission to universities/visa offices.</p>

<h4>6. Completed</h4>
<p>Your application has been submitted to the relevant institutions. You''ll receive confirmation details.</p>

<h3>Expected Timelines</h3>
<ul>
    <li><strong>Basic Tier:</strong> 7-10 business days</li>
    <li><strong>Premium Tier:</strong> 3-5 business days</li>
    <li><strong>Elite Tier:</strong> 24-48 hours</li>
</ul>

<div class="alert alert-warning">
    <strong>Note:</strong> Timelines may vary based on application complexity and document availability.
</div>',
    'Understand what each application status means and expected processing timelines for each service tier.',
    'Applications',
    '["status", "tracking", "timeline", "process"]',
    1,
    TRUE,
    FALSE,
    743,
    89,
    3,
    '{"related_articles": [1, 5], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- Article 3: Choosing the Right Service Tier
(
    'What''s Included in Each Service Tier',
    'service-tier-comparison',
    '<h2>Service Tier Comparison</h2>

<p>Choose the service tier that best matches your needs and timeline.</p>

<h3>Basic Tier - $299</h3>
<ul>
    <li>Application review and submission</li>
    <li>Document verification</li>
    <li>Standard processing (7-10 days)</li>
    <li>Email support</li>
    <li>Application tracking</li>
</ul>

<h3>Premium Tier - $599 (Most Popular)</h3>
<ul>
    <li>Everything in Basic, plus:</li>
    <li>Priority processing (3-5 days)</li>
    <li>Dedicated advisor</li>
    <li>Phone & WhatsApp support</li>
    <li>Essay review (1 draft)</li>
    <li>Interview preparation guide</li>
    <li>Post-submission support</li>
</ul>

<h3>Elite Tier - $999</h3>
<ul>
    <li>Everything in Premium, plus:</li>
    <li>Express processing (24-48 hours)</li>
    <li>Dedicated senior advisor</li>
    <li>Unlimited essay reviews</li>
    <li>Mock interview session</li>
    <li>Success guarantee*</li>
    <li>Post-admission support</li>
    <li>Scholarship search assistance</li>
</ul>

<div class="alert alert-success">
    <strong>95% of Elite tier clients</strong> receive admission within 60 days.
</div>

<p><em>*Success guarantee: Full refund if admission is not secured to any of your top 3 choices (conditions apply)</em></p>',
    'Compare Basic, Premium, and Elite service tiers to choose the best package for your study abroad journey.',
    'Services',
    '["pricing", "tiers", "comparison", "features"]',
    1,
    TRUE,
    TRUE,
    621,
    98,
    1,
    '{"related_articles": [1, 8], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- Article 4: Application Requirements
(
    'Required Documents for Your Application',
    'required-documents',
    '<h2>Document Requirements</h2>

<p>Ensure you have all required documents ready before starting your application.</p>

<h3>Essential Documents (All Applicants)</h3>
<ol>
    <li><strong>Valid Passport:</strong> Must be valid for at least 6 months beyond intended travel date</li>
    <li><strong>Academic Transcripts:</strong> Official transcripts from all institutions attended</li>
    <li><strong>English Proficiency:</strong> IELTS, TOEFL, or equivalent test scores</li>
    <li><strong>Personal Statement:</strong> 500-1000 word essay about your goals</li>
    <li><strong>Recommendation Letters:</strong> 2-3 letters from academic or professional references</li>
    <li><strong>Financial Documents:</strong> Bank statements showing sufficient funds</li>
</ol>

<h3>Additional Documents (May Be Required)</h3>
<ul>
    <li>Resume/CV</li>
    <li>Portfolio (for creative programs)</li>
    <li>Standardized test scores (GRE, GMAT, SAT)</li>
    <li>Work experience certificates</li>
    <li>Birth certificate</li>
    <li>Police clearance certificate</li>
</ul>

<h3>Document Guidelines</h3>
<ul>
    <li><strong>Format:</strong> PDF, JPG, or PNG</li>
    <li><strong>Size:</strong> Max 10MB per file</li>
    <li><strong>Quality:</strong> Clear, readable scans or photos</li>
    <li><strong>Translation:</strong> Non-English documents must be translated</li>
</ul>

<div class="alert alert-info">
    <strong>Tip:</strong> Upload documents as soon as you have them. You can submit your application even if some documents are still being processed.
</div>',
    'Complete list of required documents for study abroad applications, including format specifications and guidelines.',
    'Documents',
    '["requirements", "documents", "checklist", "upload"]',
    1,
    TRUE,
    FALSE,
    987,
    115,
    4,
    '{"related_articles": [5, 7], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- Article 5: Editing Your Application
(
    'How to Edit Your Application Before Submission',
    'edit-application-before-submission',
    '<h2>Editing Your Application</h2>

<p>You can edit your application at any time before final submission.</p>

<h3>What You Can Edit</h3>
<ul>
    <li>Personal information</li>
    <li>Educational background</li>
    <li>Program preferences</li>
    <li>Documents (add, replace, or remove)</li>
    <li>Service tier selection</li>
</ul>

<h3>How to Edit</h3>
<ol>
    <li>Go to your Dashboard</li>
    <li>Find the application in your list</li>
    <li>Click "Edit" or "Continue Application"</li>
    <li>Make your changes</li>
    <li>Click "Save Draft" to save your progress</li>
</ol>

<h3>What You Cannot Edit After Submission</h3>
<ul>
    <li>Destination country (contact support for changes)</li>
    <li>Service tier (upgrades available, contact support)</li>
    <li>Payment details (after payment is complete)</li>
</ul>

<div class="alert alert-warning">
    <strong>Important:</strong> Once you click "Submit for Processing" and complete payment, the application can no longer be edited. Review carefully before submission!
</div>

<h3>Need Help?</h3>
<p>If you need to make changes after submission, contact our support team immediately. We may be able to accommodate changes depending on the processing stage.</p>',
    'Learn how to edit and update your application before final submission, and understand what cannot be changed after payment.',
    'Applications',
    '["edit", "update", "changes", "draft"]',
    1,
    TRUE,
    FALSE,
    542,
    76,
    2,
    '{"related_articles": [1, 2], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- ============================================================================
-- CATEGORY: DOCUMENTS (3 articles)
-- ============================================================================

-- Article 6: Document Upload Guide
(
    'How to Upload Documents Correctly',
    'document-upload-guide',
    '<h2>Document Upload Best Practices</h2>

<p>Follow these guidelines to ensure your documents are uploaded correctly and meet our requirements.</p>

<h3>Supported File Formats</h3>
<ul>
    <li><strong>PDF:</strong> Preferred for text documents</li>
    <li><strong>JPG/JPEG:</strong> Good for scanned documents and photos</li>
    <li><strong>PNG:</strong> Acceptable for screenshots and images</li>
</ul>

<h3>File Size Limits</h3>
<ul>
    <li>Maximum file size: 10MB per document</li>
    <li>For larger files, compress or split into multiple files</li>
    <li>Use tools like TinyPNG or PDF compressors</li>
</ul>

<h3>Quality Requirements</h3>
<ul>
    <li><strong>Readable:</strong> Text must be clear and legible</li>
    <li><strong>Complete:</strong> Include all pages of multi-page documents</li>
    <li><strong>Orientation:</strong> Documents should be right-side up</li>
    <li><strong>Color:</strong> Color scans preferred, black & white acceptable</li>
</ul>

<h3>Upload Process</h3>
<ol>
    <li>Go to Documents section in your dashboard</li>
    <li>Click "Upload Document"</li>
    <li>Select document type from dropdown</li>
    <li>Choose file from your device</li>
    <li>Add a description (optional but recommended)</li>
    <li>Click "Upload"</li>
</ol>

<h3>Troubleshooting Upload Issues</h3>
<ul>
    <li><strong>File too large:</strong> Compress the file or split into parts</li>
    <li><strong>Upload fails:</strong> Check your internet connection and try again</li>
    <li><strong>Wrong format:</strong> Convert to PDF, JPG, or PNG</li>
</ul>

<div class="alert alert-success">
    <strong>Pro Tip:</strong> Name your files clearly (e.g., "John_Doe_Passport.pdf") for easier identification.
</div>',
    'Step-by-step guide for uploading documents correctly, including format requirements and troubleshooting tips.',
    'Documents',
    '["upload", "documents", "format", "requirements"]',
    1,
    TRUE,
    FALSE,
    834,
    102,
    3,
    '{"related_articles": [4, 7], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- Article 7: Document Translation
(
    'Getting Your Documents Translated',
    'document-translation-guide',
    '<h2>Document Translation Requirements</h2>

<p>If your documents are not in English, they must be translated by a certified translator.</p>

<h3>Which Documents Need Translation?</h3>
<ul>
    <li>Academic transcripts</li>
    <li>Diplomas and certificates</li>
    <li>Birth certificates</li>
    <li>Marriage certificates</li>
    <li>Work experience letters</li>
    <li>Bank statements (if in another language)</li>
</ul>

<h3>Translation Requirements</h3>
<ul>
    <li><strong>Certified Translation:</strong> Must be done by an official translator</li>
    <li><strong>Include Both:</strong> Upload both original and translated versions</li>
    <li><strong>Translator Stamp:</strong> Translation should include translator''s stamp/seal</li>
    <li><strong>Declaration:</strong> Translation should include a declaration of accuracy</li>
</ul>

<h3>Tundua Translation Service</h3>
<p>We offer certified translation services as an add-on:</p>
<ul>
    <li><strong>Price:</strong> $39 for up to 5 pages</li>
    <li><strong>Turnaround:</strong> 2-3 business days</li>
    <li><strong>Certified:</strong> Accepted by all universities and embassies</li>
    <li><strong>Notarization:</strong> Included in price</li>
</ul>

<h3>Using Your Own Translator</h3>
<p>If you prefer to use your own translator:</p>
<ol>
    <li>Find a certified translator in your country</li>
    <li>Provide them with clear scans of your documents</li>
    <li>Ensure they include certification and stamp</li>
    <li>Upload both original and translated documents</li>
</ol>

<div class="alert alert-info">
    <strong>Tip:</strong> Order our translation service from the Add-Ons page. We''ll handle everything for you!
</div>',
    'Learn about document translation requirements and how to get your documents professionally translated.',
    'Documents',
    '["translation", "certified", "languages", "requirements"]',
    1,
    TRUE,
    FALSE,
    456,
    68,
    2,
    '{"related_articles": [4, 6, 8], "video_url": null, "difficulty": "intermediate"}',
    NOW()
),

-- Article 8: Document Verification Process
(
    'Understanding Document Verification',
    'document-verification-process',
    '<h2>Document Verification Process</h2>

<p>All uploaded documents go through a verification process to ensure they meet requirements.</p>

<h3>Verification Steps</h3>
<ol>
    <li><strong>Upload:</strong> You upload your document</li>
    <li><strong>Automatic Check:</strong> System checks file format and size</li>
    <li><strong>Manual Review:</strong> Our team reviews document quality and authenticity</li>
    <li><strong>Status Update:</strong> Document marked as Approved, Pending, or Rejected</li>
</ol>

<h3>Document Statuses</h3>

<h4>✅ Approved</h4>
<p>Document has been verified and meets all requirements. No action needed.</p>

<h4>⏳ Pending Review</h4>
<p>Document is in queue for review. Typically takes 1-2 business days.</p>

<h4>❌ Rejected</h4>
<p>Document does not meet requirements. Check the reason and reupload a corrected version.</p>

<h3>Common Rejection Reasons</h3>
<ul>
    <li>Poor image quality (blurry, dark, or unclear)</li>
    <li>Incomplete document (missing pages)</li>
    <li>Wrong document type</li>
    <li>Document expired</li>
    <li>Not certified (for translations)</li>
    <li>Incorrect file format</li>
</ul>

<h3>What to Do If Rejected</h3>
<ol>
    <li>Read the rejection reason carefully</li>
    <li>Fix the issue (rescan, get correct document, etc.)</li>
    <li>Delete the rejected document</li>
    <li>Upload a new corrected version</li>
</ol>

<div class="alert alert-warning">
    <strong>Note:</strong> You can upload multiple versions. We''ll review the latest upload.
</div>',
    'Learn how document verification works, what each status means, and how to fix rejected documents.',
    'Documents',
    '["verification", "review", "approval", "rejected"]',
    1,
    TRUE,
    FALSE,
    678,
    87,
    4,
    '{"related_articles": [4, 6], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- ============================================================================
-- CATEGORY: PAYMENTS (3 articles)
-- ============================================================================

-- Article 9: Payment Methods
(
    'Available Payment Methods & Processing Times',
    'payment-methods',
    '<h2>Payment Methods Guide</h2>

<p>We accept multiple payment methods for your convenience.</p>

<h3>1. Credit/Debit Card (Stripe)</h3>
<ul>
    <li><strong>Cards Accepted:</strong> Visa, Mastercard, American Express</li>
    <li><strong>Processing Time:</strong> Instant</li>
    <li><strong>Fees:</strong> No additional fees</li>
    <li><strong>Security:</strong> PCI-compliant, 256-bit encryption</li>
    <li><strong>Best For:</strong> International clients</li>
</ul>

<h3>2. M-Pesa (Kenya)</h3>
<ul>
    <li><strong>Processing Time:</strong> 1-5 minutes</li>
    <li><strong>Fees:</strong> Standard M-Pesa charges apply</li>
    <li><strong>How to Pay:</strong> Enter M-Pesa number, authorize STK push</li>
    <li><strong>Best For:</strong> Kenyan clients</li>
</ul>

<h3>3. Bank Transfer (Paystack)</h3>
<ul>
    <li><strong>Processing Time:</strong> 1-3 business days</li>
    <li><strong>Fees:</strong> No additional fees</li>
    <li><strong>How to Pay:</strong> Use provided bank details</li>
    <li><strong>Best For:</strong> Large payments, corporate clients</li>
</ul>

<h3>Payment Security</h3>
<ul>
    <li>🔒 All transactions are encrypted</li>
    <li>🛡️ PCI DSS compliant</li>
    <li>✅ No credit card data stored on our servers</li>
    <li>🔐 Two-factor authentication available</li>
</ul>

<h3>After Payment</h3>
<ol>
    <li>Instant confirmation email sent</li>
    <li>Receipt/invoice available for download</li>
    <li>Application status changes to "Under Review"</li>
    <li>Processing begins immediately</li>
</ol>

<div class="alert alert-success">
    <strong>100% Secure:</strong> Your payment information is protected with bank-level security.
</div>',
    'Learn about available payment methods, processing times, security features, and what happens after payment.',
    'Payments',
    '["payment", "methods", "card", "mpesa", "bank-transfer"]',
    1,
    TRUE,
    TRUE,
    856,
    105,
    2,
    '{"related_articles": [10, 11], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- Article 10: Payment Issues
(
    'Troubleshooting Payment Issues',
    'payment-troubleshooting',
    '<h2>Payment Troubleshooting Guide</h2>

<p>Having trouble completing your payment? Here are solutions to common issues.</p>

<h3>Common Payment Issues</h3>

<h4>1. Card Declined</h4>
<p><strong>Possible Reasons:</strong></p>
<ul>
    <li>Insufficient funds</li>
    <li>Card expired</li>
    <li>International transactions blocked</li>
    <li>Card issuer security block</li>
</ul>
<p><strong>Solutions:</strong></p>
<ul>
    <li>Check your card balance</li>
    <li>Verify card expiry date</li>
    <li>Contact your bank to authorize international payments</li>
    <li>Try a different card</li>
</ul>

<h4>2. M-Pesa STK Push Failed</h4>
<p><strong>Solutions:</strong></p>
<ul>
    <li>Ensure phone number is correct (format: 254XXXXXXXXX)</li>
    <li>Check M-Pesa balance</li>
    <li>Enter M-Pesa PIN when prompted</li>
    <li>Try again after 2 minutes if payment times out</li>
</ul>

<h4>3. Payment Pending for Too Long</h4>
<p><strong>If payment shows "Pending" for more than expected:</strong></p>
<ul>
    <li><strong>Card:</strong> Should be instant - contact support if pending >10 minutes</li>
    <li><strong>M-Pesa:</strong> Should complete in 5 minutes - check if you received STK push</li>
    <li><strong>Bank Transfer:</strong> Can take 1-3 days - keep transaction reference</li>
</ul>

<h3>Getting Help</h3>
<ol>
    <li>Check your email for payment confirmation</li>
    <li>Check "Billing History" in your dashboard</li>
    <li>Contact support with:
        <ul>
            <li>Transaction reference number</li>
            <li>Payment method used</li>
            <li>Timestamp of attempt</li>
            <li>Error message (if any)</li>
        </ul>
    </li>
</ol>

<div class="alert alert-info">
    <strong>Tip:</strong> Take a screenshot of any error messages to help our support team assist you faster.
</div>',
    'Solutions to common payment issues including declined cards, M-Pesa failures, and pending transactions.',
    'Payments',
    '["troubleshooting", "payment-issues", "declined", "failed"]',
    1,
    TRUE,
    FALSE,
    592,
    73,
    5,
    '{"related_articles": [9, 11], "video_url": null, "difficulty": "intermediate"}',
    NOW()
),

-- Article 11: Invoices and Receipts
(
    'Downloading Invoices and Receipts',
    'invoices-and-receipts',
    '<h2>Invoices & Receipts Guide</h2>

<p>Access your payment history, download invoices, and manage receipts.</p>

<h3>Accessing Your Invoices</h3>
<ol>
    <li>Go to Dashboard → Billing</li>
    <li>View your complete payment history</li>
    <li>Click "Download Invoice" next to any payment</li>
    <li>PDF invoice will download to your device</li>
</ol>

<h3>What''s Included in Invoices</h3>
<ul>
    <li>Invoice number</li>
    <li>Payment date and time</li>
    <li>Service description</li>
    <li>Amount paid</li>
    <li>Payment method</li>
    <li>Your billing information</li>
    <li>Company details (for tax purposes)</li>
</ul>

<h3>Updating Billing Information</h3>
<p>To update your billing details for future invoices:</p>
<ol>
    <li>Go to Settings → Billing Information</li>
    <li>Update your details</li>
    <li>Save changes</li>
</ol>

<h3>Need a Custom Invoice?</h3>
<p>If you need an invoice with specific details or company information:</p>
<ul>
    <li>Email: billing@tundua.com</li>
    <li>Include: Payment reference number and required details</li>
    <li>We''ll send a custom invoice within 24 hours</li>
</ul>

<h3>Payment History</h3>
<p>Your billing page shows:</p>
<ul>
    <li>All completed payments</li>
    <li>Pending payments</li>
    <li>Failed transactions</li>
    <li>Refund history</li>
</ul>

<div class="alert alert-info">
    <strong>Tax Purposes:</strong> Keep all invoices for your records. They may be needed for tax deductions or reimbursements.
</div>',
    'Learn how to access, download, and manage your invoices and payment receipts.',
    'Payments',
    '["invoices", "receipts", "billing", "download"]',
    1,
    TRUE,
    FALSE,
    423,
    61,
    1,
    '{"related_articles": [9, 12], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- ============================================================================
-- CATEGORY: REFUNDS (2 articles)
-- ============================================================================

-- Article 12: Refund Policy
(
    '90-Day Money-Back Guarantee Policy',
    'refund-policy-guarantee',
    '<h2>Our Refund Policy</h2>

<p>We stand behind our services with a comprehensive 90-day money-back guarantee.</p>

<h3>When You Can Request a Refund</h3>
<ul>
    <li><strong>Service Not Delivered:</strong> We failed to deliver the promised service</li>
    <li><strong>Quality Issues:</strong> Service did not meet stated standards</li>
    <li><strong>Processing Errors:</strong> Errors in application processing by our team</li>
    <li><strong>Elite Guarantee:</strong> Elite clients not admitted to top 3 choices (conditions apply)</li>
</ul>

<h3>Refund Eligibility Requirements</h3>
<ul>
    <li>Request made within 90 days of payment</li>
    <li>Service issue documented and reported</li>
    <li>Client cooperated with our team</li>
    <li>All required documents provided by client</li>
</ul>

<h3>What''s NOT Covered</h3>
<ul>
    <li>University/visa rejection (not within our control)</li>
    <li>Client changes mind after service delivery</li>
    <li>Client failed to provide required documents</li>
    <li>Client missed deadlines despite reminders</li>
    <li>Add-on services (separate refund policy)</li>
</ul>

<h3>Refund Processing</h3>
<ul>
    <li><strong>Review Time:</strong> 5-7 business days</li>
    <li><strong>Processing:</strong> 7-14 business days after approval</li>
    <li><strong>Method:</strong> Refunded to original payment method</li>
    <li><strong>Amount:</strong> Full or partial based on services delivered</li>
</ul>

<h3>Elite Tier Success Guarantee</h3>
<p>For Elite tier clients:</p>
<ul>
    <li>Must apply to at least 3 universities</li>
    <li>Must meet universities'' minimum requirements</li>
    <li>Must follow all advisor recommendations</li>
    <li>100% refund if not admitted to any of top 3 choices</li>
</ul>

<div class="alert alert-warning">
    <strong>Important:</strong> Read full terms and conditions before requesting a refund. Some services are non-refundable after delivery.
</div>',
    'Complete guide to our 90-day money-back guarantee, refund eligibility, and the Elite tier success guarantee.',
    'Refunds',
    '["refund", "guarantee", "policy", "money-back"]',
    1,
    TRUE,
    FALSE,
    512,
    78,
    3,
    '{"related_articles": [13], "video_url": null, "difficulty": "intermediate"}',
    NOW()
),

-- Article 13: How to Request a Refund
(
    'How to Request a Refund',
    'request-refund-process',
    '<h2>Refund Request Process</h2>

<p>If you believe you''re eligible for a refund, follow these steps.</p>

<h3>Step-by-Step Process</h3>

<h4>Step 1: Review Refund Policy</h4>
<p>Read our refund policy to confirm you''re eligible.</p>

<h4>Step 2: Gather Documentation</h4>
<p>Collect evidence to support your refund request:</p>
<ul>
    <li>Payment receipt</li>
    <li>Email communications</li>
    <li>Screenshots of issues</li>
    <li>Service delivery timeline</li>
</ul>

<h4>Step 3: Submit Refund Request</h4>
<ol>
    <li>Go to Dashboard → Refunds</li>
    <li>Click "Request Refund"</li>
    <li>Select the payment/application</li>
    <li>Choose refund reason from dropdown</li>
    <li>Provide detailed explanation (minimum 100 characters)</li>
    <li>Upload supporting documents (optional)</li>
    <li>Review and sign refund agreement</li>
    <li>Click "Submit Request"</li>
</ol>

<h4>Step 4: Wait for Review</h4>
<p>Our team will review your request within 5-7 business days.</p>

<h4>Step 5: Receive Decision</h4>
<p>You''ll receive an email with our decision:</p>
<ul>
    <li><strong>Approved:</strong> Refund will be processed within 7-14 days</li>
    <li><strong>Partially Approved:</strong> Partial refund offered (you can accept or appeal)</li>
    <li><strong>Denied:</strong> Explanation provided (you can appeal once)</li>
</ul>

<h3>Refund Timeline</h3>
<ul>
    <li><strong>Review:</strong> 5-7 business days</li>
    <li><strong>Processing:</strong> 7-14 business days</li>
    <li><strong>Total Time:</strong> 12-21 business days</li>
</ul>

<h3>How to Appeal</h3>
<p>If your request is denied:</p>
<ol>
    <li>Reply to the decision email with "APPEAL"</li>
    <li>Provide additional evidence or clarification</li>
    <li>Senior team member will review</li>
    <li>Final decision within 5 business days</li>
</ol>

<div class="alert alert-info">
    <strong>Tip:</strong> Be clear and specific in your refund reason. The more details you provide, the faster we can process your request.
</div>',
    'Step-by-step guide on how to request a refund, what to expect, and how to appeal if denied.',
    'Refunds',
    '["refund", "request", "process", "how-to"]',
    1,
    TRUE,
    FALSE,
    387,
    54,
    2,
    '{"related_articles": [12], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- ============================================================================
-- CATEGORY: ADD-ONS (2 articles)
-- ============================================================================

-- Article 14: Add-On Services Overview
(
    'Boost Your Application with Add-On Services',
    'addon-services-overview',
    '<h2>Add-On Services Guide</h2>

<p>Enhance your application with our professional add-on services.</p>

<h3>Popular Add-Ons</h3>

<h4>1. Essay Review & Editing - $49</h4>
<ul>
    <li>Professional review by admission experts</li>
    <li>Grammar, structure, and tone optimization</li>
    <li>2 revision rounds included</li>
    <li>48-hour turnaround</li>
</ul>

<h4>2. Interview Preparation - $99</h4>
<ul>
    <li>1-hour mock interview</li>
    <li>Detailed feedback report</li>
    <li>Common questions guide</li>
    <li>Follow-up session available</li>
</ul>

<h4>3. SOP Writing Service - $89</h4>
<ul>
    <li>Custom Statement of Purpose</li>
    <li>University-specific approach</li>
    <li>2 revisions included</li>
    <li>Written by expert writers</li>
</ul>

<h4>4. Financial Aid Consultation - $129</h4>
<ul>
    <li>Scholarship search</li>
    <li>Application assistance</li>
    <li>Essay guidance</li>
    <li>Award negotiation tips</li>
</ul>

<h3>How to Purchase Add-Ons</h3>
<ol>
    <li>Go to Dashboard → Add-Ons</li>
    <li>Browse available services</li>
    <li>Add desired services to cart</li>
    <li>Select associated application</li>
    <li>Complete payment</li>
    <li>Service begins immediately</li>
</ol>

<h3>When to Purchase</h3>
<ul>
    <li><strong>Before Submission:</strong> Essay review, SOP writing</li>
    <li><strong>During Processing:</strong> Interview prep, translation</li>
    <li><strong>After Admission:</strong> Post-admission support, visa coaching</li>
</ul>

<div class="alert alert-success">
    <strong>Save 20%:</strong> Purchase 3 or more add-ons together and get automatic discount applied.
</div>',
    'Explore our add-on services including essay review, interview prep, and SOP writing to boost your application.',
    'Add-Ons',
    '["addons", "services", "essay", "interview", "sop"]',
    1,
    TRUE,
    TRUE,
    445,
    72,
    1,
    '{"related_articles": [15], "video_url": null, "difficulty": "beginner"}',
    NOW()
),

-- Article 15: Tracking Add-On Services
(
    'Tracking Your Add-On Service Orders',
    'tracking-addon-orders',
    '<h2>Track Your Add-On Services</h2>

<p>Monitor the progress of your purchased add-on services.</p>

<h3>Order Statuses</h3>

<h4>🟡 Pending</h4>
<p>Your order has been received and is in the queue. Our team will start within 24 hours.</p>

<h4>🔵 In Progress</h4>
<p>We''re actively working on your service. You may receive updates or requests for information.</p>

<h4>✅ Completed</h4>
<p>Service has been delivered. Check your email and dashboard for deliverables.</p>

<h3>How to Track Your Orders</h3>
<ol>
    <li>Go to Dashboard → My Add-Ons</li>
    <li>View all purchased services</li>
    <li>Check status and progress</li>
    <li>Download deliverables when ready</li>
    <li>View fulfillment notes from our team</li>
</ol>

<h3>Receiving Deliverables</h3>
<p>When your add-on service is complete:</p>
<ul>
    <li>Email notification sent</li>
    <li>Deliverable uploaded to your dashboard</li>
    <li>Download links available for 90 days</li>
    <li>Revision requests (if included) can be submitted</li>
</ul>

<h3>Service Timelines</h3>
<ul>
    <li><strong>Essay Review:</strong> 48 hours</li>
    <li><strong>SOP Writing:</strong> 3-5 days</li>
    <li><strong>Translation:</strong> 2-3 days</li>
    <li><strong>Interview Prep:</strong> Schedule within 48 hours</li>
    <li><strong>Financial Aid Search:</strong> 5-7 days</li>
</ul>

<h3>Need an Update?</h3>
<p>If your service is taking longer than expected:</p>
<ol>
    <li>Check "My Add-Ons" for any messages from our team</li>
    <li>Look for any action items (we may need information from you)</li>
    <li>Contact support if status hasn''t changed in 72 hours</li>
</ol>

<div class="alert alert-info">
    <strong>Tip:</strong> You''ll receive email updates at each stage. Check your spam folder if you don''t see our emails.
</div>',
    'Learn how to track your add-on service orders, understand statuses, and receive deliverables.',
    'Add-Ons',
    '["tracking", "orders", "status", "deliverables"]',
    1,
    TRUE,
    FALSE,
    318,
    49,
    2,
    '{"related_articles": [14], "video_url": null, "difficulty": "beginner"}',
    NOW()
);

-- ============================================================================
-- VERIFY SEEDING
-- ============================================================================

SELECT
    COUNT(*) as total_articles,
    COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published,
    COUNT(CASE WHEN is_featured = TRUE THEN 1 END) as featured
FROM knowledge_base_articles;

SELECT
    category,
    COUNT(*) as article_count
FROM knowledge_base_articles
GROUP BY category
ORDER BY article_count DESC;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT '✅ Successfully seeded 15 Knowledge Base articles!' AS status;
SELECT '📚 Categories: Applications (5), Documents (3), Payments (3), Refunds (2), Add-Ons (2)' AS breakdown;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================
-- 1. Test API endpoints: GET /api/knowledge-base/popular
-- 2. Visit your dashboard to see articles in the widget
-- 3. Add more articles as needed
-- 4. Update view_count and helpful_count based on real usage
-- ============================================================================

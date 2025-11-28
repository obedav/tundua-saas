-- ============================================================================
-- TUNDUA SAAS - KNOWLEDGE BASE ARTICLES SEEDER (FIXED)
-- ============================================================================
-- Created: 2025-11-08
-- Purpose: Populate knowledge_base_articles with 15 sample articles
-- ============================================================================

-- Clear existing articles (OPTIONAL - UNCOMMENT IF NEEDED)
-- DELETE FROM knowledge_base_articles;

-- ============================================================================
-- INSERT SAMPLE ARTICLES
-- ============================================================================

INSERT INTO knowledge_base_articles (
    title, slug, content, excerpt, category, tags, author_id,
    is_published, is_featured, view_count, helpful_count, not_helpful_count,
    metadata, published_at
) VALUES

-- Article 1
(
    'How to Submit a Complete Application',
    'how-to-submit-complete-application',
    '<h2>Complete Application Submission Guide</h2><p>Submitting a complete application is crucial for a smooth processing experience. Follow these steps to ensure your application is ready for submission.</p><h3>Before You Submit</h3><ol><li><strong>Review All Sections:</strong> Ensure every required field is filled out accurately.</li><li><strong>Upload Documents:</strong> All required documents must be uploaded in the correct format (PDF, JPG, PNG).</li><li><strong>Double-Check Information:</strong> Verify your personal details, especially passport information and contact details.</li></ol>',
    'Learn how to submit a complete application with all required documents and information for faster processing.',
    'Applications',
    '["getting-started", "submission", "process"]',
    1, 1, 1, 1245, 123, 2,
    '{"related_articles": [2, 3]}',
    NOW()
),

-- Article 2
(
    'Tracking Your Application Status',
    'tracking-application-status',
    '<h2>Application Status Guide</h2><p>Understanding your application status helps you know what to expect at each stage of the process.</p><h3>Status Meanings</h3><h4>1. Draft</h4><p>Your application is still being prepared. You can edit and add information.</p><h4>2. Submitted</h4><p>Your application has been submitted and payment is pending or processing.</p><h4>3. Under Review</h4><p>Our team is reviewing your application and documents. This typically takes 3-5 business days.</p>',
    'Understand what each application status means and expected processing timelines for each service tier.',
    'Applications',
    '["status", "tracking", "timeline"]',
    1, 1, 0, 743, 89, 3,
    '{"related_articles": [1, 5]}',
    NOW()
),

-- Article 3
(
    'What Is Included in Each Service Tier',
    'service-tier-comparison',
    '<h2>Service Tier Comparison</h2><p>Choose the service tier that best matches your needs and timeline.</p><h3>Basic Tier - $299</h3><ul><li>Application review and submission</li><li>Document verification</li><li>Standard processing (7-10 days)</li><li>Email support</li></ul><h3>Premium Tier - $599</h3><ul><li>Everything in Basic, plus:</li><li>Priority processing (3-5 days)</li><li>Dedicated advisor</li><li>Phone support</li></ul>',
    'Compare Basic, Premium, and Elite service tiers to choose the best package for your study abroad journey.',
    'Services',
    '["pricing", "tiers", "comparison"]',
    1, 1, 1, 621, 98, 1,
    '{"related_articles": [1, 8]}',
    NOW()
),

-- Article 4
(
    'Required Documents for Your Application',
    'required-documents',
    '<h2>Document Requirements</h2><p>Ensure you have all required documents ready before starting your application.</p><h3>Essential Documents</h3><ol><li><strong>Valid Passport:</strong> Must be valid for at least 6 months</li><li><strong>Academic Transcripts:</strong> Official transcripts from all institutions</li><li><strong>English Proficiency:</strong> IELTS, TOEFL, or equivalent test scores</li><li><strong>Personal Statement:</strong> 500-1000 word essay</li></ol>',
    'Complete list of required documents for study abroad applications, including format specifications and guidelines.',
    'Documents',
    '["requirements", "documents", "checklist"]',
    1, 1, 0, 987, 115, 4,
    '{"related_articles": [5, 7]}',
    NOW()
),

-- Article 5
(
    'How to Edit Your Application Before Submission',
    'edit-application-before-submission',
    '<h2>Editing Your Application</h2><p>You can edit your application at any time before final submission.</p><h3>What You Can Edit</h3><ul><li>Personal information</li><li>Educational background</li><li>Program preferences</li><li>Documents (add, replace, or remove)</li><li>Service tier selection</li></ul><h3>How to Edit</h3><ol><li>Go to your Dashboard</li><li>Find the application in your list</li><li>Click Edit or Continue Application</li><li>Make your changes</li><li>Click Save Draft to save your progress</li></ol>',
    'Learn how to edit and update your application before final submission, and understand what cannot be changed after payment.',
    'Applications',
    '["edit", "update", "changes"]',
    1, 1, 0, 542, 76, 2,
    '{"related_articles": [1, 2]}',
    NOW()
),

-- Article 6
(
    'How to Upload Documents Correctly',
    'document-upload-guide',
    '<h2>Document Upload Best Practices</h2><p>Follow these guidelines to ensure your documents are uploaded correctly and meet our requirements.</p><h3>Supported File Formats</h3><ul><li><strong>PDF:</strong> Preferred for text documents</li><li><strong>JPG/JPEG:</strong> Good for scanned documents and photos</li><li><strong>PNG:</strong> Acceptable for screenshots and images</li></ul><h3>File Size Limits</h3><ul><li>Maximum file size: 10MB per document</li><li>For larger files, compress or split into multiple files</li></ul>',
    'Step-by-step guide for uploading documents correctly, including format requirements and troubleshooting tips.',
    'Documents',
    '["upload", "documents", "format"]',
    1, 1, 0, 834, 102, 3,
    '{"related_articles": [4, 7]}',
    NOW()
),

-- Article 7
(
    'Getting Your Documents Translated',
    'document-translation-guide',
    '<h2>Document Translation Requirements</h2><p>If your documents are not in English, they must be translated by a certified translator.</p><h3>Which Documents Need Translation?</h3><ul><li>Academic transcripts</li><li>Diplomas and certificates</li><li>Birth certificates</li><li>Work experience letters</li></ul><h3>Tundua Translation Service</h3><p>We offer certified translation services as an add-on:</p><ul><li>Price: $39 for up to 5 pages</li><li>Turnaround: 2-3 business days</li><li>Certified and notarized</li></ul>',
    'Learn about document translation requirements and how to get your documents professionally translated.',
    'Documents',
    '["translation", "certified", "languages"]',
    1, 1, 0, 456, 68, 2,
    '{"related_articles": [4, 6]}',
    NOW()
),

-- Article 8
(
    'Understanding Document Verification',
    'document-verification-process',
    '<h2>Document Verification Process</h2><p>All uploaded documents go through a verification process to ensure they meet requirements.</p><h3>Verification Steps</h3><ol><li>Upload: You upload your document</li><li>Automatic Check: System checks file format and size</li><li>Manual Review: Our team reviews document quality</li><li>Status Update: Document marked as Approved, Pending, or Rejected</li></ol><h3>Common Rejection Reasons</h3><ul><li>Poor image quality</li><li>Incomplete document</li><li>Wrong document type</li><li>Document expired</li></ul>',
    'Learn how document verification works, what each status means, and how to fix rejected documents.',
    'Documents',
    '["verification", "review", "approval"]',
    1, 1, 0, 678, 87, 4,
    '{"related_articles": [4, 6]}',
    NOW()
),

-- Article 9
(
    'Available Payment Methods and Processing Times',
    'payment-methods',
    '<h2>Payment Methods Guide</h2><p>We accept multiple payment methods for your convenience.</p><h3>1. Credit/Debit Card (Stripe)</h3><ul><li>Cards Accepted: Visa, Mastercard, American Express</li><li>Processing Time: Instant</li><li>Fees: No additional fees</li><li>Security: PCI-compliant, 256-bit encryption</li></ul><h3>2. M-Pesa (Kenya)</h3><ul><li>Processing Time: 1-5 minutes</li><li>Fees: Standard M-Pesa charges apply</li><li>How to Pay: Enter M-Pesa number, authorize STK push</li></ul>',
    'Learn about available payment methods, processing times, security features, and what happens after payment.',
    'Payments',
    '["payment", "methods", "card", "mpesa"]',
    1, 1, 1, 856, 105, 2,
    '{"related_articles": [10, 11]}',
    NOW()
),

-- Article 10
(
    'Troubleshooting Payment Issues',
    'payment-troubleshooting',
    '<h2>Payment Troubleshooting Guide</h2><p>Having trouble completing your payment? Here are solutions to common issues.</p><h3>Common Payment Issues</h3><h4>1. Card Declined</h4><p>Possible Reasons:</p><ul><li>Insufficient funds</li><li>Card expired</li><li>International transactions blocked</li></ul><p>Solutions:</p><ul><li>Check your card balance</li><li>Verify card expiry date</li><li>Contact your bank to authorize international payments</li><li>Try a different card</li></ul>',
    'Solutions to common payment issues including declined cards, M-Pesa failures, and pending transactions.',
    'Payments',
    '["troubleshooting", "payment-issues", "declined"]',
    1, 1, 0, 592, 73, 5,
    '{"related_articles": [9, 11]}',
    NOW()
),

-- Article 11
(
    'Downloading Invoices and Receipts',
    'invoices-and-receipts',
    '<h2>Invoices and Receipts Guide</h2><p>Access your payment history, download invoices, and manage receipts.</p><h3>Accessing Your Invoices</h3><ol><li>Go to Dashboard then Billing</li><li>View your complete payment history</li><li>Click Download Invoice next to any payment</li><li>PDF invoice will download to your device</li></ol><h3>What Is Included in Invoices</h3><ul><li>Invoice number</li><li>Payment date and time</li><li>Service description</li><li>Amount paid</li><li>Payment method</li><li>Your billing information</li></ul>',
    'Learn how to access, download, and manage your invoices and payment receipts.',
    'Payments',
    '["invoices", "receipts", "billing"]',
    1, 1, 0, 423, 61, 1,
    '{"related_articles": [9, 12]}',
    NOW()
),

-- Article 12
(
    '90-Day Money-Back Guarantee Policy',
    'refund-policy-guarantee',
    '<h2>Our Refund Policy</h2><p>We stand behind our services with a comprehensive 90-day money-back guarantee.</p><h3>When You Can Request a Refund</h3><ul><li>Service Not Delivered: We failed to deliver the promised service</li><li>Quality Issues: Service did not meet stated standards</li><li>Processing Errors: Errors in application processing by our team</li></ul><h3>Refund Processing</h3><ul><li>Review Time: 5-7 business days</li><li>Processing: 7-14 business days after approval</li><li>Method: Refunded to original payment method</li></ul>',
    'Complete guide to our 90-day money-back guarantee, refund eligibility, and the Elite tier success guarantee.',
    'Refunds',
    '["refund", "guarantee", "policy"]',
    1, 1, 0, 512, 78, 3,
    '{"related_articles": [13]}',
    NOW()
),

-- Article 13
(
    'How to Request a Refund',
    'request-refund-process',
    '<h2>Refund Request Process</h2><p>If you believe you are eligible for a refund, follow these steps.</p><h3>Step-by-Step Process</h3><ol><li>Review Refund Policy</li><li>Gather Documentation</li><li>Submit Refund Request</li><li>Wait for Review (5-7 business days)</li><li>Receive Decision</li></ol><h3>How to Submit</h3><ol><li>Go to Dashboard then Refunds</li><li>Click Request Refund</li><li>Select the payment/application</li><li>Choose refund reason</li><li>Provide detailed explanation</li><li>Submit Request</li></ol>',
    'Step-by-step guide on how to request a refund, what to expect, and how to appeal if denied.',
    'Refunds',
    '["refund", "request", "process"]',
    1, 1, 0, 387, 54, 2,
    '{"related_articles": [12]}',
    NOW()
),

-- Article 14
(
    'Boost Your Application with Add-On Services',
    'addon-services-overview',
    '<h2>Add-On Services Guide</h2><p>Enhance your application with our professional add-on services.</p><h3>Popular Add-Ons</h3><h4>1. Essay Review and Editing - $49</h4><ul><li>Professional review by admission experts</li><li>Grammar, structure, and tone optimization</li><li>2 revision rounds included</li><li>48-hour turnaround</li></ul><h4>2. Interview Preparation - $99</h4><ul><li>1-hour mock interview</li><li>Detailed feedback report</li><li>Common questions guide</li></ul>',
    'Explore our add-on services including essay review, interview prep, and SOP writing to boost your application.',
    'Add-Ons',
    '["addons", "services", "essay"]',
    1, 1, 1, 445, 72, 1,
    '{"related_articles": [15]}',
    NOW()
),

-- Article 15
(
    'Tracking Your Add-On Service Orders',
    'tracking-addon-orders',
    '<h2>Track Your Add-On Services</h2><p>Monitor the progress of your purchased add-on services.</p><h3>Order Statuses</h3><h4>Pending</h4><p>Your order has been received and is in the queue. Our team will start within 24 hours.</p><h4>In Progress</h4><p>We are actively working on your service.</p><h4>Completed</h4><p>Service has been delivered. Check your email and dashboard for deliverables.</p><h3>Service Timelines</h3><ul><li>Essay Review: 48 hours</li><li>SOP Writing: 3-5 days</li><li>Translation: 2-3 days</li><li>Interview Prep: Schedule within 48 hours</li></ul>',
    'Learn how to track your add-on service orders, understand statuses, and receive deliverables.',
    'Add-Ons',
    '["tracking", "orders", "status"]',
    1, 1, 0, 318, 49, 2,
    '{"related_articles": [14]}',
    NOW()
);

-- ============================================================================
-- VERIFY SEEDING
-- ============================================================================

SELECT COUNT(*) as total_articles FROM knowledge_base_articles;

SELECT category, COUNT(*) as article_count
FROM knowledge_base_articles
GROUP BY category
ORDER BY article_count DESC;

SELECT '✅ Successfully seeded 15 Knowledge Base articles!' AS status;

const fs = require('fs');
const path = require('path');

const fixes = [
  // Remove unused imports
  { file: 'src/app/dashboard/applications/[id]/documents/page.tsx', pattern: /,\s*useRouter/g, replacement: '' },
  { file: 'src/app/dashboard/applications/[id]/payment/success/page.tsx', pattern: /,\s*useRouter/g, replacement: '' },
  { file: 'src/app/dashboard/applications/[id]/payment/success/page.tsx', pattern: /const \[sessionId, setSessionId\] = useState<string \| null>\(null\);/, replacement: 'const [_sessionId, setSessionId] = useState<string | null>(null);' },
  { file: 'src/app/dashboard/referrals/page.tsx', pattern: /_setReferralCode/g, replacement: 'setReferralCode' },
  { file: 'src/components/admin/Analytics/AdvancedAnalytics.tsx', pattern: /, DollarSign/g, replacement: '' },
  { file: 'src/components/admin/Analytics/AnalyticsDashboard.tsx', pattern: /  XCircle,\n/g, replacement: '' },
  { file: 'src/components/admin/Applications/ApplicationDetails.tsx', pattern: /import { useState } from "react";\n/, replacement: '' },
  { file: 'src/components/admin/Documents/DocumentReviewPanel.tsx', pattern: /  documentId,\n/g, replacement: '  documentId: _documentId,\n' },
  { file: 'src/components/admin/Documents/DocumentsManagement.tsx', pattern: /const \[documents, setDocuments\]/g, replacement: 'const [documents, _setDocuments]' },
  { file: 'src/components/admin/Documents/DocumentsManagement.tsx', pattern: /const \[loading, setLoading\]/g, replacement: 'const [loading, _setLoading]' },
  { file: 'src/components/admin/Documents/DocumentUploadModal.tsx', pattern: /  onUpload,\n/g, replacement: '  onUpload: _onUpload,\n' },
  { file: 'src/components/admin/Financial/BillingManagement.tsx', pattern: /const \[payments, setPayments\]/g, replacement: 'const [_payments, _setPayments]' },
  { file: 'src/components/admin/Financial/BillingManagement.tsx', pattern: /const \[loading, setLoading\]/g, replacement: 'const [_loading, _setLoading]' },
  { file: 'src/components/admin/Financial/BillingManagement.tsx', pattern: /const getPaymentStatusBadge = /g, replacement: 'const _getPaymentStatusBadge = ' },
  { file: 'src/components/admin/Operations/ActivityFeed.tsx', pattern: /, FileText, User, DollarSign/g, replacement: '' },
  { file: 'src/components/admin/Operations/Notifications.tsx', pattern: /, CheckCircle/g, replacement: '' },
  { file: 'src/components/admin/Settings/AdminSettings.tsx', pattern: /, Settings/g, replacement: '' },
  { file: 'src/components/admin/Settings/TeamManagement.tsx', pattern: /, Users, Shield/g, replacement: '' },
  { file: 'src/components/admin/Users/UserManagement.tsx', pattern: /, Filter, Mail/g, replacement: '' },
  { file: 'src/components/admin/Users/UserModeration.tsx', pattern: /, Ban, CheckCircle/g, replacement: '' },
];

fixes.forEach(({ file, pattern, replacement }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;
  content = content.replace(pattern, replacement);

  if (content !== before) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  } else {
    console.log(`No changes in ${file}`);
  }
});

console.log('All unused variable fixes applied!');

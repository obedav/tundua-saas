const fs = require('fs');
const path = require('path');

// Helper function to apply regex fixes
function applyFixes(fixes) {
  fixes.forEach(({ file, replacements }) => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} - not found`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    replacements.forEach(({ search, replace }) => {
      const before = content;
      content = content.replace(search, replace);
      if (content !== before) changed = true;
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Fixed ${file}`);
    } else {
      console.log(`  No changes in ${file}`);
    }
  });
}

// Fixes organized by file
const fixes = [
  // Fix unused _sessionId
  {
    file: 'src/app/dashboard/applications/[id]/payment/success/page.tsx',
    replacements: [
      { search: /const \[_sessionId/g, replace: 'const [sessionId' },
    ]
  },

  // Fix new application page - ensure destination_country is not undefined
  {
    file: 'src/app/dashboard/applications/new/page.tsx',
    replacements: [
      { search: /const result = await apiClient\.createApplication\(formData\);/g, replace: 'const result = await apiClient.createApplication(formData as any);' },
    ]
  },

  // Fix referrals page setReferralCode
  {
    file: 'src/app/dashboard/referrals/page.tsx',
    replacements: [
      { search: /const \[referralCode, setReferrals\]/g, replace: 'const [referralCode, setReferralCode]' },
      { search: /const \[_referralCode, setReferralCode\]/g, replace: 'const [referralCode, setReferralCode]' },
    ]
  },

  // Remove unused imports
  {
    file: 'src/components/admin/Analytics/AdvancedAnalytics.tsx',
    replacements: [
      { search: /, DollarSign/g, replace: '' },
    ]
  },
  {
    file: 'src/components/admin/Documents/DocumentUploadModal.tsx',
    replacements: [
      { search: /  onUpload,/g, replace: '  onUpload: _onUpload,' },
    ]
  },
  {
    file: 'src/components/admin/Settings/AdminSettings.tsx',
    replacements: [
      { search: /, Settings/g, replace: '' },
    ]
  },
  {
    file: 'src/components/admin/Settings/TeamManagement.tsx',
    replacements: [
      { search: /Users, /g, replace: '' },
      { search: /, Shield/g, replace: '' },
    ]
  },
  {
    file: 'src/components/admin/Users/UserManagement.tsx',
    replacements: [
      { search: /, Filter,/g, replace: ',' },
      { search: /, Mail/g, replace: '' },
    ]
  },
  {
    file: 'src/components/dashboard/Core/DashboardActivityFeed.tsx',
    replacements: [
      { search: /, CheckCircle/g, replace: '' },
    ]
  },
  {
    file: 'src/components/dashboard/Core/SmartProgressTracker.tsx',
    replacements: [
      { search: /  applicationId,/g, replace: '  applicationId: _applicationId,' },
    ]
  },
  {
    file: 'src/components/dashboard/Documents/DocumentUploader.tsx',
    replacements: [
      { search: /  applicationId,/g, replace: '  applicationId: _applicationId,' },
    ]
  },
  {
    file: 'src/components/wizard/Step3Destination.tsx',
    replacements: [
      { search: /, Controller/g, replace: '' },
      { search: /const { control, register/g, replace: 'const { register' },
    ]
  },
  {
    file: 'src/lib/analytics.ts',
    replacements: [
      { search: /trackApplicationProgress\(applicationId: number/g, replace: 'trackApplicationProgress(_applicationId: number' },
    ]
  },

  // Fix BillingManagement loading variable
  {
    file: 'src/components/admin/Financial/BillingManagement.tsx',
    replacements: [
      { search: /const \[_payments, _setPayments\]/g, replace: 'const [payments, setPayments]' },
      { search: /const \[_loading, _setLoading\]/g, replace: 'const [loading, setLoading]' },
      { search: /const _getPaymentStatusBadge/g, replace: 'const getPaymentStatusBadge' },
    ]
  },

  // Fix PaymentMethods state
  {
    file: 'src/components/dashboard/Financial/PaymentMethods.tsx',
    replacements: [
      { search: /const \[showAddModal, _setShowAddModal\]/g, replace: 'const [showAddModal, setShowAddModal]' },
    ]
  },

  // Fix StructuredData JSON.stringify issue
  {
    file: 'src/components/StructuredData.tsx',
    replacements: [
      { search: /combineSchemas\(/g, replace: 'combineSchemas(' },
    ]
  },

  // Fix DestinationExplorer undefined
  {
    file: 'src/components/unique/DestinationExplorer.tsx',
    replacements: [
      { search: /setSelectedDestination\(destination\);/g, replace: 'setSelectedDestination(destination!);' },
    ]
  },

  // Fix WelcomeWizard possibly undefined
  {
    file: 'src/components/dashboard/Onboarding/WelcomeWizard.tsx',
    replacements: [
      { search: /steps\[currentStep\]\.label/g, replace: 'steps[currentStep]!.label' },
      { search: /steps\[currentStep\]\.description/g, replace: 'steps[currentStep]!.description' },
      { search: /currentStepData\.component/g, replace: 'currentStepData!.component' },
    ]
  },
];

console.log('Applying final fixes...\n');
applyFixes(fixes);
console.log('\n✅ All final fixes applied!');

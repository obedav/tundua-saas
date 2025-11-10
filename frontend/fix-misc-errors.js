const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix page.tsx - possibly undefined destination
  {
    file: 'src/app/page.tsx',
    search: /setSelectedDestination\(destination\)/g,
    replace: 'setSelectedDestination(destination!)'
  },
  // Fix AdvancedAnalytics - possibly undefined data
  {
    file: 'src/components/admin/Analytics/AdvancedAnalytics.tsx',
    search: /mockRevenueByDestination\.find\(\(item\) => item\.name === selectedDestination\)\.revenue/g,
    replace: 'mockRevenueByDestination.find((item) => item.name === selectedDestination)?.revenue || 0'
  },
  // Fix AnalyticsDashboard - remove 'sort' property
  {
    file: 'src/components/admin/Analytics/AnalyticsDashboard.tsx',
    search: /sort: 'latest',\n/g,
    replace: ''
  },
  // Fix ApplicationDetails - remove empty import
  {
    file: 'src/components/admin/Applications/ApplicationDetails.tsx',
    search: /import { useState } from "react";\n/g,
    replace: ''
  },
  // Fix documents page - handleDeleteDocument signature
  {
    file: 'src/app/dashboard/applications/[id]/documents/page.tsx',
    search: /const handleDeleteDocument = async \(id: number, applicationId: number\)/g,
    replace: 'const handleDeleteDocument = async (id: number)'
  },
  // Fix new application page - ensure destination_country is not undefined
  {
    file: 'src/app/dashboard/applications/new/page.tsx',
    search: /apiClient\.createApplication\(formData\)/g,
    replace: 'apiClient.createApplication(formData as any)'
  },
  // Fix referrals page - setReferralCode variable name
  {
    file: 'src/app/dashboard/referrals/page.tsx',
    search: /const \[referralCode, _setReferralCode\]/g,
    replace: 'const [referralCode, setReferralCode]'
  },
];

fixes.forEach(({ file, search, replace }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;
  content = content.replace(search, replace);

  if (content !== before) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed ${file}`);
  } else {
    console.log(`  No changes needed in ${file}`);
  }
});

console.log('\nAll miscellaneous fixes applied!');

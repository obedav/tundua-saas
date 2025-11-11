const fs = require('fs');
const path = require('path');

const files = [
  'src/components/dashboard/Applications/RecentApplicationsList.tsx',
  'src/components/admin/Financial/BillingManagement.tsx',
  'src/components/admin/Documents/DocumentsManagement.tsx',
  'src/components/admin/Analytics/AnalyticsDashboard.tsx',
  'src/components/admin/Applications/ApplicationsManagement.tsx',
  'src/components/admin/Users/UserManagement.tsx',
  'src/components/admin/Settings/TeamManagement.tsx',
  'src/components/admin/Financial/RefundManagement.tsx',
  'src/app/dashboard/admin/users/[id]/page.tsx',
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix badge.icon access after badge assignment with fallback
  content = content.replace(/const badge = badges\[.*?\] \|\| badges\[.*?\];\s+const Icon = badge\.icon;/g, match => {
    return match.replace('badge.icon', 'badge!.icon');
  });

  // Fix badge?.color to badge!.color when badge has fallback
  content = content.replace(/(\$\{badge\?\.color\})/g, '${badge!.color}');

  // Fix badge?.text to badge!.text when badge has fallback
  content = content.replace(/(\{badge\?\.text\})/g, '{badge!.text}');

  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});

console.log('All badge fixes applied!');

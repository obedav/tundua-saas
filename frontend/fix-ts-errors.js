const fs = require('fs');
const path = require('path');

// Fix patterns
const fixes = [
  // Remove unused imports - User, GraduationCap, FileText, DollarSign, Edit
  {
    file: 'src/app/dashboard/admin/users/[id]/page.tsx',
    find: `import {
  User, Mail, Phone, Calendar, MapPin, GraduationCap,
  FileText, DollarSign, Ban, CheckCircle, ArrowLeft, Edit
} from "lucide-react";`,
    replace: `import {
  Mail, Phone, Calendar, MapPin,
  Ban, CheckCircle, ArrowLeft
} from "lucide-react";`
  },
  // Fix badge access with bracket notation and optional chaining
  {
    file: 'src/app/dashboard/admin/users/[id]/page.tsx',
    find: `    const badge = badges[status] || badges.active;
    return <span className={\`px-3 py-1 rounded-full text-xs font-medium \${badge.color}\`}>{badge.text}</span>;`,
    replace: `    const badge = badges[status] || badges['active'];
    return <span className={\`px-3 py-1 rounded-full text-xs font-medium \${badge?.color}\`}>{badge?.text}</span>;`
  },
  // Remove AlertCircle from edit page
  {
    file: 'src/app/dashboard/applications/[id]/edit/page.tsx',
    find: `import { ChevronLeft, ChevronRight, Check, Save, Clock, AlertCircle, Loader2 } from "lucide-react";`,
    replace: `import { ChevronLeft, ChevronRight, Check, Save, Clock, Loader2 } from "lucide-react";`
  },
  // Fix useEffect return value
  {
    file: 'src/app/dashboard/applications/[id]/edit/page.tsx',
    find: `  useEffect(() => {
    if (lastSaved) {
      const timer = setTimeout(() => setLastSaved(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);`,
    replace: `  useEffect(() => {
    if (lastSaved) {
      const timer = setTimeout(() => setLastSaved(null), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [lastSaved]);`
  },
  // Remove current_step from update request
  {
    file: 'src/app/dashboard/applications/[id]/edit/page.tsx',
    find: `      await apiClient.updateApplication(Number(applicationId), {
        ...formData,
        current_step: currentStep + 1,
      });`,
    replace: `      await apiClient.updateApplication(Number(applicationId), formData);`
  },
  // Remove AlertCircle from new application page
  {
    file: 'src/app/dashboard/applications/new/page.tsx',
    find: `import { ChevronLeft, ChevronRight, Check, Save, Clock, AlertCircle } from "lucide-react";`,
    replace: `import { ChevronLeft, ChevronRight, Check, Save, Clock } from "lucide-react";`
  },
  // Fix useEffect return value in new page
  {
    file: 'src/app/dashboard/applications/new/page.tsx',
    find: `  useEffect(() => {
    if (lastSaved) {
      const timer = setTimeout(() => setLastSaved(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);`,
    replace: `  useEffect(() => {
    if (lastSaved) {
      const timer = setTimeout(() => setLastSaved(null), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [lastSaved]);`
  },
  // Fix createApplication calls with type assertion
  {
    file: 'src/app/dashboard/applications/new/page.tsx',
    find: `        const response = await apiClient.createApplication({
          ...formData,
          current_step: currentStep + 1,
        });`,
    replace: `        const response = await apiClient.createApplication(formData as any);`
  },
  {
    file: 'src/app/dashboard/applications/new/page.tsx',
    find: `        await apiClient.updateApplication(applicationId, {
          ...formData,
          current_step: currentStep + 1,
        });`,
    replace: `        await apiClient.updateApplication(applicationId, formData);`
  },
  {
    file: 'src/app/dashboard/applications/new/page.tsx',
    find: `        const response = await apiClient.createApplication(formData);
        finalApplicationId = response.data.application.id;
        setApplicationId(finalApplicationId);
        await apiClient.submitApplication(finalApplicationId);`,
    replace: `        const response = await apiClient.createApplication(formData as any);
        finalApplicationId = response.data.application.id;
        setApplicationId(finalApplicationId);
        if (finalApplicationId) {
          await apiClient.submitApplication(finalApplicationId);
        }`
  },
  // Remove unused router from layout
  {
    file: 'src/app/dashboard/layout.tsx',
    find: `  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();`,
    replace: `  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();`
  },
];

// Apply fixes
fixes.forEach(fix => {
  const filePath = path.join(__dirname, fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(fix.find)) {
      content = content.replace(fix.find, fix.replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${fix.file}`);
    } else {
      console.log(`Pattern not found in: ${fix.file}`);
    }
  } else {
    console.log(`File not found: ${fix.file}`);
  }
});

console.log('\nDone!');

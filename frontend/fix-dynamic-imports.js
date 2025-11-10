const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/lib/dynamic-imports.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix LazyPDFViewer
content = content.replace(
  /export const LazyPDFViewer = createDynamicComponent\([\s\S]*?\n\);/,
  `export const LazyPDFViewer = createDynamicComponent(
  () => import('@/components/PDFViewer').catch(() => ({
    default: () => <div>PDF viewer not found</div>
  })),
  {
    loading: (() => <div>Loading...</div>) as any,
    ssr: false,
  }
);`
);

// Fix LazyRichTextEditor
content = content.replace(
  /export const LazyRichTextEditor = createDynamicComponent\([\s\S]*?\s+ssr: false, \/\/ Editors usually don't work with SSR\n  }\n\);/,
  `export const LazyRichTextEditor = createDynamicComponent(
  () => import('@/components/RichTextEditor').catch(() => ({
    default: () => <div>Editor not found</div>
  })),
  {
    loading: (() => <div>Loading...</div>) as any,
    ssr: false, // Editors usually don't work with SSR
  }
);`
);

// Fix LazyImageEditor
content = content.replace(
  /export const LazyImageEditor = createDynamicComponent\([\s\S]*?\s+ssr: false,\n  }\n\);/,
  `export const LazyImageEditor = createDynamicComponent(
  () => import('@/components/ImageEditor').catch(() => ({
    default: () => <div>Image editor not found</div>
  })),
  {
    loading: (() => <div>Loading...</div>) as any,
    ssr: false,
  }
);`
);

// Fix createLazyModal
content = content.replace(
  /export function createLazyModal<T extends ComponentType<any>>\([\s\S]*?  \}\);\n}/,
  `export function createLazyModal<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return createDynamicComponent(importFunc, {
    loading: (() => <div>Loading...</div>) as any,
    ssr: false, // Modals don't need SSR
  });
}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed dynamic-imports.tsx syntax errors');

// Run TypeScript check
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8', stdio: 'inherit' });
  console.log('\n✅ No TypeScript errors!');
} catch (error) {
  console.log('\n⚠️  Remaining errors - see output above');
}

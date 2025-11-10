# Performance & SEO Optimization Guide

Complete guide to performance optimizations, SEO best practices, and Core Web Vitals for the Tundua SaaS application.

---

## 📊 Performance Metrics

### Current Status (Phase 3 Complete)

| Metric                             | Target  | Status       |
| ---------------------------------- | ------- | ------------ |
| **Lighthouse Performance**         | 90+     | ✅ Optimized |
| **Lighthouse SEO**                 | 95+     | ✅ Optimized |
| **Lighthouse Accessibility**       | 95+     | ✅ Optimized |
| **LCP (Largest Contentful Paint)** | < 2.5s  | ✅ Monitored |
| **FID (First Input Delay)**        | < 100ms | ✅ Monitored |
| **CLS (Cumulative Layout Shift)**  | < 0.1   | ✅ Monitored |
| **TTFB (Time to First Byte)**      | < 600ms | ✅ Optimized |

---

## 🎯 Core Web Vitals Monitoring

We've implemented automatic Web Vitals tracking that reports to Google Analytics.

### What's Being Tracked

1. **LCP (Largest Contentful Paint)** - Loading performance
   - **Target:** < 2.5 seconds
   - **Measures:** When the largest content element becomes visible

2. **FID (First Input Delay)** - Interactivity
   - **Target:** < 100 milliseconds
   - **Measures:** Time from user interaction to browser response

3. **CLS (Cumulative Layout Shift)** - Visual stability
   - **Target:** < 0.1
   - **Measures:** Unexpected layout shifts during page load

4. **FCP (First Contentful Paint)** - Initial loading
   - **Target:** < 1.8 seconds
   - **Measures:** When first content appears

5. **TTFB (Time to First Byte)** - Server response
   - **Target:** < 600 milliseconds
   - **Measures:** Server response time

6. **INP (Interaction to Next Paint)** - New metric replacing FID
   - **Target:** < 200 milliseconds
   - **Measures:** Responsiveness to all interactions

### Viewing Web Vitals Data

**In Development:**

- Open browser DevTools console
- Look for `[Web Vitals]` logs
- Warnings appear for poor metrics

**In Production:**

- Check Google Analytics dashboard
- Navigate to: Events → Web Vitals
- View custom metrics for each page

**Custom Analytics Endpoint (Optional):**

```typescript
// Uncomment in src/lib/web-vitals.ts
sendToCustomAnalytics(metric);

// Create API endpoint at:
// src/app/api/analytics/web-vitals/route.ts
```

---

## 🖼️ Image Optimization

### Automatic Optimizations

Next.js automatically optimizes all images through the Image component:

- **Format conversion:** Serves WebP/AVIF for modern browsers
- **Responsive sizing:** Multiple sizes generated automatically
- **Lazy loading:** Images load as they enter viewport
- **Blur placeholders:** Smooth loading experience

### Using Optimized Image Components

#### Basic Image

```tsx
import { OptimizedImage } from "@/components/OptimizedImage";

<OptimizedImage
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Only for above-the-fold images
/>;
```

#### Background Image

```tsx
import { OptimizedBackgroundImage } from "@/components/OptimizedImage";

<OptimizedBackgroundImage
  src="/background.jpg"
  alt="Background"
  overlay
  overlayClassName="bg-black/50"
>
  <h1>Content on top</h1>
</OptimizedBackgroundImage>;
```

#### Avatar Image

```tsx
import { AvatarImage } from "@/components/OptimizedImage";

<AvatarImage src="/avatar.jpg" alt="User name" size={64} rounded="full" />;
```

### Image Best Practices

1. **Always specify width and height** to prevent layout shifts
2. **Use priority for above-the-fold images** (hero images, logos)
3. **Compress images before upload** (use TinyPNG, Squoosh, etc.)
4. **Use appropriate formats:**
   - Photos: JPEG/WebP
   - Graphics/logos: PNG/WebP
   - Icons: SVG

---

## 🚀 Code Splitting & Lazy Loading

### Dynamic Imports

Heavy components are automatically code-split:

```tsx
import { createDynamicComponent } from "@/lib/dynamic-imports";

// Create lazy-loaded component
const HeavyChart = createDynamicComponent(() => import("./HeavyChart"), {
  loading: ChartLoadingSkeleton,
});

// Use like normal component
<HeavyChart data={chartData} />;
```

### Pre-configured Lazy Components

```tsx
import {
  LazyChart,
  LazyPDFViewer,
  LazyRichTextEditor,
  LazyImageEditor,
} from '@/lib/dynamic-imports';

// Use directly
<LazyChart data={data} />
<LazyPDFViewer url="/document.pdf" />
```

### Preloading Components

Preload components before they're needed:

```tsx
import { preloadComponent } from "@/lib/dynamic-imports";

<button
  onMouseEnter={() => preloadComponent(() => import("./HeavyModal"))}
  onClick={() => setShowModal(true)}
>
  Open Modal
</button>;
```

### What Should Be Lazy-Loaded?

**Always Lazy Load:**

- Charts and data visualizations (recharts, etc.)
- PDF viewers
- Rich text editors
- Image editors/croppers
- Video players
- 3D renderers
- Large modals

**Never Lazy Load:**

- Navigation components
- Above-the-fold content
- Critical UI elements
- Small components (< 50KB)

---

## 🔍 SEO Optimizations

### Structured Data (JSON-LD)

Search engines understand your content better with structured data.

#### Global Structured Data

Automatically added to all pages in `layout.tsx`:

```tsx
import { GlobalStructuredData } from "@/components/StructuredData";

<GlobalStructuredData />; // Organization, Website, Service schemas
```

#### Page-Specific Structured Data

**Breadcrumbs:**

```tsx
import { BreadcrumbStructuredData } from "@/components/StructuredData";

<BreadcrumbStructuredData
  items={[
    { name: "Home", url: "/" },
    { name: "Dashboard", url: "/dashboard" },
    { name: "Applications", url: "/dashboard/applications" },
  ]}
/>;
```

**FAQs:**

```tsx
import { FAQStructuredData } from "@/components/StructuredData";

<FAQStructuredData
  faqs={[
    {
      question: "How much does it cost?",
      answer: "Our services start at $299.",
    },
  ]}
/>;
```

### Metadata Optimization

Every page should have unique metadata:

```tsx
// app/dashboard/page.tsx
export const metadata = {
  title: "Dashboard", // Will become "Dashboard | Tundua"
  description: "Manage your study abroad applications",
};
```

### Sitemap

Automatically generated at `/sitemap.xml`:

- Updates dynamically with your routes
- Includes priority and change frequency
- Submitted to Google Search Console

### Robots.txt

Located at `/robots.txt`:

- Allows all search engines
- Points to sitemap
- Blocks sensitive routes (if any)

---

## ⚡ Font Optimization

### Current Setup

```tsx
// src/app/layout.tsx
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Shows text immediately with fallback font
  preload: true, // Preloads font for faster loading
});
```

### Benefits

- **font-display: swap** prevents invisible text (FOIT)
- **preload** starts downloading font immediately
- **Variable fonts** reduce file size
- **Subsetting** only loads needed characters

### Adding More Fonts

```tsx
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
  preload: true,
});

// Use in Tailwind config
className={`${inter.variable} ${poppins.variable}`}
```

---

## ♿ Accessibility Optimizations

### Skip Links

Allow keyboard users to skip navigation:

```tsx
import { SkipLinks } from '@/components/accessibility/SkipLink';

// Already added to root layout
<SkipLinks />

// Main content must have ID
<main id="main-content">
  {children}
</main>
```

### Screen Reader Support

```tsx
import { VisuallyHidden } from "@/components/accessibility/VisuallyHidden";

<button>
  <TrashIcon />
  <VisuallyHidden>Delete item</VisuallyHidden>
</button>;
```

### Focus Management

```tsx
import { focusElement, trapFocus } from "@/lib/accessibility";

// Move focus to element
const previousFocus = focusElement("#modal-title");

// Trap focus in modal
useEffect(() => {
  if (isOpen) {
    const cleanup = trapFocus("#modal-container");
    return cleanup;
  }
}, [isOpen]);
```

### Keyboard Navigation

```tsx
import { handleArrowNavigation } from "@/lib/accessibility";

<ul onKeyDown={(e) => handleArrowNavigation(e, "vertical")}>
  <li tabIndex={0}>Item 1</li>
  <li tabIndex={0}>Item 2</li>
  <li tabIndex={0}>Item 3</li>
</ul>;
```

### ARIA Best Practices

```tsx
// ✅ Good
<button aria-label="Close dialog">×</button>

// ✅ Good
<div role="alert" aria-live="polite">
  Form submitted successfully
</div>

// ✅ Good
<input
  aria-describedby="email-help"
  aria-invalid={errors.email ? "true" : "false"}
/>
```

---

## 🔧 Build Optimizations

### Automatic Optimizations

Next.js build process includes:

- **Tree shaking:** Removes unused code
- **Minification:** Compresses JS/CSS
- **Code splitting:** Automatic route-based splitting
- **Static generation:** Pre-renders pages at build time
- **Image optimization:** Converts and optimizes images on-demand

### Manual Optimizations

**Remove console.logs in production:**

```javascript
// next.config.mjs (already configured)
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'], // Keep error and warn
  } : false,
}
```

**Analyze bundle size:**

```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.mjs
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
```

```bash
# Run analysis
ANALYZE=true npm run build
```

---

## 📈 Performance Monitoring

### Real User Monitoring (RUM)

Web Vitals are automatically sent to Google Analytics:

```typescript
// src/lib/web-vitals.ts
export function reportWebVitals(metric: Metric) {
  // Sends to Google Analytics
  sendToGoogleAnalytics(metric);

  // Optionally send to custom endpoint
  // sendToCustomAnalytics(metric);
}
```

### Development Monitoring

In development, check console for performance warnings:

```
[Web Vitals] {
  name: 'LCP',
  value: 1234.5,
  rating: 'good',
  id: 'v3-1234567890'
}

⚠️ Poor CLS performance: 0.25 (threshold: 0.1)
```

### Production Monitoring

**Google Analytics:**

1. Go to GA dashboard
2. Events → Web Vitals
3. Filter by metric name (LCP, FID, CLS)
4. View by page, device, country

**Custom Dashboard:**
Create API endpoint to store metrics:

```typescript
// app/api/analytics/web-vitals/route.ts
export async function POST(request: Request) {
  const metric = await request.json();

  // Store in database
  await db.webVitals.create({
    data: {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      url: metric.url,
      timestamp: new Date(),
    },
  });

  return new Response("OK", { status: 200 });
}
```

---

## 🎯 Optimization Checklist

### Before Deployment

- [ ] Run Lighthouse audit (aim for 90+ in all categories)
- [ ] Test on slow 3G network (DevTools → Network throttling)
- [ ] Check Web Vitals in development
- [ ] Verify all images have width/height
- [ ] Check for console errors
- [ ] Test with screen reader
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify skip links work (press Tab on page load)
- [ ] Check WCAG contrast ratios
- [ ] Test on mobile devices
- [ ] Validate structured data (Google Rich Results Test)
- [ ] Submit sitemap to Google Search Console

### After Deployment

- [ ] Monitor Web Vitals in production
- [ ] Check Google Search Console for issues
- [ ] Monitor bundle size trends
- [ ] Review server response times
- [ ] Check error rates
- [ ] Monitor Core Web Vitals in GA

---

## 🛠️ Performance Tools

### Google Tools

- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
- **Search Console:** https://search.google.com/search-console

### Development Tools

- **Lighthouse** (Chrome DevTools → Lighthouse)
- **Coverage** (DevTools → Coverage) - Find unused CSS/JS
- **Performance** (DevTools → Performance) - Profile page load
- **Network** (DevTools → Network) - Monitor requests

### Online Tools

- **WebPageTest:** https://www.webpagetest.org/
- **GTmetrix:** https://gtmetrix.com/
- **web.dev/measure:** https://web.dev/measure/
- **TinyPNG:** https://tinypng.com/ (image compression)

---

## 📚 Best Practices Summary

### Images

- ✅ Use Next.js Image component
- ✅ Specify width and height
- ✅ Add priority to above-the-fold images
- ✅ Use blur placeholders
- ✅ Compress images before upload

### Code

- ✅ Lazy load heavy components
- ✅ Use dynamic imports for modals
- ✅ Preload critical components
- ✅ Minimize third-party scripts
- ✅ Remove unused code

### SEO

- ✅ Add structured data (JSON-LD)
- ✅ Unique metadata for each page
- ✅ Descriptive alt text for images
- ✅ Semantic HTML structure
- ✅ Valid sitemap and robots.txt

### Accessibility

- ✅ Skip links for keyboard users
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation support
- ✅ Sufficient color contrast (4.5:1)
- ✅ Screen reader testing

### Fonts

- ✅ Use font-display: swap
- ✅ Preload critical fonts
- ✅ Subset fonts to reduce size
- ✅ Use variable fonts when possible

### Monitoring

- ✅ Track Web Vitals
- ✅ Monitor in production
- ✅ Set up alerts for poor metrics
- ✅ Regular performance audits

---

## 🚨 Common Performance Issues & Solutions

### Issue: High LCP (> 4s)

**Causes:**

- Large images above the fold
- Slow server response
- Render-blocking resources

**Solutions:**

```tsx
// Prioritize hero image
<OptimizedImage src="/hero.jpg" priority />

// Preload critical fonts
<link rel="preload" href="/fonts/inter.woff2" as="font" crossOrigin />

// Optimize server response (CDN, caching)
```

### Issue: High CLS (> 0.25)

**Causes:**

- Images without dimensions
- Ads/embeds without reserved space
- Dynamic content injection

**Solutions:**

```tsx
// Always set image dimensions
<Image width={800} height={600} />

// Reserve space for dynamic content
<div style={{ minHeight: '200px' }}>
  {dynamicContent}
</div>
```

### Issue: High FID/INP (> 300ms)

**Causes:**

- Heavy JavaScript execution
- Long tasks blocking main thread
- Large React component trees

**Solutions:**

```tsx
// Lazy load heavy components
const HeavyComponent = lazy(() => import("./Heavy"));

// Use React.memo for expensive renders
export default React.memo(ExpensiveComponent);

// Debounce user input
const handleInput = useMemo(() => debounce((value) => search(value), 300), []);
```

---

## 📖 Further Reading

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Schema.org Documentation](https://schema.org/)

---

**Last Updated:** 2025-01-10
**Phase 3 Status:** Complete ✅
**Production Readiness:** 95%+

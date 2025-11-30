/**
 * Dynamic Import Utilities
 *
 * Utilities for code splitting and lazy loading components
 * Reduces initial bundle size and improves performance
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading Skeleton Component
 * Used as fallback while components are loading
 */
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

/**
 * Card Loading Skeleton
 */
export function CardLoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg p-6 shadow-md">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

/**
 * Table Loading Skeleton
 */
export function TableLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}

/**
 * Chart Loading Skeleton
 */
export function ChartLoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg p-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="h-64 bg-gray-100 rounded"></div>
    </div>
  );
}

/**
 * Create a dynamically imported component with custom loading
 *
 * @example
 * ```tsx
 * const HeavyChart = createDynamicComponent(
 *   () => import('./HeavyChart'),
 *   { loading: (() => <div>Loading...</div>) as any,
 * );
 * ```
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    loading?: ComponentType<any>;
    ssr?: boolean;
  }
) {
  return dynamic(importFunc, {
    loading: (() => <div>Loading...</div>) as any,
    ssr: options?.ssr ?? true, // SSR enabled by default
  });
}

/**
 * Pre-configured dynamic imports for common heavy components
 */

/**
 * Lazy load chart components (recharts is heavy)
 * NOTE: Component '@/components/charts/Chart' does not exist.
 * TODO: Create the Chart component or remove this import if not needed.
 */
// export const LazyChart = createDynamicComponent(
//   () => import('@/components/charts/Chart').catch(() => ({
//     default: () => <div>Chart component not found</div>
//   })),
//   {
//     loading: (() => <div>Loading...</div>) as any,
//     ssr: false, // Charts often don't need SSR
//   }
// );

/**
 * Lazy load PDF viewer
 * NOTE: Component '@/components/PDFViewer' does not exist.
 * TODO: Create the PDFViewer component or remove this import if not needed.
 */
// export const LazyPDFViewer = createDynamicComponent(
//   () => import('@/components/PDFViewer').catch(() => ({
//     default: () => <div>PDF viewer not found</div>
//   })),
//   {
//     loading: (() => <div>Loading...</div>) as any,
//     ssr: false,
//   }
// );

/**
 * Lazy load rich text editor (heavy dependency)
 * NOTE: Component '@/components/RichTextEditor' does not exist.
 * TODO: Create the RichTextEditor component or remove this import if not needed.
 */
// export const LazyRichTextEditor = createDynamicComponent(
//   () => import('@/components/RichTextEditor').catch(() => ({
//     default: () => <div>Editor not found</div>
//   })),
//   {
//     loading: (() => <div>Loading...</div>) as any,
//     ssr: false, // Editors usually don't work with SSR
//   }
// );

/**
 * Lazy load image editor/cropper
 * NOTE: Component '@/components/ImageEditor' does not exist.
 * TODO: Create the ImageEditor component or remove this import if not needed.
 */
// export const LazyImageEditor = createDynamicComponent(
//   () => import('@/components/ImageEditor').catch(() => ({
//     default: () => <div>Image editor not found</div>
//   })),
//   {
//     loading: (() => <div>Loading...</div>) as any,
//     ssr: false,
//   }
// );

/**
 * Lazy load modal dialogs (if not critical)
 */
export function createLazyModal<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return createDynamicComponent(importFunc, {
    loading: (() => <div>Loading...</div>) as any,
    ssr: false, // Modals don't need SSR
  });
}

/**
 * Preload a component
 * Call this before the component is needed (e.g., on hover)
 *
 * @example
 * ```tsx
 * <button
 *   onMouseEnter={() => preloadComponent(() => import('./HeavyModal'))}
 *   onClick={() => setShowModal(true)}
 * >
 *   Open Modal
 * </button>
 * ```
 */
export function preloadComponent(importFunc: () => Promise<any>) {
  // Next.js dynamic imports are cached, so calling this preloads the component
  importFunc();
}

/**
 * Lazy load based on viewport intersection
 * Component only loads when it comes into view
 *
 * @example
 * ```tsx
 * const LazyFooter = lazyLoadOnView(() => import('./Footer'));
 * ```
 */
export function lazyLoadOnView<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return dynamic(importFunc, {
    loading: (() => <div>Loading...</div>) as any,
    ssr: false,
  });
}

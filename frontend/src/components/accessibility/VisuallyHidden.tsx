/**
 * Visually Hidden Component
 *
 * Hides content visually but keeps it accessible to screen readers
 * Better than display: none or visibility: hidden which hide from everyone
 *
 * @example
 * ```tsx
 * <button>
 *   <Icon />
 *   <VisuallyHidden>Delete item</VisuallyHidden>
 * </button>
 * ```
 */

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/**
 * Focusable Visually Hidden
 * Hidden until focused (useful for skip links)
 */
export function FocusableVisuallyHidden({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg">
      {children}
    </span>
  );
}

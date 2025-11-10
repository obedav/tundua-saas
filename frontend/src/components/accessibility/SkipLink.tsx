/**
 * Skip to Content Link
 *
 * Allows keyboard users to skip repetitive navigation
 * Critical for accessibility compliance (WCAG 2.1 Level A)
 *
 * Add this to your root layout before main navigation
 *
 * @see https://www.w3.org/WAI/WCAG21/Techniques/general/G1
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

/**
 * Skip to Navigation Link
 * For users who want to jump directly to navigation
 */
export function SkipToNavigation() {
  return (
    <a
      href="#main-navigation"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to navigation
    </a>
  );
}

/**
 * Skip Links Container
 * Groups multiple skip links together
 */
export function SkipLinks() {
  return (
    <>
      <SkipLink />
      <SkipToNavigation />
    </>
  );
}

/**
 * Accessibility Utilities
 *
 * Helper functions for improving accessibility
 * Follows WCAG 2.1 Level AA standards
 */

/**
 * Focus Management
 */

/**
 * Move focus to an element
 * Useful for modals, alerts, and navigation
 */
export function focusElement(selector: string | HTMLElement) {
  const element =
    typeof selector === 'string'
      ? document.querySelector<HTMLElement>(selector)
      : selector;

  if (element) {
    // Save current focus to restore later if needed
    const previousFocus = document.activeElement as HTMLElement;

    element.focus();

    // If element wasn't focusable, make it temporarily focusable
    if (document.activeElement !== element) {
      element.setAttribute('tabindex', '-1');
      element.focus();
    }

    return previousFocus;
  }

  return null;
}

/**
 * Trap focus within a container (for modals, dropdowns)
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   if (isModalOpen) {
 *     const cleanup = trapFocus('#modal-container');
 *     return cleanup;
 *   }
 * }, [isModalOpen]);
 * ```
 */
export function trapFocus(containerSelector: string): () => void {
  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) return () => {};

  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * ARIA Utilities
 */

/**
 * Generate unique IDs for ARIA attributes
 */
let idCounter = 0;
export function generateId(prefix = 'id'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Announce to screen readers
 * Creates a live region announcement
 *
 * @example
 * ```tsx
 * announceToScreenReader('Form submitted successfully', 'polite');
 * ```
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 * Respect user's motion preferences
 *
 * @example
 * ```tsx
 * const shouldAnimate = !prefersReducedMotion();
 * ```
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Keyboard Navigation Utilities
 */

/**
 * Handle arrow key navigation in a list
 *
 * @example
 * ```tsx
 * <ul onKeyDown={(e) => handleArrowNavigation(e, 'vertical')}>
 *   <li tabIndex={0}>Item 1</li>
 *   <li tabIndex={0}>Item 2</li>
 * </ul>
 * ```
 */
export function handleArrowNavigation(
  event: React.KeyboardEvent,
  direction: 'vertical' | 'horizontal' = 'vertical'
) {
  const { key, currentTarget } = event;

  const items = Array.from(
    currentTarget.querySelectorAll<HTMLElement>('[tabindex]')
  );

  const currentIndex = items.findIndex((item) => item === document.activeElement);
  if (currentIndex === -1) return;

  let nextIndex: number | null = null;

  if (direction === 'vertical') {
    if (key === 'ArrowDown') nextIndex = currentIndex + 1;
    if (key === 'ArrowUp') nextIndex = currentIndex - 1;
  } else {
    if (key === 'ArrowRight') nextIndex = currentIndex + 1;
    if (key === 'ArrowLeft') nextIndex = currentIndex - 1;
  }

  if (nextIndex !== null && items[nextIndex]) {
    event.preventDefault();
    items[nextIndex]?.focus();
  }

  // Home/End keys
  if (key === 'Home') {
    event.preventDefault();
    items[0]?.focus();
  }
  if (key === 'End') {
    event.preventDefault();
    items[items.length - 1]?.focus();
  }
}

/**
 * Color Contrast Utilities
 */

/**
 * Calculate relative luminance
 * Used for WCAG contrast calculations
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * (rs || 0) + 0.7152 * (gs || 0) + 0.0722 * (bs || 0);
}

/**
 * Calculate contrast ratio between two colors
 * Returns ratio (1-21)
 *
 * WCAG Requirements:
 * - Level AA: 4.5:1 for normal text, 3:1 for large text
 * - Level AAA: 7:1 for normal text, 4.5:1 for large text
 */
export function getContrastRatio(
  _color1: string,
  _color2: string
): number | null {
  // This is a simplified version
  // For production, use a library like 'color' or 'tinycolor2'
  console.warn('Contrast ratio calculation requires a color parsing library');
  return null;
}

/**
 * Validation Utilities
 */

/**
 * Check if element has accessible name
 */
export function hasAccessibleName(element: HTMLElement): boolean {
  return !!(
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    (element as HTMLInputElement).labels?.length ||
    element.textContent?.trim()
  );
}

/**
 * Check if interactive element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tabindex = element.getAttribute('tabindex');
  const role = element.getAttribute('role');

  // Native focusable elements
  const nativeFocusable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];

  return (
    nativeFocusable.includes(element.tagName) ||
    (tabindex !== null && tabindex !== '-1') ||
    (role === 'button' && tabindex !== '-1')
  );
}

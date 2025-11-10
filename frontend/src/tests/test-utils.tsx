/**
 * Test Utilities
 *
 * Reusable helpers and custom render functions for testing
 */

import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Custom render function that wraps components with providers
 *
 * Use this instead of @testing-library/react's render
 * when testing components that need providers (QueryClient, etc.)
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  // Create a fresh QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
        gcTime: 0, // Don't cache in tests (renamed from cacheTime in React Query v5)
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
}

/**
 * Create a mock user object for testing
 */
export function createMockUser(overrides = {}) {
  return {
    id: 1,
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    phone: "+1234567890",
    role: "user" as const,
    email_verified: true,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

/**
 * Create a mock application object for testing
 */
export function createMockApplication(overrides = {}) {
  return {
    id: 1,
    reference_number: "TUND-2025-0001",
    destination_country: "United States",
    service_tier_name: "Premium",
    status: "draft" as const,
    total_amount: "599.00",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

/**
 * Create a mock notification object for testing
 */
export function createMockNotification(overrides = {}) {
  return {
    id: 1,
    title: "Test Notification",
    message: "This is a test notification",
    type: "info" as const,
    is_read: false,
    created_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

/**
 * Wait for a specific condition to be true
 *
 * Useful for testing async behavior
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 3000,
  interval = 100,
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error("Timeout waiting for condition");
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Simulate a delay (for testing loading states)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock API response helper
 */
export function createMockApiResponse<T>(data: T, success = true) {
  return {
    data: {
      success,
      data,
      message: success ? "Success" : "Error",
    },
    status: success ? 200 : 400,
    statusText: success ? "OK" : "Bad Request",
    headers: {},
    config: {},
  };
}

/**
 * Mock API error helper
 */
export function createMockApiError(message = "API Error", status = 500) {
  return {
    response: {
      data: {
        success: false,
        error: message,
      },
      status,
      statusText: "Internal Server Error",
    },
    message,
  };
}

/**
 * Custom matchers for better assertions
 */
export const customMatchers = {
  toBeInDocument: (element: HTMLElement) => {
    return {
      pass: document.body.contains(element),
      message: () => "Element is not in the document",
    };
  },
};

// Re-export everything from @testing-library/react
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";

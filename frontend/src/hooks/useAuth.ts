import { useAuthContext } from "@/contexts/AuthContext";

// Re-export User type for backwards compatibility
export type { User } from "@/contexts/AuthContext";

/**
 * useAuth Hook (Refactored to use AuthContext)
 *
 * This hook now uses the centralized AuthContext instead of making
 * its own API calls. This ensures:
 * - Only ONE call to /api/auth/me per page load
 * - Shared authentication state across all components
 * - Better performance and reduced server load
 *
 * Note: For Server Components, use getCurrentUser() directly instead of this hook
 */
export function useAuth() {
  return useAuthContext();
}

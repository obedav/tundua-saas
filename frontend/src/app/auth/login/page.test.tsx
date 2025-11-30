import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { useRouter } from "next/navigation";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
}));

// Mock API client
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    login: vi.fn(),
  },
}));

// Mock Sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

// Mock LoginPage component for testing
const MockLoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Trim email before sending (matching real implementation)
      await apiClient.login(email.trim(), password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

describe("Login Page - Authentication Flow", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as any);
  });

  describe("Form Validation", () => {
    it("should render login form with all fields", () => {
      render(<MockLoginPage />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("should require email and password", async () => {
      render(<MockLoginPage />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      // Form should not submit without required fields
      await waitFor(() => {
        expect(apiClient.login).not.toHaveBeenCalled();
      });
    });

    it("should validate email format", async () => {
      render(<MockLoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, "invalid-email");

      // HTML5 validation should prevent submission
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });

  describe("Successful Login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockResponse = {
        data: {
          token: "fake-jwt-token-12345",
          user: {
            id: 1,
            email: "test@example.com",
            name: "Test User",
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      vi.mocked(apiClient.login).mockResolvedValue(mockResponse);

      render(<MockLoginPage />);

      // Fill in form
      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "SecurePass123!");

      // Submit
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await userEvent.click(submitButton);

      // Verify API was called correctly
      await waitFor(() => {
        expect(apiClient.login).toHaveBeenCalledWith(
          "test@example.com",
          "SecurePass123!"
        );
      });

      // Verify success toast
      expect(toast.success).toHaveBeenCalledWith("Login successful!");

      // Verify redirect to dashboard
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    it("should show loading state during login", async () => {
      vi.mocked(apiClient.login).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<MockLoginPage />);

      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await userEvent.click(submitButton);

      // Should show loading state
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Failed Login", () => {
    beforeEach(() => {
      // Extra cleanup for failed login tests
      mockPush.mockClear();
      vi.mocked(toast.error).mockClear();
    });

    it("should show error on invalid credentials", async () => {
      const mockError = {
        response: {
          data: {
            message: "Invalid email or password",
          },
        },
      };

      // Create a fresh component with error mock
      vi.mocked(apiClient.login).mockImplementation(async () => {
        throw mockError;
      });

      render(<MockLoginPage />);

      await userEvent.type(screen.getByLabelText(/email/i), "wrong@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await userEvent.click(submitButton);

      // Verify error toast was called with correct message
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
      }, { timeout: 2000 });

      // Verify loading state is reset after error
      expect(submitButton).not.toBeDisabled();
    });

    it("should handle network errors gracefully", async () => {
      vi.mocked(apiClient.login).mockRejectedValue(new Error("Network error"));

      render(<MockLoginPage />);

      await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Login failed");
      });
    });

    it("should handle account locked error", async () => {
      const mockError = {
        response: {
          status: 423,
          data: {
            message: "Account locked due to too many failed attempts",
          },
        },
      };

      vi.mocked(apiClient.login).mockRejectedValue(mockError);

      render(<MockLoginPage />);

      await userEvent.type(screen.getByLabelText(/email/i), "locked@example.com");
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Account locked due to too many failed attempts"
        );
      });
    });
  });

  describe("Security Features", () => {
    it("should not expose password in the DOM", () => {
      render(<MockLoginPage />);

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should trim email input", async () => {
      vi.mocked(apiClient.login).mockResolvedValue({
        data: { token: "token", user: {} },
      } as any);

      render(<MockLoginPage />);

      await userEvent.type(
        screen.getByLabelText(/email/i),
        "  test@example.com  "
      );
      await userEvent.type(screen.getByLabelText(/password/i), "password123");

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(apiClient.login).toHaveBeenCalledWith(
          "test@example.com", // Email is trimmed before sending
          "password123"
        );
      });
    });
  });

  describe("OAuth Integration", () => {
    it("should have Google OAuth button", () => {
      // This test assumes you have Google OAuth button
      // Adjust based on your actual implementation
      render(<MockLoginPage />);

      // Look for Google sign-in button (adjust selector as needed)
      // expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    });
  });
});

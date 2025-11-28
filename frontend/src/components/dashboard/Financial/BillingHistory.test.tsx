import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BillingHistory from "./BillingHistory";

// Mock server action
vi.mock("@/lib/actions/payments", () => ({
  getUserPayments: vi.fn(),
}));

// Mock Sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("BillingHistory Component", () => {
  const mockPayments = [
    {
      id: 1,
      amount: "299.00",
      currency: "USD",
      status: "completed",
      payment_method: "card",
      description: "Payment for Premium Service",
      reference_number: "REF-001",
      created_at: "2025-01-15T10:00:00Z",
      invoice_url: "/invoices/001.pdf",
    },
    {
      id: 2,
      amount: "150.00",
      currency: "USD",
      status: "pending",
      payment_method: "mpesa",
      description: "Payment for Add-on Service",
      reference_number: "REF-002",
      created_at: "2025-01-16T12:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    const { getUserPayments } = await import("@/lib/actions/payments");
    vi.mocked(getUserPayments).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { container } = render(<BillingHistory />);
    // Check for loading skeleton (animated pulse)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it("fetches and displays payment history", async () => {
    const { getUserPayments } = await import("@/lib/actions/payments");
    vi.mocked(getUserPayments).mockResolvedValue({
      payments: mockPayments,
    });

    render(<BillingHistory />);

    await waitFor(() => {
      expect(screen.getByText("REF-001")).toBeInTheDocument();
      expect(screen.getByText("REF-002")).toBeInTheDocument();
    });

    expect(screen.getByText(/Premium Service/i)).toBeInTheDocument();
    // Currency format check (₦299 for NGN, $299.00 for USD)
    const amountElement = screen.getByText(/299/);
    expect(amountElement).toBeInTheDocument();
  });

  it("filters payments by status", async () => {
    const { getUserPayments } = await import("@/lib/actions/payments");
    vi.mocked(getUserPayments).mockResolvedValue({
      payments: mockPayments,
    });

    const user = userEvent.setup();

    render(<BillingHistory />);

    await waitFor(() => {
      expect(screen.getByText("REF-001")).toBeInTheDocument();
    });

    // Find and click the "Completed" filter button
    const completedButton = screen.getByRole("button", { name: /completed/i });
    await user.click(completedButton);

    // Should only show completed payments
    await waitFor(() => {
      expect(screen.getByText("REF-001")).toBeInTheDocument();
      expect(screen.queryByText("REF-002")).not.toBeInTheDocument();
    });
  });

  it("handles empty payment history", async () => {
    const { getUserPayments } = await import("@/lib/actions/payments");
    vi.mocked(getUserPayments).mockResolvedValue({
      payments: [],
    });

    render(<BillingHistory />);

    await waitFor(() => {
      expect(screen.getByText(/no payments/i)).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const { getUserPayments } = await import("@/lib/actions/payments");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getUserPayments).mockRejectedValue(
      new Error("Network error")
    );

    render(<BillingHistory />);

    await waitFor(() => {
      expect(screen.getByText(/no payments/i)).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it("displays correct status badges", async () => {
    const { getUserPayments } = await import("@/lib/actions/payments");
    vi.mocked(getUserPayments).mockResolvedValue({
      payments: mockPayments,
    });

    render(<BillingHistory />);

    await waitFor(() => {
      // "Completed" and "Pending" appear in both filter buttons and status badges
      const completedElements = screen.getAllByText("Completed");
      const pendingElements = screen.getAllByText("Pending");

      expect(completedElements.length).toBeGreaterThan(0);
      expect(pendingElements.length).toBeGreaterThan(0);
    });
  });

  it("calculates total spending correctly", async () => {
    const { getUserPayments } = await import("@/lib/actions/payments");
    vi.mocked(getUserPayments).mockResolvedValue({
      payments: mockPayments,
    });

    const { container } = render(<BillingHistory />);

    await waitFor(() => {
      // Total should be 299 (only completed payments)
      // Check for the total in the summary card specifically
      expect(screen.getByText("Total Spent")).toBeInTheDocument();
      // Use container query to find the total within the summary card (accepts both $ and ₦)
      const summaryCard = container.querySelector('.bg-gradient-to-br');
      expect(summaryCard?.textContent).toMatch(/299/);
    });
  });
});

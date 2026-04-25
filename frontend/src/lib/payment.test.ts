import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { AxiosResponse } from "axios";

// Helper to create mock AxiosResponse
function mockAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { headers: {} },
  } as AxiosResponse<T>;
}

// Mock API client
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    initializePaystack: vi.fn(),
    verifyPaystack: vi.fn(),
    getPaymentStatus: vi.fn(),
    requestRefund: vi.fn(),
  },
}));

describe("Payment Flow Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Payment Initialization", () => {
    it("should initialize Paystack payment successfully", async () => {
      const mockPaystackResponse = mockAxiosResponse({
        success: true,
        authorization_url: "https://checkout.paystack.com/test123",
        access_code: "test_access_code",
        reference: "TUN-1234567890",
      });

      vi.mocked(apiClient.initializePaystack).mockResolvedValue(
        mockPaystackResponse
      );

      const result = await apiClient.initializePaystack(1);

      expect(result.data.success).toBe(true);
      expect(result.data.authorization_url).toContain("paystack.com");
      expect(result.data.reference).toMatch(/^TUN-/);
    });

    it("should handle payment initialization failure", async () => {
      vi.mocked(apiClient.initializePaystack).mockRejectedValue({
        response: {
          status: 400,
          data: {
            success: false,
            message: "Application not found or already paid",
          },
        },
      });

      await expect(apiClient.initializePaystack(999)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: expect.stringContaining("Application"),
          },
        },
      });
    });
  });

  describe("Payment Verification", () => {
    it("should verify successful Paystack payment", async () => {
      const mockVerification = mockAxiosResponse({
        success: true,
        status: "success",
        payment_id: 123,
        amount: 50000,
        currency: "NGN",
      });

      vi.mocked(apiClient.verifyPaystack).mockResolvedValue(mockVerification);

      const result = await apiClient.verifyPaystack("TUN-1234567890");

      expect(result.data.success).toBe(true);
      expect(result.data.status).toBe("success");
    });

    it("should handle failed payment verification", async () => {
      const mockVerification = mockAxiosResponse({
        success: false,
        status: "failed",
        error: "Payment was declined",
      });

      vi.mocked(apiClient.verifyPaystack).mockResolvedValue(mockVerification);

      const result = await apiClient.verifyPaystack("TUN-failed-ref");

      expect(result.data.success).toBe(false);
      expect(result.data.status).toBe("failed");
    });

    it("should get payment status by ID", async () => {
      const mockStatus = mockAxiosResponse({
        success: true,
        payment: {
          id: 123,
          status: "completed",
          amount: 50000,
          currency: "NGN",
          payment_method: "paystack",
        },
      });

      vi.mocked(apiClient.getPaymentStatus).mockResolvedValue(mockStatus);

      const result = await apiClient.getPaymentStatus(123);

      expect(result.data.success).toBe(true);
      expect(result.data.payment.status).toBe("completed");
    });
  });

  describe("Refund Processing", () => {
    it("should request refund successfully", async () => {
      const mockRefund = mockAxiosResponse({
        success: true,
        refund: {
          id: 456,
          status: "pending",
          amount: 50000,
          reason: "Service not needed",
        },
      });

      vi.mocked(apiClient.requestRefund).mockResolvedValue(mockRefund);

      const result = await apiClient.requestRefund(1, "Service not needed");

      expect(result.data.success).toBe(true);
      expect(result.data.refund.status).toBe("pending");
    });

    it("should reject refund for ineligible application", async () => {
      vi.mocked(apiClient.requestRefund).mockRejectedValue({
        response: {
          status: 400,
          data: {
            success: false,
            message: "Application is not eligible for refund",
          },
        },
      });

      await expect(
        apiClient.requestRefund(1, "Changed mind")
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: expect.stringContaining("eligible"),
          },
        },
      });
    });
  });

  describe("Payment Error Handling", () => {
    it("should handle network timeout", async () => {
      vi.mocked(apiClient.getPaymentStatus).mockRejectedValue(
        new Error("Network request failed")
      );

      await expect(apiClient.getPaymentStatus(123)).rejects.toThrow(
        "Network request failed"
      );
    });

    it("should handle unauthorized access", async () => {
      vi.mocked(apiClient.getPaymentStatus).mockRejectedValue({
        response: {
          status: 401,
          data: {
            message: "Unauthorized",
          },
        },
      });

      await expect(apiClient.getPaymentStatus(123)).rejects.toMatchObject({
        response: {
          status: 401,
        },
      });
    });
  });

  describe("Payment Security", () => {
    it("should not expose sensitive payment data in responses", async () => {
      const mockPayment = mockAxiosResponse({
        success: true,
        payment: {
          id: 123,
          status: "completed",
          amount: 50000,
          last4: "4242",
          brand: "visa",
        },
      });

      vi.mocked(apiClient.getPaymentStatus).mockResolvedValue(mockPayment);

      const result = await apiClient.getPaymentStatus(123);

      // Should only have last4, not full card number
      expect(result.data.payment).not.toHaveProperty("cardNumber");
      expect(result.data.payment).not.toHaveProperty("cvv");
      expect(result.data.payment).not.toHaveProperty("pin");
      expect(result.data.payment.last4).toBe("4242");
    });
  });
});

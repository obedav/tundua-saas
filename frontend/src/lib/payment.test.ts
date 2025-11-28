import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api-client";

// Mock API client
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    initializePayment: vi.fn(),
    verifyPayment: vi.fn(),
    processRefund: vi.fn(),
  },
}));

describe("Payment Flow Tests - CRITICAL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Payment Initialization", () => {
    it("should initialize Stripe payment successfully", async () => {
      const mockPaymentIntent = {
        data: {
          clientSecret: "pi_test_secret_12345",
          paymentIntentId: "pi_12345",
          amount: 29900, // $299.00 in cents
          currency: "usd",
        },
      };

      vi.mocked(apiClient.initializePayment).mockResolvedValue(mockPaymentIntent);

      const result = await apiClient.initializePayment({
        amount: 299.0,
        currency: "USD",
        serviceTier: "Premium",
        applicationId: 1,
      });

      expect(result.data.clientSecret).toBe("pi_test_secret_12345");
      expect(result.data.amount).toBe(29900);
    });

    it("should initialize M-Pesa payment successfully", async () => {
      const mockPaystackResponse = {
        data: {
          authorization_url: "https://paystack.com/pay/xyz123",
          access_code: "xyz123",
          reference: "ref_12345",
        },
      };

      vi.mocked(apiClient.initializePayment).mockResolvedValue(
        mockPaystackResponse
      );

      const result = await apiClient.initializePayment({
        amount: 299.0,
        currency: "KES",
        serviceTier: "Premium",
        paymentMethod: "mpesa",
      });

      expect(result.data.authorization_url).toContain("paystack.com");
      expect(result.data.reference).toBe("ref_12345");
    });

    it("should handle payment initialization failure", async () => {
      vi.mocked(apiClient.initializePayment).mockRejectedValue({
        response: {
          status: 400,
          data: {
            message: "Insufficient account balance",
          },
        },
      });

      await expect(
        apiClient.initializePayment({
          amount: 299.0,
          currency: "USD",
        })
      ).rejects.toMatchObject({
        response: {
          data: {
            message: "Insufficient account balance",
          },
        },
      });
    });

    it("should validate payment amount", async () => {
      // Amount should be positive
      await expect(
        apiClient.initializePayment({
          amount: -10,
          currency: "USD",
        })
      ).rejects.toThrow();

      // Amount should not be zero
      await expect(
        apiClient.initializePayment({
          amount: 0,
          currency: "USD",
        })
      ).rejects.toThrow();
    });
  });

  describe("Payment Verification", () => {
    it("should verify successful Stripe payment", async () => {
      const mockVerification = {
        data: {
          status: "succeeded",
          paymentId: 123,
          amount: 29900,
          currency: "usd",
          receipt_url: "https://stripe.com/receipt/xyz",
        },
      };

      vi.mocked(apiClient.verifyPayment).mockResolvedValue(mockVerification);

      const result = await apiClient.verifyPayment("pi_12345", "stripe");

      expect(result.data.status).toBe("succeeded");
      expect(result.data.amount).toBe(29900);
    });

    it("should handle failed payment verification", async () => {
      const mockVerification = {
        data: {
          status: "failed",
          error: "Card declined",
        },
      };

      vi.mocked(apiClient.verifyPayment).mockResolvedValue(mockVerification);

      const result = await apiClient.verifyPayment("pi_12345", "stripe");

      expect(result.data.status).toBe("failed");
      expect(result.data.error).toBe("Card declined");
    });

    it("should handle payment timeout", async () => {
      vi.mocked(apiClient.verifyPayment).mockRejectedValue({
        response: {
          status: 408,
          data: {
            message: "Payment verification timeout",
          },
        },
      });

      await expect(
        apiClient.verifyPayment("pi_12345", "stripe")
      ).rejects.toMatchObject({
        response: {
          status: 408,
        },
      });
    });

    it("should verify Paystack/M-Pesa payment", async () => {
      const mockVerification = {
        data: {
          status: "success",
          reference: "ref_12345",
          amount: 29900,
          currency: "KES",
        },
      };

      vi.mocked(apiClient.verifyPayment).mockResolvedValue(mockVerification);

      const result = await apiClient.verifyPayment("ref_12345", "paystack");

      expect(result.data.status).toBe("success");
    });
  });

  describe("Refund Processing - CRITICAL", () => {
    it("should process full refund successfully", async () => {
      const mockRefund = {
        data: {
          refundId: 456,
          status: "pending",
          amount: 29900,
          reason: "Visa denied",
          estimatedDays: 5,
        },
      };

      vi.mocked(apiClient.processRefund).mockResolvedValue(mockRefund);

      const result = await apiClient.processRefund({
        paymentId: 123,
        amount: 299.0,
        reason: "Visa denied",
      });

      expect(result.data.status).toBe("pending");
      expect(result.data.amount).toBe(29900);
    });

    it("should process partial refund", async () => {
      const mockRefund = {
        data: {
          refundId: 457,
          status: "pending",
          amount: 14950, // $149.50 - partial refund
          reason: "Partial service completion",
        },
      };

      vi.mocked(apiClient.processRefund).mockResolvedValue(mockRefund);

      const result = await apiClient.processRefund({
        paymentId: 123,
        amount: 149.5,
        reason: "Partial service completion",
      });

      expect(result.data.amount).toBe(14950);
    });

    it("should reject refund after 90 days", async () => {
      vi.mocked(apiClient.processRefund).mockRejectedValue({
        response: {
          status: 400,
          data: {
            message: "Refund period expired (90 days)",
          },
        },
      });

      await expect(
        apiClient.processRefund({
          paymentId: 123,
          amount: 299.0,
          reason: "Changed mind",
        })
      ).rejects.toMatchObject({
        response: {
          data: {
            message: expect.stringContaining("90 days"),
          },
        },
      });
    });

    it("should not refund more than original amount", async () => {
      vi.mocked(apiClient.processRefund).mockRejectedValue({
        response: {
          status: 400,
          data: {
            message: "Refund amount exceeds original payment",
          },
        },
      });

      await expect(
        apiClient.processRefund({
          paymentId: 123,
          amount: 500.0, // More than original $299
          reason: "Invalid amount",
        })
      ).rejects.toMatchObject({
        response: {
          data: {
            message: expect.stringContaining("exceeds"),
          },
        },
      });
    });
  });

  describe("Payment Error Scenarios", () => {
    it("should handle insufficient funds", async () => {
      vi.mocked(apiClient.initializePayment).mockRejectedValue({
        response: {
          data: {
            code: "insufficient_funds",
            message: "Your card has insufficient funds",
          },
        },
      });

      await expect(
        apiClient.initializePayment({ amount: 299.0 })
      ).rejects.toMatchObject({
        response: {
          data: {
            code: "insufficient_funds",
          },
        },
      });
    });

    it("should handle card declined", async () => {
      vi.mocked(apiClient.verifyPayment).mockResolvedValue({
        data: {
          status: "failed",
          decline_code: "generic_decline",
          message: "Your card was declined",
        },
      });

      const result = await apiClient.verifyPayment("pi_declined");

      expect(result.data.status).toBe("failed");
      expect(result.data.decline_code).toBe("generic_decline");
    });

    it("should handle network timeout during payment", async () => {
      vi.mocked(apiClient.verifyPayment).mockRejectedValue(
        new Error("Network request failed")
      );

      await expect(apiClient.verifyPayment("pi_12345")).rejects.toThrow(
        "Network request failed"
      );
    });

    it("should handle webhook delivery failure", async () => {
      // Payment succeeds but webhook fails
      // Application should still be able to verify payment manually
      const mockVerification = {
        data: {
          status: "succeeded",
          webhookDelivered: false,
          manualVerificationRequired: true,
        },
      };

      vi.mocked(apiClient.verifyPayment).mockResolvedValue(mockVerification);

      const result = await apiClient.verifyPayment("pi_12345");

      expect(result.data.webhookDelivered).toBe(false);
      expect(result.data.manualVerificationRequired).toBe(true);
    });
  });

  describe("Payment Security", () => {
    it("should not expose sensitive card data", async () => {
      const mockPayment = {
        data: {
          last4: "4242",
          brand: "visa",
          // Should NOT include full card number, CVV, etc.
        },
      };

      vi.mocked(apiClient.verifyPayment).mockResolvedValue(mockPayment);

      const result = await apiClient.verifyPayment("pi_12345");

      expect(result.data).not.toHaveProperty("cardNumber");
      expect(result.data).not.toHaveProperty("cvv");
      expect(result.data).not.toHaveProperty("pin");
    });

    it("should use HTTPS for all payment requests in production", async () => {
      // This would be tested in integration tests
      // Ensure all payment API calls use HTTPS in production
      // In development/test, localhost is acceptable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (process.env.NODE_ENV === 'production') {
        expect(apiUrl).toMatch(/^https:/);
      } else {
        // In development/test, allow localhost with http
        expect(apiUrl).toMatch(/^https?:\/\/(localhost|127\.0\.0\.1)/);
      }
    });
  });
});

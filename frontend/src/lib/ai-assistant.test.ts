import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  analyzeDocument,
  getFormSuggestions,
  checkDocumentRequirements,
  generateApplicationTips,
  answerVisaQuestion,
} from "./ai-assistant";

// Create a mock messages.create function
const mockCreate = vi.fn();

// Mock Anthropic SDK
vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: vi.fn().mockImplementation(function() {
      return {
        messages: {
          create: mockCreate,
        },
      };
    }),
  };
});

describe("AI Assistant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockClear();
    process.env.ANTHROPIC_API_KEY = "test-api-key";
  });

  describe("analyzeDocument", () => {
    it("should analyze document and return structured data", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              document_type: "passport",
              extracted_data: {
                name: "John Doe",
                passport_number: "AB123456",
                expiry_date: "2030-01-01",
              },
              suggestions: ["Ensure passport is valid for 6+ months"],
              confidence: 0.95,
            }),
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const result = await analyzeDocument("base64string", "passport");

      expect(result.document_type).toBe("passport");
      expect(result.extracted_data.name).toBe("John Doe");
      expect(result.confidence).toBe(0.95);
    });
  });

  describe("getFormSuggestions", () => {
    it("should provide smart form field suggestions", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify([
              {
                field: "destination_country",
                suggestion: "United States",
                reason: "Based on your selected university",
              },
            ]),
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const result = await getFormSuggestions("destination_country", {
        university: "MIT",
      });

      expect(result).toHaveLength(1);
      expect(result[0].field).toBe("destination_country");
      expect(result[0].suggestion).toBe("United States");
    });
  });

  describe("checkDocumentRequirements", () => {
    it("should identify missing and complete documents", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              missing: ["Bank Statement", "Letter of Acceptance"],
              optional: ["Recommendation Letter"],
              complete: ["Passport", "Photograph"],
              tips: ["Ensure all documents are notarized"],
            }),
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const result = await checkDocumentRequirements(
        "USA",
        "F-1 Student Visa",
        ["Passport", "Photograph"]
      );

      expect(result.missing).toContain("Bank Statement");
      expect(result.complete).toContain("Passport");
      expect(result.tips).toHaveLength(1);
    });
  });

  describe("generateApplicationTips", () => {
    it("should generate personalized tips", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify([
              "Submit application 2-3 months before travel date",
              "Ensure all documents are properly translated",
              "Prepare for visa interview with common questions",
            ]),
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const result = await generateApplicationTips({
        country: "USA",
        visa_type: "F-1",
      });

      expect(result).toHaveLength(3);
      expect(result[0]).toContain("application");
    });
  });

  describe("answerVisaQuestion", () => {
    it("should provide helpful answers to visa questions", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: "Processing time for an F-1 visa typically ranges from 3-5 weeks, but can vary by location.",
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const result = await answerVisaQuestion(
        "How long does it take to get an F-1 visa?",
        { country: "USA", visaType: "F-1" }
      );

      expect(result).toContain("3-5 weeks");
      expect(result).toContain("F-1 visa");
    });
  });

  it("should throw error when API key is not configured", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    await expect(
      analyzeDocument("base64string", "passport")
    ).rejects.toThrow("ANTHROPIC_API_KEY is not configured");
  });
});

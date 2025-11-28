/**
 * AI Document Assistant - 2026 Feature
 *
 * Provides intelligent document analysis, form auto-fill,
 * and smart suggestions using Claude AI
 */

import Anthropic from "@anthropic-ai/sdk";

// Initialize Claude client (server-side only)
const getAnthropicClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
};

export interface DocumentAnalysis {
  document_type: string;
  extracted_data: Record<string, any>;
  suggestions: string[];
  confidence: number;
  issues?: string[];
}

export interface FormAssistance {
  field: string;
  suggestion: string;
  reason: string;
}

/**
 * Analyze uploaded document using Claude Vision
 */
export async function analyzeDocument(
  documentBase64: string,
  documentType: string
): Promise<DocumentAnalysis> {
  const client = getAnthropicClient();

  const prompt = `You are an expert document analyst for visa applications. Analyze this ${documentType} and extract relevant information.

Return a JSON response with:
1. document_type: The type of document
2. extracted_data: Key information extracted (names, dates, numbers, etc.)
3. suggestions: Helpful suggestions for the user
4. confidence: Your confidence level (0-1)
5. issues: Any problems or missing information

Be thorough and helpful.`;

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: documentBase64,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Parse JSON response
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from Claude");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Get smart form field suggestions
 */
export async function getFormSuggestions(
  fieldName: string,
  currentContext: Record<string, any>,
  userProfile?: Record<string, any>
): Promise<FormAssistance[]> {
  const client = getAnthropicClient();

  const prompt = `You are helping a user fill out a visa application form. The current field is "${fieldName}".

Current form context: ${JSON.stringify(currentContext, null, 2)}
User profile: ${JSON.stringify(userProfile || {}, null, 2)}

Provide 2-3 smart suggestions for the "${fieldName}" field. Return JSON array with:
[
  {
    "field": "field_name",
    "suggestion": "suggested value",
    "reason": "why this is suggested"
  }
]

Be specific, helpful, and consider the context.`;

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from Claude");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Check document requirements for a specific country/visa type
 */
export async function checkDocumentRequirements(
  country: string,
  visaType: string,
  providedDocuments: string[]
): Promise<{
  missing: string[];
  optional: string[];
  complete: string[];
  tips: string[];
}> {
  const client = getAnthropicClient();

  const prompt = `You are a visa application expert. Check the document requirements for:
- Country: ${country}
- Visa Type: ${visaType}
- Documents provided: ${providedDocuments.join(", ")}

Return JSON with:
{
  "missing": ["required documents not provided"],
  "optional": ["optional documents that would strengthen application"],
  "complete": ["required documents that are provided"],
  "tips": ["helpful tips for this specific application"]
}`;

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1536,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from Claude");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Generate personalized application tips
 */
export async function generateApplicationTips(
  applicationData: Record<string, any>
): Promise<string[]> {
  const client = getAnthropicClient();

  const prompt = `Based on this visa application data, provide 5 personalized tips to improve the chances of approval:

${JSON.stringify(applicationData, null, 2)}

Return a JSON array of specific, actionable tips: ["tip1", "tip2", ...]`;

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from Claude");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Answer user questions about the visa process
 */
export async function answerVisaQuestion(
  question: string,
  context?: {
    country?: string;
    visaType?: string;
    userProfile?: Record<string, any>;
  }
): Promise<string> {
  const client = getAnthropicClient();

  const contextStr = context
    ? `\n\nContext:\n- Country: ${context.country || "N/A"}\n- Visa Type: ${context.visaType || "N/A"}\n- User Profile: ${JSON.stringify(context.userProfile || {})}`
    : "";

  const prompt = `You are a knowledgeable visa application assistant. Answer this question clearly and helpfully:

Question: ${question}${contextStr}

Provide a concise, accurate, and helpful answer.`;

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textContent.text;
}

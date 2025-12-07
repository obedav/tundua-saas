/**
 * AI Usage Tracker
 *
 * Tracks AI API usage for:
 * - Cost monitoring and alerts
 * - User analytics
 * - Rate limit enforcement
 * - Billing integration (future)
 */

import { clientEnv } from "@/lib/env";

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

/**
 * Claude 3.5 Sonnet Pricing (as of Dec 2024)
 * Input: $3 per 1M tokens
 * Output: $15 per 1M tokens
 */
const PRICING = {
  inputTokenPer1M: 3.0, // USD
  outputTokenPer1M: 15.0, // USD
};

export interface AIUsageData {
  userId: number;
  action: string;
  tokensInput: number;
  tokensOutput: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
}

export interface AIUsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCostUSD: number;
  averageDuration: number;
  successRate: number;
}

/**
 * Track AI usage to backend
 */
export async function trackAIUsage(data: AIUsageData): Promise<void> {
  try {
    const costUSD = calculateCost(data.tokensInput, data.tokensOutput);

    const payload = {
      user_id: data.userId,
      action_type: data.action,
      tokens_input: data.tokensInput,
      tokens_output: data.tokensOutput,
      cost_usd: costUSD,
      duration_ms: data.durationMs,
      success: data.success,
      error_message: data.errorMessage || null,
      metadata: {
        timestamp: new Date().toISOString(),
        model: "claude-3-5-sonnet-20241022",
      },
    };

    // Send to backend asynchronously (don't block the response)
    fetch(`${API_URL}/api/ai/usage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.error("Failed to track AI usage:", error);
      // Silent fail - don't throw to avoid breaking the main request
    });

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("📊 AI Usage Tracked:", {
        action: data.action,
        tokens: data.tokensInput + data.tokensOutput,
        cost: `$${costUSD.toFixed(4)}`,
        duration: `${data.durationMs}ms`,
      });
    }
  } catch (error) {
    console.error("AI usage tracking error:", error);
    // Silent fail
  }
}

/**
 * Calculate cost based on token usage
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (inputTokens / 1_000_000) * PRICING.inputTokenPer1M;
  const outputCost = (outputTokens / 1_000_000) * PRICING.outputTokenPer1M;
  return inputCost + outputCost;
}

/**
 * Get user AI usage statistics (for dashboard)
 */
export async function getUserAIUsageStats(
  _userId: number,
  token: string,
  period: "day" | "week" | "month" = "month"
): Promise<AIUsageStats | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/ai/usage/stats?period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.stats || null;
  } catch (error) {
    console.error("Failed to fetch AI usage stats:", error);
    return null;
  }
}

/**
 * Check if user is approaching rate limit
 */
export async function checkAIQuota(
  _userId: number,
  token: string
): Promise<{
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
}> {
  try {
    const response = await fetch(`${API_URL}/api/ai/usage/quota`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { used: 0, limit: 10, remaining: 10, resetAt: "" };
    }

    const data = await response.json();
    return data.quota;
  } catch (error) {
    console.error("Failed to check AI quota:", error);
    return { used: 0, limit: 10, remaining: 10, resetAt: "" };
  }
}

/**
 * Format cost for display
 */
export function formatCost(usd: number): string {
  if (usd < 0.01) {
    return "< $0.01";
  }
  return `$${usd.toFixed(2)}`;
}

/**
 * Estimate cost for action before execution
 */
export function estimateActionCost(action: string): number {
  const estimates: Record<string, { input: number; output: number }> = {
    form_suggestions: { input: 300, output: 500 },
    check_documents: { input: 250, output: 800 },
    application_tips: { input: 600, output: 1000 },
    ask_question: { input: 150, output: 400 },
    sop_generation: { input: 1000, output: 2000 }, // Future feature
    resume_review: { input: 800, output: 1500 }, // Future feature
  };

  const tokens = estimates[action] || { input: 200, output: 500 };
  return calculateCost(tokens.input, tokens.output);
}

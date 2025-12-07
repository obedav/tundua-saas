import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getFormSuggestions,
  checkDocumentRequirements,
  generateApplicationTips,
  answerVisaQuestion,
} from "@/lib/ai-assistant";
import { rateLimiters, getRateLimitIdentifier } from "@/lib/rate-limit";
import { trackAIUsage } from "@/lib/ai-usage-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AI Suggestions API Route (SECURED)
 * POST /api/ai/suggestions
 *
 * Security Features:
 * - Authentication required
 * - Rate limiting (10 calls/hour for free users)
 * - Input validation and sanitization
 * - Usage tracking for cost monitoring
 */
export async function POST(request: NextRequest) {
  try {
    // 1. AUTHENTICATION CHECK
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user from token
    const userResponse = await fetch(
      `${process.env['NEXT_PUBLIC_API_URL']}/api/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userData = await userResponse.json();
    const user = userData.user || userData.data || userData;

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // 2. RATE LIMITING (AI-specific)
    const identifier = getRateLimitIdentifier(request, user.id.toString());
    const aiRateLimiter = rateLimiters.ai || rateLimiters.api;
    const rateLimitResult = await aiRateLimiter.limit(identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many AI requests. Please try again later.",
          resetAt: new Date(rateLimitResult.reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // 3. INPUT VALIDATION
    const body = await request.json();
    const { action, ...params } = body;

    // Validate action type
    const validActions = [
      "form_suggestions",
      "check_documents",
      "application_tips",
      "ask_question",
    ];

    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action specified" },
        { status: 400 }
      );
    }

    // Sanitize inputs (prevent prompt injection)
    const sanitizedParams = sanitizeAIInputs(params);

    // Verify AI is configured
    if (!process.env['ANTHROPIC_API_KEY']) {
      return NextResponse.json(
        { error: "AI features are not configured" },
        { status: 503 }
      );
    }

    // 4. EXECUTE AI ACTION
    const startTime = Date.now();
    let result;
    let tokensUsed = { input: 0, output: 0 };

    switch (action) {
      case "form_suggestions":
        result = await getFormSuggestions(
          sanitizedParams.fieldName,
          sanitizedParams.currentContext,
          sanitizedParams.userProfile
        );
        tokensUsed = estimateTokens(action, sanitizedParams);
        break;

      case "check_documents":
        result = await checkDocumentRequirements(
          sanitizedParams.country,
          sanitizedParams.visaType,
          sanitizedParams.providedDocuments
        );
        tokensUsed = estimateTokens(action, sanitizedParams);
        break;

      case "application_tips":
        result = await generateApplicationTips(sanitizedParams.applicationData);
        tokensUsed = estimateTokens(action, sanitizedParams);
        break;

      case "ask_question":
        result = await answerVisaQuestion(
          sanitizedParams.question,
          sanitizedParams.context
        );
        tokensUsed = estimateTokens(action, sanitizedParams);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }

    const duration = Date.now() - startTime;

    // 5. TRACK USAGE (for cost monitoring and analytics)
    await trackAIUsage({
      userId: user.id,
      action,
      tokensInput: tokensUsed.input,
      tokensOutput: tokensUsed.output,
      durationMs: duration,
      success: true,
    }).catch((error) => {
      // Don't fail the request if tracking fails
      console.error("Failed to track AI usage:", error);
    });

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        tokensUsed: tokensUsed.input + tokensUsed.output,
        duration,
        rateLimitRemaining: rateLimitResult.remaining,
      },
    });
  } catch (error: any) {
    console.error("AI Suggestion Error:", error);

    // Track failed request
    await trackAIUsage({
      userId: (error as any).userId || 0,
      action: (error as any).action || "unknown",
      tokensInput: 0,
      tokensOutput: 0,
      durationMs: 0,
      success: false,
      errorMessage: error.message,
    }).catch(() => {
      // Silent fail for tracking errors
    });

    return NextResponse.json(
      {
        error: "Failed to generate AI suggestions",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Sanitize AI inputs to prevent prompt injection
 */
function sanitizeAIInputs(params: any): any {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      // Remove potential prompt injection patterns
      sanitized[key] = value
        .replace(/system:/gi, "")
        .replace(/assistant:/gi, "")
        .replace(/human:/gi, "")
        .replace(/<\|.*?\|>/g, "")
        .trim()
        .slice(0, 5000); // Max 5000 chars per field
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? item.slice(0, 1000) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Estimate token usage for cost tracking
 * Claude pricing: $3/1M input, $15/1M output tokens
 */
function estimateTokens(
  action: string,
  _params: any
): { input: number; output: number } {
  const estimates: Record<
    string,
    { input: number; output: number }
  > = {
    form_suggestions: { input: 300, output: 500 },
    check_documents: { input: 250, output: 800 },
    application_tips: { input: 600, output: 1000 },
    ask_question: { input: 150, output: 400 },
  };

  return estimates[action] || { input: 200, output: 500 };
}

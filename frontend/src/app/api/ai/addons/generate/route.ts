import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  generateSOP,
  generateUniversityReport,
  optimizeResume,
  estimateAddonTokens,
  type SOPGenerationRequest,
  type UniversityReportRequest,
  type ResumeOptimizationRequest,
} from "@/lib/ai-addons-generator";
import { rateLimiters, getRateLimitIdentifier } from "@/lib/rate-limit";
import { trackAIUsage } from "@/lib/ai-usage-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds for longer generations

/**
 * AI Addon Generation API Route (SECURED)
 * POST /api/ai/addons/generate
 *
 * Generates AI-powered addon services:
 * - SOP (Statement of Purpose)
 * - University Selection Report
 * - Resume/CV Optimization
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
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // 2. RATE LIMITING
    // AI addon generation is more expensive, so stricter limits
    const identifier = getRateLimitIdentifier(request, user.id.toString());
    const addonRateLimiter = rateLimiters.ai || rateLimiters.api;
    const rateLimitResult = await addonRateLimiter.limit(identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many generation requests. Please wait before trying again.",
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

    // 3. PARSE AND VALIDATE REQUEST
    const body = await request.json();
    const { type, ...params } = body;

    const validTypes = ["sop", "university_report", "resume_optimization"];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid generation type. Must be: sop, university_report, or resume_optimization" },
        { status: 400 }
      );
    }

    // Verify AI is configured
    const aiProvider = process.env['AI_PROVIDER'] || 'gemini';
    const hasGeminiKey = process.env['GOOGLE_GEMINI_API_KEY'] || process.env['GEMINI_API_KEY'];
    const hasAnthropicKey = process.env['ANTHROPIC_API_KEY'];

    if (aiProvider === 'gemini' && !hasGeminiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 503 }
      );
    }

    if (aiProvider === 'anthropic' && !hasAnthropicKey) {
      return NextResponse.json(
        { error: "Anthropic API key is not configured" },
        { status: 503 }
      );
    }

    // If using Gemini but it's not available, check for Anthropic fallback
    if (!hasGeminiKey && !hasAnthropicKey) {
      return NextResponse.json(
        { error: "No AI provider is configured (Gemini or Anthropic)" },
        { status: 503 }
      );
    }

    // 4. GENERATE DOCUMENT
    const startTime = Date.now();
    let result: any;
    let tokensUsed = { input: 0, output: 0 };
    let actionType = "";

    try {
      switch (type) {
        case "sop":
          actionType = "sop_generation";
          result = await generateSOP(params as SOPGenerationRequest);
          tokensUsed = estimateAddonTokens(
            actionType,
            JSON.stringify(params).length
          );
          break;

        case "university_report":
          actionType = "university_report";
          result = await generateUniversityReport(
            params as UniversityReportRequest
          );
          tokensUsed = estimateAddonTokens(
            actionType,
            JSON.stringify(params).length
          );
          break;

        case "resume_optimization":
          actionType = "resume_optimization";
          result = await optimizeResume(params as ResumeOptimizationRequest);
          tokensUsed = estimateAddonTokens(
            actionType,
            params.currentResume?.length || 1000
          );
          break;

        default:
          throw new Error("Invalid type");
      }
    } catch (generationError: any) {
      // Track failed generation
      await trackAIUsage({
        userId: user.id,
        action: actionType || type,
        tokensInput: 0,
        tokensOutput: 0,
        durationMs: Date.now() - startTime,
        success: false,
        errorMessage: generationError.message,
      }).catch(() => {
        // Silent fail
      });

      throw generationError;
    }

    const duration = Date.now() - startTime;

    // 5. TRACK USAGE
    await trackAIUsage({
      userId: user.id,
      action: actionType,
      tokensInput: tokensUsed.input,
      tokensOutput: tokensUsed.output,
      durationMs: duration,
      success: true,
    }).catch((error) => {
      console.error("Failed to track AI usage:", error);
    });

    // 6. RETURN RESPONSE
    return NextResponse.json({
      success: true,
      type,
      data: result,
      meta: {
        tokensUsed: tokensUsed.input + tokensUsed.output,
        duration,
        rateLimitRemaining: rateLimitResult.remaining,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("AI addon generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate document",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * Get available AI addon types and their pricing
 * GET /api/ai/addons/generate
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    availableTypes: [
      {
        type: "sop",
        name: "Statement of Purpose (SOP) Generation",
        description:
          "AI-generated Statement of Purpose based on your narrative",
        estimatedCost: 0.02, // USD
        estimatedDuration: "30-60 seconds",
        requiredFields: [
          "fullName",
          "nationality",
          "currentEducation",
          "targetDegree",
          "targetUniversity",
          "targetCountry",
          "academicBackground",
          "careerGoals",
          "whyThisProgram",
        ],
      },
      {
        type: "university_report",
        name: "University Selection Report",
        description:
          "Personalized university recommendations based on your profile",
        estimatedCost: 0.025, // USD
        estimatedDuration: "45-90 seconds",
        requiredFields: ["field", "degree", "gpa", "budget"],
      },
      {
        type: "resume_optimization",
        name: "Resume/CV Optimization",
        description: "AI-optimized resume for maximum impact",
        estimatedCost: 0.018, // USD
        estimatedDuration: "30-60 seconds",
        requiredFields: ["currentResume", "targetField", "targetLevel"],
      },
    ],
    rateLimit: {
      requests: 10,
      window: "1 hour",
    },
  });
}

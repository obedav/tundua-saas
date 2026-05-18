import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { answerVisaQuestion } from "@/lib/ai-assistant";
import { rateLimiters, getRateLimitIdentifier } from "@/lib/rate-limit";
import { trackAIUsage } from "@/lib/ai-usage-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userResponse = await fetch(
      `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userData = await userResponse.json();
    const user = userData.user || userData.data || userData;

    if (!user?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const identifier = getRateLimitIdentifier(request, user.id.toString());
    const rateLimitResult = await (rateLimiters.ai || rateLimiters.api).limit(identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded", message: "Too many AI requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sanitizedMessage = message
      .replace(/system:/gi, "")
      .replace(/assistant:/gi, "")
      .replace(/human:/gi, "")
      .replace(/<\|.*?\|>/g, "")
      .trim()
      .slice(0, 2000);

    if (!process.env['ANTHROPIC_API_KEY']) {
      return NextResponse.json({ error: "AI features are not configured" }, { status: 503 });
    }

    const startTime = Date.now();
    const answer = await answerVisaQuestion(sanitizedMessage, context);
    const duration = Date.now() - startTime;

    await trackAIUsage({
      userId: user.id,
      action: "visa_chat",
      tokensInput: 150,
      tokensOutput: 400,
      durationMs: duration,
      success: true,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: { answer },
      meta: { duration, rateLimitRemaining: rateLimitResult.remaining },
    });
  } catch (error: any) {
    console.error("Visa chat error:", error);
    return NextResponse.json(
      { error: "Failed to get answer", message: error.message },
      { status: 500 }
    );
  }
}

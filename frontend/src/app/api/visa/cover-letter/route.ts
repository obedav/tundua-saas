import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimiters, getRateLimitIdentifier } from "@/lib/rate-limit";
import { trackAIUsage } from "@/lib/ai-usage-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const userResponse = await fetch(
      `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!userResponse.ok) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }

    const userData = await userResponse.json();
    const user = userData.user || userData.data || userData;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
    }

    const identifier = getRateLimitIdentifier(request, user.id.toString());
    const rateLimitResult = await (rateLimiters.ai || rateLimiters.api).limit(identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Too many AI requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { destination, visaType, applicantName, applicantJob, travelPurpose, stayDuration } = body;

    if (!destination || !visaType) {
      return NextResponse.json({ error: "Destination and visa type are required" }, { status: 400 });
    }

    if (!process.env['ANTHROPIC_API_KEY']) {
      return NextResponse.json({ success: false, error: "AI features are not configured on this server" }, { status: 503 });
    }

    const client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });

    const nameStr = applicantName?.trim() || "[Your Full Name]";
    const jobStr = applicantJob?.trim() || "[Your Profession]";
    const purposeStr = travelPurpose?.trim() || `Visit ${destination} for tourism and personal reasons`;
    const durationStr = stayDuration || "approximately 3 weeks";

    const prompt = `Write a professional visa cover letter for a Nigerian passport holder applying for a ${visaType} visa to ${destination}.

Applicant details:
- Name: ${nameStr}
- Profession: ${jobStr}
- Purpose: ${purposeStr}
- Duration: ${durationStr}

Write a formal, well-structured cover letter that:
1. Addresses the correct authority (e.g., "The Visa Officer, [Country] High Commission / Embassy, Lagos")
2. Clearly states the purpose and duration of the visit
3. Demonstrates financial capability (references attached bank statements and employment letter)
4. Shows strong ties to Nigeria: employment, property at [Your Address], family dependents
5. Confirms a clear intention to return before the visa expires
6. Has a professional but genuine tone — not robotic or over-formal
7. Uses realistic placeholder markers like [Your Passport Number], [Company Name], [Your Address], [Phone Number], [Email Address] for details the applicant fills in
8. Length: 350–450 words

Write ONLY the cover letter text. No preamble, no commentary after.`;

    const startTime = Date.now();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const duration = Date.now() - startTime;
    const textContent = response.content.find((c) => c.type === "text");

    if (!textContent || textContent.type !== "text") {
      throw new Error("No response from AI");
    }

    await trackAIUsage({
      userId: user.id,
      action: "visa_cover_letter",
      tokensInput: response.usage.input_tokens,
      tokensOutput: response.usage.output_tokens,
      durationMs: duration,
      success: true,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: { letter: textContent.text },
      meta: { duration, rateLimitRemaining: rateLimitResult.remaining },
    });
  } catch (error: any) {
    console.error("Cover letter error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter", message: error.message },
      { status: 500 }
    );
  }
}

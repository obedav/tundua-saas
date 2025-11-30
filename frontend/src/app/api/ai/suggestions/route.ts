import { NextRequest, NextResponse } from "next/server";
import {
  getFormSuggestions,
  checkDocumentRequirements,
  generateApplicationTips,
  answerVisaQuestion,
} from "@/lib/ai-assistant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AI Suggestions API Route
 * POST /api/ai/suggestions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    // Verify AI is configured
    if (!process.env['ANTHROPIC_API_KEY']) {
      return NextResponse.json(
        { error: "AI features are not configured" },
        { status: 503 }
      );
    }

    let result;

    switch (action) {
      case "form_suggestions":
        result = await getFormSuggestions(
          params.fieldName,
          params.currentContext,
          params.userProfile
        );
        break;

      case "check_documents":
        result = await checkDocumentRequirements(
          params.country,
          params.visaType,
          params.providedDocuments
        );
        break;

      case "application_tips":
        result = await generateApplicationTips(params.applicationData);
        break;

      case "ask_question":
        result = await answerVisaQuestion(params.question, params.context);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("AI Suggestion Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate AI suggestions",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

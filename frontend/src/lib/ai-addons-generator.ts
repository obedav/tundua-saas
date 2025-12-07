/**
 * AI-Powered Addons Generator
 *
 * Supports multiple AI providers:
 * - Google Gemini (FREE - 1,500 requests/day)
 * - Anthropic Claude ($5 minimum)
 *
 * Generates high-quality documents:
 * - Statement of Purpose (SOP)
 * - University Selection Reports
 * - Resume/CV Optimization
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  generateSOPWithGemini,
  generateUniversityReportWithGemini,
  optimizeResumeWithGemini
} from './ai-providers/gemini-provider'

// AI Provider Configuration
const AI_PROVIDER = process.env['AI_PROVIDER'] || 'gemini' // Default to free Gemini
const USE_GEMINI = AI_PROVIDER === 'gemini'

// Anthropic setup (fallback)
const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'] || "",
});

const MODEL = "claude-3-5-sonnet-20241022";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SOPGenerationRequest {
  // Student Profile
  fullName: string;
  nationality: string;
  currentEducation: string; // e.g., "Bachelor's in Computer Science"
  gpa?: string;
  workExperience?: string;

  // Target Program
  targetDegree: string; // e.g., "Master's in Data Science"
  targetUniversity: string;
  targetCountry: string;

  // Narrative (Student's story in their own words)
  academicBackground: string; // 200+ words
  careerGoals: string; // 200+ words
  whyThisProgram: string; // 200+ words
  achievements?: string; // Optional: awards, publications, projects
  challenges?: string; // Optional: obstacles overcome

  // Preferences
  tone?: "formal" | "conversational" | "balanced"; // Default: balanced
  wordCount?: number; // Default: 700
}

export interface SOPGenerationResponse {
  sop: string;
  wordCount: number;
  suggestions: string[];
  estimatedQuality: "excellent" | "good" | "needs-review";
}

export interface UniversityReportRequest {
  // Student Profile
  field: string; // e.g., "Computer Science"
  degree: string; // e.g., "Master's"
  gpa: number;
  budget: number; // USD per year
  country?: string; // Optional: preferred country

  // Preferences
  priorities?: string[]; // e.g., ["research", "location", "ranking"]
  careerGoal?: string;
}

export interface UniversityReportResponse {
  recommendations: UniversityRecommendation[];
  summary: string;
  admissionTips: string[];
}

export interface UniversityRecommendation {
  name: string;
  country: string;
  ranking?: string;
  tuitionRange: string;
  casDeposit?: string; // CAS deposit for UK universities (e.g., "£2,500 (refundable)")
  livingCosts?: string; // Estimated living expenses (e.g., "$12,000-15,000/year")
  admissionProbability: "high" | "medium" | "low";
  reasoning: string;
  strengths: string[];
  programFit: string;
}

export interface ResumeOptimizationRequest {
  currentResume: string; // Raw text or structured data
  targetField: string; // e.g., "Data Science"
  targetLevel: string; // e.g., "Graduate School", "Entry-level Job"
  targetCountry?: string;
}

export interface ResumeOptimizationResponse {
  optimizedResume: string;
  improvements: {
    category: string; // e.g., "Action Verbs", "Quantification"
    suggestions: string[];
  }[];
  missingElements: string[];
  overallScore: number; // 0-100
}

// ============================================================================
// SOP GENERATION
// ============================================================================

/**
 * Generate Statement of Purpose using AI (Gemini or Claude)
 */
export async function generateSOP(
  request: SOPGenerationRequest
): Promise<SOPGenerationResponse> {
  // Use Gemini if configured (FREE!)
  if (USE_GEMINI) {
    try {
      const sop = await generateSOPWithGemini({
        ...request,
        tone: request.tone || 'balanced',
        wordCount: request.wordCount || 700
      })

      const actualWordCount = sop.split(/\s+/).filter(Boolean).length

      return {
        sop,
        wordCount: actualWordCount,
        estimatedQuality: actualWordCount >= (request.wordCount || 700) * 0.9 ? 'excellent' : 'good',
        suggestions: []
      }
    } catch (error: any) {
      // If Gemini fails, fall back to Anthropic if available
      if (!process.env['ANTHROPIC_API_KEY']) {
        throw new Error(`Gemini failed: ${error.message}. No fallback API configured.`)
      }
      console.warn('Gemini failed, falling back to Anthropic:', error.message)
      // Continue to Anthropic code below
    }
  }

  const tone = request.tone || "balanced";
  const wordCount = request.wordCount || 700;

  const prompt = `You are an expert academic writing consultant specializing in graduate school applications. Generate a compelling Statement of Purpose based on the student's narrative.

STUDENT PROFILE:
- Name: ${request.fullName}
- Nationality: ${request.nationality}
- Current Education: ${request.currentEducation}
${request.gpa ? `- GPA: ${request.gpa}` : ""}
${request.workExperience ? `- Work Experience: ${request.workExperience}` : ""}

TARGET PROGRAM:
- Degree: ${request.targetDegree}
- University: ${request.targetUniversity}
- Country: ${request.targetCountry}

STUDENT'S NARRATIVE:

Academic Background:
${request.academicBackground}

Career Goals:
${request.careerGoals}

Why This Program:
${request.whyThisProgram}

${request.achievements ? `Achievements:\n${request.achievements}\n` : ""}
${request.challenges ? `Challenges Overcome:\n${request.challenges}\n` : ""}

REQUIREMENTS:
1. Write a ${wordCount}-word Statement of Purpose
2. Tone: ${tone === "formal" ? "Highly formal and academic" : tone === "conversational" ? "Warm and personal while maintaining professionalism" : "Balanced between formal and personal"}
3. Structure:
   - Opening hook (personal anecdote or motivation)
   - Academic background and preparation
   - Professional/research experience (if applicable)
   - Why this specific program and university
   - Career goals and how the program helps achieve them
   - Conclusion (compelling summary)

4. Writing guidelines:
   - Use strong, specific examples
   - Quantify achievements where possible
   - Show, don't just tell
   - Connect past experiences to future goals
   - Demonstrate knowledge of the program
   - Avoid clichés and generic statements
   - Maintain authentic voice while being persuasive

5. Output format:
   {
     "sop": "The complete Statement of Purpose text",
     "wordCount": actual_word_count,
     "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
     "estimatedQuality": "excellent" | "good" | "needs-review"
   }

Generate the SOP now. Return ONLY valid JSON.`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      temperature: 0.7, // Creative but consistent
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Parse JSON response
    const jsonMatch = ('text' in content ? content.text : '').match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]) as SOPGenerationResponse;

    // Validate quality
    if (result.wordCount < wordCount * 0.9 || result.wordCount > wordCount * 1.1) {
      result.estimatedQuality = "needs-review";
      result.suggestions.push(
        `Word count is ${result.wordCount}, target was ${wordCount}. Consider revising.`
      );
    }

    return result;
  } catch (error) {
    console.error("SOP generation error:", error);
    throw new Error("Failed to generate SOP. Please try again.");
  }
}

// ============================================================================
// UNIVERSITY SELECTION REPORT
// ============================================================================

/**
 * Generate University Selection Report using AI (Gemini or Claude)
 */
export async function generateUniversityReport(
  request: UniversityReportRequest
): Promise<UniversityReportResponse> {
  // Use Gemini if configured (FREE!)
  if (USE_GEMINI) {
    try {
      const result = await generateUniversityReportWithGemini(request)
      return result
    } catch (error: any) {
      // If Gemini fails, fall back to Anthropic if available
      if (!process.env['ANTHROPIC_API_KEY']) {
        throw new Error(`Gemini failed: ${error.message}. No fallback API configured.`)
      }
      console.warn('Gemini failed, falling back to Anthropic:', error.message)
      // Continue to Anthropic code below
    }
  }

  const prompt = `You are a university admissions consultant. Generate a personalized university selection report.

STUDENT PROFILE:
- Field of Study: ${request.field}
- Degree Level: ${request.degree}
- GPA: ${request.gpa}
- Budget: $${request.budget.toLocaleString()} USD/year
${request.country ? `- Preferred Country: ${request.country}` : ""}
${request.priorities ? `- Priorities: ${request.priorities.join(", ")}` : ""}
${request.careerGoal ? `- Career Goal: ${request.careerGoal}` : ""}

TASK:
Generate a comprehensive university selection report with:
1. 10 personalized university recommendations
2. Each recommendation must include:
   - University name and country
   - World/regional ranking (if available)
   - Tuition range
   - Admission probability (high/medium/low) based on student's GPA
   - Detailed reasoning for recommendation
   - Program strengths (3-4 points)
   - Program fit analysis

3. Overall summary (100-150 words)
4. 5 admission tips specific to this student's profile

REQUIREMENTS:
- Recommend diverse universities (safety, target, reach)
- Consider budget constraints
- Mix well-known and hidden gem institutions
- Be realistic about admission chances
- Provide actionable insights

Output format (JSON):
{
  "recommendations": [
    {
      "name": "University Name",
      "country": "Country",
      "ranking": "QS/THE ranking or 'Top 100 in region'",
      "tuitionRange": "$X,000 - $Y,000/year",
      "admissionProbability": "high" | "medium" | "low",
      "reasoning": "Why this university suits the student",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "programFit": "How the program aligns with student goals"
    }
  ],
  "summary": "Overall summary of recommendations",
  "admissionTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
}

Return ONLY valid JSON.`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      temperature: 0.5, // More factual, less creative
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const jsonMatch = ('text' in content ? content.text : '').match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]) as UniversityReportResponse;

    // Validate we have 10 recommendations
    if (result.recommendations.length < 8) {
      throw new Error("Insufficient recommendations generated");
    }

    return result;
  } catch (error) {
    console.error("University report generation error:", error);
    throw new Error("Failed to generate university report. Please try again.");
  }
}

// ============================================================================
// RESUME OPTIMIZATION
// ============================================================================

/**
 * Optimize Resume/CV using AI (Gemini or Claude)
 */
export async function optimizeResume(
  request: ResumeOptimizationRequest
): Promise<ResumeOptimizationResponse> {
  // Use Gemini if configured (FREE!)
  if (USE_GEMINI) {
    try {
      const result = await optimizeResumeWithGemini(request)
      return result
    } catch (error: any) {
      // If Gemini fails, fall back to Anthropic if available
      if (!process.env['ANTHROPIC_API_KEY']) {
        throw new Error(`Gemini failed: ${error.message}. No fallback API configured.`)
      }
      console.warn('Gemini failed, falling back to Anthropic:', error.message)
      // Continue to Anthropic code below
    }
  }

  const prompt = `You are a professional resume consultant specializing in ${request.targetField}. Analyze and optimize this resume.

CURRENT RESUME:
${request.currentResume}

TARGET:
- Field: ${request.targetField}
- Level: ${request.targetLevel}
${request.targetCountry ? `- Country: ${request.targetCountry}` : ""}

TASK:
1. Rewrite the resume to maximize impact for ${request.targetLevel} positions in ${request.targetField}
2. Focus on:
   - Strong action verbs
   - Quantified achievements
   - ATS (Applicant Tracking System) optimization
   - Relevant keywords for ${request.targetField}
   - Clear, concise bullet points
   - Proper formatting and structure

3. Identify improvements in these categories:
   - Action Verbs: Stronger alternatives to weak verbs
   - Quantification: Adding metrics and numbers
   - Relevance: Highlighting relevant experience
   - Keywords: Industry-specific terms
   - Structure: Organization and clarity
   - Impact: More compelling descriptions

4. Identify missing elements (certifications, skills, sections)

5. Provide an overall score (0-100) based on:
   - Clarity and readability (20 points)
   - Achievement focus (20 points)
   - Keyword optimization (20 points)
   - Quantification (20 points)
   - Professional formatting (20 points)

Output format (JSON):
{
  "optimizedResume": "The complete optimized resume text",
  "improvements": [
    {
      "category": "Action Verbs",
      "suggestions": ["Change 'Responsible for' to 'Led'", "Change 'Helped with' to 'Collaborated on'"]
    }
  ],
  "missingElements": ["Technical skills section", "Quantified achievements in role X"],
  "overallScore": 85
}

Return ONLY valid JSON.`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3500,
      temperature: 0.4, // More conservative for professional docs
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const jsonMatch = ('text' in content ? content.text : '').match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]) as ResumeOptimizationResponse;

    return result;
  } catch (error) {
    console.error("Resume optimization error:", error);
    throw new Error("Failed to optimize resume. Please try again.");
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Estimate token usage for cost calculation
 */
export function estimateAddonTokens(addonType: string, inputSize: number): {
  input: number;
  output: number;
} {
  // Input tokens = prompt template + user input
  // Output tokens = expected response length

  const estimates: Record<string, { inputBase: number; outputBase: number }> = {
    sop_generation: { inputBase: 800, outputBase: 2000 },
    university_report: { inputBase: 400, outputBase: 3000 },
    resume_optimization: { inputBase: 600, outputBase: 2500 },
  };

  const base = estimates[addonType] || { inputBase: 500, outputBase: 1500 };

  return {
    input: base.inputBase + Math.floor(inputSize / 4), // Rough token estimate
    output: base.outputBase,
  };
}

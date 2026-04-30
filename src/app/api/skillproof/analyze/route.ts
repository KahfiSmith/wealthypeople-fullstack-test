import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { env } from "@/config";
import { skillProofInputSchema } from "@/lib/schemas/skillproof";
import {
  analyzeSkillProofExperience,
  SkillProofServiceError,
} from "@/services/skillproof.service";

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  if (!env.openaiApiKey) {
    return jsonError("OPENAI_API_KEY is not configured.", 500);
  }

  try {
    const body = await request.json();
    const input = skillProofInputSchema.parse(body);
    const data = await analyzeSkillProofExperience({
      apiKey: env.openaiApiKey,
      input,
      maxOutputTokens: env.openaiMaxOutputTokens,
      model: env.openaiModel,
      temperature: env.openaiTemperature,
      timeoutMs: env.openaiTimeoutMs,
    });

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(error.issues[0]?.message || "Invalid request body.", 400);
    }

    if (error instanceof SyntaxError) {
      return jsonError("Invalid JSON request body.", 400);
    }

    if (error instanceof SkillProofServiceError) {
      return jsonError(error.message, getServiceErrorStatus(error));
    }

    return jsonError("Unable to analyze this experience right now.", 500);
  }
}

function getServiceErrorStatus(error: SkillProofServiceError) {
  if (error.code === "model" || error.code === "configuration") {
    return 500;
  }

  if (error.code === "rate_limit") {
    return 429;
  }

  return 502;
}

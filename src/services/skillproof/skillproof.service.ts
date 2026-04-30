import type { SkillProofInput } from "@/types";
import { skillProofAnalysisSchema } from "@/lib/schemas/skillproof";
import type { SkillProofAnalysis } from "@/types";

type AnalyzeSkillProofOptions = {
  apiKey: string;
  input: SkillProofInput;
  maxOutputTokens: number;
  model: string;
  temperature: number;
  timeoutMs: number;
};

type OpenAIResponseContent = {
  refusal?: string;
  text?: string;
  type?: string;
};

type OpenAIResponseOutput = {
  content?: OpenAIResponseContent[];
};

type OpenAIResponsePayload = {
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
  output?: OpenAIResponseOutput[];
  output_text?: string;
};

export class SkillProofServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | "configuration"
      | "model"
      | "openai"
      | "parse"
      | "rate_limit"
      | "timeout"
  ) {
    super(message);
    this.name = "SkillProofServiceError";
  }
}

const skillProofResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "hiddenSkills",
    "cvBullets",
    "portfolioStory",
    "interviewAnswer",
    "recommendedRoles",
  ],
  properties: {
    hiddenSkills: {
      type: "array",
      items: { type: "string" },
    },
    cvBullets: {
      type: "array",
      items: { type: "string" },
    },
    portfolioStory: {
      type: "string",
    },
    interviewAnswer: {
      type: "string",
    },
    recommendedRoles: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "reason"],
        properties: {
          title: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
  },
} as const;

const outputLabels: Record<SkillProofInput["outputFormats"][number], string> = {
  cv_bullets: "CV bullet points",
  interview_answer: "interview answer",
  portfolio_story: "portfolio story",
  role_recommendations: "role recommendations",
};

export function buildSkillProofPrompt(input: SkillProofInput) {
  const outputFormats = input.outputFormats
    .map((format) => outputLabels[format])
    .join(", ");
  const experienceType =
    input.experienceType === "other" && input.customExperienceType?.trim()
      ? input.customExperienceType
      : input.experienceType;

  return [
    "Analyze this student or fresh graduate experience and turn it into practical career material.",
    "Infer realistic transferable skills without exaggerating seniority, job level, metrics, or ownership.",
    "If the experience lacks detail, use cautious language and do not invent company names, numbers, or awards.",
    `Experience type: ${experienceType}.`,
    `Target role: ${input.targetRole?.trim() || "not specified"}.`,
    `Output language: ${input.outputLanguage}.`,
    "Tone: professional.",
    `Requested output formats: ${outputFormats}.`,
    `Experience:\n${input.experience}`,
  ].join("\n");
}

export async function analyzeSkillProofExperience({
  apiKey,
  input,
  maxOutputTokens,
  model,
  temperature,
  timeoutMs,
}: AnalyzeSkillProofOptions): Promise<SkillProofAnalysis> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "You are SkillProof AI, a career assistant for students and fresh graduates. Return only structured JSON that matches the requested schema.",
          },
          {
            role: "user",
            content: buildSkillProofPrompt(input),
          },
        ],
        max_output_tokens: maxOutputTokens,
        temperature,
        text: {
          format: {
            type: "json_schema",
            name: "skillproof_analysis",
            strict: true,
            schema: skillProofResponseJsonSchema,
          },
        },
      }),
    });

    const payload = (await response.json()) as OpenAIResponsePayload;

    if (!response.ok) {
      throw mapOpenAIError(response.status, payload);
    }

    const outputText = extractOutputText(payload);

    if (!outputText) {
      throw new SkillProofServiceError(
        "AI response did not include output text.",
        "parse"
      );
    }

    return skillProofAnalysisSchema.parse(JSON.parse(outputText));
  } catch (error) {
    if (error instanceof SkillProofServiceError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new SkillProofServiceError(
        "AI request timed out. Try again in a moment.",
        "timeout"
      );
    }

    if (error instanceof SyntaxError) {
      throw new SkillProofServiceError(
        "AI returned an invalid response format.",
        "parse"
      );
    }

    throw new SkillProofServiceError(
      "AI service is unavailable right now.",
      "openai"
    );
  } finally {
    clearTimeout(timeout);
  }
}

function extractOutputText(payload: OpenAIResponsePayload) {
  if (payload.output_text) {
    return payload.output_text;
  }

  for (const output of payload.output || []) {
    for (const content of output.content || []) {
      if (content.type === "refusal" && content.refusal) {
        throw new SkillProofServiceError(content.refusal, "openai");
      }

      if (content.type === "output_text" && content.text) {
        return content.text;
      }
    }
  }

  return null;
}

function mapOpenAIError(status: number, payload: OpenAIResponsePayload) {
  const message = payload.error?.message || "OpenAI request failed.";
  const errorCode = payload.error?.code || payload.error?.type || "";

  if (status === 401 || status === 403) {
    return new SkillProofServiceError(
      "OpenAI API key is invalid or does not have access.",
      "configuration"
    );
  }

  if (status === 404 || errorCode.includes("model")) {
    return new SkillProofServiceError(
      "Configured OpenAI model is unavailable. Check OPENAI_MODEL.",
      "model"
    );
  }

  if (status === 429) {
    return new SkillProofServiceError(
      "OpenAI rate limit reached. Try again later.",
      "rate_limit"
    );
  }

  return new SkillProofServiceError(message, "openai");
}

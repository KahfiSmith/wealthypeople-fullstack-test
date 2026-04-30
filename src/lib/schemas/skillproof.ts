import { z } from "zod";

import {
  SKILL_PROOF_CUSTOM_EXPERIENCE_TYPE_MAX_LENGTH,
  SKILL_PROOF_EXPERIENCE_MAX_LENGTH,
  SKILL_PROOF_EXPERIENCE_MIN_LENGTH,
  SKILL_PROOF_TARGET_ROLE_MAX_LENGTH,
} from "@/types";

export const skillProofInputSchema = z.object({
  customExperienceType: z
    .string()
    .trim()
    .max(
      SKILL_PROOF_CUSTOM_EXPERIENCE_TYPE_MAX_LENGTH,
      "Keep the custom experience type short and clear."
    )
    .optional(),
  experience: z
    .string()
    .trim()
    .min(
      SKILL_PROOF_EXPERIENCE_MIN_LENGTH,
      "Please describe your experience in at least 40 characters. Add what you did, the context, and the result."
    )
    .max(
      SKILL_PROOF_EXPERIENCE_MAX_LENGTH,
      "Your experience is too long. Please keep it under 4,000 characters."
    ),
  experienceType: z.enum([
    "organization",
    "course_project",
    "freelance",
    "volunteer",
    "family_business",
    "competition",
    "internship",
    "other",
  ]),
  targetRole: z
    .string()
    .trim()
    .max(
      SKILL_PROOF_TARGET_ROLE_MAX_LENGTH,
      "Keep the target role under 120 characters."
    )
    .optional(),
  outputLanguage: z.enum(["id", "en"]),
  outputFormats: z
    .array(
      z.enum([
        "cv_bullets",
        "portfolio_story",
        "interview_answer",
        "role_recommendations",
      ])
    )
    .min(1, "Choose at least one output to generate."),
});

export const skillProofAnalysisSchema = z.object({
  hiddenSkills: z.array(z.string()).default([]),
  cvBullets: z.array(z.string()).default([]),
  portfolioStory: z.string().default(""),
  interviewAnswer: z.string().default(""),
  recommendedRoles: z
    .array(
      z.object({
        title: z.string(),
        reason: z.string(),
      })
    )
    .default([]),
});

import { z } from "zod";

export const skillProofInputSchema = z.object({
  customExperienceType: z.string().trim().max(80).optional(),
  experience: z.string().trim().min(40).max(4000),
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
  targetRole: z.string().trim().max(120).optional(),
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
    .min(1),
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

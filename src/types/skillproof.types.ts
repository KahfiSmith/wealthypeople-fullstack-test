export const SKILL_PROOF_EXPERIENCE_MIN_LENGTH = 40;
export const SKILL_PROOF_EXPERIENCE_MAX_LENGTH = 4000;
export const SKILL_PROOF_CUSTOM_EXPERIENCE_TYPE_MAX_LENGTH = 80;
export const SKILL_PROOF_TARGET_ROLE_MAX_LENGTH = 120;

export type SkillProofExperienceType =
  | "organization"
  | "course_project"
  | "freelance"
  | "volunteer"
  | "family_business"
  | "competition"
  | "internship"
  | "other";

export type SkillProofOutputLanguage = "id" | "en";

export type SkillProofOutputFormat =
  | "cv_bullets"
  | "portfolio_story"
  | "interview_answer"
  | "role_recommendations";

export type SkillProofInput = {
  customExperienceType?: string;
  experience: string;
  experienceType: SkillProofExperienceType;
  targetRole?: string;
  outputLanguage: SkillProofOutputLanguage;
  outputFormats: SkillProofOutputFormat[];
};

export type SkillProofRoleRecommendation = {
  title: string;
  reason: string;
};

export type SkillProofAnalysis = {
  hiddenSkills: string[];
  cvBullets: string[];
  portfolioStory: string;
  interviewAnswer: string;
  recommendedRoles: SkillProofRoleRecommendation[];
};

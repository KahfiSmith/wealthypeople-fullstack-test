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

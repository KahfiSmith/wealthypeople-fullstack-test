const readOptionalEnv = (name: string, fallback: string): string => {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
};

const readOptionalNumberEnv = (
  name: string,
  fallback: number,
  options: { max?: number; min?: number } = {}
): number => {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  const min = options.min ?? 0;
  const max = options.max ?? Number.POSITIVE_INFINITY;

  return Number.isFinite(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
};

export const env = {
  appUrl: readOptionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: readOptionalEnv("OPENAI_MODEL", "gpt-5.4-nano"),
  openaiTemperature: readOptionalNumberEnv("OPENAI_TEMPERATURE", 0.4, {
    max: 2,
    min: 0,
  }),
  openaiMaxOutputTokens: readOptionalNumberEnv(
    "OPENAI_MAX_OUTPUT_TOKENS",
    1200,
    { min: 1 }
  ),
  openaiTimeoutMs: readOptionalNumberEnv("OPENAI_TIMEOUT_MS", 20000, {
    min: 1000,
  }),
};

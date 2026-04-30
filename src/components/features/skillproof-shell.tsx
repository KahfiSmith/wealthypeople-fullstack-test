"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

import { siteConfig } from "@/config";
import { Button } from "@/components/ui";
import type {
  SkillProofAnalysis,
  SkillProofExperienceType,
  SkillProofOutputFormat,
  SkillProofOutputLanguage,
} from "@/types";

const outputLanguageOptions: Array<{
  label: string;
  value: SkillProofOutputLanguage;
}> = [
  { label: "Indonesia", value: "id" },
  { label: "English", value: "en" },
];

const experienceTypeOptions: Array<{
  label: string;
  value: SkillProofExperienceType;
}> = [
  { label: "Organisasi", value: "organization" },
  { label: "Project kuliah", value: "course_project" },
  { label: "Freelance", value: "freelance" },
  { label: "Volunteer", value: "volunteer" },
  { label: "Bisnis keluarga", value: "family_business" },
  { label: "Kompetisi", value: "competition" },
  { label: "Internship", value: "internship" },
  { label: "Lainnya", value: "other" },
];

const outputFormatOptions: Array<{
  label: string;
  value: SkillProofOutputFormat;
}> = [
  { label: "CV bullets", value: "cv_bullets" },
  { label: "Portfolio story", value: "portfolio_story" },
  { label: "Interview answer", value: "interview_answer" },
  { label: "Role recommendations", value: "role_recommendations" },
];

export function SkillProofShell() {
  const [experience, setExperience] = useState("");
  const [experienceType, setExperienceType] =
    useState<SkillProofExperienceType>("organization");
  const [customExperienceType, setCustomExperienceType] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [outputLanguage, setOutputLanguage] =
    useState<SkillProofOutputLanguage>("id");
  const [outputFormats, setOutputFormats] = useState<SkillProofOutputFormat[]>([
    "cv_bullets",
    "portfolio_story",
    "interview_answer",
    "role_recommendations",
  ]);
  const [analysis, setAnalysis] = useState<SkillProofAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const formPayload = {
    customExperienceType:
      experienceType === "other" ? customExperienceType : undefined,
    experience,
    experienceType,
    outputFormats,
    outputLanguage,
    targetRole,
  };

  const toggleOutputFormat = (format: SkillProofOutputFormat) => {
    setOutputFormats((currentFormats) => {
      if (currentFormats.includes(format)) {
        const nextFormats = currentFormats.filter((item) => item !== format);
        return nextFormats.length > 0 ? nextFormats : currentFormats;
      }

      return [...currentFormats, format];
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnalysis(null);
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/skillproof/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload),
      });
      const payload = (await response.json()) as
        | { data: SkillProofAnalysis }
        | { error?: string };

      if (!response.ok || !("data" in payload)) {
        const message = "error" in payload ? payload.error : undefined;
        throw new Error(message || "Gagal membuat analisis.");
      }

      setAnalysis(payload.data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Gagal membuat analisis."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-brand-blue">
      <div
        className="pointer-events-none absolute -right-24 top-28 h-72 w-72 rounded-full bg-brand-cream blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 top-72 h-80 w-80 rounded-full bg-brand-cream blur-3xl"
        aria-hidden="true"
      />

      <header className="border-b-2 border-brand-blue bg-white">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 items-center">
              <Image
                alt={siteConfig.name}
                className="h-8 w-auto object-contain"
                height={938}
                priority
                src={siteConfig.logoPath}
                unoptimized
                width={1967}
              />
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-none border-2 border-brand-blue bg-brand-peach px-3 py-2 text-sm font-black uppercase text-brand-blue shadow-[4px_4px_0_var(--brand-blue)] sm:flex">
            Career proof builder
          </div>
        </div>
      </header>

      <main className="relative z-10 py-16">
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-6">
          <p className="w-fit rounded-none border-2 border-brand-blue bg-brand-peach px-3 py-2 text-sm font-black uppercase text-brand-blue shadow-[4px_4px_0_var(--brand-blue)]">
            {siteConfig.name}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-brand-blue sm:text-5xl">
            Ubah pengalaman sehari-hari menjadi bukti skill profesional.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-brand-blue/75">
            Struktur awal sudah siap. Step berikutnya adalah membuat form input,
            lalu menghubungkannya ke endpoint AI.
          </p>

          <form
            className="mt-8 grid gap-5 rounded-none border-2 border-brand-blue bg-white p-5 shadow-[8px_8px_0_var(--brand-blue)]"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-brand-blue">
                Ceritakan pengalaman kamu
              </span>
              <textarea
                className="min-h-40 resize-y rounded-none border-2 border-brand-blue bg-white px-4 py-3 text-sm leading-6 text-brand-blue outline-none transition placeholder:text-brand-blue/40 focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/30"
                onChange={(event) => setExperience(event.target.value)}
                placeholder="Contoh: Saya membantu bisnis keluarga mencatat stok, melayani pelanggan, dan membuat laporan penjualan sederhana..."
                value={experience}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-brand-blue">
                Target role
              </span>
              <input
                className="h-11 rounded-none border-2 border-brand-blue bg-white px-4 text-sm text-brand-blue outline-none transition placeholder:text-brand-blue/40 focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/30"
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="Contoh: Product Manager Intern, Data Analyst, HR Staff"
                value={targetRole}
              />
            </label>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-brand-blue">
                Tipe pengalaman
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {experienceTypeOptions.map((option) => (
                  <button
                    className="rounded-none border-2 border-brand-blue bg-white px-3 py-2 text-left text-sm font-bold text-brand-blue/70 transition hover:bg-brand-cream data-[active=true]:border-brand-blue data-[active=true]:bg-brand-sage data-[active=true]:text-brand-blue data-[active=true]:shadow-[4px_4px_0_var(--brand-blue)]"
                    data-active={experienceType === option.value}
                    key={option.value}
                    onClick={() => setExperienceType(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {experienceType === "other" ? (
                <label className="mt-2 flex flex-col gap-2">
                  <span className="text-sm font-medium text-brand-blue">
                    Tulis tipe pengalaman lainnya
                  </span>
                  <input
                    className="h-11 rounded-none border-2 border-brand-blue bg-white px-4 text-sm text-brand-blue outline-none transition placeholder:text-brand-blue/40 focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/30"
                    onChange={(event) =>
                      setCustomExperienceType(event.target.value)
                    }
                    placeholder="Contoh: komunitas online, side project, content creator..."
                    value={customExperienceType}
                  />
                </label>
              ) : null}
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-brand-blue">
                Bahasa output
              </legend>
              <div className="grid grid-cols-2 rounded-none border-2 border-brand-blue bg-white p-1">
                {outputLanguageOptions.map((option) => (
                  <button
                    className="rounded-none px-3 py-2 text-sm font-bold text-brand-blue/70 transition data-[active=true]:bg-brand-blue data-[active=true]:text-white"
                    data-active={outputLanguage === option.value}
                    key={option.value}
                    onClick={() => setOutputLanguage(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-brand-blue">
                Output yang dibuat
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {outputFormatOptions.map((option) => (
                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-none border-2 border-brand-blue bg-white px-3 py-2 text-sm font-bold text-brand-blue/75 transition has-checked:bg-brand-sage has-checked:shadow-[4px_4px_0_var(--brand-blue)]"
                    key={option.value}
                  >
                    <input
                      checked={outputFormats.includes(option.value)}
                      className="size-4 accent-brand-blue"
                      onChange={() => toggleOutputFormat(option.value)}
                      type="checkbox"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {error ? (
              <p className="rounded-none border-2 border-brand-red bg-brand-red/10 px-3 py-2 text-sm font-bold text-brand-red">
                {error}
              </p>
            ) : null}

            <Button
              className="h-11 w-full rounded-none border-2 border-brand-blue bg-brand-coral font-black uppercase text-white shadow-[5px_5px_0_var(--brand-blue)] hover:bg-brand-red"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Menganalisis..." : "Generate SkillProof"}
            </Button>
          </form>

          {analysis ? <SkillProofResult analysis={analysis} /> : null}

        </section>
      </main>
    </div>
  );
}

function SkillProofResult({
  analysis,
}: Readonly<{ analysis: SkillProofAnalysis }>) {
  return (
    <section className="mt-6 grid gap-4 rounded-none border-2 border-brand-blue bg-white p-5 shadow-[8px_8px_0_var(--brand-blue)]">
      <h2 className="text-xl font-semibold text-brand-blue">Hasil analisis</h2>

      <ResultBlock title="Hidden skills">
        <div className="flex flex-wrap gap-2">
          {analysis.hiddenSkills.map((skill) => (
            <span
              className="rounded-none border-2 border-brand-blue bg-brand-sage px-3 py-2 text-sm font-bold text-brand-blue"
              key={skill}
            >
              {skill}
            </span>
          ))}
        </div>
      </ResultBlock>

      <ResultBlock title="CV bullets">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-brand-blue/80">
          {analysis.cvBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </ResultBlock>

      <ResultBlock title="Portfolio story">
        <p className="text-sm leading-6 text-brand-blue/80">
          {analysis.portfolioStory}
        </p>
      </ResultBlock>

      <ResultBlock title="Interview answer">
        <p className="text-sm leading-6 text-brand-blue/80">
          {analysis.interviewAnswer}
        </p>
      </ResultBlock>

      <ResultBlock title="Recommended roles">
        <div className="grid gap-3">
          {analysis.recommendedRoles.map((role) => (
            <article
              className="rounded-none border-2 border-brand-blue bg-white p-4 shadow-[4px_4px_0_var(--brand-blue)]"
              key={`${role.title}-${role.reason}`}
            >
              <h3 className="font-medium text-brand-blue">{role.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-blue/75">
                {role.reason}
              </p>
            </article>
          ))}
        </div>
      </ResultBlock>
    </section>
  );
}

function ResultBlock({
  children,
  title,
}: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <div className="rounded-none border-2 border-brand-blue bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-brand-blue">{title}</h3>
      {children}
    </div>
  );
}

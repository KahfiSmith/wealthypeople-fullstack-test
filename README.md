# SkillProof AI

SkillProof AI is an AI-powered web app that helps students and fresh graduates turn everyday experience into professional career material.

Users can describe an experience, choose the experience type, set a target role, select the output language, and choose which career assets they want to generate. The app then produces hidden skills, CV bullet points, a portfolio story, an interview answer, and role recommendations.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Zod
- OpenAI Responses API

## Current Structure

```text
src/
├─ app/
│  ├─ (public)/
│  │  └─ page.tsx
│  ├─ api/
│  │  └─ skillproof/
│  │     └─ analyze/
│  │        └─ route.ts
│  ├─ globals.css
│  └─ layout.tsx
├─ components/
│  ├─ features/
│  │  └─ skillproof-shell.tsx
│  └─ ui/
│     └─ button.tsx
├─ config/
├─ lib/
│  ├─ schemas/
│  │  └─ skillproof.ts
│  └─ utils/
├─ services/
│  └─ skillproof.service.ts
└─ types/
   └─ skillproof.types.ts
```

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

OPENAI_API_KEY=replace-with-your-openai-api-key
OPENAI_MODEL=gpt-5.4-nano
OPENAI_TEMPERATURE=0.4
OPENAI_MAX_OUTPUT_TOKENS=2000
OPENAI_TIMEOUT_MS=20000
```

`OPENAI_API_KEY` is used only on the server-side API route. Do not expose it in Client Components.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm type-check
pnpm build
```

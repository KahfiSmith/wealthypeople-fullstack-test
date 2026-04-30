# SkillProof AI

SkillProof AI adalah rencana aplikasi AI untuk membantu mahasiswa dan fresh graduate mengubah pengalaman sehari-hari menjadi bukti skill profesional.

Repo ini sengaja dibuat sebagai skeleton awal, bukan implementasi penuh. Tujuannya supaya pengembangan bisa dilakukan step by step.

## Step-by-Step Roadmap

1. **Struktur awal**
   - Bersihkan boilerplate yang tidak dipakai.
   - Siapkan route utama, API route placeholder, schema, service, types, dan env config.

2. **Form input**
   - Tambahkan form untuk pengalaman, tipe pengalaman, target role, bahasa, dan format output.
   - Validasi input di client secukupnya.

3. **API contract**
   - Finalkan request dan response untuk `/api/skillproof/analyze`.
   - Validasi request dengan Zod.

4. **AI integration**
   - Service OpenAI server-side sudah disiapkan.
   - Simpan API key hanya di `.env.local`.

5. **Output UI**
   - Render hidden skills, CV bullets, portfolio story, jawaban interview, dan rekomendasi role.

6. **Polish**
   - Tambahkan loading/error state.

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
│  │  └─ skillproof/
│  │     └─ skillproof-shell.tsx
│  └─ ui/
│     └─ button.tsx
├─ config/
│  ├─ env.ts
│  ├─ index.ts
│  ├─ navigation.ts
│  ├─ routes.ts
│  └─ site.ts
├─ lib/
│  ├─ schemas/
│  │  └─ skillproof.ts
│  └─ utils/
│     └─ cn.ts
├─ services/
│  └─ skillproof/
│     └─ skillproof.service.ts
└─ types/
   ├─ common.types.ts
   ├─ index.ts
   └─ skillproof.types.ts
```

## What Was Removed

Tidak ada lagi boilerplate untuk:

- auth
- login/register
- profile
- middleware auth
- global providers
- Zustand store
- TanStack Query
- Axios
- database scaffold
- NextAuth
- React Hook Form
- Jest/test folder

## Environment

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

OPENAI_API_KEY=replace-with-your-openai-api-key
OPENAI_MODEL=gpt-5.4-nano
OPENAI_TEMPERATURE=0.4
OPENAI_MAX_OUTPUT_TOKENS=1200
OPENAI_TIMEOUT_MS=20000
```

`OPENAI_API_KEY` dipakai oleh endpoint server-side `/api/skillproof/analyze`. Jangan expose API key ke Client Component.

## Commands

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm build
```

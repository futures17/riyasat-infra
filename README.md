# Riyasat Infra

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Riyasat%20Infra-1f6f4a?style=for-the-badge)](https://www.riyasatinfra.com/)
[![React](https://img.shields.io/badge/React-18-20232a?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-0f172a?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

Production-ready luxury real-estate experience for Riyasat Infra, combining a cinematic React frontend, Supabase-backed admin workflows, and a security-first release process for live verification.

## Live Verification

- Live Demo: https://www.riyasatinfra.com/
- Admin review focus: verify public site experience, project storytelling, lead capture flows, and authenticated admin/member areas.

## Project Snapshot

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Supabase client integration via environment variables
- Deployment target: Vercel
- Security posture: secrets excluded from Git, large media isolated with Git LFS, production-only files ignored

## Environment Setup

Copy `.env.example` into a local `.env` and set the values privately:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_OPENROUTER_API_KEY=...
```

Important:

- Never commit `.env`, `.env.local`, service-role keys, Railway connection strings, or private API tokens.
- Frontend code should only use the Supabase URL and anon key through environment variables.
- Any privileged Supabase or Railway secrets must stay server-side only.

## Local Development

```bash
npm install
npm run build
npm run preview
```

## Repository Hygiene

- `.gitignore` is hardened for Vite/Next-style frontend workflows, Supabase, Vercel, local agent tooling, logs, caches, and build artifacts.
- Required project media is versioned in Git for this release snapshot.
- If future media grows substantially, move heavy assets to Git LFS, Supabase Storage, Cloudinary, or another CDN-backed object store.

## UI/UX Screenshot Placeholders

- `docs/screenshots/homepage-overview.png`
- `docs/screenshots/projects-experience.png`
- `docs/screenshots/admin-dashboard.png`
- `docs/screenshots/mobile-viewport.png`

## Notes

- The current codebase is Vite-based, not Next.js. The repository metadata reflects the actual production architecture to avoid deployment confusion.
- Supabase integration is already wired in code through `import.meta.env` and remains hidden from source control.
- This repository is maintained as a controlled production backup and verification build. Only authorized maintainers should change deployment, environment, or business-critical flows.

# Riyasat Infra Documentation Index

This `docs/` directory is included intentionally as part of the production backup, handover, and verification package for the Riyasat Infra codebase.

## What Is Stored Here

- frontend workflow notes
- backend and Supabase schema references
- AI work logs and implementation history
- operational fallback plans
- project walkthrough material for future authorized maintainers

## Repository Policy

- This repository is a controlled demo, backup, and deployment reference.
- Documentation is written in English for maintainability and handoff clarity.
- Do not rotate secrets, change infrastructure, or alter business logic without authorized approval.
- Environment variables, service credentials, Railway secrets, and private API keys must never be written into markdown files.

## Deployment Context

- Frontend build: React + Vite + TypeScript
- Backend services: Supabase
- Hosting target: Vercel
- Optional external runtime services: Railway-managed integrations handled outside Git

## Related Files

- Root README: release summary and live verification link
- `.env.example`: safe environment template
- `riyasat_master_schema.sql`: backup schema reference
- `supabase/migrations/`: tracked database migration history

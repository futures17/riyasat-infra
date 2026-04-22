# Backend Workflow - Riyasat Infra / Green Glades

## Purpose

This document is the plain-language backend map for the current project.
It exists so future work does not depend on memory, partial chats, or old agent context.

## Current Backend Reality

- Frontend is already production-focused and mostly finalized.
- Backend target is Supabase:
  - PostgreSQL database
  - Supabase Auth
  - Storage bucket for uploads
  - Row Level Security
- The real database source of truth is:
  - `docs/backend-docs/supabase-database.md`

## Source Of Truth Files

- `docs/backend-docs/supabase-database.md`
  - Final master SQL schema
  - Includes enums, tables, helper functions, indexes, triggers, RLS, storage policies
- `docs/backend-docs/subapabse-chunks.md`
  - Safe execution order and chunk-running guide
- `docs/backend-docs/DB_MIND_MAP.md`
  - Feature-wise table map
- `docs/backend-docs/DB_CHANGE_PROTOCOL.md`
  - Rules for future DB changes
- `docs/backend-docs/HOSTINGER_CPANEL_FALLBACK_PLAN.md`
  - What to do if a client wants cPanel/Hostinger style hosting
- `docs/AI_Work_Log.md`
  - Historical work log and recovery notes

## Final Database Model

The backend is no longer a small basic CRM schema. It is now a structured operational schema with these areas:

- Access and org structure
  - `roles`
  - `users`
  - `admins`
  - `teams`
  - `team_memberships`
- Member onboarding
  - `members`
  - `member_profiles`
  - `member_registry_checks`
  - `member_documents`
- Uploads and files
  - `uploads`
- Client CRM and anti-crossing
  - `client_master`
  - `client_access_grants`
  - `contacts`
  - `public_form_submissions`
  - `feedback`
  - `client_identity_verifications`
  - `temp_clients`
  - `temp_client_events`
  - `temp_client_conflicts`
- Referral and attribution
  - `referral_links`
  - `referrals`
- Visits and booking pipeline
  - `visits`
  - `visit_logs`
  - `visit_proofs`
  - `bookings`
  - `client_documents`
- Meetings and attendance
  - `meetings`
  - `meeting_attendance`
  - `office_locations`
  - `member_attendance`
  - `attendance_geo_events`
  - `attendance_corrections`
  - `walkin_intake_logs`
  - `document_collection_checklists`
- Communication and operations
  - `notifications`
  - `notification_receipts`
  - `chat_threads`
  - `chat_participants`
  - `chat_messages`
  - `tasks`
  - `approvals`
  - `activity_logs`
  - `audit_logs`
  - `performance_scores`
  - `rate_limit_events`
  - `security_incidents`

## Important Helper Functions

These functions are critical because many policies and triggers depend on them:

- `set_updated_at()`
- `current_role_code()`
- `is_admin()`
- `is_manager()`
- `is_staff()`
- `is_manager_of(uuid)`
- `can_access_client(uuid)`
- `can_access_thread(uuid)`
- `prevent_locked_referral_change()`
- `guard_temp_client_phone()`
- `guard_client_phone()`

## Safe Build Order

If rebuilding the database from scratch or on a semi-old project, use this order:

1. `CHUNK 1`
2. `CHUNK 3`
3. `CHUNK 2A`
4. `CHUNK 4B`
5. `CHUNK 4C`
6. `CHUNK 4D`
7. `CHUNK 4E`
8. `CHUNK 2B`
9. `CHUNK 4F`
10. `CHUNK 5`
11. `CHUNK 6`
12. `CHUNK 7`

Why this order matters:

- some helper functions depend on tables created later
- some indexes fail on older tables unless compatibility columns exist
- some RLS policies fail if helper functions or dependent columns are missing

## What Broke Earlier

The recovery session found that older tables existed with partial structure. Because of that, rerunning final SQL caused missing-column errors like:

- `is_deleted does not exist`
- `phone_e164 does not exist`
- `assigned_user_id does not exist`
- `scheduled_start_at does not exist`
- `auth_user_id does not exist`
- `client_id does not exist`

This is why the compatibility patch exists before indexes and RLS.

## Current Hosting Recommendation

Recommended production stack:

- frontend hosting:
  - Netlify, Vercel, or Hostinger static hosting
- backend:
  - Supabase

Do not treat cPanel MySQL hosting as a drop-in replacement for this schema.
This backend relies on PostgreSQL features, Supabase Auth, RLS, and Storage policies.

## Next Backend Tasks

The next practical phase is backend connectivity, not schema redesign.

Priority order:

1. confirm frontend form tables match the final schema
2. wire `contacts`, `public_form_submissions`, `visits`, and `feedback`
3. connect admin dashboard reads to final table names
4. connect auth flow to `users` and member onboarding tables
5. verify storage upload flow against the `uploads` table and `uploads` bucket

## Rule For Future AI Sessions

Any AI agent working on backend must read these first:

1. `docs/BACKEND_WORKFLOW.md`
2. `docs/backend-docs/DB_MIND_MAP.md`
3. `docs/backend-docs/DB_CHANGE_PROTOCOL.md`
4. `docs/backend-docs/supabase-database.md`

Without these files, future edits are likely to drift or partially overwrite the intended schema.

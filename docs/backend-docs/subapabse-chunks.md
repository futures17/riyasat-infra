# Supabase Chunk Guide

## Purpose

This file is the execution guide for running the database safely in chunks.
It is not the master SQL source.

The master SQL source is:

- `docs/backend-docs/supabase-database.md`

## Final Safe Order

Use this order when building or recovering the database:

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

## Chunk Meaning

### `CHUNK 1`

- extensions
- enums
- `roles`
- `users`
- basic core setup

### `CHUNK 2A`

- helper functions that must exist early

Usually includes:

- `set_updated_at()`
- `current_role_code()`
- `is_admin()`
- `is_manager()`
- `is_staff()`
- `is_manager_of()`

### `CHUNK 2B`

- helper functions that depend on later tables

Usually includes:

- `can_access_client()`
- `can_access_thread()`
- `prevent_locked_referral_change()`
- `guard_temp_client_phone()`
- `guard_client_phone()`

### `CHUNK 3`

- core access tables after initial identity setup
- `admins`
- `teams`
- `team_memberships`

### `CHUNK 4B`

- member and upload blocks after early foundation is ready

### `CHUNK 4C`

- `client_master` and direct dependencies

Important:

- `client_master` must exist before visit, booking, checklist, and many policy blocks

### `CHUNK 4D`

- referrals
- visits
- bookings
- client documents

### `CHUNK 4E`

- meetings
- attendance
- notifications
- chat
- tasks
- approvals
- logs
- security tables

### `CHUNK 4F`

- legacy compatibility patch
- add missing columns to older tables before indexes and RLS

This chunk exists because older DB versions caused errors like:

- missing `is_deleted`
- missing `phone_e164`
- missing `assigned_user_id`
- missing `scheduled_start_at`
- missing `auth_user_id`
- missing `client_id`

### `CHUNK 5`

- indexes
- update triggers
- referral and phone guard triggers

### `CHUNK 6`

- enable RLS
- force RLS
- create policies

### `CHUNK 7`

- storage bucket setup
- storage object policies
- final commit

## Recovery Notes From Today

Earlier chunk runs failed because old tables already existed with partial structure.
The main lesson:

- `create table if not exists` does not upgrade old tables
- if a table already exists, missing columns still stay missing
- this is why `CHUNK 4F` must run before `CHUNK 5` and `CHUNK 6` on legacy databases

## Rule For Future Runs

- new project:
  - use the final safe order above
- older project with partial tables:
  - never skip `CHUNK 4F`
- if any error appears:
  - stop
  - fix the missing dependency
  - document it
  - rerun from the correct point

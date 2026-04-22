# Hostinger / cPanel Fallback Plan

## Plain Answer

This project should continue on Supabase for backend if possible.

Reason:

- current database is PostgreSQL-first
- auth flow is designed around Supabase Auth
- storage rules are designed around Supabase Storage
- RLS policies are a core part of access control

A normal cPanel MySQL setup is not a direct replacement.

## Best Recommended Setup

- frontend hosting:
  - Hostinger, Netlify, or Vercel
- backend and database:
  - Supabase

This is the lowest-risk production setup.

## If Client Wants "Single Hosting Payment"

There are three real options:

### Option A - Best

- Host frontend wherever the client wants
- keep backend on Supabase

This is still simple for the client:

- one frontend host
- one backend service

### Option B - Advanced

- move to a VPS
- install PostgreSQL
- rebuild auth/storage/RLS logic outside Supabase

This is possible but much more maintenance-heavy.

### Option C - Not Recommended

- move to shared hosting + MySQL only

This would require a backend redesign and feature loss or rewriting.

## Why MySQL / phpMyAdmin Is Not A Straight Shift

Current schema uses:

- PostgreSQL enums
- generated columns
- `citext`
- `pg_trgm`
- RLS policies
- Supabase Auth references to `auth.users`
- storage bucket policies

These do not transfer cleanly to phpMyAdmin/MySQL.

## If Migration Is Ever Required

Prepare a migration packet with:

1. `docs/backend-docs/supabase-database.md`
2. `docs/backend-docs/DB_MIND_MAP.md`
3. `docs/backend-docs/DB_CHANGE_PROTOCOL.md`
4. exported data tables
5. storage file backup
6. auth-user mapping plan
7. rewritten backend service layer plan

## Client Communication Template

You can explain it like this:

"Website hosting aur backend database alag cheezein hain. Website ko Hostinger par rakh sakte hain, lekin project ka secure backend Supabase par rehna chahiye. Isse app stable rahegi, data secure rahega, aur future me system todkar dobara banana nahi padega."

## Decision Rule

If the client wants:

- low maintenance
- mobile app support
- admin panel
- secure role-based access
- long-term stable growth

Then choose:

- Supabase backend
- separate frontend hosting

## Current Project Recommendation

For this exact repo:

- keep Supabase as backend
- keep Hostinger only for frontend if needed
- do not plan a MySQL shift unless the whole backend is budgeted for rewrite

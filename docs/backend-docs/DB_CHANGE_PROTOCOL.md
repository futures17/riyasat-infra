# DB Change Protocol

## Goal

This file prevents random DB drift, broken policies, and repeated recovery work.

## Non-Negotiable Rule

The master schema file is:

- `docs/backend-docs/supabase-database.md`

If the database changes, that file must be updated.
If that file is not updated, the change is incomplete.

## Before Changing Anything

Read these in order:

1. `docs/BACKEND_WORKFLOW.md`
2. `docs/backend-docs/DB_MIND_MAP.md`
3. `docs/backend-docs/subapabse-chunks.md`
4. `docs/backend-docs/supabase-database.md`

## Safe Change Flow

1. identify the feature area
2. identify all related tables and policies
3. check whether helper functions depend on the same columns
4. update the SQL source of truth
5. update the chunk guide if execution order changes
6. update the work log
7. only then run SQL in Supabase

## When Adding A Column

Do all of this together:

- add the column to the table definition in master schema
- add default / check / enum rules if needed
- update indexes if the column is queried often
- update triggers if it needs `updated_at`
- update RLS policies if access depends on that column
- update frontend/backend docs if naming changes

## When Adding A Table

Do all of this together:

- table definition
- foreign keys
- `is_deleted`, `created_at`, `updated_at` if operational table
- indexes
- trigger for `set_updated_at()` when needed
- RLS enable + force
- select/insert/update/delete policies
- add to `DB_MIND_MAP.md`

## When Renaming Or Replacing A Table

Avoid renaming directly unless absolutely necessary.

Prefer:

- keep the existing table
- add compatibility columns if needed
- migrate reads and writes gradually
- remove old paths only after verification

## Legacy Compatibility Rule

If running final SQL on an older DB:

- run the compatibility patch before indexes and RLS
- do not assume old tables already match the final structure

This is why `CHUNK 4F` exists.

## Files That Must Stay In Sync

- `docs/backend-docs/supabase-database.md`
- `docs/backend-docs/subapabse-chunks.md`
- `docs/backend-docs/DB_MIND_MAP.md`
- `docs/BACKEND_WORKFLOW.md`
- `docs/AI_Work_Log.md`

## What Not To Do

- do not update Supabase manually and forget the docs
- do not change only the frontend types and assume DB is aligned
- do not use MySQL assumptions for this project
- do not remove columns because they look unused without checking policies and triggers
- do not run large SQL chunks out of order on a legacy database

## Recovery Rule

If any DB command errors:

1. stop on the exact error
2. identify missing dependency
3. patch only the missing dependency
4. document the patch
5. rerun from the correct chunk

Do not blindly rerun the full stack until the root issue is understood.

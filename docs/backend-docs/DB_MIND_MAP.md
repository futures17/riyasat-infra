# DB Mind Map - Riyasat Infra / Green Glades

## Why This File Exists

This is the fast mental map of the database.
Use it before writing backend code, admin queries, forms, or migrations.

## 1. Identity And Access

- `roles`
  - role master list
- `users`
  - every internal or client-linked user
- `admins`
  - elevated admin capability flags
- `teams`
  - team containers
- `team_memberships`
  - which user belongs to which team

## 2. Member Onboarding

- `members`
  - raw member signup / approval queue
- `member_profiles`
  - approved member profile data
- `member_registry_checks`
  - registry verification history
- `member_documents`
  - member KYC and document verification

## 3. Upload System

- `uploads`
  - central file ledger for all uploaded assets
  - member photos
  - KYC docs
  - client docs
  - visit proofs
  - meeting attachments

## 4. Client CRM Core

- `client_master`
  - final client record
  - ownership, manager, source, status
- `client_access_grants`
  - controlled temporary/extra access
- `contacts`
  - contact form submissions
- `public_form_submissions`
  - broader public-facing lead forms
- `feedback`
  - client/public feedback records
- `client_identity_verifications`
  - verification layer for client identity

## 5. Anti-Crossing And Temporary Holds

- `temp_clients`
  - temporary lead ownership lock
- `temp_client_events`
  - history on temp-client actions
- `temp_client_conflicts`
  - conflict resolution records between claimants

## 6. Referral System

- `referral_links`
  - referral codes and landing paths
- `referrals`
  - actual attribution records for members or clients

## 7. Visit And Booking Funnel

- `visits`
  - site visit lifecycle
- `visit_logs`
  - operational log entries for visits
- `visit_proofs`
  - proof uploads for visit completion/approval
- `bookings`
  - deal/booking pipeline
- `client_documents`
  - client-side booking or KYC documents

## 8. Meetings And Attendance

- `meetings`
  - offline/online/hybrid meetings
- `meeting_attendance`
  - attendance per meeting
- `office_locations`
  - geofence-enabled office points
- `member_attendance`
  - daily attendance
- `attendance_geo_events`
  - raw geo capture events
- `attendance_corrections`
  - correction and review workflow
- `walkin_intake_logs`
  - reception walk-in intake
- `document_collection_checklists`
  - checklist state for document collection

## 9. Communication Layer

- `notifications`
  - system/team/user notifications
- `notification_receipts`
  - delivery/read state
- `chat_threads`
  - chat container
- `chat_participants`
  - who is in which thread
- `chat_messages`
  - actual messages

## 10. Operations And Governance

- `tasks`
  - assignment and follow-up work
- `approvals`
  - generic approval workflow
- `activity_logs`
  - lightweight user activity log
- `audit_logs`
  - stronger before/after audit trail
- `performance_scores`
  - monthly performance summary
- `rate_limit_events`
  - abuse or throttling support
- `security_incidents`
  - security issue tracking

## High-Value Relationships

- `users.id` is the central identity key
- `client_master.id` is the central client key
- `uploads.id` is the central uploaded-file key
- `visits.client_id -> client_master.id`
- `bookings.client_id -> client_master.id`
- `client_documents.client_id -> client_master.id`
- `member_profiles.user_id -> users.id`
- `member_documents.user_id -> users.id`
- `notifications.target_user_id -> users.id`
- `tasks.assigned_user_id -> users.id`

## What To Read Before Editing A Feature

- member-related feature:
  - `members`, `member_profiles`, `member_documents`
- lead/contact feature:
  - `contacts`, `public_form_submissions`, `temp_clients`, `client_master`
- visit feature:
  - `visits`, `visit_logs`, `visit_proofs`
- booking feature:
  - `bookings`, `client_documents`, `approvals`
- attendance feature:
  - `member_attendance`, `attendance_geo_events`, `attendance_corrections`
- admin dashboard feature:
  - `users`, `client_master`, `visits`, `bookings`, `tasks`, `notifications`

## Rule

Never rename or re-model a table based only on frontend naming.
Always check `supabase-database.md` first.

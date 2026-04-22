# Supabase Database Schema

-- =============================================================================
-- GREEN GLADES - FINAL PRODUCTION DATABASE SCHEMA
-- Target: Supabase Postgres
-- Notes:
-- - One-time final schema intended to replace the current shallow tables safely.
-- - Preserves earlier operational tables: contacts, visits, feedback, members, meetings.
-- - Uses auth.users as the only credential source.
-- - Enforces anti-crossing, temp-client lock, approvals, soft delete, auditability, and RLS.
-- - This file is the master SQL source of truth for the project backend.
-- - Read docs/BACKEND_WORKFLOW.md and docs/backend-docs/subapabse-chunks.md before running it.
-- - On older databases, use the safe chunk order and compatibility patch before indexes and RLS.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- EXTENSIONS
-- -----------------------------------------------------------------------------
create extension if not exists pgcrypto;
create extension if not exists citext;
create extension if not exists pg_trgm;

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin','manager','agent','reception','client','system');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_status as enum ('pending','active','suspended','rejected','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.membership_type as enum ('new','existing');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.member_approval_status as enum ('pending','approved','correction_required','rejected','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.team_status as enum ('active','inactive','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.client_status as enum ('lead','contacted','visit_scheduled','visit_done','hot','booked','inactive','closed','merged');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.client_source as enum ('website_contact','website_visit','walkin','manual','referral','campaign','import','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.access_type as enum ('read','comment','handover_review','document_access');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.referral_link_type as enum ('generic','contact','visit','member_signup');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.referral_kind as enum ('client','member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.referral_status as enum ('pending','verified','disputed','superseded','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.temp_client_status as enum ('active','converted','expired','released','disputed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.temp_conflict_status as enum ('open','under_review','resolved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.visit_status as enum ('scheduled','confirmed','completed','proof_pending','approved','rejected','rescheduled','cancelled','no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.proof_status as enum ('not_submitted','pending','approved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.booking_status as enum ('initiated','token_paid','docs_pending','loan_pending','registry_pending','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_status as enum ('pending','approved','rejected','expired','reupload_required');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.upload_kind as enum ('member_photo','member_kyc','client_kyc','visit_proof','prospecting_selfie','agreement','meeting_attachment','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.upload_status as enum ('ready','compressing','queued','uploading','uploaded','finalize_pending','failed_retryable','failed_blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attendance_mode as enum ('manual','geo','reception','system');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attendance_status as enum ('present','late','absent','half_day','pending','corrected','rejected_correction');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.correction_status as enum ('pending','approved','rejected','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.meeting_type as enum ('offline','online','hybrid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.meeting_status as enum ('upcoming','ongoing','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_priority as enum ('urgent','high','normal','low','silent_archive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_type as enum ('meeting','reminder','approval','alert','system','chat','task','attendance','visit','booking');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_type as enum ('call','followup','visit','document','approval_fix','booking_action','meeting','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_priority as enum ('low','medium','high','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_status as enum ('open','in_progress','done','missed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.approval_entity as enum ('member','client','visit_proof','attendance','booking','document','ownership_transfer','referral','upload','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.approval_status as enum ('pending','approved','rejected','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.chat_thread_type as enum ('direct','group','entity');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.security_severity as enum ('low','medium','high','critical');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- HELPER FUNCTIONS
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_role_code()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select u.role_code
  from public.users u
  where u.id = auth.uid() and u.is_deleted = false
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role_code() = 'admin', false)
$$;

create or replace function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role_code() = 'manager', false)
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role_code() in ('admin','manager','agent','reception'), false)
$$;

create or replace function public.is_manager_of(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or exists (
      select 1
      from public.users u
      where u.id = target_user_id
        and u.manager_user_id = auth.uid()
        and u.is_deleted = false
    )
$$;

create or replace function public.can_access_client(target_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.client_master c
    where c.id = target_client_id
      and c.is_deleted = false
      and (
        public.is_admin()
        or c.owner_user_id = auth.uid()
        or c.client_user_id = auth.uid()
        or public.is_manager_of(c.owner_user_id)
        or exists (
          select 1
          from public.client_access_grants g
          where g.client_id = c.id
            and g.user_id = auth.uid()
            and g.is_deleted = false
            and (g.expires_at is null or g.expires_at > now())
        )
      )
  )
$$;

create or replace function public.can_access_thread(target_thread_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
  or exists (
    select 1
    from public.chat_participants p
    where p.thread_id = target_thread_id
      and p.user_id = auth.uid()
      and p.is_deleted = false
  )
$$;

create or replace function public.prevent_locked_referral_change()
returns trigger
language plpgsql
as $$
begin
  if old.is_locked = true and (
    new.referrer_user_id is distinct from old.referrer_user_id
    or new.referred_client_id is distinct from old.referred_client_id
    or new.referred_member_user_id is distinct from old.referred_member_user_id
    or new.referral_kind is distinct from old.referral_kind
  ) then
    raise exception 'Locked referral records cannot be mutated. Create a superseding referral record instead.';
  end if;
  return new;
end;
$$;

create or replace function public.guard_temp_client_phone()
returns trigger
language plpgsql
as $$
declare
  conflicting_temp uuid;
  conflicting_client uuid;
begin
  if new.phone_e164 is null then
    return new;
  end if;

  select t.id into conflicting_temp
  from public.temp_clients t
  where t.phone_e164 = new.phone_e164
    and t.status = 'active'
    and t.is_deleted = false
    and t.id <> coalesce(new.id, gen_random_uuid())
  limit 1;

  if conflicting_temp is not null then
    raise exception 'Active temp client lock already exists for this phone number.';
  end if;

  select c.id into conflicting_client
  from public.client_master c
  where c.phone_e164 = new.phone_e164
    and c.is_deleted = false
    and c.merged_into_client_id is null
  limit 1;

  if conflicting_client is not null then
    raise exception 'A permanent client record already exists for this phone number.';
  end if;

  return new;
end;
$$;

create or replace function public.guard_client_phone()
returns trigger
language plpgsql
as $$
declare
  conflicting_client uuid;
  conflicting_temp uuid;
begin
  if new.phone_e164 is null then
    return new;
  end if;

  select c.id into conflicting_client
  from public.client_master c
  where c.phone_e164 = new.phone_e164
    and c.is_deleted = false
    and c.merged_into_client_id is null
    and c.id <> coalesce(new.id, gen_random_uuid())
  limit 1;

  if conflicting_client is not null then
    raise exception 'Duplicate active client phone is not allowed.';
  end if;

  select t.id into conflicting_temp
  from public.temp_clients t
  where t.phone_e164 = new.phone_e164
    and t.status = 'active'
    and t.is_deleted = false
    and (new.source_temp_client_id is null or t.id <> new.source_temp_client_id)
  limit 1;

  if conflicting_temp is not null and new.source_temp_client_id is null then
    raise exception 'Active temp-client lock exists for this phone. Convert from temp client or resolve conflict first.';
  end if;

  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- CORE ACCESS TABLES
-- -----------------------------------------------------------------------------
create table if not exists public.roles (
  code public.app_role primary key,
  name text not null unique,
  rank integer not null unique check (rank > 0),
  description text,
  created_at timestamptz not null default now()
);

insert into public.roles (code, name, rank, description)
values
  ('admin','Admin',1,'Full operational and security access'),
  ('manager','Manager',2,'Team-level operational oversight'),
  ('agent','Agent',3,'Field sales member'),
  ('reception','Reception',4,'Attendance and intake operations'),
  ('client','Client',5,'Client portal user'),
  ('system','System',6,'Automation jobs')
on conflict (code) do update
set name = excluded.name,
    rank = excluded.rank,
    description = excluded.description;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role_code public.app_role not null references public.roles(code),
  manager_user_id uuid null references public.users(id) on delete set null,
  team_id uuid null,
  full_name text not null,
  normalized_name text generated always as (regexp_replace(lower(full_name), '\s+', ' ', 'g')) stored,
  phone_e164 text unique,
  email citext unique,
  avatar_upload_id uuid null,
  status public.user_status not null default 'pending',
  joined_on date,
  last_seen_at timestamptz,
  client_master_id uuid null,
  notes text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_phone_format_chk check (
    phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$'
  )
);

create table if not exists public.admins (
  user_id uuid primary key references public.users(id) on delete cascade,
  can_manage_roles boolean not null default true,
  can_manage_ownership boolean not null default true,
  can_manage_storage boolean not null default true,
  can_manage_security boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  branch_name text,
  manager_user_id uuid null references public.users(id) on delete set null,
  status public.team_status not null default 'active',
  description text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users
  add constraint users_team_fk
  foreign key (team_id) references public.teams(id) on delete set null;

create table if not exists public.team_memberships (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  is_primary boolean not null default false,
  title text,
  started_at date,
  ended_at date,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, user_id)
);

-- -----------------------------------------------------------------------------
-- MEMBER / ONBOARDING
-- -----------------------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  user_id uuid unique references public.users(id) on delete set null,
  full_name text not null,
  email citext not null,
  phone_e164 text not null,
  requested_role public.app_role not null default 'agent',
  membership_type public.membership_type not null default 'new',
  status public.member_approval_status not null default 'pending',
  referred_by_ref_code text,
  photo_upload_id uuid null,
  rejection_note text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email),
  constraint members_phone_format_chk check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$')
);

create table if not exists public.member_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  employee_code text not null unique,
  membership_type public.membership_type not null default 'new',
  approval_status public.member_approval_status not null default 'pending',
  designation text,
  branch_name text,
  referral_code text unique,
  date_of_birth date,
  joined_officially_on date,
  address_line text,
  city text,
  state text,
  pincode text,
  aadhar_number_masked text,
  pan_number_masked text,
  registry_verified boolean not null default false,
  registry_verified_at timestamptz,
  registry_verified_by_user_id uuid null references public.users(id) on delete set null,
  location_required boolean not null default false,
  commission_percent numeric(5,2),
  profile_note text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_registry_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  checked_by_user_id uuid not null references public.users(id) on delete restrict,
  match_status public.approval_status not null default 'pending',
  registry_source text,
  note text,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- UPLOADS
-- -----------------------------------------------------------------------------
create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  bucket_name text not null default 'uploads',
  storage_path text not null,
  original_file_name text not null,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  checksum_sha256 text,
  width integer,
  height integer,
  upload_kind public.upload_kind not null,
  variant text not null default 'original',
  status public.upload_status not null default 'ready',
  uploaded_by_user_id uuid not null references public.users(id) on delete restrict,
  linked_entity_type text,
  linked_entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_name, storage_path)
);

alter table public.users
  add constraint users_avatar_upload_fk
  foreign key (avatar_upload_id) references public.uploads(id) on delete set null;

alter table public.members
  add constraint members_photo_upload_fk
  foreign key (photo_upload_id) references public.uploads(id) on delete set null;

create table if not exists public.member_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  upload_id uuid not null references public.uploads(id) on delete restrict,
  document_type text not null,
  document_number_last4 text,
  verification_status public.document_status not null default 'pending',
  requested_by_user_id uuid null references public.users(id) on delete set null,
  verified_by_user_id uuid null references public.users(id) on delete set null,
  verified_at timestamptz,
  expiry_date date,
  rejection_note text,
  is_primary boolean not null default false,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- CLIENT CORE / ANTI-CROSSING
-- -----------------------------------------------------------------------------
create table if not exists public.client_master (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid unique references public.users(id) on delete set null,
  owner_user_id uuid not null references public.users(id) on delete restrict,
  manager_user_id uuid null references public.users(id) on delete set null,
  team_id uuid null references public.teams(id) on delete set null,
  created_by_user_id uuid not null references public.users(id) on delete restrict,
  approved_by_user_id uuid null references public.users(id) on delete set null,
  source_temp_client_id uuid null,
  merged_into_client_id uuid null references public.client_master(id) on delete set null,
  full_name text not null,
  normalized_name text generated always as (regexp_replace(lower(full_name), '\s+', ' ', 'g')) stored,
  phone_e164 text not null,
  email citext,
  whatsapp_e164 text,
  source public.client_source not null,
  source_ref text,
  status public.client_status not null default 'lead',
  approval_status public.approval_status not null default 'pending',
  anti_crossing_lock boolean not null default true,
  budget_range text,
  interest_project text,
  plot_preference text,
  city text,
  next_followup_at timestamptz,
  last_activity_at timestamptz not null default now(),
  assignment_reason text,
  approval_note text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_master_phone_format_chk check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$')
);

alter table public.users
  add constraint users_client_master_fk
  foreign key (client_master_id) references public.client_master(id) on delete set null;

create table if not exists public.client_access_grants (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_master(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  access_type public.access_type not null,
  granted_by_user_id uuid not null references public.users(id) on delete restrict,
  expires_at timestamptz,
  note text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, user_id, access_type)
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.client_master(id) on delete set null,
  submission_ref text,
  name text not null,
  phone_e164 text not null,
  email citext,
  message text,
  source public.client_source not null default 'website_contact',
  status text not null default 'new',
  ip_address inet,
  user_agent text,
  fingerprint text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.public_form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('contact','visit','feedback','member_signup','client_signup','other')),
  source public.client_source not null,
  client_id uuid null references public.client_master(id) on delete set null,
  contact_id uuid null references public.contacts(id) on delete set null,
  visit_id uuid null,
  member_id uuid null references public.members(id) on delete set null,
  referral_link_id uuid null,
  name text,
  phone_e164 text,
  email citext,
  payload jsonb not null default '{}'::jsonb,
  dedupe_state text not null default 'pending',
  idempotency_key text,
  ip_address inet,
  fingerprint text,
  user_agent text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (idempotency_key)
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.client_master(id) on delete set null,
  phone_e164 text,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'hidden' check (status in ('hidden','published','archived')),
  verification_status public.approval_status not null default 'pending',
  verified_by_user_id uuid null references public.users(id) on delete set null,
  verified_at timestamptz,
  ip_address inet,
  user_agent text,
  fingerprint text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_identity_verifications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.client_master(id) on delete cascade,
  phone_e164 text not null,
  verification_type text not null check (verification_type in ('otp','recent_visit','manual_review')),
  verification_status public.approval_status not null default 'pending',
  verified_by_user_id uuid null references public.users(id) on delete set null,
  otp_reference text,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.temp_clients (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id) on delete restrict,
  manager_user_id uuid null references public.users(id) on delete set null,
  team_id uuid null references public.teams(id) on delete set null,
  client_name text not null,
  normalized_name text generated always as (regexp_replace(lower(client_name), '\s+', ' ', 'g')) stored,
  phone_e164 text not null,
  expected_visit_date date,
  source public.client_source not null default 'manual',
  source_note text,
  confidence_score integer not null default 50 check (confidence_score between 0 and 100),
  hold_started_at timestamptz not null default now(),
  hold_expires_at timestamptz not null default (now() + interval '7 days'),
  converted_client_id uuid null references public.client_master(id) on delete set null,
  status public.temp_client_status not null default 'active',
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint temp_clients_phone_format_chk check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$')
);

alter table public.client_master
  add constraint client_master_source_temp_fk
  foreign key (source_temp_client_id) references public.temp_clients(id) on delete set null;

create table if not exists public.temp_client_events (
  id uuid primary key default gen_random_uuid(),
  temp_client_id uuid not null references public.temp_clients(id) on delete cascade,
  actor_user_id uuid not null references public.users(id) on delete restrict,
  event_type text not null,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.temp_client_conflicts (
  id uuid primary key default gen_random_uuid(),
  temp_client_id uuid not null references public.temp_clients(id) on delete cascade,
  claimant_user_id uuid not null references public.users(id) on delete restrict,
  existing_owner_user_id uuid not null references public.users(id) on delete restrict,
  status public.temp_conflict_status not null default 'open',
  reason text,
  decided_by_user_id uuid null references public.users(id) on delete set null,
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- REFERRALS
-- -----------------------------------------------------------------------------
create table if not exists public.referral_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  ref_code text not null unique,
  link_type public.referral_link_type not null default 'generic',
  destination_path text not null default '/',
  is_active boolean not null default true,
  created_by_user_id uuid not null references public.users(id) on delete restrict,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referral_link_id uuid null references public.referral_links(id) on delete set null,
  referrer_user_id uuid not null references public.users(id) on delete restrict,
  referral_kind public.referral_kind not null,
  referred_client_id uuid null references public.client_master(id) on delete cascade,
  referred_member_user_id uuid null references public.users(id) on delete cascade,
  ref_code_snapshot text,
  status public.referral_status not null default 'pending',
  attribution_score integer not null default 50 check (attribution_score between 0 and 100),
  is_primary boolean not null default true,
  is_locked boolean not null default true,
  locked_at timestamptz not null default now(),
  decided_by_user_id uuid null references public.users(id) on delete set null,
  decision_note text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint referrals_target_chk check (
    (referral_kind = 'client' and referred_client_id is not null and referred_member_user_id is null)
    or
    (referral_kind = 'member' and referred_member_user_id is not null and referred_client_id is null)
  )
);

-- -----------------------------------------------------------------------------
-- VISITS / BOOKINGS
-- -----------------------------------------------------------------------------
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.client_master(id) on delete set null,
  assigned_user_id uuid not null references public.users(id) on delete restrict,
  booked_by_user_id uuid not null references public.users(id) on delete restrict,
  referred_by_ref_code text,
  full_name text not null,
  phone_e164 text not null,
  email citext,
  preferred_date date,
  preferred_time text,
  scheduled_at timestamptz,
  confirmed_at timestamptz,
  completed_at timestamptz,
  visit_status public.visit_status not null default 'scheduled',
  proof_status public.proof_status not null default 'not_submitted',
  primary_proof_upload_id uuid null references public.uploads(id) on delete set null,
  proof_note text,
  approval_note text,
  approved_by_user_id uuid null references public.users(id) on delete set null,
  approved_at timestamptz,
  source public.client_source not null default 'website_visit',
  source_submission_id uuid null references public.public_form_submissions(id) on delete set null,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint visits_phone_format_chk check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$')
);

alter table public.public_form_submissions
  add constraint public_form_submissions_visit_fk
  foreign key (visit_id) references public.visits(id) on delete set null;

create table if not exists public.visit_logs (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  actor_user_id uuid not null references public.users(id) on delete restrict,
  event_type text not null,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.visit_proofs (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  upload_id uuid not null references public.uploads(id) on delete restrict,
  uploaded_by_user_id uuid not null references public.users(id) on delete restrict,
  latitude numeric(10,7),
  longitude numeric(10,7),
  captured_at timestamptz,
  status public.proof_status not null default 'pending',
  reviewer_user_id uuid null references public.users(id) on delete set null,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_master(id) on delete cascade,
  assigned_user_id uuid not null references public.users(id) on delete restrict,
  booking_code text not null unique,
  booking_status public.booking_status not null default 'initiated',
  unit_ref text,
  unit_type text,
  amount_total numeric(14,2),
  amount_token numeric(14,2),
  loan_required boolean not null default false,
  emi_required boolean not null default false,
  registry_due_date date,
  approved_by_user_id uuid null references public.users(id) on delete set null,
  approved_at timestamptz,
  note text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_master(id) on delete cascade,
  booking_id uuid null references public.bookings(id) on delete cascade,
  upload_id uuid not null references public.uploads(id) on delete restrict,
  client_user_id uuid null references public.users(id) on delete set null,
  document_type text not null,
  verification_status public.document_status not null default 'pending',
  requested_by_user_id uuid null references public.users(id) on delete set null,
  verified_by_user_id uuid null references public.users(id) on delete set null,
  verified_at timestamptz,
  expiry_date date,
  rejection_note text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- MEETINGS / ATTENDANCE / RECEPTION
-- -----------------------------------------------------------------------------
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  scheduled_start_at timestamptz not null,
  scheduled_end_at timestamptz,
  meeting_type public.meeting_type not null default 'offline',
  status public.meeting_status not null default 'upcoming',
  team_id uuid null references public.teams(id) on delete set null,
  location_text text,
  meeting_link text,
  created_by_user_id uuid not null references public.users(id) on delete restrict,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meeting_attendance (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  attendance_status public.attendance_status not null default 'pending',
  auto_marked boolean not null default false,
  marked_by_user_id uuid null references public.users(id) on delete set null,
  marked_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meeting_id, user_id)
);

create table if not exists public.office_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  branch_name text,
  latitude numeric(10,7) not null,
  longitude numeric(10,7) not null,
  geofence_radius_meters integer not null default 200 check (geofence_radius_meters between 10 and 10000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  office_location_id uuid null references public.office_locations(id) on delete set null,
  attendance_date date not null,
  check_in_at timestamptz,
  check_out_at timestamptz,
  original_captured_at timestamptz,
  attendance_mode public.attendance_mode not null default 'manual',
  status public.attendance_status not null default 'pending',
  latitude numeric(10,7),
  longitude numeric(10,7),
  marked_by_user_id uuid null references public.users(id) on delete set null,
  correction_requested boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, attendance_date)
);

create table if not exists public.attendance_geo_events (
  id uuid primary key default gen_random_uuid(),
  attendance_id uuid null references public.member_attendance(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  office_location_id uuid null references public.office_locations(id) on delete set null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  accuracy_meters numeric(10,2),
  captured_at timestamptz not null,
  freshness_seconds integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_corrections (
  id uuid primary key default gen_random_uuid(),
  attendance_id uuid not null references public.member_attendance(id) on delete cascade,
  requested_by_user_id uuid not null references public.users(id) on delete restrict,
  reviewed_by_user_id uuid null references public.users(id) on delete set null,
  status public.correction_status not null default 'pending',
  evidence_type text check (evidence_type in ('visual','meeting_roster','register','screenshot','verbal_escalation','other')),
  note text not null,
  resolved_note text,
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.walkin_intake_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.client_master(id) on delete set null,
  received_by_user_id uuid not null references public.users(id) on delete restrict,
  name text not null,
  phone_e164 text not null,
  email citext,
  note text,
  dedupe_state text not null default 'pending',
  routed_to_user_id uuid null references public.users(id) on delete set null,
  requires_admin_review boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_collection_checklists (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.client_master(id) on delete cascade,
  user_id uuid null references public.users(id) on delete cascade,
  booking_id uuid null references public.bookings(id) on delete cascade,
  requested_document_type text not null,
  status public.document_status not null default 'pending',
  due_at timestamptz,
  collected_by_user_id uuid null references public.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- COMMUNICATION / NOTIFICATIONS
-- -----------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type public.notification_type not null,
  priority public.notification_priority not null default 'normal',
  title text not null,
  message text not null,
  target_role public.app_role null,
  target_team_id uuid null references public.teams(id) on delete set null,
  target_user_id uuid null references public.users(id) on delete set null,
  related_entity_type text,
  related_entity_id uuid,
  expires_at timestamptz,
  archived_at timestamptz,
  created_by_user_id uuid not null references public.users(id) on delete restrict,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_receipts (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  delivered_at timestamptz,
  read_at timestamptz,
  hidden_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (notification_id, user_id)
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  thread_type public.chat_thread_type not null default 'direct',
  title text,
  entity_type text,
  entity_id uuid,
  created_by_user_id uuid not null references public.users(id) on delete restrict,
  is_closed boolean not null default false,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_participants (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  can_post boolean not null default true,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (thread_id, user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_user_id uuid not null references public.users(id) on delete restrict,
  body text not null,
  related_entity_type text,
  related_entity_id uuid,
  is_system_generated boolean not null default false,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- TASKS / APPROVALS / LOGGING / SECURITY
-- -----------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.client_master(id) on delete cascade,
  assigned_user_id uuid not null references public.users(id) on delete restrict,
  created_by_user_id uuid not null references public.users(id) on delete restrict,
  task_type public.task_type not null,
  title text not null,
  description text,
  due_at timestamptz,
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'open',
  source_entity_type text,
  source_entity_id uuid,
  completed_at timestamptz,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by_user_id uuid null references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  entity_type public.approval_entity not null,
  entity_id uuid not null,
  status public.approval_status not null default 'pending',
  submitted_by_user_id uuid not null references public.users(id) on delete restrict,
  reviewed_by_user_id uuid null references public.users(id) on delete set null,
  review_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid null references public.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action_type text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid null references public.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action_type text not null,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.performance_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  score_month date not null,
  attendance_score numeric(5,2) not null default 0,
  task_score numeric(5,2) not null default 0,
  visit_score numeric(5,2) not null default 0,
  conversion_score numeric(5,2) not null default 0,
  proof_quality_score numeric(5,2) not null default 0,
  total_score numeric(5,2) not null default 0,
  generated_at timestamptz not null default now(),
  unique (user_id, score_month)
);

create table if not exists public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  bucket_key text not null,
  ip_address inet,
  fingerprint text,
  phone_e164 text,
  hits integer not null default 1,
  window_started_at timestamptz not null,
  window_ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.security_incidents (
  id uuid primary key default gen_random_uuid(),
  severity public.security_severity not null,
  incident_type text not null,
  user_id uuid null references public.users(id) on delete set null,
  related_entity_type text,
  related_entity_id uuid,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open','investigating','resolved','dismissed')),
  created_by_user_id uuid null references public.users(id) on delete set null,
  resolved_by_user_id uuid null references public.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------
create index if not exists idx_users_role_status on public.users(role_code, status) where is_deleted = false;
create index if not exists idx_users_manager on public.users(manager_user_id) where is_deleted = false;
create index if not exists idx_users_name_trgm on public.users using gin (normalized_name gin_trgm_ops) where is_deleted = false;

create index if not exists idx_team_memberships_team on public.team_memberships(team_id) where is_deleted = false;
create index if not exists idx_member_profiles_referral_code on public.member_profiles(referral_code) where is_deleted = false;
create index if not exists idx_members_phone_status on public.members(phone_e164, status) where is_deleted = false;

create index if not exists idx_uploads_uploader_kind on public.uploads(uploaded_by_user_id, upload_kind) where is_deleted = false;
create index if not exists idx_member_documents_user_status on public.member_documents(user_id, verification_status) where is_deleted = false;

create unique index if not exists uq_client_master_active_phone
  on public.client_master(phone_e164)
  where is_deleted = false and merged_into_client_id is null;

create index if not exists idx_client_master_owner_status on public.client_master(owner_user_id, status) where is_deleted = false;
create index if not exists idx_client_master_last_activity on public.client_master(last_activity_at desc) where is_deleted = false;
create index if not exists idx_client_master_name_trgm on public.client_master using gin (normalized_name gin_trgm_ops) where is_deleted = false;
create index if not exists idx_client_access_grants_client_user on public.client_access_grants(client_id, user_id) where is_deleted = false;

create index if not exists idx_contacts_phone_created on public.contacts(phone_e164, created_at desc) where is_deleted = false;
create index if not exists idx_public_form_submissions_form_time on public.public_form_submissions(form_type, submitted_at desc);
create index if not exists idx_feedback_status_created on public.feedback(status, created_at desc) where is_deleted = false;

create unique index if not exists uq_temp_clients_active_phone
  on public.temp_clients(phone_e164)
  where status = 'active' and is_deleted = false;

create index if not exists idx_temp_clients_owner_status on public.temp_clients(owner_user_id, status) where is_deleted = false;
create index if not exists idx_temp_clients_expiry on public.temp_clients(hold_expires_at) where is_deleted = false;
create index if not exists idx_temp_conflicts_status on public.temp_client_conflicts(status, created_at desc);

create unique index if not exists uq_referrals_primary_client
  on public.referrals(referred_client_id)
  where referred_client_id is not null and is_primary = true and is_deleted = false;

create unique index if not exists uq_referrals_primary_member
  on public.referrals(referred_member_user_id)
  where referred_member_user_id is not null and is_primary = true and is_deleted = false;

create index if not exists idx_referral_links_user_type on public.referral_links(user_id, link_type) where is_active = true;

create index if not exists idx_visits_assigned_schedule on public.visits(assigned_user_id, scheduled_at desc) where is_deleted = false;
create index if not exists idx_visits_status_proof on public.visits(visit_status, proof_status) where is_deleted = false;
create index if not exists idx_visit_logs_visit_time on public.visit_logs(visit_id, created_at desc);
create index if not exists idx_visit_proofs_visit_status on public.visit_proofs(visit_id, status);

create index if not exists idx_bookings_client_status on public.bookings(client_id, booking_status) where is_deleted = false;
create index if not exists idx_client_documents_client_status on public.client_documents(client_id, verification_status) where is_deleted = false;

create index if not exists idx_meetings_start_status on public.meetings(scheduled_start_at desc, status) where is_deleted = false;
create index if not exists idx_member_attendance_user_date on public.member_attendance(user_id, attendance_date desc);
create index if not exists idx_attendance_geo_user_time on public.attendance_geo_events(user_id, captured_at desc);
create index if not exists idx_attendance_corrections_status on public.attendance_corrections(status, requested_at desc);
create index if not exists idx_walkin_phone_time on public.walkin_intake_logs(phone_e164, created_at desc);

create index if not exists idx_notifications_target_user on public.notifications(target_user_id, created_at desc) where is_deleted = false;
create index if not exists idx_notifications_target_role on public.notifications(target_role, created_at desc) where is_deleted = false;
create index if not exists idx_notification_receipts_user on public.notification_receipts(user_id, read_at, delivered_at);
create index if not exists idx_chat_messages_thread_time on public.chat_messages(thread_id, created_at desc) where is_deleted = false;

create index if not exists idx_tasks_assigned_due on public.tasks(assigned_user_id, status, due_at) where is_deleted = false;
create unique index if not exists uq_approvals_pending_entity
  on public.approvals(entity_type, entity_id)
  where status = 'pending';

create index if not exists idx_activity_logs_entity_time on public.activity_logs(entity_type, entity_id, created_at desc);
create index if not exists idx_audit_logs_entity_time on public.audit_logs(entity_type, entity_id, created_at desc);
create index if not exists idx_rate_limit_bucket_window on public.rate_limit_events(bucket_key, window_started_at desc);
create index if not exists idx_security_incidents_status_time on public.security_incidents(status, created_at desc);

-- -----------------------------------------------------------------------------
-- TRIGGERS
-- -----------------------------------------------------------------------------
drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_admins_updated_at on public.admins;
create trigger trg_admins_updated_at before update on public.admins
for each row execute function public.set_updated_at();

drop trigger if exists trg_teams_updated_at on public.teams;
create trigger trg_teams_updated_at before update on public.teams
for each row execute function public.set_updated_at();

drop trigger if exists trg_team_memberships_updated_at on public.team_memberships;
create trigger trg_team_memberships_updated_at before update on public.team_memberships
for each row execute function public.set_updated_at();

drop trigger if exists trg_members_updated_at on public.members;
create trigger trg_members_updated_at before update on public.members
for each row execute function public.set_updated_at();

drop trigger if exists trg_member_profiles_updated_at on public.member_profiles;
create trigger trg_member_profiles_updated_at before update on public.member_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_uploads_updated_at on public.uploads;
create trigger trg_uploads_updated_at before update on public.uploads
for each row execute function public.set_updated_at();

drop trigger if exists trg_member_documents_updated_at on public.member_documents;
create trigger trg_member_documents_updated_at before update on public.member_documents
for each row execute function public.set_updated_at();

drop trigger if exists trg_client_master_updated_at on public.client_master;
create trigger trg_client_master_updated_at before update on public.client_master
for each row execute function public.set_updated_at();

drop trigger if exists trg_client_access_grants_updated_at on public.client_access_grants;
create trigger trg_client_access_grants_updated_at before update on public.client_access_grants
for each row execute function public.set_updated_at();

drop trigger if exists trg_contacts_updated_at on public.contacts;
create trigger trg_contacts_updated_at before update on public.contacts
for each row execute function public.set_updated_at();

drop trigger if exists trg_public_form_submissions_updated_at on public.public_form_submissions;
create trigger trg_public_form_submissions_updated_at before update on public.public_form_submissions
for each row execute function public.set_updated_at();

drop trigger if exists trg_feedback_updated_at on public.feedback;
create trigger trg_feedback_updated_at before update on public.feedback
for each row execute function public.set_updated_at();

drop trigger if exists trg_client_identity_verifications_updated_at on public.client_identity_verifications;
create trigger trg_client_identity_verifications_updated_at before update on public.client_identity_verifications
for each row execute function public.set_updated_at();

drop trigger if exists trg_temp_clients_updated_at on public.temp_clients;
create trigger trg_temp_clients_updated_at before update on public.temp_clients
for each row execute function public.set_updated_at();

drop trigger if exists trg_temp_client_conflicts_updated_at on public.temp_client_conflicts;
create trigger trg_temp_client_conflicts_updated_at before update on public.temp_client_conflicts
for each row execute function public.set_updated_at();

drop trigger if exists trg_referral_links_updated_at on public.referral_links;
create trigger trg_referral_links_updated_at before update on public.referral_links
for each row execute function public.set_updated_at();

drop trigger if exists trg_referrals_updated_at on public.referrals;
create trigger trg_referrals_updated_at before update on public.referrals
for each row execute function public.set_updated_at();

drop trigger if exists trg_visits_updated_at on public.visits;
create trigger trg_visits_updated_at before update on public.visits
for each row execute function public.set_updated_at();

drop trigger if exists trg_visit_proofs_updated_at on public.visit_proofs;
create trigger trg_visit_proofs_updated_at before update on public.visit_proofs
for each row execute function public.set_updated_at();

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists trg_client_documents_updated_at on public.client_documents;
create trigger trg_client_documents_updated_at before update on public.client_documents
for each row execute function public.set_updated_at();

drop trigger if exists trg_meetings_updated_at on public.meetings;
create trigger trg_meetings_updated_at before update on public.meetings
for each row execute function public.set_updated_at();

drop trigger if exists trg_meeting_attendance_updated_at on public.meeting_attendance;
create trigger trg_meeting_attendance_updated_at before update on public.meeting_attendance
for each row execute function public.set_updated_at();

drop trigger if exists trg_office_locations_updated_at on public.office_locations;
create trigger trg_office_locations_updated_at before update on public.office_locations
for each row execute function public.set_updated_at();

drop trigger if exists trg_member_attendance_updated_at on public.member_attendance;
create trigger trg_member_attendance_updated_at before update on public.member_attendance
for each row execute function public.set_updated_at();

drop trigger if exists trg_attendance_corrections_updated_at on public.attendance_corrections;
create trigger trg_attendance_corrections_updated_at before update on public.attendance_corrections
for each row execute function public.set_updated_at();

drop trigger if exists trg_walkin_intake_logs_updated_at on public.walkin_intake_logs;
create trigger trg_walkin_intake_logs_updated_at before update on public.walkin_intake_logs
for each row execute function public.set_updated_at();

drop trigger if exists trg_document_collection_checklists_updated_at on public.document_collection_checklists;
create trigger trg_document_collection_checklists_updated_at before update on public.document_collection_checklists
for each row execute function public.set_updated_at();

drop trigger if exists trg_notifications_updated_at on public.notifications;
create trigger trg_notifications_updated_at before update on public.notifications
for each row execute function public.set_updated_at();

drop trigger if exists trg_notification_receipts_updated_at on public.notification_receipts;
create trigger trg_notification_receipts_updated_at before update on public.notification_receipts
for each row execute function public.set_updated_at();

drop trigger if exists trg_chat_threads_updated_at on public.chat_threads;
create trigger trg_chat_threads_updated_at before update on public.chat_threads
for each row execute function public.set_updated_at();

drop trigger if exists trg_chat_participants_updated_at on public.chat_participants;
create trigger trg_chat_participants_updated_at before update on public.chat_participants
for each row execute function public.set_updated_at();

drop trigger if exists trg_chat_messages_updated_at on public.chat_messages;
create trigger trg_chat_messages_updated_at before update on public.chat_messages
for each row execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists trg_approvals_updated_at on public.approvals;
create trigger trg_approvals_updated_at before update on public.approvals
for each row execute function public.set_updated_at();

drop trigger if exists trg_security_incidents_updated_at on public.security_incidents;
create trigger trg_security_incidents_updated_at before update on public.security_incidents
for each row execute function public.set_updated_at();

drop trigger if exists trg_referrals_lock_guard on public.referrals;
create trigger trg_referrals_lock_guard before update on public.referrals
for each row execute function public.prevent_locked_referral_change();

drop trigger if exists trg_temp_clients_phone_guard on public.temp_clients;
create trigger trg_temp_clients_phone_guard before insert or update on public.temp_clients
for each row execute function public.guard_temp_client_phone();

drop trigger if exists trg_client_master_phone_guard on public.client_master;
create trigger trg_client_master_phone_guard before insert or update on public.client_master
for each row execute function public.guard_client_phone();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.admins enable row level security;
alter table public.teams enable row level security;
alter table public.team_memberships enable row level security;
alter table public.members enable row level security;
alter table public.member_profiles enable row level security;
alter table public.member_registry_checks enable row level security;
alter table public.uploads enable row level security;
alter table public.member_documents enable row level security;
alter table public.client_master enable row level security;
alter table public.client_access_grants enable row level security;
alter table public.contacts enable row level security;
alter table public.public_form_submissions enable row level security;
alter table public.feedback enable row level security;
alter table public.client_identity_verifications enable row level security;
alter table public.temp_clients enable row level security;
alter table public.temp_client_events enable row level security;
alter table public.temp_client_conflicts enable row level security;
alter table public.referral_links enable row level security;
alter table public.referrals enable row level security;
alter table public.visits enable row level security;
alter table public.visit_logs enable row level security;
alter table public.visit_proofs enable row level security;
alter table public.bookings enable row level security;
alter table public.client_documents enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_attendance enable row level security;
alter table public.office_locations enable row level security;
alter table public.member_attendance enable row level security;
alter table public.attendance_geo_events enable row level security;
alter table public.attendance_corrections enable row level security;
alter table public.walkin_intake_logs enable row level security;
alter table public.document_collection_checklists enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_receipts enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_participants enable row level security;
alter table public.chat_messages enable row level security;
alter table public.tasks enable row level security;
alter table public.approvals enable row level security;
alter table public.activity_logs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.performance_scores enable row level security;
alter table public.rate_limit_events enable row level security;
alter table public.security_incidents enable row level security;

alter table public.roles force row level security;
alter table public.users force row level security;
alter table public.admins force row level security;
alter table public.teams force row level security;
alter table public.team_memberships force row level security;
alter table public.members force row level security;
alter table public.member_profiles force row level security;
alter table public.member_registry_checks force row level security;
alter table public.uploads force row level security;
alter table public.member_documents force row level security;
alter table public.client_master force row level security;
alter table public.client_access_grants force row level security;
alter table public.contacts force row level security;
alter table public.public_form_submissions force row level security;
alter table public.feedback force row level security;
alter table public.client_identity_verifications force row level security;
alter table public.temp_clients force row level security;
alter table public.temp_client_events force row level security;
alter table public.temp_client_conflicts force row level security;
alter table public.referral_links force row level security;
alter table public.referrals force row level security;
alter table public.visits force row level security;
alter table public.visit_logs force row level security;
alter table public.visit_proofs force row level security;
alter table public.bookings force row level security;
alter table public.client_documents force row level security;
alter table public.meetings force row level security;
alter table public.meeting_attendance force row level security;
alter table public.office_locations force row level security;
alter table public.member_attendance force row level security;
alter table public.attendance_geo_events force row level security;
alter table public.attendance_corrections force row level security;
alter table public.walkin_intake_logs force row level security;
alter table public.document_collection_checklists force row level security;
alter table public.notifications force row level security;
alter table public.notification_receipts force row level security;
alter table public.chat_threads force row level security;
alter table public.chat_participants force row level security;
alter table public.chat_messages force row level security;
alter table public.tasks force row level security;
alter table public.approvals force row level security;
alter table public.activity_logs force row level security;
alter table public.audit_logs force row level security;
alter table public.performance_scores force row level security;
alter table public.rate_limit_events force row level security;
alter table public.security_incidents force row level security;

-- Admin-only tables
create policy roles_select on public.roles for select using (public.is_admin());
create policy roles_insert on public.roles for insert with check (public.is_admin());
create policy roles_update on public.roles for update using (public.is_admin()) with check (public.is_admin());
create policy roles_delete on public.roles for delete using (public.is_admin());

create policy admins_select on public.admins for select using (public.is_admin());
create policy admins_insert on public.admins for insert with check (public.is_admin());
create policy admins_update on public.admins for update using (public.is_admin()) with check (public.is_admin());
create policy admins_delete on public.admins for delete using (public.is_admin());

create policy office_locations_select on public.office_locations for select using (public.is_staff());
create policy office_locations_insert on public.office_locations for insert with check (public.is_admin());
create policy office_locations_update on public.office_locations for update using (public.is_admin()) with check (public.is_admin());
create policy office_locations_delete on public.office_locations for delete using (public.is_admin());

create policy audit_logs_select on public.audit_logs for select using (public.is_admin());
create policy audit_logs_insert on public.audit_logs for insert with check (public.is_admin());
create policy audit_logs_update on public.audit_logs for update using (public.is_admin()) with check (public.is_admin());
create policy audit_logs_delete on public.audit_logs for delete using (public.is_admin());

create policy rate_limit_events_select on public.rate_limit_events for select using (public.is_admin());
create policy rate_limit_events_insert on public.rate_limit_events for insert with check (public.is_admin());
create policy rate_limit_events_update on public.rate_limit_events for update using (public.is_admin()) with check (public.is_admin());
create policy rate_limit_events_delete on public.rate_limit_events for delete using (public.is_admin());

create policy security_incidents_select on public.security_incidents for select using (public.is_admin());
create policy security_incidents_insert on public.security_incidents for insert with check (public.is_admin());
create policy security_incidents_update on public.security_incidents for update using (public.is_admin()) with check (public.is_admin());
create policy security_incidents_delete on public.security_incidents for delete using (public.is_admin());

-- Users / teams
create policy users_select on public.users for select using (
  public.is_admin()
  or id = auth.uid()
  or public.is_manager_of(id)
  or (public.current_role_code() = 'reception' and role_code in ('agent','manager','reception','client'))
);

create policy users_insert on public.users for insert with check (public.is_admin());
create policy users_update on public.users for update using (public.is_admin() or id = auth.uid()) with check (public.is_admin() or id = auth.uid());
create policy users_delete on public.users for delete using (public.is_admin());

create policy teams_select on public.teams for select using (
  public.is_admin()
  or exists (
    select 1 from public.team_memberships tm
    where tm.team_id = teams.id and tm.user_id = auth.uid() and tm.is_deleted = false
  )
  or manager_user_id = auth.uid()
);

create policy teams_insert on public.teams for insert with check (public.is_admin() or public.current_role_code() = 'manager');
create policy teams_update on public.teams for update using (public.is_admin() or manager_user_id = auth.uid()) with check (public.is_admin() or manager_user_id = auth.uid());
create policy teams_delete on public.teams for delete using (public.is_admin());

create policy team_memberships_select on public.team_memberships for select using (
  public.is_admin()
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
);

create policy team_memberships_insert on public.team_memberships for insert with check (public.is_admin() or public.current_role_code() = 'manager');
create policy team_memberships_update on public.team_memberships for update using (public.is_admin() or public.current_role_code() = 'manager') with check (public.is_admin() or public.current_role_code() = 'manager');
create policy team_memberships_delete on public.team_memberships for delete using (public.is_admin());

-- Member onboarding
create policy members_select on public.members for select using (
  public.is_admin()
  or auth_user_id = auth.uid()
  or (user_id is not null and public.is_manager_of(user_id))
  or public.current_role_code() = 'reception'
);

create policy members_insert on public.members for insert to anon, authenticated with check (true);
create policy members_update on public.members for update using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or auth_user_id = auth.uid()
) with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or auth_user_id = auth.uid()
);

create policy members_delete on public.members for delete using (public.is_admin());

create policy member_profiles_select on public.member_profiles for select using (
  public.is_admin()
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
  or public.current_role_code() = 'reception'
);

create policy member_profiles_insert on public.member_profiles for insert with check (public.is_admin());
create policy member_profiles_update on public.member_profiles for update using (
  public.is_admin() or user_id = auth.uid() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or user_id = auth.uid() or public.current_role_code() = 'reception'
);

create policy member_profiles_delete on public.member_profiles for delete using (public.is_admin());

create policy member_registry_checks_select on public.member_registry_checks for select using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
);

create policy member_registry_checks_insert on public.member_registry_checks for insert with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy member_registry_checks_update on public.member_registry_checks for update using (
  public.is_admin() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy member_registry_checks_delete on public.member_registry_checks for delete using (public.is_admin());

create policy uploads_select on public.uploads for select using (
  public.is_admin()
  or uploaded_by_user_id = auth.uid()
  or public.current_role_code() = 'reception'
  or public.is_manager_of(uploaded_by_user_id)
);

create policy uploads_insert on public.uploads for insert with check (
  public.is_admin() or public.current_role_code() = 'reception' or uploaded_by_user_id = auth.uid()
);

create policy uploads_update on public.uploads for update using (
  public.is_admin() or public.current_role_code() = 'reception' or uploaded_by_user_id = auth.uid()
) with check (
  public.is_admin() or public.current_role_code() = 'reception' or uploaded_by_user_id = auth.uid()
);

create policy uploads_delete on public.uploads for delete using (public.is_admin());

create policy member_documents_select on public.member_documents for select using (
  public.is_admin()
  or user_id = auth.uid()
  or public.current_role_code() = 'reception'
  or public.is_manager_of(user_id)
);

create policy member_documents_insert on public.member_documents for insert with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or user_id = auth.uid()
);

create policy member_documents_update on public.member_documents for update using (
  public.is_admin()
  or public.current_role_code() = 'reception'
) with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
);

create policy member_documents_delete on public.member_documents for delete using (public.is_admin());

-- Client core
create policy client_master_select on public.client_master for select using (
  public.can_access_client(id)
  or public.current_role_code() = 'reception'
);

create policy client_master_insert on public.client_master for insert with check (
  public.is_staff()
  and (
    public.is_admin()
    or public.current_role_code() = 'reception'
    or owner_user_id = auth.uid()
    or public.is_manager_of(owner_user_id)
  )
);

create policy client_master_update on public.client_master for update using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or owner_user_id = auth.uid()
  or public.is_manager_of(owner_user_id)
) with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or owner_user_id = auth.uid()
  or public.is_manager_of(owner_user_id)
);

create policy client_master_delete on public.client_master for delete using (public.is_admin());

create policy client_access_grants_select on public.client_access_grants for select using (
  public.is_admin()
  or user_id = auth.uid()
  or exists (
    select 1 from public.client_master c
    where c.id = client_access_grants.client_id
      and (c.owner_user_id = auth.uid() or public.is_manager_of(c.owner_user_id))
  )
);

create policy client_access_grants_insert on public.client_access_grants for insert with check (
  public.is_admin() or public.current_role_code() = 'manager'
);

create policy client_access_grants_update on public.client_access_grants for update using (
  public.is_admin() or public.current_role_code() = 'manager'
) with check (
  public.is_admin() or public.current_role_code() = 'manager'
);

create policy client_access_grants_delete on public.client_access_grants for delete using (public.is_admin());

create policy contacts_select on public.contacts for select using (
  public.is_admin() or public.current_role_code() in ('manager','reception')
);

create policy contacts_insert on public.contacts for insert to anon, authenticated with check (true);
create policy contacts_update on public.contacts for update using (
  public.is_admin() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy contacts_delete on public.contacts for delete using (public.is_admin());

create policy public_form_submissions_select on public.public_form_submissions for select using (
  public.is_admin() or public.current_role_code() in ('manager','reception')
);

create policy public_form_submissions_insert on public.public_form_submissions for insert to anon, authenticated with check (true);
create policy public_form_submissions_update on public.public_form_submissions for update using (
  public.is_admin() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy public_form_submissions_delete on public.public_form_submissions for delete using (public.is_admin());

create policy feedback_select on public.feedback for select using (
  (status = 'published' and is_deleted = false)
  or public.is_admin()
  or public.current_role_code() = 'reception'
);

create policy feedback_insert on public.feedback for insert to anon, authenticated with check (true);
create policy feedback_update on public.feedback for update using (
  public.is_admin() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy feedback_delete on public.feedback for delete using (public.is_admin());

create policy client_identity_verifications_select on public.client_identity_verifications for select using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or exists (
    select 1
    from public.client_master c
    where c.id = client_identity_verifications.client_id
      and c.client_user_id = auth.uid()
  )
);

create policy client_identity_verifications_insert on public.client_identity_verifications for insert to anon, authenticated with check (true);
create policy client_identity_verifications_update on public.client_identity_verifications for update using (
  public.is_admin() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy client_identity_verifications_delete on public.client_identity_verifications for delete using (public.is_admin());

create policy temp_clients_select on public.temp_clients for select using (
  public.is_admin()
  or owner_user_id = auth.uid()
  or public.is_manager_of(owner_user_id)
  or public.current_role_code() = 'reception'
);

create policy temp_clients_insert on public.temp_clients for insert with check (
  public.is_admin()
  or owner_user_id = auth.uid()
  or public.is_manager_of(owner_user_id)
);

create policy temp_clients_update on public.temp_clients for update using (
  public.is_admin()
  or owner_user_id = auth.uid()
  or public.is_manager_of(owner_user_id)
) with check (
  public.is_admin()
  or owner_user_id = auth.uid()
  or public.is_manager_of(owner_user_id)
);

create policy temp_clients_delete on public.temp_clients for delete using (public.is_admin());

create policy temp_client_events_select on public.temp_client_events for select using (
  public.is_admin()
  or exists (
    select 1
    from public.temp_clients t
    where t.id = temp_client_events.temp_client_id
      and (
        t.owner_user_id = auth.uid()
        or public.is_manager_of(t.owner_user_id)
        or public.current_role_code() = 'reception'
      )
  )
);

create policy temp_client_events_insert on public.temp_client_events for insert with check (
  public.is_admin()
  or actor_user_id = auth.uid()
);

create policy temp_client_events_update on public.temp_client_events for update using (public.is_admin()) with check (public.is_admin());
create policy temp_client_events_delete on public.temp_client_events for delete using (public.is_admin());

create policy temp_client_conflicts_select on public.temp_client_conflicts for select using (
  public.is_admin()
  or claimant_user_id = auth.uid()
  or existing_owner_user_id = auth.uid()
  or public.is_manager_of(claimant_user_id)
  or public.is_manager_of(existing_owner_user_id)
);

create policy temp_client_conflicts_insert on public.temp_client_conflicts for insert with check (
  public.is_admin() or claimant_user_id = auth.uid()
);

create policy temp_client_conflicts_update on public.temp_client_conflicts for update using (
  public.is_admin() or public.current_role_code() = 'manager'
) with check (
  public.is_admin() or public.current_role_code() = 'manager'
);

create policy temp_client_conflicts_delete on public.temp_client_conflicts for delete using (public.is_admin());

-- Referrals
create policy referral_links_select on public.referral_links for select using (
  public.is_admin() or user_id = auth.uid() or public.is_manager_of(user_id)
);

create policy referral_links_insert on public.referral_links for insert with check (
  public.is_admin() or user_id = auth.uid()
);

create policy referral_links_update on public.referral_links for update using (
  public.is_admin() or user_id = auth.uid()
) with check (
  public.is_admin() or user_id = auth.uid()
);

create policy referral_links_delete on public.referral_links for delete using (public.is_admin());

create policy referrals_select on public.referrals for select using (
  public.is_admin()
  or referrer_user_id = auth.uid()
  or (referred_client_id is not null and public.can_access_client(referred_client_id))
  or referred_member_user_id = auth.uid()
);

create policy referrals_insert on public.referrals for insert with check (
  public.is_admin() or referrer_user_id = auth.uid()
);

create policy referrals_update on public.referrals for update using (
  public.is_admin() or public.current_role_code() = 'manager'
) with check (
  public.is_admin() or public.current_role_code() = 'manager'
);

create policy referrals_delete on public.referrals for delete using (public.is_admin());

-- Visits / bookings / documents
create policy visits_select on public.visits for select using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or assigned_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
  or (client_id is not null and public.can_access_client(client_id))
);

create policy visits_insert on public.visits for insert with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or assigned_user_id = auth.uid()
  or booked_by_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
);

create policy visits_update on public.visits for update using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or assigned_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
) with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or assigned_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
);

create policy visits_delete on public.visits for delete using (public.is_admin());

create policy visit_logs_select on public.visit_logs for select using (
  public.is_admin()
  or exists (
    select 1 from public.visits v
    where v.id = visit_logs.visit_id
      and (
        v.assigned_user_id = auth.uid()
        or public.is_manager_of(v.assigned_user_id)
        or public.current_role_code() = 'reception'
        or (v.client_id is not null and public.can_access_client(v.client_id))
      )
  )
);

create policy visit_logs_insert on public.visit_logs for insert with check (
  public.is_admin() or actor_user_id = auth.uid()
);

create policy visit_logs_update on public.visit_logs for update using (public.is_admin()) with check (public.is_admin());
create policy visit_logs_delete on public.visit_logs for delete using (public.is_admin());

create policy visit_proofs_select on public.visit_proofs for select using (
  public.is_admin()
  or exists (
    select 1 from public.visits v
    where v.id = visit_proofs.visit_id
      and (
        v.assigned_user_id = auth.uid()
        or public.is_manager_of(v.assigned_user_id)
        or public.current_role_code() = 'reception'
        or (v.client_id is not null and public.can_access_client(v.client_id))
      )
  )
);

create policy visit_proofs_insert on public.visit_proofs for insert with check (
  public.is_admin() or uploaded_by_user_id = auth.uid()
);

create policy visit_proofs_update on public.visit_proofs for update using (
  public.is_admin() or public.current_role_code() in ('manager','reception')
) with check (
  public.is_admin() or public.current_role_code() in ('manager','reception')
);

create policy visit_proofs_delete on public.visit_proofs for delete using (public.is_admin());

create policy bookings_select on public.bookings for select using (
  public.is_admin()
  or assigned_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
  or public.can_access_client(client_id)
);

create policy bookings_insert on public.bookings for insert with check (
  public.is_admin()
  or assigned_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
);

create policy bookings_update on public.bookings for update using (
  public.is_admin()
  or assigned_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
) with check (
  public.is_admin()
  or assigned_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
);

create policy bookings_delete on public.bookings for delete using (public.is_admin());

create policy client_documents_select on public.client_documents for select using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or public.can_access_client(client_id)
  or client_user_id = auth.uid()
);

create policy client_documents_insert on public.client_documents for insert with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or public.can_access_client(client_id)
  or client_user_id = auth.uid()
);

create policy client_documents_update on public.client_documents for update using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or public.can_access_client(client_id)
) with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or public.can_access_client(client_id)
);

create policy client_documents_delete on public.client_documents for delete using (public.is_admin());

-- Meetings / attendance / reception
create policy meetings_select on public.meetings for select using (public.is_staff());
create policy meetings_insert on public.meetings for insert with check (public.current_role_code() in ('admin','manager','reception'));
create policy meetings_update on public.meetings for update using (public.current_role_code() in ('admin','manager','reception')) with check (public.current_role_code() in ('admin','manager','reception'));
create policy meetings_delete on public.meetings for delete using (public.is_admin());

create policy meeting_attendance_select on public.meeting_attendance for select using (
  public.is_admin()
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
  or public.current_role_code() = 'reception'
);

create policy meeting_attendance_insert on public.meeting_attendance for insert with check (
  public.current_role_code() in ('admin','manager','reception')
);

create policy meeting_attendance_update on public.meeting_attendance for update using (
  public.current_role_code() in ('admin','manager','reception')
) with check (
  public.current_role_code() in ('admin','manager','reception')
);

create policy meeting_attendance_delete on public.meeting_attendance for delete using (public.is_admin());

create policy member_attendance_select on public.member_attendance for select using (
  public.is_admin()
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
  or public.current_role_code() = 'reception'
);

create policy member_attendance_insert on public.member_attendance for insert with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or user_id = auth.uid()
);

create policy member_attendance_update on public.member_attendance for update using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
) with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
);

create policy member_attendance_delete on public.member_attendance for delete using (public.is_admin());

create policy attendance_geo_events_select on public.attendance_geo_events for select using (
  public.is_admin()
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
  or public.current_role_code() = 'reception'
);

create policy attendance_geo_events_insert on public.attendance_geo_events for insert with check (
  public.is_admin() or user_id = auth.uid()
);

create policy attendance_geo_events_update on public.attendance_geo_events for update using (
  public.is_admin() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy attendance_geo_events_delete on public.attendance_geo_events for delete using (public.is_admin());

create policy attendance_corrections_select on public.attendance_corrections for select using (
  public.is_admin()
  or requested_by_user_id = auth.uid()
  or reviewed_by_user_id = auth.uid()
  or public.current_role_code() = 'reception'
  or exists (
    select 1
    from public.member_attendance a
    where a.id = attendance_corrections.attendance_id
      and public.is_manager_of(a.user_id)
  )
);

create policy attendance_corrections_insert on public.attendance_corrections for insert with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or requested_by_user_id = auth.uid()
);

create policy attendance_corrections_update on public.attendance_corrections for update using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or reviewed_by_user_id = auth.uid()
) with check (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or reviewed_by_user_id = auth.uid()
);

create policy attendance_corrections_delete on public.attendance_corrections for delete using (public.is_admin());

create policy walkin_intake_logs_select on public.walkin_intake_logs for select using (
  public.is_admin() or public.current_role_code() in ('manager','reception')
);

create policy walkin_intake_logs_insert on public.walkin_intake_logs for insert with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy walkin_intake_logs_update on public.walkin_intake_logs for update using (
  public.is_admin() or public.current_role_code() = 'reception'
) with check (
  public.is_admin() or public.current_role_code() = 'reception'
);

create policy walkin_intake_logs_delete on public.walkin_intake_logs for delete using (public.is_admin());

create policy document_collection_checklists_select on public.document_collection_checklists for select using (
  public.is_admin()
  or public.current_role_code() = 'reception'
  or (client_id is not null and public.can_access_client(client_id))
  or user_id = auth.uid()
  or public.is_manager_of(user_id)
);

create policy document_collection_checklists_insert on public.document_collection_checklists for insert with check (
  public.current_role_code() in ('admin','manager','reception')
);

create policy document_collection_checklists_update on public.document_collection_checklists for update using (
  public.current_role_code() in ('admin','manager','reception')
) with check (
  public.current_role_code() in ('admin','manager','reception')
);

create policy document_collection_checklists_delete on public.document_collection_checklists for delete using (public.is_admin());

-- Notifications / chat
create policy notifications_select on public.notifications for select using (
  public.is_admin()
  or created_by_user_id = auth.uid()
  or target_user_id = auth.uid()
  or target_role = public.current_role_code()
  or (target_team_id is not null and exists (
    select 1 from public.team_memberships tm
    where tm.team_id = notifications.target_team_id and tm.user_id = auth.uid() and tm.is_deleted = false
  ))
);

create policy notifications_insert on public.notifications for insert with check (
  public.current_role_code() in ('admin','manager','reception','system')
);

create policy notifications_update on public.notifications for update using (
  public.is_admin() or created_by_user_id = auth.uid()
) with check (
  public.is_admin() or created_by_user_id = auth.uid()
);

create policy notifications_delete on public.notifications for delete using (public.is_admin());

create policy notification_receipts_select on public.notification_receipts for select using (
  public.is_admin() or user_id = auth.uid() or public.is_manager_of(user_id)
);

create policy notification_receipts_insert on public.notification_receipts for insert with check (
  public.is_admin() or public.current_role_code() in ('manager','reception','system')
);

create policy notification_receipts_update on public.notification_receipts for update using (
  public.is_admin() or user_id = auth.uid()
) with check (
  public.is_admin() or user_id = auth.uid()
);

create policy notification_receipts_delete on public.notification_receipts for delete using (public.is_admin());

create policy chat_threads_select on public.chat_threads for select using (
  public.can_access_thread(id)
);

create policy chat_threads_insert on public.chat_threads for insert with check (
  public.is_staff() and created_by_user_id = auth.uid()
);

create policy chat_threads_update on public.chat_threads for update using (
  public.is_admin() or public.can_access_thread(id)
) with check (
  public.is_admin() or public.can_access_thread(id)
);

create policy chat_threads_delete on public.chat_threads for delete using (public.is_admin());

create policy chat_participants_select on public.chat_participants for select using (
  public.can_access_thread(thread_id)
);

create policy chat_participants_insert on public.chat_participants for insert with check (
  public.is_admin() or public.current_role_code() in ('manager','reception')
);

create policy chat_participants_update on public.chat_participants for update using (
  public.is_admin() or public.current_role_code() in ('manager','reception')
) with check (
  public.is_admin() or public.current_role_code() in ('manager','reception')
);

create policy chat_participants_delete on public.chat_participants for delete using (public.is_admin());

create policy chat_messages_select on public.chat_messages for select using (
  public.can_access_thread(thread_id)
);

create policy chat_messages_insert on public.chat_messages for insert with check (
  sender_user_id = auth.uid() and public.can_access_thread(thread_id)
);

create policy chat_messages_update on public.chat_messages for update using (
  public.is_admin() or sender_user_id = auth.uid()
) with check (
  public.is_admin() or sender_user_id = auth.uid()
);

create policy chat_messages_delete on public.chat_messages for delete using (public.is_admin());

-- Tasks / approvals / activity / performance
create policy tasks_select on public.tasks for select using (
  public.is_admin()
  or assigned_user_id = auth.uid()
  or created_by_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
  or (client_id is not null and public.can_access_client(client_id))
);

create policy tasks_insert on public.tasks for insert with check (
  public.is_staff() and created_by_user_id = auth.uid()
);

create policy tasks_update on public.tasks for update using (
  public.is_admin()
  or assigned_user_id = auth.uid()
  or created_by_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
) with check (
  public.is_admin()
  or assigned_user_id = auth.uid()
  or created_by_user_id = auth.uid()
  or public.is_manager_of(assigned_user_id)
);

create policy tasks_delete on public.tasks for delete using (public.is_admin());

create policy approvals_select on public.approvals for select using (
  public.is_admin()
  or submitted_by_user_id = auth.uid()
  or reviewed_by_user_id = auth.uid()
  or public.current_role_code() in ('manager','reception')
);

create policy approvals_insert on public.approvals for insert with check (
  public.is_staff() and submitted_by_user_id = auth.uid()
);

create policy approvals_update on public.approvals for update using (
  public.is_admin()
  or public.current_role_code() in ('manager','reception')
  or reviewed_by_user_id = auth.uid()
) with check (
  public.is_admin()
  or public.current_role_code() in ('manager','reception')
  or reviewed_by_user_id = auth.uid()
);

create policy approvals_delete on public.approvals for delete using (public.is_admin());

create policy activity_logs_select on public.activity_logs for select using (
  public.is_admin()
  or actor_user_id = auth.uid()
  or public.current_role_code() in ('manager','reception')
);

create policy activity_logs_insert on public.activity_logs for insert with check (
  public.is_staff()
);

create policy activity_logs_update on public.activity_logs for update using (public.is_admin()) with check (public.is_admin());
create policy activity_logs_delete on public.activity_logs for delete using (public.is_admin());

create policy performance_scores_select on public.performance_scores for select using (
  public.is_admin() or user_id = auth.uid() or public.is_manager_of(user_id)
);

create policy performance_scores_insert on public.performance_scores for insert with check (public.is_admin());
create policy performance_scores_update on public.performance_scores for update using (public.is_admin()) with check (public.is_admin());
create policy performance_scores_delete on public.performance_scores for delete using (public.is_admin());

-- -----------------------------------------------------------------------------
-- STORAGE BUCKET
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'uploads',
  'uploads',
  false,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy uploads_bucket_select
on storage.objects
for select
using (
  bucket_id = 'uploads'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[2]
    or public.current_role_code() in ('manager','reception')
  )
);

create policy uploads_bucket_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'uploads'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[2]
    or public.current_role_code() in ('manager','reception')
  )
);

create policy uploads_bucket_update
on storage.objects
for update
using (
  bucket_id = 'uploads'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[2]
    or public.current_role_code() in ('manager','reception')
  )
)
with check (
  bucket_id = 'uploads'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[2]
    or public.current_role_code() in ('manager','reception')
  )
);

create policy uploads_bucket_delete
on storage.objects
for delete
using (
  bucket_id = 'uploads'
  and public.is_admin()
);

commit;
---------------------------

-- 1. extensions
-- 2. enums
-- 3. set_updated_at() only
-- 4. create roles
-- 5. create users
-- 6. बाकी helper functions:
--    current_role_code()
--    is_admin()
--    is_manager()
--    is_staff()
--    is_manager_of()
--    can_access_client()
--    can_access_thread()
--    prevent_locked_referral_change()
--    guard_temp_client_phone()
--    guard_client_phone()
-----------

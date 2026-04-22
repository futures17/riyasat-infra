# 🗄️ Backend Workflow — Riyasat Infra (Supabase)

**Stack:** Supabase (PostgreSQL + Auth + RLS + Storage) + Edge Functions (Deno)

---

## 🏗️ Database Architecture

All tables are in the `public` schema. Row Level Security (RLS) is enabled on all tables.

```
public/
├── roles           # User roles (admin, manager, agent, reception, client)
├── users           # Internal staff & clients (maps to auth.users.id)
├── team_members    # Extended agent/staff profile (employee code, branch etc.)
│
├── clients         # Registered clients (with anti-crossing lock)
├── temp_clients    # Temporary client entries (expire in 7 days)
│
├── visits          # Site visit bookings
├── bookings        # Property bookings / deals
├── contacts        # Website contact form submissions
├── feedback        # Client reviews & ratings
│
├── attendance      # Agent attendance (geo-verified check-in/out)
├── media_assets    # Uploaded media (variants: original, webp, thumb)
└── notifications   # System notifications for users
```

---

## 📋 Table Details

### `roles`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | Auto-generated |
| code | TEXT (UNIQUE) | `admin` / `manager` / `agent` / `reception` / `client` |
| name | TEXT | Display name |
| rank | INT | Hierarchy level (lower = more power) |

---

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | Mirrors `auth.users.id` in production |
| role_id | UUID (FK → roles) | What role this user has |
| manager_user_id | UUID (FK → users) | Self-referential — who manages this user |
| full_name | TEXT | |
| phone | TEXT (UNIQUE) | Primary contact |
| email | TEXT (UNIQUE) | Optional |
| status | TEXT | `active` / `inactive` |
| avatar_url | TEXT | Supabase storage URL |

---

### `clients`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| owner_user_id | UUID (FK → users) | The agent who owns this client |
| full_name | TEXT | |
| phone | TEXT | |
| source | TEXT | Where did the lead come from |
| status | TEXT | `lead` / `visited` / `booked` / `dropped` |
| anti_crossing_lock | BOOLEAN | If true, no other agent can claim this client |

---

### `visits`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| client_id | UUID (FK → clients) | Optional — can be a new walk-in |
| assigned_user_id | UUID (FK → users) | Which agent handles this visit |
| full_name | TEXT | Visitor name |
| phone | TEXT | Visitor phone |
| preferred_date | DATE | |
| visit_status | TEXT | `scheduled` / `completed` / `cancelled` |
| ref_id | TEXT | Referral code / campaign tag |

---

### `contacts`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | TEXT | From website contact form |
| phone | TEXT | |
| email | TEXT | |
| message | TEXT | |
| status | TEXT | `new` / `read` / `responded` |

---

### `attendance`
| Column | Type | Notes |
|---|---|---|
| user_id | UUID (FK → users) | Agent ID |
| attendance_date | DATE | |
| check_in_at | TIMESTAMPTZ | Geo-verified timestamp |
| check_out_at | TIMESTAMPTZ | |
| location_lat / lng | NUMERIC | GPS coordinates |
| mode | TEXT | `geo` / `manual` / `reception` |

---

## 🔐 Row Level Security (RLS) Policy Map

| Table | Policy | Rule |
|---|---|---|
| `visits` | Allow public read | `USING (true)` |
| `visits` | Allow public insert | `WITH CHECK (true)` |
| `contacts` | Allow public read/insert | Open (for website forms) |
| `feedback` | Allow public read/insert | Open (for review widget) |
| `temp_clients` | Allow public read/insert | Open |
| `attendance` | Allow public read/insert | Open |
| `bookings` | Allow public read/insert | Open |
| `users` | Allow public read/insert | Open |
| `roles` | No public policy | Restricted (admin-only) |
| `team_members` | No public policy | Restricted (admin-only) |
| `clients` | No public policy | Restricted (agent-only via auth) |

> **Note:** In production, "allow public" policies should be replaced with `auth.uid() IS NOT NULL` or role-based checks.

---

## 🔄 Data Flow — Key Operations

### 1. Website Contact Form → Supabase
```
ContactSection.tsx
    ↓ user fills form
    ↓ supabase.from('contacts').insert({ name, phone, email, message })
    ↓ record created with status = 'new'
    ↓ Admin sees it in Admin Dashboard → Contacts tab
```

### 2. Book Site Visit → Supabase
```
BookVisitPage.tsx
    ↓ user fills visit form
    ↓ supabase.from('visits').insert({ full_name, phone, preferred_date, ref_id })
    ↓ visit_status = 'scheduled' (default)
    ↓ Admin sees it in VisitsAdmin.tsx → can assign agent, update status
```

### 3. Member Signup → Supabase Auth
```
signup-member.tsx
    ↓ supabase.auth.signUp({ email, password })
    ↓ after email confirm → insert into public.users with role_id
    ↓ insert into public.team_members with employee_code, designation
```

### 4. Admin Login → Supabase Auth
```
auth/login.tsx
    ↓ supabase.auth.signInWithPassword({ email, password })
    ↓ session stored in localStorage
    ↓ redirect to /admin
    ↓ admin/index.tsx checks user role from public.users
    ↓ renders admin shell with sidebar nav
```

### 5. Attendance Check-in
```
Member opens attendance page
    ↓ browser gets GPS coordinates
    ↓ supabase.from('attendance').insert({ user_id, attendance_date, check_in_at, location_lat, location_lng })
    ↓ Admin can view in Dashboard
```

---

## 📦 Supabase Storage

Used for:
- Agent / staff photos (`avatar_url` in `users` table)
- Media assets (property images, videos) via `media_assets` table

Buckets (to be configured):
- `avatars` — public read, authenticated write
- `property-media` — public read, authenticated write

---

## 🛠️ Migration Files

Location: `supabase/migrations/`

Master schema is at:
```
riyasat_master_schema.sql   ← Run this to recreate the full DB from scratch
```

---

## 🔧 Local Development

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push

# Or run SQL manually in Supabase Studio:
# Project → SQL Editor → paste riyasat_master_schema.sql → Run
```

---

## ⚙️ Environment Setup

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  ← anon/public key (safe to expose in frontend)
```

The **service_role** key is NEVER used in the frontend. It is only used in Edge Functions or server-side scripts.

---

## 🚨 Security Checklist

- [x] RLS enabled on all public tables
- [x] `uuid-ossp` extension used for UUID generation
- [ ] In production: Replace `USING (true)` with `auth.uid() IS NOT NULL` on sensitive tables
- [ ] In production: Add role-based policies (`admin`, `agent`, `client` checks)
- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up Row Level Security for `media_assets` bucket
- [ ] Enable `pg_net` extension for Supabase webhooks / notifications if needed

---

## 📊 Admin Dashboard — Feature Map

| Feature | File | Table |
|---|---|---|
| Overview stats | `DashboardOverview.tsx` | `visits`, `bookings`, `contacts` |
| Site visits list | `VisitsAdmin.tsx` | `visits` |
| Schedule meetings | `MeetingsAdmin.tsx` | `visits` (meeting type) |
| Manage team members | `MembersAdmin.tsx` | `users`, `team_members` |
| Book visit (manual) | `AdminBookVisit.tsx` | `visits` |

# 🌿 Frontend Workflow — Green Glades Estate (Riyasat Infra)

**Stack:** Vite + React 18 + TypeScript + TailwindCSS + Supabase JS Client

---

## 📁 Project Structure

```
src/
├── main.tsx               # App entry point — mounts React, sets up Lenis scroll
├── App.tsx                # Root router (react-router-dom v6)
├── index.css              # Global design tokens, animations, Tailwind base
│
├── pages/                 # Public-facing pages (website)
│   ├── Index.tsx          # Home page
│   ├── AboutPage.tsx      # About + Location merged page
│   ├── ProjectsPage.tsx   # Green Glades Estate full project page ⭐
│   ├── EventsPage.tsx     # Events & Awards gallery page
│   ├── BookVisitPage.tsx  # Book a site visit form
│   ├── ContactPage.tsx    # Contact hub
│   ├── DeveloperPage.tsx  # Riyasat Infra developer profile
│   ├── GalleryPage.tsx    # Full gallery
│   └── NotFound.tsx       # 404
│
├── components/            # Reusable UI components
│   ├── Navbar.tsx         # Sticky navbar (desktop + mobile)
│   ├── LuxuryFooter.tsx   # Footer with contact info, social links
│   ├── HeroSection.tsx    # Homepage hero
│   ├── ContactSection.tsx # Supabase-connected contact form
│   ├── ReviewSection.tsx  # Testimonials / reviews
│   ├── InvestmentExcellenceSection.tsx # Investment carousel
│   ├── AmenitiesSection.tsx           # Amenities icons grid
│   ├── StackedFacilitiesSection.tsx   # Facilities stacked cards
│   ├── AwardsMedallions.tsx           # Awards display
│   └── ...
│
├── app/                   # Internal admin / member portal
│   ├── auth/
│   │   ├── login.tsx          # Admin / member login
│   │   ├── signup-member.tsx  # Agent / staff signup
│   │   └── signup-client.tsx  # Client self-registration
│   ├── admin/
│   │   ├── index.tsx              # Admin dashboard shell
│   │   ├── DashboardOverview.tsx  # Stats cards (visits, bookings etc.)
│   │   ├── VisitsAdmin.tsx        # Manage site visits
│   │   ├── MeetingsAdmin.tsx      # Manage scheduled meetings
│   │   ├── MembersAdmin.tsx       # Manage agents / team members
│   │   └── AdminBookVisit.tsx     # Admin form to book a visit manually
│   └── member/                    # Member (agent) portal
│
├── hooks/
│   ├── use-mobile.tsx     # Responsive breakpoint hook
│   └── use-toast.ts       # Toast notification system
│
├── lib/
│   └── utils.ts           # cn() helper (clsx + tailwind-merge)
│
└── assets/                # All static images (webp)
    ├── green_glades/      # Project-specific images
    │   ├── posters/
    │   ├── facalities/
    │   ├── broucher/
    │   ├── visit map/
    │   └── logo/
    └── ...
```

---

## 🔄 Page Routing Map

```
/                    → Index.tsx          (Home)
/about               → AboutPage.tsx      (About + Location)
/projects            → ProjectsPage.tsx   (Green Glades full page)
/events              → EventsPage.tsx     (Events & Awards)
/contact             → ContactPage.tsx    (Contact hub)
/book-visit          → BookVisitPage.tsx  (Visit booking form)
/developer           → DeveloperPage.tsx  (Riyasat Infra profile)
/gallery             → GalleryPage.tsx    (Photo gallery)

/auth                → auth/index.tsx     (Auth router)
/auth/login          → auth/login.tsx
/auth/signup-member  → auth/signup-member.tsx
/auth/signup-client  → auth/signup-client.tsx

/admin               → admin/index.tsx    (Protected admin shell)
/admin/dashboard     → DashboardOverview
/admin/visits        → VisitsAdmin
/admin/meetings      → MeetingsAdmin
/admin/members       → MembersAdmin
```

---

## 🎨 Design System

All design tokens live in `src/index.css`:

| Token | Value / Usage |
|---|---|
| `forest-deep` | Deep dark green (`#0A2E2E`) — primary bg |
| `gold` | Luxury gold (`#C8A44B`) — accents, CTA borders |
| `font-heading` | Cormorant Garamond — luxury headings |
| `font-body` | Inter / Outfit — body text |
| `luxury-heading` | CSS class — large serif heading style |
| `gold-text` | CSS class — golden gradient text |
| `Btn` | CSS class — primary CTA button (gold) |
| `animate-marquee` | Auto-scrolling horizontal slider |
| `animate-loader-progress` | Page loader progress bar |

---

## 📡 Supabase Integration (Frontend)

```
src/lib/supabase.ts  ←  Supabase client (uses VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
```

### Tables accessed from frontend:
| Table | Operation | Where |
|---|---|---|
| `contacts` | INSERT | ContactSection.tsx, ContactPage.tsx |
| `visits` | INSERT | BookVisitPage.tsx |
| `feedback` | SELECT / INSERT | ReviewSection.tsx |
| `users` | SELECT | Admin dashboard |
| `visits` | SELECT | VisitsAdmin.tsx |
| `bookings` | SELECT | DashboardOverview.tsx |

---

## ⚙️ Development Workflow

```bash
# 1. Start dev server
npm run dev
# → http://localhost:8080

# 2. Build for production
npm run build
# → dist/ folder

# 3. Preview production build
npm run preview

# 4. Run tests
npm run test
```

### Environment Variables (.env)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_OPENROUTER_API_KEY=sk-or-...
```

---

## 🖼️ Asset Convention

- All images are `.webp` format for performance
- Images are placed in `src/assets/` and referenced via absolute `/src/assets/...` paths
- Brochure PDF lives at: `src/assets/green_glades/broucher/Final Green Glade Brochure.pdf`
- Never reference assets with `../../` — always use `/src/assets/...` to avoid Vite path resolution issues

---

## 🚀 Deployment

- **Platform:** Netlify / Vercel
- Config: `netlify.toml` + `vercel.json` (both handle SPA redirects → `index.html`)
- Build command: `npm run build`
- Output dir: `dist`

---

## ⚠️ Known Rules / Gotchas

1. **No `useRef` without cleanup** — GSAP timelines must be killed in `return () => tl.kill()`
2. **Image paths** — Always use absolute `/src/assets/...` (not import aliases for images in arrays)
3. **Tailwind arbitrary values** — `duration-[1200ms]` etc. cause Tailwind warnings; these are cosmetic and don't break the build
4. **`noise.png`** — Referenced in CSS but not a real asset. It's a runtime CSS background that resolves via CDN. Do not delete or fix it.
5. **TypeScript strict** — Avoid `any` types; use `SliderItem` pattern for union types in component props
6. **Scroll Resets** — Always use the `ScrollToTop` component in `App.tsx` to handle Lenis re-initialization on route changes.
7. **AI Chat Links** — When adding new pages, remember to update `ai-chat/chat.js` suggestions and knowledge base links.

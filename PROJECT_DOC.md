# AKU Olympiad 2026 — Sports Event Registration System
## Project Documentation

---

## 1. Project Overview

**Event:** National University Olympiad 2026
**Organizer:** Aga Khan University Hospital, Karachi, Pakistan
**System Type:** Sports Event Registration & Scheduling System (POC / Phase 1)
**Stack:** React 18 + Vite + Tailwind CSS v3 + Framer Motion + React Router v6
**Storage:** localStorage (mock, no backend)
**Path:** `D:/TRAEEE/asf/sports-olympiad`

---

## 2. Running the Project

```bash
cd D:/TRAEEE/asf/sports-olympiad
npm run dev
# Opens at http://localhost:5173
```

**Reset mock data** (browser console):
```js
resetMockData()
```

---

## 3. Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@olympiad.pk | admin123 |
| Punjab University | sports@pu.edu.pk | pu123 |
| NUST | athletics@nust.edu.pk | nust123 |
| LUMS | sports@lums.edu.pk | lums123 |
| UET Lahore | sports@uet.edu.pk | uet123 |
| FAST NUCES | olympiad@nu.edu.pk | fast123 |
| QAU | sports@qau.edu.pk | qau123 |
| UoK | sports@uok.edu.pk | uok123 |
| IBA Karachi | sports@iba.edu.pk | iba123 |

---

## 4. Architecture

```
src/
├── components/
│   ├── HomePage.jsx          # Public landing page
│   ├── Login.jsx             # University + Admin login (isAdmin prop)
│   ├── AppShell.jsx          # Shared portal header/nav wrapper
│   ├── UniversityDashboard.jsx
│   ├── RegistrationForm.jsx  # Multi-step: sport select → add players
│   ├── RegistrationDetails.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminReview.jsx       # Per-player approve/reject + verify
│   └── Icons.jsx             # SVG icon factory + sport emoji map
├── data/
│   └── mockData.js           # All mock data + initializeMockData()
├── utils/
│   ├── auth.js               # login/logout/getCurrentUser
│   ├── storage.js            # localStorage CRUD for registrations
│   └── invoice.js            # HTML→PDF invoice generator
├── index.css                 # Tailwind + component/utility layers
└── App.jsx                   # BrowserRouter + ProtectedRoute + all routes
```

### Key Architectural Decisions
- **AppShell**: All portal pages wrapped in `<AppShell user={user} breadcrumb="...">` — single nav
- **Auth**: `localStorage.auth` = `{type:'university'|'admin', id, name, ...}`
- **Data**: `localStorage.registrations` seeded via `initializeMockData()` on mount
- **Data version**: `DATA_VERSION = 'v3'` in mockData.js — bump to force re-seed
- **Protected routes**: HOC checks `isAuthenticated()` + `isAdmin()`/`isUniversity()`

---

## 5. Design System

| Token | Value |
|-------|-------|
| Primary | `#006747` (aku-600) |
| Display font | Bebas Neue (ALL CAPS headings) |
| Body font | Source Sans 3 |
| Style | Vibrant block-based, dark hero, alternating sections |
| Sport icons | Emoji in colored containers `🏏⚽🏀🏐🏸🏃🏓🏒` |
| Shadows | `shadow-card`, `shadow-card-md`, `shadow-card-lg`, `shadow-card-xl`, `shadow-glow` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Animations | Framer Motion `variants` (fadeUp/stagger) + `whileHover/whileTap` |

**Component classes (index.css):**
`.btn` `.btn-primary` `.btn-secondary` `.btn-ghost` `.btn-danger`
`.card` `.card-hover` `.input` `.badge-*` `.stat-card` `.section-label`
`.glass` `.skeleton` `.sport-chip` `.pill`

**Tailwind custom colors:** `aku-*` `surface-*` `gold-*`

---

## 6. Routes

| Path | Component | Auth |
|------|-----------|------|
| `/` | HomePage | Public |
| `/login` | Login | Public |
| `/admin/login` | Login (isAdmin) | Public |
| `/university/dashboard` | UniversityDashboard | University |
| `/university/register` | RegistrationForm (new) | University |
| `/university/register/:id` | RegistrationForm (edit) | University |
| `/university/registration/:id` | RegistrationDetails | University |
| `/admin/dashboard` | AdminDashboard | Admin |
| `/admin/review/:id` | AdminReview | Admin |

---

## 7. Mock Data Summary (v3)

**12 registrations** across **8 universities**, **all 8 sports**, **~80 players**

| ID | University | Sports | Status | Players |
|----|-----------|--------|--------|---------|
| reg1 | Punjab University | Cricket, Football | submitted | 12 (mixed) |
| reg2 | NUST | Basketball, Athletics, Volleyball | submitted | 12 (all pending) |
| reg3 | LUMS | Badminton, Table Tennis | ✅ verified | 7 (all approved) |
| reg4 | UET Lahore | Football, Hockey | submitted | 11 (mixed) |
| reg5 | FAST NUCES | Cricket, Basketball, Badminton | ✅ verified | 11 (all approved) |
| reg6 | QAU | Athletics | submitted | 6 (mixed, 1 rejected) |
| reg7 | UoK | Volleyball, Hockey | submitted | 11 (all pending) |
| reg8 | IBA Karachi | Table Tennis, Badminton | ✅ verified | 7 (all approved) |
| reg9 | Punjab University | Hockey, Athletics | **draft** | 5 |
| reg10 | NUST | Cricket | **draft** | 3 |
| reg11 | UET Lahore | Basketball, Volleyball | ✅ verified | 7 (all approved) |
| reg12 | FAST NUCES | Football | submitted | 6 (with age rejection) |

**Admin stats:** 10 received · 6 pending review · 4 verified · ~80 total players

---

## 8. Phase 1 Scope — Completion Status

| Feature | Status | Notes |
|---------|--------|-------|
| University login | ✅ Done | 8 demo accounts |
| Sport selection + draft save | ✅ Done | |
| Player details (name, DOB, CNIC, images) | ✅ Done | |
| Student ID upload | ⚠️ Partial | Only CNIC; student ID recommended in scope |
| Submit for verification | ✅ Done | |
| Admin review + approve/reject | ✅ Done | With rejection reason |
| Age eligibility check (18–25) | ✅ Done | Visual warning shown |
| Invoice generation + PDF download | ✅ Done | HTML→PDF, AKU branded |
| Invoice "no stamp required" label | ⚠️ Missing | Easy addition |
| Invoice versioning | ⚠️ Not built | Out of scope for POC |
| Track verification status | ✅ Done | |
| Public homepage | ✅ Done | |
| Event info + dates + venue | ✅ Done | |
| Sports list | ✅ Done | |
| Eligibility criteria | ✅ Done | |
| Announcements section | ✅ Done | |
| Register Now CTA | ✅ Done | |
| Downloads section | ⚠️ Missing | Rulebook, guidelines |
| How to Register guide | ⚠️ Missing | Step-by-step |
| Countdown timer | ⚠️ Missing | Mar 15 event date |
| Admin announcement management | ⚠️ Missing | Currently hardcoded |
| Contact section | ✅ Done | |

**Phase 1 completion: ~88%** — Demo-ready. Remaining gaps are cosmetic.

---

## 9. Pending Additions (Post-doc)

1. **Fix location** — Change all "Islamabad" references to **AKU Hospital, Karachi**
2. **Countdown timer** — Live countdown to Mar 15, 2026 in hero
3. **Downloads section** — Rulebook PDF, guidelines, code of conduct (mock links)
4. **How to Register** — 3-step guide section on homepage
5. **Student ID field** — Optional field in player registration form
6. **"Online invoice – no stamp required"** — Label on PDF invoice
7. **Clickable sport cards** — Modal/sheet showing sport details on click

---

## 10. Phase 2 Scope (Not Built — For Discussion)

- Auto fixture generation (Round Robin / Groups / Knockouts)
- Courts configuration per sport
- Auto-cancel sport if teams < 2
- Score entry + live standings
- Digital QR code player ID generation
- Admin announcement management UI
- Sponsors section, gallery, social links

---

## 11. Known Issues / Notes

- **Tailwind v3** — PostCSS config uses `tailwindcss: {}` NOT `@tailwindcss/postcss`
- **CSS syntax** — Uses `@tailwind base/components/utilities` (v3 style)
- **Data re-seed** — Bump `DATA_VERSION` in `mockData.js` to force fresh data
- **CNIC images** — Using `placehold.co` placeholder images (no real uploads stored)
- **PDF generation** — Uses HTML string + `data:` URL blob download (no library)
- **No backend** — All data in localStorage; state resets on `localStorage.clear()`

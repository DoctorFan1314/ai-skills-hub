# Changelog

> **[中文版本](CHANGELOG_CN.md)**

All notable changes to this project will be documented in this file.

---

## [v1.2.0] — 2026-05-05

### Added
- **User Auth System** — localStorage-based login/register/logout with session persistence
- **Toast Notification System** — auto-dismiss notifications with deduplication logic
- **Like/Bookmark Persistence** — skill likes and bookmarks saved to localStorage, survive page refresh
- **Submit Form Validation & Persistence** — required field validation, min-length checks, submissions saved to localStorage with history list
- **URL-Synced Filters** — skill marketplace filters (category, difficulty, sort, query) synced to URL query params; shareable, supports browser back/forward
- **Navbar Auth State** — shows username + logout when logged in, login/register buttons when logged out; mobile Sheet menu synced
- **OAuth "Coming Soon" Toast** — Google/GitHub login buttons show toast notification
- **Proper 404 Handling** — `notFound()` for missing skills (`/skills/[id]`) and categories (`/categories/[slug]`)

### Fixed
- **Data Inconsistency** — removed hardcoded `skillCount` (15/12/13) from categories; hero badge and trust bar now show dynamic `skills.length` instead of "1284+"
- **Dead Links** — footer "Terms of Service" and "Privacy Policy" links now greyed out and non-interactive; login "Forgot password?" link disabled
- **Toast Deduplication** — rapid button clicks no longer stack duplicate toast notifications

### New Files
- `src/hooks/use-local-storage.ts` — generic localStorage hook with SSR-safe loading state
- `src/contexts/toast-context.tsx` — ToastProvider + useToast hook
- `src/contexts/auth-context.tsx` — AuthProvider + useAuth hook
- `src/components/ui/toast.tsx` — Toaster floating component

---

## [v1.1.0] — 2026-05-04

### Added
- **Custom 404 Page** — matches site dark theme with "return home" button
- **Sitemap** (`/sitemap.xml`) — auto-generated covering static pages, all skills, and categories
- **Robots.txt** (`/robots.txt`) — search engine crawling rules
- **Per-page Metadata** — `generateMetadata` for `/skills/[id]`, `/categories/[slug]`, `/guide`, `/login`, `/register`, `/submit`
- **JSON-LD Structured Data** — Article schema with AggregateRating on skill detail pages
- **Accessibility Improvements** — `role="radio"` + `aria-checked` on filter buttons, `aria-label` on icon buttons, `<caption>` on model table
- **Clipboard Error Handling** — try/catch on all `navigator.clipboard.writeText` calls
- **Loading Skeleton** — skill detail page loading state
- **Error Boundary** — global `error.tsx` with retry button

### Changed
- **Particle Animation Optimization** — `visibilitychange` listener pauses animation when tab hidden; particles reduced from 50 to 30; squared-distance optimization for connection lines
- **Navbar Search** — functional Enter-to-search with `aria-label` on buttons
- **Color Constants** — centralized in `src/lib/theme.ts`
- **Responsive Filter Bar** — mobile-first stacking with `md:` breakpoints
- **Before/After Section** — cyan gradient background for visual contrast
- **Skill Card Tags** — shows up to 3 tags as pills below subtitle
- **Homepage "View All" Link** — skill sections link to `/skills`
- **Trust Bar Stats** — highlighted values with semantic labels
- **Category Card Hover** — emoji icon scales on hover
- **Skill Detail Table** — `min-w-[600px]` prevents column compression on narrow viewports

### Fixed
- **Type Safety** — removed `as string` type assertions in page params
- **CSS Duplicates** — merged duplicate `body` rules in globals.css
- **Dead Code** — removed unused `searchSkills` function from mock-data

---

## [v1.0.0] — 2026-05-03

### Added
- Initial release
- Homepage with hero, trust bar, category cards, skill sections, testimonials
- Skill marketplace with search, category/difficulty filters, sort
- Skill detail page with one-click copy, variable fill, before/after comparison, usage steps, recommended models
- Category browse and detail pages
- Beginner guide page
- Submit template page
- Login and register pages (UI only)
- Particle background animation
- Responsive design (mobile-first)
- shadcn/ui component library integration
- 10 mock skill templates across 3 categories
- 6 mock user testimonials

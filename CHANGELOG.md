# Changelog

> **[中文版本](CHANGELOG_CN.md)**

All notable changes to this project will be documented in this file.

---

## [v1.4.0] — 2026-05-05

### Added
- **Publish Skill Page** (`/publish`) — full form for publishing Agent Skills with: name, title, description, category, developer, install command, version, license, README editor (Markdown), dynamic file list (add/remove/toggle), demo input/output, tags
- Published skills saved to localStorage, viewable on skill detail page and skills list
- `getPublishedSkills()` and `getAllAgentSkills()` helper functions in `mock-agent-skills.ts`
- `publishedSkills` storage key in `storage-keys.ts`
- **Footer Reorganized** — 4 sections: Agent Skills (with /publish link), Prompt Templates (with categories/trending/tags), Resources, Community
- **Navbar** — "发布技能" added as 4th navigation link
- `/publish` route in sitemap and keyboard command palette
- i18n `publish` section with full Chinese/English translations

### Changed
- **README.md & README_CN.md** — rewritten to reflect dual-content architecture (Agent Skills marketplace + Prompt Template platform)
- Footer grid updated from 4 to 5 columns
- `getAgentSkillById` now checks both mock data and localStorage for user-published skills
- Skills list page includes user-published skills via `getPublishedSkills()`

### Files Modified
- `README.md` — full rewrite for dual-content architecture
- `README_CN.md` — full rewrite for dual-content architecture
- `src/components/layout/navbar.tsx` — added "发布技能" nav link
- `src/components/layout/footer.tsx` — reorganized link groups, 5-column grid
- `src/lib/i18n/types.ts` — added `publish` section to Dictionary
- `src/lib/i18n/zh.ts` — added `publish` Chinese translations
- `src/lib/i18n/en.ts` — added `publish` English translations
- `src/lib/mock-agent-skills.ts` — added `getPublishedSkills()`, `getAllAgentSkills()`, updated `getAgentSkillById`
- `src/lib/storage-keys.ts` — added `publishedSkills` key
- `src/app/skills/client.tsx` — includes published skills in list
- `src/app/sitemap.ts` — added `/publish` route
- `src/hooks/use-keyboard-shortcuts.ts` — added "发布技能" command

### New Files
- `src/app/publish/page.tsx` — server component with metadata
- `src/app/publish/client.tsx` — publish skill form component

---

## [v1.3.0] — 2026-05-05

### Added
- **3 New Categories** — Data Analysis (📊), Productivity (⚡), Creative Writing (✍️), expanding from 3 to 6 total categories
- **18 New Skill Templates** — 28 total skills covering SQL optimization, data cleaning, chart recommendations, data insights, meeting summaries, task planning, email batch generation, workflow automation, daily planning, story outlining, character building, worldbuilding, dialogue polishing, SEO blog optimization, social media strategy, React component generation, incident response, SWOT analysis
- **4 New Testimonials** — from data analysts, novelists, project managers, and educators
- **Pagination** — load-more button (12 per page) on skills marketplace
- **Prompt Engineering Guide** — new section on guide page covering Chain-of-Thought, Few-Shot, Role Prompting, Structured Output, and Self-Critique techniques
- **Better Results Tips** — practical before/after examples for improving AI outputs

### Changed
- **Category Cards** — dynamically rendered from data instead of hardcoded 3 cards; now shows all 6 categories in responsive grid
- **Hero Tagline** — updated to mention six core domains
- **Global Metadata** — description updated to cover all six categories
- **Skill Detail Like/Bookmark** — now properly persisted via localStorage (was reset on refresh)
- **CONTRIBUTING.md** — translated to English

### Files Modified
- `src/lib/theme.ts` — added 3 new category colors (amber, red, pink)
- `src/lib/categories.ts` — added 3 new category definitions
- `src/lib/mock-data.ts` — added 18 skills + 4 testimonials (~1800 new lines)
- `src/components/home/category-cards.tsx` — dynamic rendering from categories data
- `src/components/home/hero.tsx` — updated tagline
- `src/app/layout.tsx` — updated metadata description
- `src/app/skills/client.tsx` — added pagination
- `src/app/skills/[id]/client.tsx` — fixed like/bookmark persistence
- `src/app/guide/page.tsx` — added prompt engineering techniques section
- `README.md` — updated for 28 skills, 6 categories
- `README_CN.md` — updated for 28 skills, 6 categories
- `CONTRIBUTING.md` — translated to English

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

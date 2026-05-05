# AI Skills Hub — High-Quality LLM Skill Template Library

> **[中文文档](README_CN.md)**

> Production-ready LLM skill templates · Copy & use · Remove AI-sounding text · Turn AI into your real productivity weapon

Perfectly compatible with ChatGPT · Claude · Grok · DeepSeek · Qwen · LM Studio · Ollama and other mainstream platforms.

---

## Screenshots

- Deep blue-to-black gradient background + particle animation
- Frosted glass cards + cyan neon borders
- Responsive design, mobile-first

---

## Quick Start

### 1. Requirements

| Dependency | Minimum Version |
|------------|-----------------|
| Node.js | >= 18.0 |
| npm | >= 9.0 |

### 2. Install & Run

```bash
# Enter project directory
cd ai-skills-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Library | shadcn/ui (Base UI) |
| Icons | Lucide React |
| Data | Local Mock Data (migratable to Supabase) |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
ai-skills-hub/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (fonts, Navbar, Footer, particle bg)
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Global styles + CSS variables + utilities
│   │   ├── skills/
│   │   │   ├── page.tsx              # Skill marketplace (search, filter, sort)
│   │   │   └── [id]/page.tsx         # Skill detail page
│   │   ├── categories/
│   │   │   ├── page.tsx              # Category browse
│   │   │   └── [slug]/page.tsx       # Category detail
│   │   ├── guide/page.tsx            # Beginner guide
│   │   ├── submit/page.tsx           # Submit template
│   │   ├── login/page.tsx            # Login
│   │   └── register/page.tsx         # Register
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── navbar.tsx            # Top navigation bar
│   │   │   └── footer.tsx            # Footer
│   │   ├── home/
│   │   │   ├── hero.tsx              # Hero section
│   │   │   ├── trust-bar.tsx         # Trust bar
│   │   │   ├── category-cards.tsx    # Three entry cards
│   │   │   ├── skill-section.tsx     # Skill list section
│   │   │   └── testimonials.tsx      # User testimonials
│   │   ├── skill/
│   │   │   └── skill-card.tsx        # Skill card
│   │   └── shared/
│   │       └── particle-bg.tsx       # Particle background animation
│   ├── contexts/
│   │   ├── toast-context.tsx         # Toast notification system
│   │   └── auth-context.tsx          # Auth context (localStorage-based)
│   ├── hooks/
│   │   └── use-local-storage.ts      # localStorage hook
│   └── lib/
│       ├── types.ts                  # TypeScript type definitions
│       ├── mock-data.ts              # Mock data (10 skill templates + 6 reviews)
│       ├── categories.ts             # Category definitions
│       ├── theme.ts                  # Color/theme constants
│       └── utils.ts                  # Utility functions
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── components.json                   # shadcn/ui config
```

---

## Pages

### Homepage `/`
- Hero section: title + subtitle + CTA buttons
- Trust bar: stats display
- Three entry cards: Language & Content / Coding & Tech / Thinking & Workflow
- Trending skills / Newest templates / Beginner picks: card lists
- User testimonials

### Skill Marketplace `/skills`
- Full-text search (title, description, tags)
- Category filter, difficulty filter, sort (trending / rating / newest)
- URL-synced filters (shareable, browser back/forward supported)
- Responsive grid layout

### Skill Detail `/skills/[id]`
- Title + meta info (category, difficulty, rating, usage count)
- **One-click copy**: Online / Local tab switch
- **Variable fill form**: fill variables, prompt auto-updates
- **Before/After comparison**: multi-model output tab switch
- Usage steps (online / local separately)
- Recommended models table
- Advanced tips
- Interactive buttons (like, bookmark, share) — persisted via localStorage

### Other Pages
- `/categories` — Category browse
- `/categories/[slug]` — Category detail
- `/guide` — Beginner guide
- `/submit` — Submit template (with validation + localStorage persistence)
- `/login` — Login (localStorage-based auth)
- `/register` — Register (localStorage-based auth)

---

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| Skill marketplace | ✅ | Search, filter, sort, responsive grid |
| One-click prompt copy | ✅ | Online/Local versions, clipboard API |
| Variable fill | ✅ | Real-time prompt template update |
| Before/After comparison | ✅ | Multi-model output tabs |
| User auth | ✅ | localStorage-based login/register/logout |
| Like/Bookmark | ✅ | Persisted via localStorage |
| Submit template | ✅ | Validation + localStorage persistence |
| URL-synced filters | ✅ | Shareable filter URLs |
| Toast notifications | ✅ | Auto-dismiss, deduplication |
| SEO | ✅ | Per-page metadata, JSON-LD, sitemap, robots.txt |
| 404 page | ✅ | Custom not-found page |
| Error boundary | ✅ | Global error page |
| Loading skeleton | ✅ | Skill detail page skeleton |
| Accessibility | ✅ | ARIA roles, sr-only labels, semantic HTML |
| Responsive design | ✅ | Mobile-first, Sheet drawer nav |

---

## Design System

### Colors

| Purpose | Value |
|---------|-------|
| Primary (Cyan) | `#00d4ff` |
| Background | `#0a0e1a` → `#000000` gradient |
| Card background | `rgba(255,255,255,0.03)` frosted glass |
| Card border | `rgba(0,212,255,0.12)` |
| Body text | `#e6edf3` |
| Muted text | `#8b949e` |

### CSS Utilities

```css
.glass-card          /* Frosted glass card */
.glass-card-hover    /* Hover float effect */
.glow-text           /* Text glow */
.glow-border         /* Border glow */
.gradient-text       /* Gradient text */
.scrollbar-hide      /* Hide scrollbar */
```

---

## Data Structure

### Skill (Skill Template)

```typescript
interface Skill {
  id: string;              // Unique identifier
  title: string;           // Title
  subtitle: string;        // One-line description
  category: string;        // Category name
  categorySlug: string;    // Category slug
  difficulty: "新手友好" | "进阶" | "高级";
  rating: number;          // Rating (0-5)
  usageCount: number;      // Usage count
  promptOnline: string;    // Online prompt
  promptLocal: string;     // Local prompt
  variables: SkillVariable[];           // Variable list
  beforeAfter: BeforeAfterExample;      // Effect comparison
  recommendedModels: RecommendedModel[];// Recommended models
  // ... see src/lib/types.ts for all fields
}
```

### Adding New Skills

Edit `src/lib/mock-data.ts` and add a new Skill object to the `skills` array.

---

## TODO

- [ ] Integrate Supabase (Auth + PostgreSQL + pgvector search)
- [ ] Prompt version management
- [ ] Template feedback/rating system
- [ ] Payment system (Freemium + Pro subscription)
- [ ] User template submission review workflow
- [ ] Further mobile polish

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect the GitHub repo to [Vercel](https://vercel.com) for automatic deployment.

---

## License

MIT

---

## Disclaimer

**This project is for learning, teaching, and personal research only. It does not constitute any form of commercial service or professional advice.**

### Project Nature

AI Skills Hub is a frontend learning project demonstrating how to build full-stack applications with Next.js, Tailwind CSS, shadcn/ui and other modern web technologies. All data in the project is mock data and does not represent real users, real reviews, or real business.

### AI Output Disclaimer

- The prompt templates provided are examples only and do not guarantee accuracy, safety, or suitability of AI model outputs
- AI-generated content may contain errors, bias, or inappropriate information — users should judge independently
- Users bear full responsibility for any consequences from using prompt templates

### Trademark Notice

ChatGPT (OpenAI), Claude (Anthropic), Grok (xAI), DeepSeek, Qwen (Alibaba), Llama (Meta) are registered trademarks of their respective companies. This project has no affiliation, authorization, sponsorship, or partnership with any of them.

### Third-Party Services

This project may involve third-party API or service calls. Users should comply with the relevant terms of service. This project is not responsible for the behavior or availability of any third-party services.

### Content Compliance

- All text content (including prompt templates, example outputs, user reviews) is fictional
- This project does not encourage using AI-generated content directly in legal, medical, financial, or other professional scenarios
- Users should ensure their use of this project complies with local laws and regulations

---

> If this project helps you, a Star ⭐ is appreciated. Nothing more, nothing less — no warranties expressed or implied.

### Acknowledgments

This project was built with the assistance of **MiMo V2.5-pro** model via **Claude Code**.

Special thanks to the **Xiaomi MiMo Orbit — Million Token Creator Incentive Program** for supporting this project. MiMo's strong reasoning capabilities and code generation efficiency provided the core momentum for rapid development.

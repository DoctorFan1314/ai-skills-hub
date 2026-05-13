# Contributing

Thank you for your interest in OortAPI! We welcome all forms of contributions.

---

## How to Contribute

### Configure AI Provider Channels (Most Welcome!)

The platform needs upstream AI provider channels to function. Adding and testing channels is the most valuable contribution:

1. Fork this repo and add a new channel configuration
2. Or submit channel info via GitHub Issues with provider name, base URL, and supported models

#### Channel Requirements

Each channel should include:

- **Provider Type**: openai, anthropic, google, deepseek, alibaba, etc.
- **Base URL**: API endpoint URL
- **Supported Models**: List of available models
- **API Key**: Will be encrypted with AES-256-GCM on storage

#### Quality Standards

- Channel must pass connection test (`GET /v1/models` or equivalent)
- Model list should be accurate and up-to-date
- Response latency should be reasonable (< 10s for standard requests)

### Submit Model Rate Updates

Help keep pricing accurate:

1. Check model provider official pricing pages
2. Submit updated rates via PR to `src/lib/schema.sql` (seed data section)
3. Include: model_name, input_rate, output_rate, cache_rate, cache_creation_rate (per 1K tokens)

### Report Bugs

Submit bug reports in [Issues](../../issues), including:

- Problem description and expected behavior
- Steps to reproduce
- API endpoint and request/response (redact API keys)
- Browser and operating system information

### Feature Requests

Submit feature requests in [Issues](../../issues), describing:

- What feature you'd like to see
- Why you need this feature
- Your envisioned use case

### Code Contributions

1. Fork this repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a Pull Request

---

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/oortapi.git
cd oortapi

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── v1/              # OpenAI-compatible API endpoints
│   │   │   ├── chat/        # Chat completions (streaming)
│   │   │   ├── messages/    # Anthropic Messages API
│   │   │   ├── models/      # Model listing
│   │   │   └── billing/     # Balance, usage, redeem
│   │   ├── auth/            # Login, register, profile
│   │   ├── dashboard/       # Admin & user dashboard APIs
│   │   ├── subscribe/       # Subscription API
│   │   └── plans/           # Plans listing API
│   ├── dashboard/           # Dashboard pages
│   ├── token-plan/          # Token Plan subscription page
│   ├── models/              # Model marketplace
│   └── profile/             # User profile
├── components/
│   ├── dashboard/           # Dashboard UI components
│   ├── shared/              # Shared components (SubscriptionCard, etc.)
│   ├── layout/              # Navbar, Footer
│   └── ui/                  # shadcn/ui base components
├── lib/
│   ├── db.ts                # SQLite connection (better-sqlite3)
│   ├── schema.sql           # Database schema (14 tables)
│   ├── auth.ts              # JWT + PBKDF2 + AES-256-GCM
│   ├── api-gateway.ts       # Unified API gateway
│   ├── billing-engine.ts    # Per-token billing engine
│   ├── channel-manager.ts   # Smart channel routing
│   └── i18n/                # Internationalization (zh/en)
└── contexts/
    ├── auth-context.tsx     # JWT-based auth
    └── currency-context.tsx # USD/CNY currency switching
```

---

## Key Architecture Decisions

- **SQLite** with `better-sqlite3` — no ORM, direct SQL queries
- **JWT + httpOnly cookies** for authentication (not localStorage)
- **AES-256-GCM** for channel API key encryption at rest
- **OpenAI-compatible format** — all endpoints follow OpenAI API spec
- **Smart routing** — weighted random selection with automatic failover
- **3-tier cache pricing** — separate rates for input, cache read, cache write, output
- **Prorated subscriptions** — upgrades/downgrades use remaining-period ratio

---

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting (no logic change)
- `refactor:` Refactoring
- `perf:` Performance improvement
- `test:` Testing related
- `chore:` Build/toolchain related

Examples:
```
feat: add DeepSeek channel support with model sync
fix: fix tool_calls not forwarded to upstream providers
docs: update CHANGELOG with v3.3.1 subscription system
```

---

## Code of Conduct

- Respect every contributor
- Use friendly and inclusive language
- Accept constructive criticism
- Focus on what is best for the community

---

## Contact

- GitHub Issues: Submit bugs or suggestions

---

## License

This project uses the [Apache License 2.0](./LICENSE). By submitting a contribution, you agree that your code will be open-sourced under the Apache 2.0 license.

# Contributing

Thank you for your interest in OortAPI! We welcome all forms of contributions.

---

## How to Contribute

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
feat: add subscription downgrade protection
fix: fix tool_calls not forwarded to upstream providers
docs: update CHANGELOG with v3.3.1
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

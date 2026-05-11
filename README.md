# OortAPI — Unified AI API Relay Platform

> **[中文文档](README_CN.md)**

> One API key to access OpenAI, Anthropic, Google, Meta, DeepSeek, and more. OpenAI-compatible format, smart routing, per-token billing.

---

## Quick Start

### 1. Requirements

| Dependency | Minimum Version |
|------------|-----------------|
| Node.js | >= 18.0 |
| npm | >= 9.0 |

### 2. Install & Run

```bash
# Clone the repo
git clone https://github.com/yourname/oortapi.git
cd oortapi

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Production Build

```bash
npm run build
npm start
```

---

## API Usage

All endpoints are OpenAI-compatible. Replace `https://api.openai.com` with your OortAPI base URL and use your OortAPI key.

### Chat Completions (Streaming)

```bash
curl https://your-domain.com/api/v1/chat/completions \
  -H "Authorization: Bearer sk-oort-your-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```

### Using with OpenAI SDK (Python)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-oort-your-key",
    base_url="https://your-domain.com/api/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### Using with OpenAI SDK (Node.js)

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk-oort-your-key",
  baseURL: "https://your-domain.com/api/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(response.choices[0].message.content);
```

### List Models

```bash
curl https://your-domain.com/api/v1/models \
  -H "Authorization: Bearer sk-oort-your-key"
```

### Check Balance

```bash
curl https://your-domain.com/api/v1/billing/balance \
  -H "Authorization: Bearer sk-oort-your-key"
```

---

## Supported Models

| Provider | Models |
|----------|--------|
| OpenAI | gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo |
| Anthropic | claude-3.5-sonnet, claude-3-opus, claude-3-haiku |
| Google | gemini-pro, gemini-pro-vision |
| Meta | llama-3.1-70b, llama-3.1-8b |
| DeepSeek | deepseek-chat, deepseek-coder |

> Model availability depends on configured channels. Admin can add/remove models via the dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + httpOnly cookies |
| Styling | Tailwind CSS v4 |
| UI Library | shadcn/ui (Base UI) |
| Charts | Recharts |
| Password Hashing | PBKDF2 |
| Deployment | Vercel / Docker / VPS |

---

## Project Structure

```
oortapi/
├── src/
│   ├── app/
│   │   ├── api/                        # Backend API routes
│   │   │   ├── v1/
│   │   │   │   ├── chat/completions/   # Chat completions (streaming)
│   │   │   │   ├── completions/        # Text completions
│   │   │   │   ├── images/generations/ # Image generation
│   │   │   │   ├── embeddings/         # Text embeddings
│   │   │   │   ├── models/             # Model listing
│   │   │   │   └── billing/            # Balance & usage
│   │   │   ├── auth/                   # Login, register, profile
│   │   │   └── dashboard/              # Stats, keys, channels CRUD
│   │   ├── dashboard/                  # User dashboard pages
│   │   │   ├── page.tsx                # Overview (stats + charts)
│   │   │   ├── keys/page.tsx           # API key management
│   │   │   ├── usage/page.tsx          # Usage analytics
│   │   │   ├── billing/page.tsx        # Billing & balance
│   │   │   ├── channels/page.tsx       # Channel management (admin)
│   │   │   └── settings/page.tsx       # Account settings
│   │   ├── resources/                  # Skills, prompts, categories
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── db.ts                       # SQLite connection (lazy singleton)
│   │   ├── schema.sql                  # Database schema
│   │   ├── auth.ts                     # JWT + password hashing
│   │   ├── api-gateway.ts              # Unified gateway logic
│   │   ├── channel-manager.ts          # Smart channel routing
│   │   ├── billing-engine.ts           # Per-token billing
│   │   └── rate-limiter.ts             # Rate limiting
│   ├── components/
│   │   ├── dashboard/                  # Dashboard UI components
│   │   ├── home/                       # Homepage components
│   │   └── ...
│   └── contexts/
│       ├── auth-context.tsx            # JWT-based auth
│       └── ...
├── data/                               # SQLite database (gitignored)
├── package.json
└── ...
```

---

## Dashboard

After registering, users get access to a full dashboard:

- **Overview** — Today's calls, success rate, cost, latency, 7-day chart
- **API Keys** — Create/manage keys with per-key rate limits
- **Usage** — Detailed call history with pagination
- **Billing** — Balance display and transaction history
- **Channels** — Admin: configure AI provider channels with smart routing

---

## Channel Management (Admin)

Admins can configure upstream AI provider channels:

- **Multi-provider support** — Add OpenAI, Anthropic, Google, etc. as channels
- **Weighted routing** — Set channel weights for load balancing
- **Automatic failover** — Channels with 3 consecutive failures are temporarily disabled
- **Model mapping** — Map requested model names to actual provider model names
- **Priority system** — Higher priority channels are preferred

---

## Environment Variables

```bash
# Optional
DATABASE_PATH=./data/oortapi.db    # SQLite database path
JWT_SECRET=your-secret-key          # JWT signing secret (auto-generated if not set)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Deployment

### Vercel

> Note: SQLite requires a persistent filesystem. For Vercel, use a VPS or Docker deployment instead.

### Docker

```bash
docker build -t oortapi .
docker run -p 3000:3000 -v ./data:/app/data oortapi
```

### VPS

```bash
npm run build
npm start
```

Use a process manager like PM2 for production:

```bash
pm2 start npm --name oortapi -- start
```

---

## Resource Center

The original AI Skills Hub features are preserved under `/resources/`:

- Agent Skills marketplace
- Prompt Templates
- Categories, Trending, Tags
- Beginner Guide

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).

---

## Disclaimer

**OortAPI is a learning and educational project for studying modern full-stack web development. It is not a production service and should not be relied upon for any commercial or mission-critical use.**

This software is provided "AS IS", WITHOUT WARRANTY OF ANY KIND. See [Apache License 2.0](LICENSE) for full details.

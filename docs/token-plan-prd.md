# Token Plan (API 订阅套餐) — PRD 产品需求文档

> OortAPI — Unified AI API Gateway  
> 版本: v4.0  
> 日期: 2026-05-13

---

## 一、命名体系：「星际能量」主题

以 Oort（奥尔特星云）为灵感，构建以宇宙能量递增的 4 档套餐体系：

| 梯度 | 套餐名 | 能量隐喻 | 定位 |
|------|--------|----------|------|
| A | **Spark** | 火花 | 尝鲜体验 |
| B | **Flare** | 耀斑 | 个人开发者 |
| C | **Pulse** | 脉冲星 | 全职工程师 |
| D | **Nova** | 超新星 | 重度团队 |

**计量单位**: Credits（能量单位，1 Credit = $0.001 等值）

---

## 二、全局导航栏结构

### 导航项顺序

| 位置 | 导航项 | 链接 | 说明 |
|------|--------|------|------|
| 1 | 首页 | `/` | 品牌 Logo |
| 2 | 控制台 | `/dashboard` | 登录后可见 |
| 3 | **Token Plan** | `/token-plan` | **当前激活** |
| 4 | 模型市场 | `/models` | |
| 5 | 文档 | `/docs` | |
| 6 | 资源中心 | `/resources` | |

### 激活状态设计

- **Token Plan 菜单项**：带有渐变底边框（`bg-gradient-to-r from-amber-500 to-orange-500`），文字使用 `text-foreground`（非 muted）
- **当前页面激活指示器**：卡片上方 3px 渐变高亮条
- **移动端**：底部 Tab 栏第 3 位，图标使用 `Sparkles`

---

## 三、Token Plan 页面排版与文案设计

### 3.1 顶部 Hero 区

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              ⚡ Power Your AI Journey                    │
│                                                         │
│     选择适合你的能量方案，释放 AI 的无限可能              │
│                                                         │
│     ┌──────────┐  ┌──────────┐                          │
│     │ 连续包月  │  │ 连续包年  │  ← Tab 切换             │
│     └──────────┘  └──────────┘                          │
│     包年立享 85 折 💰                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 套餐卡片设计

#### Tab: 连续包月（默认）

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ ┌─────────────┐   │
│  │   ✦ Spark   │ │   ✦ Flare   │ │   ✦ Pulse       │ │   ✦ Nova    │   │
│  │   火花       │ │   耀斑       │ │   脉冲星         │ │   超新星    │   │
│  │             │ │             │ │                 │ │             │   │
│  │  $9/月      │ │  $29/月     │ │  $79/月         │ │  $199/月    │   │
│  │             │ │             │ │ ⭐ Most Popular │ │             │   │
│  │  9,000      │ │  30,000     │ │  85,000         │ │  220,000    │   │
│  │  Credits    │ │  Credits    │ │  Credits        │ │  Credits    │   │
│  │             │ │             │ │                 │ │             │   │
│  │ ────────── │ │ ────────── │ │ ────────────── │ │ ────────── │   │
│  │ • 基础模型  │ │ • 高级模型  │ │ • 全部模型       │ │ • 全部模型  │   │
│  │ • 10 并发   │ │ • 30 并发   │ │ • 100 并发      │ │ • 500 并发  │   │
│  │ • 标准路由  │ │ • 优先路由  │ │ • 极速路由      │ │ • 专属路由  │   │
│  │ • 基础支持  │ │ • 邮件支持  │ │ • 优先支持      │ │ • 专属客服  │   │
│  │             │ │             │ │                 │ │             │   │
│  │  [开始试用] │ │  [立即订阅] │ │  [立即订阅]     │ │  [联系销售] │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘ └─────────────┘   │
│                                                                         │
│  💡 首购特惠：首个订阅周期享 7 折优惠                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Tab: 连续包年

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ ┌─────────────┐   │
│  │   ✦ Spark   │ │   ✦ Flare   │ │   ✦ Pulse       │ │   ✦ Nova    │   │
│  │   火花       │ │   耀斑       │ │   脉冲星         │ │   超新星    │   │
│  │             │ │             │ │                 │ │             │   │
│  │  $92/年     │ │  $296/年    │  │  $806/年        │ │  $2,030/年  │   │
│  │  ~~$108~~   │ │  ~~$348~~   │ │  ~~$948~~       │ │  ~~$2,388~~ │   │
│  │  省 $16     │ │  省 $52     │ │  省 $142        │ │  省 $358    │   │
│  │             │ │             │ │ ⭐ Most Popular │ │             │   │
│  │  9,000/月   │ │  30,000/月  │ │  85,000/月      │ │  220,000/月 │   │
│  │             │ │             │ │                 │ │             │   │
│  │  [开始试用] │ │  [立即订阅] │ │  [立即订阅]     │ │  [联系销售] │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘ └─────────────┘   │
│                                                                         │
│  🎉 年度超值：立享 85 折，平均每月仅需原价的 85%                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 详细权益对照表

| 权益项 | Spark 火花 | Flare 耀斑 | Pulse 脉冲星 | Nova 超新星 |
|--------|-----------|-----------|-------------|------------|
| 月价格 | $9 | $29 | $79 | $199 |
| 年价格（85折） | $92/年 | $296/年 | $806/年 | $2,030/年 |
| 月 Credits | 9,000 | 30,000 | 85,000 | 220,000 |
| 首购优惠 | 7折 | 7折 | 7折 | 7折 |
| 基础模型 (GPT-4o-mini, DeepSeek Chat) | ✅ | ✅ | ✅ | ✅ |
| 高级模型 (GPT-4o, Claude 3.5 Sonnet) | ❌ | ✅ | ✅ | ✅ |
| 旗舰模型 (GPT-4 Turbo, Claude 3 Opus) | ❌ | ❌ | ✅ | ✅ |
| 专有模型 (Nova 专属定制) | ❌ | ❌ | ❌ | ✅ |
| 最大并发 | 10 | 30 | 100 | 500 |
| 路由优先级 | 标准 | 优先 | 极速 | 专属 |
| 超出费率 | 标准价 ×1.0 | 标准价 ×0.95 | 标准价 ×0.85 | 标准价 ×0.75 |
| 技术支持 | 社区 | 邮件 | 优先邮件 | 专属客服 |
| 非高峰折扣 | ❌ | ❌ | ❌ | ✅ 额外 8 折 |

### 3.4 视觉设计规范

- **Pulse 脉冲星**（推荐）：卡片顶部渐变条 `from-amber-500 to-orange-500`，右上角 `⭐ Most Popular` 标签
- **Nova 超新星**：卡片边框使用 `border-purple-500/50`，右上角 `👑 Enterprise` 标签
- **Spark 火花**：最简卡片，无额外装饰
- **Flare 耀斑**：标准卡片，微光效果

---

## 四、模型与生态展示区

### 4.1 平台模型展示

```
┌───────────────────────────────────────────────────────────────────────┐
│  🧠 支持的 AI 模型                                                    │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ 🌊 DeepSeek  │  │ 🔮 Gemini    │  │ 🌀 Claude    │  │ ✨ GPT   │  │
│  │   Chat       │  │   2.0 Flash  │  │   3.5 Sonnet │  │   4o     │  │
│  │              │  │              │  │              │  │          │  │
│  │ 基础文本对话  │  │ 多模态视觉   │  │ 代码生成专家  │  │ 旗舰基座  │  │
│  │              │  │              │  │              │  │          │  │
│  │ Spark+ 可用  │  │ Flare+ 可用  │  │ Pulse+ 可用  │  │ Pulse+   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                                       │
│  📌 模型列表由管理员后台控制，可动态增减                                │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

### 4.2 生态集成 Logo 墙

```
┌───────────────────────────────────────────────────────────────────────┐
│  🔌 无缝接入你的开发工具                                               │
│                                                                       │
│   VS Code  ·  Cursor  ·  JetBrains  ·  Continue  ·  Cline  ·  ...   │
│                                                                       │
│   [Logo]      [Logo]     [Logo]       [Logo]     [Logo]               │
│                                                                       │
│   统一 API 端点，一行配置即可接入任何支持 OpenAI 格式的工具             │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 五、核心扣费与计费逻辑

### 5.1 扣费优先级

```
用户 API 调用
     │
     ▼
┌─────────────────┐
│ 1. 套餐 Credits  │  ← 优先消耗当前周期内剩余 Credits
│    是否充足？     │
└────────┬────────┘
         │
    ┌────┴────┐
    │ 是      │ 否
    ▼         ▼
  直接扣减   ┌─────────────────┐
  Credits   │ 2. 账户余额      │  ← 自动切换为按量扣费
             │    是否充足？     │
             └────────┬────────┘
                      │
                 ┌────┴────┐
                 │ 是      │ 否
                 ▼         ▼
             按量扣减    ┌─────────────────┐
             账户余额    │ 3. 阻断请求      │  ← 返回 402 错误
                         │    发送提醒通知   │
                         └─────────────────┘
```

### 5.2 计费规则明细

| 规则 | 说明 |
|------|------|
| **Credits 扣减** | 1 Credit = 按模型费率计算的等值 token 消耗 |
| **超出费率** | 套餐 Credits 耗尽后，按量扣费享受套餐折扣系数（Spark×1.0 / Flare×0.95 / Pulse×0.85 / Nova×0.75） |
| **首次订阅折扣** | 首个订阅周期享 7 折（月付或年付均适用） |
| **非高峰折扣**（仅 Nova） | 北京时间 00:00-08:00 调用享受额外 8 折 |

### 5.3 边缘场景处理

| 场景 | 处理方式 |
|------|---------|
| Credits 耗尽 + 余额不足 | HTTP 402 响应 + 站内通知 + 邮件提醒 |
| Credits 耗尽 + 余额充足 | 自动从余额按量扣费（享受套餐折扣系数） |
| 套餐到期未续费 | Credits 冻结 7 天 → 7 天后清零 → 切换为按量计费 |
| 续费失败 | 连续 3 次扣款失败 → 暂停套餐 → 降级为按量计费 |
| 退款 | 未使用 Credits 按比例退款，已消耗部分不退 |

### 5.4 周期规则

| 类型 | 周期 | 重置时间 | 续费方式 |
|------|------|---------|---------|
| 月付 | 30 天 | 每月订阅日 00:00 UTC | 自动扣款 |
| 年付 | 365 天 | 每年订阅日 00:00 UTC | 自动扣款 |

---

## 六、管理员控制台配置

### 6.1 数据库设计

```sql
-- 订阅套餐表
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,               -- 'spark', 'flare', 'pulse', 'nova'
  display_name TEXT NOT NULL,       -- 'Spark 火花'
  tagline TEXT,                     -- '点燃你的 AI 之旅'
  tier INTEGER NOT NULL,            -- 1, 2, 3, 4 (排序用)
  monthly_price REAL NOT NULL,      -- 月付价格 (USD)
  yearly_price REAL NOT NULL,       -- 年付价格 (USD)
  monthly_credits INTEGER NOT NULL, -- 每月 Credits 额度
  first_purchase_discount REAL DEFAULT 0.3, -- 首购折扣 (0.3 = 7折)
  overage_rate_multiplier REAL DEFAULT 1.0, -- 超出费率系数
  max_concurrency INTEGER DEFAULT 10,       -- 最大并发
  route_priority TEXT DEFAULT 'standard',   -- standard/priority/ultra/exclusive
  off_peak_discount REAL DEFAULT 0,         -- 非高峰折扣 (0.2 = 8折, 仅Nova)
  support_level TEXT DEFAULT 'community',   -- community/email/priority/dedicated
  enabled INTEGER DEFAULT 1,
  popular INTEGER DEFAULT 0,        -- 是否显示 "Most Popular" 标签
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 套餐-模型绑定表
CREATE TABLE IF NOT EXISTS plan_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL,
  model_name TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
  UNIQUE(plan_id, model_name)
);

-- 用户订阅表
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  billing_cycle TEXT NOT NULL CHECK(billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled', 'paused')),
  credits_remaining INTEGER NOT NULL,
  credits_total INTEGER NOT NULL,
  current_period_start DATETIME NOT NULL,
  current_period_end DATETIME NOT NULL,
  is_first_purchase INTEGER DEFAULT 1,
  auto_renew INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- 订阅扣费日志
CREATE TABLE IF NOT EXISTS subscription_usage_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  model TEXT NOT NULL,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  source TEXT NOT NULL CHECK(source IN ('credits', 'balance')), -- 扣费来源
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 6.2 管理员 API

```
GET    /api/admin/plans              — 获取所有套餐列表
POST   /api/admin/plans              — 创建新套餐
PATCH  /api/admin/plans/:id          — 编辑套餐
DELETE /api/admin/plans/:id          — 删除套餐
GET    /api/admin/plans/:id/models   — 获取套餐绑定的模型
POST   /api/admin/plans/:id/models   — 绑定模型到套餐
DELETE /api/admin/plans/:id/models/:model — 解绑模型
```

### 6.3 管理员配置界面字段

| 字段 | 类型 | 说明 |
|------|------|------|
| 套餐名称 | text | 内部标识（如 `spark`） |
| 显示名称 | text | 前端展示（如 `Spark 火花`） |
| 宣传标语 | text | 如 "点燃你的 AI 之旅" |
| 梯度等级 | number | 1-4 |
| 月付价格 | number | USD |
| 年付价格 | number | USD |
| 月 Credits | number | 每月额度 |
| 首购折扣 | number | 0.0-1.0（0.3 = 7折） |
| 超出费率系数 | number | 如 0.85 = 85折 |
| 最大并发 | number | |
| 路由优先级 | select | standard/priority/ultra/exclusive |
| 非高峰折扣 | number | 0.0-1.0 |
| 技术支持等级 | select | community/email/priority/dedicated |
| 是否推荐 | boolean | 显示 "Most Popular" |
| 是否启用 | boolean | 上下架 |

---

## 七、页面底部组件

### 7.1 快速开始指南

```
┌───────────────────────────────────────────────────────────────────────┐
│  🚀 3 步开始使用                                                      │
│                                                                       │
│  ① 下载工具     ② 配置 API Key      ③ 开始调用                       │
│  ┌─────────┐    ┌─────────────┐     ┌─────────────┐                  │
│  │ VS Code │    │ sk-oort-xxx │     │ "Hello!"   │                  │
│  │ Cursor  │ →  │ 填入配置     │  →  │ 一键发送    │                  │
│  │ CLI     │    │             │     │             │                  │
│  └─────────┘    └─────────────┘     └─────────────┘                  │
│                                                                       │
│  [查看完整文档 →]                                                      │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

### 7.2 FAQ

| 问题 | 回答 |
|------|------|
| **Q: Credits 耗尽后还能继续调用吗？** | A: 可以。系统会自动从账户余额按量扣费，且享受您当前套餐的折扣系数。如余额也不足，系统将返回 402 错误并发送通知提醒充值。 |
| **Q: 年付中途可以升级套餐吗？** | A: 可以。升级时按剩余天数折算差价，立即生效。降级将在当前周期结束后生效。 |
| **Q: 首购优惠如何使用？** | A: 首次订阅任意套餐自动享受 7 折优惠，无需输入优惠码。优惠仅限首个订阅周期（月付为第一个月，年付为第一年）。 |

---

## 八、前端实现文件清单

| 文件 | 说明 |
|------|------|
| `src/app/token-plan/page.tsx` | Token Plan 主页面 |
| `src/app/api/plans/route.ts` | 公开 API：获取启用的套餐列表 |
| `src/app/api/admin/plans/route.ts` | 管理员 API：CRUD 套餐 |
| `src/app/api/admin/plans/[id]/models/route.ts` | 管理员 API：套餐模型绑定 |
| `src/app/api/subscribe/route.ts` | 用户订阅 API |
| `src/lib/schema.sql` | 新增 4 张表 |
| `src/lib/db.ts` | 新增迁移 |
| `src/lib/billing-engine.ts` | 新增 Credits 扣费逻辑 |
| `src/components/layout/navbar.tsx` | 导航添加 Token Plan |
| `src/app/dashboard/token-plan/page.tsx` | 用户订阅管理页 |
| `src/app/dashboard/admin/plans/page.tsx` | 管理员套餐配置页 |

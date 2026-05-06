# 更新日志

> **[English](CHANGELOG.md)**

本项目的所有重要变更记录。

---

## [v1.5.2] — 2026-05-06

### 新增
- **评论回复** — 技能详情页每条评论下方新增「回复」按钮；点击后设置 `replyTo` 状态，输入框预填 `@用户名`，显示「正在回复」视觉指示器，支持取消回复
- **标签云搜索** — `/tags` 页面顶部新增实时搜索输入框，按名称过滤标签；新增标签计数显示
- **Newsletter 取消订阅** — 页脚订阅成功后显示「管理偏好」链接；点击后展示「取消订阅」/「取消」选项；取消订阅状态通过 localStorage 持久化
- **面包屑导航** — 可复用 `Breadcrumb` 组件；技能详情、分类详情、标签详情页替换返回链接
- **移动端原生分享** — Prompt 详情页分享按钮在移动端使用 `navigator.share()`，桌面端回退到剪贴板复制
- **命令面板改进** — 关闭时恢复焦点，新增淡入/下滑动画
- **页面过渡动画** — 通过 `src/app/template.tsx` 实现路由切换时 200ms 透明度渐变
- **OG 图片 + 规范链接** — 根布局及所有详情页（技能、Prompt、分类）新增 `openGraph`、`twitter`、`alternates.canonical`
- **加载骨架屏** — 技能列表、技能详情、分类详情、排行榜、标签云、个人中心页面新增加载状态

### 变更
- **粒子背景优化** — 缓存 `getComputedStyle`，通过 `MutationObserver` 在主题变化时失效；移动端粒子数减半（15 vs 30）；不再每帧读取 CSS 变量
- **用户头像** — `<img>` 替换为 `next/image` 的 `Image` 组件，优化加载

### 修改文件
- `src/app/skills/[id]/client.tsx` — 新增回复功能
- `src/app/tags/client.tsx` — 新增搜索输入框和标签计数
- `src/components/shared/newsletter-form.tsx` — 新增管理偏好/取消订阅流程
- `src/components/shared/particle-bg.tsx` — 缓存 CSS 变量读取、移动端粒子减半、MutationObserver 清理
- `src/components/profile/profile-header.tsx` — `<img>` → `<Image>` from next/image
- `src/app/layout.tsx` — 新增 `metadataBase`、`openGraph`、`twitter`、`alternates`
- `src/app/skills/[id]/page.tsx` — 新增 OG、twitter、canonical
- `src/app/prompts/[id]/page.tsx` — 新增 OG、twitter、canonical
- `src/app/categories/[slug]/page.tsx` — 新增 OG、twitter、canonical
- `src/lib/i18n/types.ts` — `comments` 新增 `reply`、`cancelReply`、`replyingTo`；`tags` 新增 `searchPlaceholder`、`tagCount`；`footer` 新增 `unsubscribe`、`unsubscribeDesc`、`managePreferences`
- `src/lib/i18n/zh.ts` — 新键的中文翻译
- `src/lib/i18n/en.ts` — 新键的英文翻译
- `README.md` / `README_CN.md` — 更新功能清单

### 新文件
- `src/app/template.tsx` — 页面过渡动画包装组件（CSS 渐变）
- `src/components/shared/breadcrumb.tsx` — 可复用面包屑导航组件
- `src/app/skills/loading.tsx` — 技能列表骨架屏
- `src/app/skills/[id]/loading.tsx` — 技能详情骨架屏
- `src/app/categories/[slug]/loading.tsx` — 分类详情骨架屏
- `src/app/trending/loading.tsx` — 排行榜骨架屏
- `src/app/tags/loading.tsx` — 标签云骨架屏
- `src/app/profile/loading.tsx` — 个人中心骨架屏

---

## [v1.5.1] — 2026-05-06

### 新增
- **回到顶部按钮** — 滚动超过 400px 后显示浮动按钮，点击平滑滚动回顶部
- **上下文感知导航栏搜索** — 在技能页面搜索时自动路由到 `/skills?q=...`，其他页面路由到 `/prompts?q=...`（基于 `usePathname()`）

### 修改文件
- `src/app/layout.tsx` — 导入并渲染 `<ScrollToTop />`
- `src/components/layout/navbar.tsx` — 新增 `usePathname()`，搜索根据当前路径路由

### 新文件
- `src/components/shared/scroll-to-top.tsx` — 回到顶部浮动按钮组件

---

## [v1.5.0] — 2026-05-06

### 新增
- **Agent 技能页「新建 Skill」按钮** — hover 弹出下拉菜单，包含两种创建方式：
  - **快速创建（Github 导入）**：3 步向导 — 输入 Github 仓库地址 → 模拟解析 Skills → 选择并确认。保存 `AgentSkill` 到 localStorage
  - **自定义创建（本地上传）**：表单包含英文名称、展示名称、来源地址、所有者、是否公开、描述、Skill 类型、标签、图标选择、文件上传。保存 `AgentSkill` 到 localStorage
- **Prompt 模板页「新建模板」按钮** — hover 弹出下拉菜单，包含两种 Prompt 专用创建方式：
  - **快速创建（Github 导入）**：3 步向导解析 Github 仓库为 `Skill` 模板。保存到 `publishedPrompts` localStorage
  - **自定义创建（手动填写）**：表单包含 Prompt 专用字段（标题、副标题、描述、分类、难度、在线/本地 Prompt、版本、标签）。保存 `Skill` 到 `publishedPrompts` localStorage
- `storage-keys.ts` 新增 `publishedPrompts` 存储键
- `mock-data.ts` 新增 `getPublishedPrompts()` 辅助函数
- i18n 新增 Prompt 创建专用键（templateTitle、templateSubtitle、templateCategory、templateDifficulty、promptOnline、promptLocal 等）
- 可复用的 `CreateDropdown` 组件，两个页面共用

### 变更
- **删除 `/publish` 独立页面** — 改为页面内创建按钮
- **导航栏回到 3 项** — 去掉「发布技能」
- **Footer** — 去掉「发布技能」链接
- **Sitemap** — 去掉 `/publish` 路由
- **键盘快捷键** — 去掉「发布技能」命令
- **技能详情页介绍 Tab 布局** — 从 `[280px_1fr]` 改为 `[1fr_280px]`：左侧 80% README，右侧 20% 来源/安装侧边栏
- **i18n** — `publish` section 替换为 `create` section，新增 Prompt 创建专用键
- **README.md 和 README_CN.md** — 更新项目结构、页面说明和功能清单

### 修改文件
- `src/app/skills/client.tsx` — 新头部布局含创建按钮，渲染模态框
- `src/app/prompts/client.tsx` — 新头部含创建按钮，合并已发布模板
- `src/app/skills/[id]/client.tsx` — 介绍 Tab 布局翻转（左 README，右侧边栏）
- `src/components/layout/navbar.tsx` — 去掉第 4 个导航链接
- `src/components/layout/footer.tsx` — 去掉「发布技能」链接
- `src/app/sitemap.ts` — 去掉 `/publish`
- `src/hooks/use-keyboard-shortcuts.ts` — 去掉「发布技能」命令
- `src/lib/i18n/types.ts` — `publish` → `create`，新增 Prompt 创建键
- `src/lib/i18n/zh.ts` — 更新翻译
- `src/lib/i18n/en.ts` — 更新翻译
- `src/lib/storage-keys.ts` — 新增 `publishedPrompts`
- `src/lib/mock-data.ts` — 新增 `getPublishedPrompts()`
- `README.md` — 更新结构、页面、功能
- `README_CN.md` — 更新结构、页面、功能

### 新文件
- `src/components/skills/create-dropdown.tsx` — 可复用新建按钮+下拉菜单
- `src/components/skills/create-from-github.tsx` — Github 导入向导（Agent Skill）
- `src/components/skills/create-from-upload.tsx` — 本地上传表单（Agent Skill）
- `src/components/skills/create-from-github-prompt.tsx` — Github 导入向导（Prompt）
- `src/components/skills/create-from-upload-prompt.tsx` — 本地上传表单（Prompt）

### 移除
- `src/app/publish/page.tsx` — 独立发布页面
- `src/app/publish/client.tsx` — 发布表单组件

---

## [v1.4.0] — 2026-05-05

### 新增
- **发布技能页面** (`/publish`) — 完整的 Agent 技能发布表单，包含：名称、标题、描述、分类、开发者、安装命令、版本、许可证、README 编辑器（Markdown）、动态文件列表（添加/删除/折叠）、演示输入/输出、标签
- 已发布技能保存到 localStorage，可在技能详情页和技能列表页查看
- `mock-agent-skills.ts` 新增 `getPublishedSkills()` 和 `getAllAgentSkills()` 辅助函数
- `storage-keys.ts` 新增 `publishedSkills` 存储键
- **Footer 重新分组** — 4 个区块：Agent 技能（含 /publish 链接）、Prompt 模板（含分类/排行榜/标签云）、资源、社区
- **导航栏** — 新增「发布技能」作为第 4 个导航链接
- sitemap 和键盘命令面板新增 `/publish` 路由
- i18n 新增 `publish` section，支持中英文完整翻译

### 变更
- **README.md 和 README_CN.md** — 重写，反映双内容架构（Agent 技能市场 + Prompt 模板平台）
- Footer 网格从 4 列调整为 5 列
- `getAgentSkillById` 现在同时搜索 mock 数据和 localStorage 中用户发布的技能
- 技能列表页通过 `getPublishedSkills()` 包含用户发布的技能

### 修改文件
- `README.md` — 双内容架构全面重写
- `README_CN.md` — 双内容架构全面重写
- `src/components/layout/navbar.tsx` — 新增「发布技能」导航链接
- `src/components/layout/footer.tsx` — 重新分组链接，5 列网格
- `src/lib/i18n/types.ts` — Dictionary 新增 `publish` section
- `src/lib/i18n/zh.ts` — 新增 `publish` 中文翻译
- `src/lib/i18n/en.ts` — 新增 `publish` 英文翻译
- `src/lib/mock-agent-skills.ts` — 新增 `getPublishedSkills()`、`getAllAgentSkills()`，更新 `getAgentSkillById`
- `src/lib/storage-keys.ts` — 新增 `publishedSkills` 键
- `src/app/skills/client.tsx` — 列表包含已发布技能
- `src/app/sitemap.ts` — 新增 `/publish` 路由
- `src/hooks/use-keyboard-shortcuts.ts` — 新增「发布技能」命令

### 新文件
- `src/app/publish/page.tsx` — 服务端组件，含 metadata
- `src/app/publish/client.tsx` — 发布技能表单组件

---

## [v1.3.0] — 2026-05-05

### 新增
- **3 个新分类** — 数据分析（📊）、效率工具（⚡）、创意写作（✍️），从 3 个扩展到 6 个分类
- **18 个新技能模板** — 共 28 个技能，覆盖 SQL 优化、数据清洗、图表推荐、数据洞察、会议纪要、任务分解、邮件批量生成、工作流自动化、日程规划、故事大纲、角色塑造、世界观搭建、对白优化、SEO 博客优化、社交媒体策略、React 组件生成、事故响应、SWOT 分析
- **4 条新评价** — 来自数据分析师、网络小说作者、项目经理和在线教育从业者
- **分页加载** — 技能市场每页 12 个，"加载更多"按钮
- **Prompt 工程技巧** — 新手指南新增 Chain-of-Thought、Few-Shot、角色扮演、结构化输出、自我反思等技巧章节
- **获得更好结果的秘诀** — 实用的前后对比示例

### 变更
- **分类卡片** — 从硬编码 3 个改为从数据动态渲染 6 个，响应式网格
- **Hero 标语** — 更新为提及六大核心领域
- **全局 Metadata** — description 更新覆盖六大分类
- **技能详情页点赞/收藏** — 修复为 localStorage 持久化（之前刷新即失）
- **CONTRIBUTING.md** — 翻译为英文

### 修改文件
- `src/lib/theme.ts` — 新增 3 个分类颜色（琥珀、红、粉）
- `src/lib/categories.ts` — 新增 3 个分类定义
- `src/lib/mock-data.ts` — 新增 18 个技能 + 4 条评价（约 1800 行）
- `src/components/home/category-cards.tsx` — 从分类数据动态渲染
- `src/components/home/hero.tsx` — 更新标语
- `src/app/layout.tsx` — 更新 metadata description
- `src/app/skills/client.tsx` — 新增分页
- `src/app/skills/[id]/client.tsx` — 修复点赞/收藏持久化
- `src/app/guide/page.tsx` — 新增 Prompt 工程技巧章节
- `README.md` — 更新为 28 个技能、6 个分类
- `README_CN.md` — 更新为 28 个技能、6 个分类
- `CONTRIBUTING.md` — 翻译为英文

---

## [v1.2.0] — 2026-05-05

### 新增
- **用户认证系统** — 基于 localStorage 的登录/注册/登出，会话持久化
- **Toast 通知系统** — 自动消失通知，含去重逻辑
- **点赞/收藏持久化** — 技能点赞和收藏保存到 localStorage，刷新后保持
- **提交表单验证与持久化** — 必填字段验证、最小长度检查，提交数据保存到 localStorage 并显示历史列表
- **URL 同步筛选** — 技能市场筛选条件（分类、难度、排序、搜索）同步到 URL 查询参数；可分享，支持浏览器前进/后退
- **Navbar 登录态** — 已登录显示用户名+退出，未登录显示登录/注册；移动端 Sheet 菜单同步
- **OAuth "即将推出" 提示** — Google/GitHub 登录按钮点击显示 toast 通知
- **404 处理** — 技能详情 (`/skills/[id]`) 和分类详情 (`/categories/[slug]`) 不存在时调用 `notFound()`

### 修复
- **数据不一致** — 移除 categories 中硬编码的 `skillCount`（15/12/13）；Hero 徽章和 Trust Bar 现在显示动态 `skills.length` 而非 "1284+"
- **死链** — Footer "使用条款"和"隐私政策"链接置灰不可点击；登录页"忘记密码？"链接禁用
- **Toast 去重** — 快速连续点击按钮不再叠加重复的 toast 通知

### 新文件
- `src/hooks/use-local-storage.ts` — 泛型 localStorage Hook，含 SSR 安全加载状态
- `src/contexts/toast-context.tsx` — ToastProvider + useToast Hook
- `src/contexts/auth-context.tsx` — AuthProvider + useAuth Hook
- `src/components/ui/toast.tsx` — Toaster 浮层组件

---

## [v1.1.0] — 2026-05-04

### 新增
- **自定义 404 页面** — 匹配站点深色主题，带"返回首页"按钮
- **Sitemap** (`/sitemap.xml`) — 自动生成，覆盖静态页面、所有技能和分类
- **Robots.txt** (`/robots.txt`) — 搜索引擎爬取规则
- **页面级 Metadata** — `/skills/[id]`、`/categories/[slug]`、`/guide`、`/login`、`/register`、`/submit` 使用 `generateMetadata`
- **JSON-LD 结构化数据** — 技能详情页添加 Article schema + AggregateRating
- **可访问性改进** — 筛选按钮添加 `role="radio"` + `aria-checked`，图标按钮添加 `aria-label`，模型表格添加 `<caption>`
- **剪贴板容错** — 所有 `navigator.clipboard.writeText` 调用包裹 try/catch
- **加载骨架屏** — 技能详情页加载状态
- **错误边界** — 全局 `error.tsx` 含重试按钮

### 变更
- **粒子动画优化** — `visibilitychange` 监听，Tab 不可见时暂停；粒子数从 50 降至 30；连线使用距离平方优化
- **Navbar 搜索** — 绑定 Enter 键跳转搜索，按钮添加 `aria-label`
- **颜色常量** — 集中到 `src/lib/theme.ts`
- **响应式筛选栏** — 移动端优先堆叠布局，`md:` 断点切换
- **Before/After 区域** — 氰色渐变背景增强视觉对比
- **技能卡片标签** — 副标题下方显示最多 3 个标签
- **首页"查看全部"链接** — 技能区块链接到 `/skills`
- **Trust Bar 统计** — 语义化高亮数值
- **分类卡片悬停** — Emoji 图标悬停缩放
- **技能详情表格** — `min-w-[600px]` 防止窄屏下列压缩

### 修复
- **类型安全** — 移除页面参数中的 `as string` 类型断言
- **CSS 重复** — 合并 globals.css 中重复的 `body` 规则
- **死代码** — 删除 mock-data 中未使用的 `searchSkills` 函数

---

## [v1.0.0] — 2026-05-03

### 新增
- 初始发布
- 首页：Hero、Trust Bar、分类卡片、技能区块、用户评价
- 技能市场：搜索、分类/难度筛选、排序
- 技能详情页：一键复制、变量填充、Before/After 对比、使用步骤、推荐模型
- 分类浏览和详情页
- 新手指南页
- 提交模板页
- 登录和注册页面（纯 UI）
- 粒子背景动画
- 响应式设计（移动端优先）
- shadcn/ui 组件库集成
- 10 个 Mock 技能模板，覆盖 3 个分类
- 6 条 Mock 用户评价

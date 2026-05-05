# 更新日志

> **[English](CHANGELOG.md)**

本项目的所有重要变更记录。

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

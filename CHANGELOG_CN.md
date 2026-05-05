# 更新日志

> **[English](CHANGELOG.md)**

本项目的所有重要变更记录。

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

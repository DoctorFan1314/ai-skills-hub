import type { Skill, Testimonial } from "./types";

export const skills: Skill[] = [
  {
    id: "xiaohongshu-notes",
    title: "小红书爆款笔记生成器（去AI味专业版 v2.1）",
    subtitle: "输入主题，几秒生成自然、接地气的高质量小红书笔记，大幅去除AI味。",
    description: "专为小红书平台优化的内容生成工具。通过深度学习小红书爆款笔记的语言风格和结构模式，生成自然流畅、高互动率的笔记内容。",
    category: "语言与内容生产",
    categorySlug: "content",
    difficulty: "新手友好",
    rating: 4.9,
    usageCount: 3248,
    lastUpdated: "2026.04",
    version: "v2.1",
    tags: ["小红书", "内容创作", "去AI味", "爆款"],
    featured: true,
    trending: true,
    beginner: true,
    promptOnline: `你是一位资深小红书内容创作者。请根据以下要求生成一篇高质量的小红书笔记：

【主题】：{{主题}}
【风格偏好】：{{风格}}
【目标人群】：{{目标人群}}

请严格遵循以下规则：

1. 标题要求：使用emoji开头，包含数字或利益点，控制在20字以内
2. 正文要求：个人经历代入 → 核心干货分点列举 → 行动号召，使用口语化表达
3. 去AI味技巧：加入"说实话"、"踩过坑才知道"等个人化表达，使用不完美句式
4. 标签：生成5-8个相关话题标签`,
    promptLocal: `[系统指令]
你是一位小红书资深博主。根据用户提供的主题，生成一篇自然的笔记。

[输入参数]
- 主题：{topic}
- 风格：{style}
- 目标人群：{audience}

[约束]
- 全文口语化，像真人聊天
- 避免AI常见的排比句和过度修饰
- 控制总字数在500-800字`,
    variables: [
      { name: "主题", placeholder: "例如：春季穿搭、护肤心得、旅行攻略", required: true },
      { name: "风格", placeholder: "例如：轻松活泼、专业干货", required: false },
      { name: "目标人群", placeholder: "例如：大学生、职场新人", required: false },
    ],
    beforeAfter: {
      input: "主题：分享我的极简生活心得",
      outputs: [
        {
          model: "Claude Opus 4.7",
          text: `🏠 极简生活3年，我扔掉了80%的东西，却活得更自由了

说实话，3年前的我是个"囤货狂"。衣柜塞满衣服却总觉得没衣服穿，护肤品摆了一桌子过期了大半。

直到有次搬家，看着满屋子的东西我突然就崩溃了...

🌟 我的极简生活实践：

1️⃣ 衣橱断舍离 — 只留下真正穿的、喜欢的，现在衣橱只有30件单品
2️⃣ 护肤做减法 — 从十几瓶精简到3瓶，皮肤反而比以前好了
3️⃣ 数字极简 — 卸载不用的APP，手机屏幕时间减半
4️⃣ 消费降级不降质 — 买贵的但耐用的，不买便宜但凑合的

极简不是苦行，是把时间和精力留给真正重要的事。

#极简生活 #断舍离 #生活方式 #自律 #成长`,
        },
        {
          model: "Qwen 3.6",
          text: `🏠 极简生活两年，我的人生像开了挂

姐妹们！今天必须跟你们聊聊极简生活。

两年前我还是个月光族，工资发下来就各种买买买，月底吃土...后来实在受不了了，决定改变。

🧹 我做了这些事：
✨ 衣服从200+件减到35件
✨ 护肤从15瓶减到4瓶
✨ 退出了10+个群聊
✨ 每月强制存30%

极简不是不花钱，是把钱花在刀刃上。试试看，你会爱上这种轻盈感～

#极简生活 #理性消费 #生活感悟`,
        },
      ],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7 / Sonnet 4.6", strengths: "文字最自然、复杂推理强", useCase: "高质量内容创作", audience: "追求极致内容质量的创作者" },
      { name: "Grok 4.20", strengths: "创意强、指令跟随优秀", useCase: "脚本、标题、突破性想法", audience: "需要创意灵感的用户" },
      { name: "Qwen 3.6 / DeepSeek V4", strengths: "中文理解极佳、速度快", useCase: "小红书、营销、日常写作", audience: "中文内容创作者" },
      { name: "Llama 3.1/4 系列（本地）", strengths: "隐私安全、完全离线", useCase: "高频使用、隐私敏感场景", audience: "注重隐私的用户" },
    ],
    usageStepsOnline: ["点击「复制完整 Prompt」", "打开 ChatGPT / Claude 等平台", "粘贴 Prompt，替换变量", "发送后等待 AI 生成", "微调输出后使用"],
    usageStepsLocal: ["安装 LM Studio 或 Ollama", "下载推荐模型", "复制本地版 Prompt", "粘贴并运行", "调整 Temperature 参数（推荐 0.7）"],
    advancedTips: ["多轮迭代：要求AI「更口语化」或「加入更多个人经历」", "风格迁移：提供你喜欢的博主笔记作为参考", "A/B测试：生成3-5个版本选最佳"],
    likes: 892,
  },
  {
    id: "weekly-report",
    title: "职场周报一键生成器（结构化专业版 v1.5）",
    subtitle: "输入本周工作要点，自动生成结构清晰、重点突出的专业周报。",
    description: "帮助职场人士将零散工作内容整理成结构化周报，突出成果和价值。",
    category: "思考与工作流",
    categorySlug: "thinking",
    difficulty: "新手友好",
    rating: 4.8,
    usageCount: 2156,
    lastUpdated: "2026.04",
    version: "v1.5",
    tags: ["周报", "职场", "汇报", "结构化"],
    featured: true,
    trending: true,
    beginner: true,
    promptOnline: `你是一位职场写作专家。请根据以下信息生成一份专业的周报：

【本周工作内容】：{{工作内容}}
【遇到的问题】：{{遇到的问题}}
【下周计划】：{{下周计划}}

按以下结构输出：
📊 本周工作总结（1-2句话概括）
✅ 重点完成事项（按重要性排序，包含产出和价值）
⚠️ 问题与挑战（问题 + 原因 + 解决方案）
📅 下周工作计划（按优先级，注明时间节点）
🤝 需要的支持

要求：语言专业但不生硬，突出成果和价值，控制在500字以内。`,
    promptLocal: `[系统指令] 你是职场写作专家，帮助用户生成专业周报。
[输入] 本周工作：{work} 问题：{issues} 下周计划：{plan}
[输出] 📊总结 ✅完成事项 ⚠️问题 📅计划 🤝支持`,
    variables: [
      { name: "工作内容", placeholder: "例如：完成用户系统重构、处理15个Bug", required: true },
      { name: "遇到的问题", placeholder: "例如：接口响应慢、需求变更频繁", required: false },
      { name: "下周计划", placeholder: "例如：完成支付模块开发", required: true },
    ],
    beforeAfter: {
      input: "工作内容：完成用户登录模块重构，修复8个Bug\n问题：第三方登录接口文档不清晰\n下周计划：开始购物车模块开发",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `📊 本周工作总结
本周聚焦用户系统优化，完成登录模块重构并修复8个Bug，系统稳定性显著提升。

✅ 重点完成事项
1. 用户登录模块重构 — 完成OAuth 2.0集成，登录成功率从92%提升至99.5%
2. Bug修复（8个） — 修复3个P0级Bug，线上投诉量下降60%

⚠️ 问题与挑战
问题：第三方登录接口文档不清晰
解决方案：已联系技术支持获取最新文档并完成适配

📅 下周工作计划
1. 购物车模块开发（周一-周三）
2. 购物车与商品模块联调（周四-周五）

🤝 需要的支持
本周暂无额外支持需求。`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7 / Sonnet 4.6", strengths: "文字最自然、结构化输出强", useCase: "高质量周报", audience: "追求专业表达的职场人" },
      { name: "Qwen 3.6", strengths: "中文理解极佳、速度快", useCase: "日常周报", audience: "需要快速完成周报的职场人" },
    ],
    usageStepsOnline: ["复制 Prompt", "打开 AI 平台", "替换变量", "获取周报", "微调后使用"],
    usageStepsLocal: ["安装模型", "复制本地版 Prompt", "填入工作内容", "运行生成"],
    likes: 654,
  },
  {
    id: "code-review",
    title: "AI代码审查专家（全方位安全版 v2.0）",
    subtitle: "粘贴代码，获得专业审查报告，包含安全漏洞、性能优化、最佳实践。",
    description: "专业AI代码审查工具，帮助开发者快速发现潜在问题。",
    category: "编程与技术任务",
    categorySlug: "coding",
    difficulty: "进阶",
    rating: 4.9,
    usageCount: 1876,
    lastUpdated: "2026.04",
    version: "v2.0",
    tags: ["代码审查", "安全", "性能优化"],
    featured: true,
    trending: true,
    beginner: false,
    promptOnline: `你是资深代码审查专家。请审查以下代码：

【编程语言】：{{语言}}
【代码用途】：{{用途}}
【代码内容】：
{{代码}}

从以下维度审查：
🔒 安全性（SQL注入、XSS、敏感信息泄露）
⚡ 性能（复杂度、瓶颈、资源泄漏）
📐 代码质量（命名、职责单一、可读性）
✅ 最佳实践（设计模式、错误处理）

输出格式：总体评分（1-10）→ 问题列表（🔴严重 🟡警告 🔵建议）→ 优化后代码 → 改进建议`,
    promptLocal: `[系统指令] 你是代码审查专家。
[输入] 语言：{language} 代码：{code}
[输出] 评分 → 问题列表 → 优化代码 → 建议`,
    variables: [
      { name: "语言", placeholder: "例如：Python、JavaScript", required: true },
      { name: "用途", placeholder: "例如：用户认证、数据处理", required: false },
      { name: "代码", placeholder: "粘贴你的代码", required: true },
    ],
    beforeAfter: {
      input: "Python登录函数：\ndef login(username, password):\n    query = f\"SELECT * FROM users WHERE username='{username}' AND password='{password}'\"\n    result = db.execute(query)\n    return bool(result)",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `📊 总体评分：3/10

🔴 严重问题：
1. SQL注入漏洞（Critical）— 直接使用f-string拼接SQL，攻击者可绕过验证
   修复：使用参数化查询
2. 明文存储密码 — 密码应哈希存储
   修复：使用bcrypt

🟡 警告：
1. 无错误处理 — 数据库操作未使用try-except

📝 优化后代码：
import bcrypt

def login(username: str, password: str) -> Optional[dict]:
    if not username or not password:
        return None
    try:
        result = db.execute("SELECT * FROM users WHERE username = %s", (username,))
        if result and bcrypt.checkpw(password.encode(), result['password_hash'].encode()):
            return result
        return None
    except Exception as e:
        logger.error(f"Login error: {e}")
        return None`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "代码理解强、安全分析深入", useCase: "复杂代码审查", audience: "专业开发者" },
      { name: "Grok 4.20", strengths: "快速响应、创意方案", useCase: "快速审查", audience: "需要快速反馈的开发者" },
    ],
    usageStepsOnline: ["复制 Prompt", "指定语言和用途", "粘贴代码", "获取审查报告"],
    usageStepsLocal: ["安装代码模型", "复制本地版 Prompt", "粘贴代码后运行"],
    likes: 567,
  },
  {
    id: "english-to-chinese",
    title: "英译中自然化翻译器（去机翻味 v3.0）",
    subtitle: "将英文翻译成自然流畅的中文，完全去除机翻味。",
    description: "专为英译中优化，生成地道中文表达。",
    category: "语言与内容生产",
    categorySlug: "content",
    difficulty: "新手友好",
    rating: 4.8,
    usageCount: 2890,
    lastUpdated: "2026.03",
    version: "v3.0",
    tags: ["翻译", "英译中", "去机翻味"],
    featured: false,
    trending: true,
    beginner: true,
    promptOnline: `你是资深翻译专家。将以下英文翻译成自然流畅的中文：

【英文原文】：{{英文内容}}
【翻译场景】：{{场景}}

要求：忠实传达含义，使用地道中文表达，避免翻译腔，适当意译。直接输出翻译结果。`,
    promptLocal: `[系统指令] 你是专业翻译，将英文翻译成自然的中文。
[输入] 原文：{text} 场景：{context}
[要求] 准确、自然、避免翻译腔`,
    variables: [
      { name: "英文内容", placeholder: "粘贴需要翻译的英文内容", required: true },
      { name: "场景", placeholder: "例如：商务邮件、学术论文、技术文档", required: false },
    ],
    beforeAfter: {
      input: "The implementation of this feature requires careful consideration of various factors, including performance implications and maintainability.",
      outputs: [
        { model: "Claude Opus 4.7", text: "实现这一功能需要综合考量多方面因素，包括性能影响和代码可维护性。" },
        { model: "Qwen 3.6", text: "要落地这个功能，得从性能、可维护性等多个维度仔细权衡。" },
      ],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "翻译最自然、语境理解深", useCase: "高质量翻译", audience: "追求翻译质量的用户" },
      { name: "Qwen 3.6", strengths: "中文表达地道、速度快", useCase: "日常翻译", audience: "需要快速翻译的用户" },
    ],
    usageStepsOnline: ["复制 Prompt 并填入原文", "指定场景", "获取翻译"],
    usageStepsLocal: ["安装中英双语模型", "复制本地版 Prompt", "填入原文后运行"],
    likes: 723,
  },
  {
    id: "email-writer",
    title: "商务邮件撰写助手（专业得体版 v1.8）",
    subtitle: "输入邮件目的和要点，生成专业得体的商务邮件。",
    description: "帮助职场人士快速撰写各类商务邮件。",
    category: "思考与工作流",
    categorySlug: "thinking",
    difficulty: "新手友好",
    rating: 4.7,
    usageCount: 1543,
    lastUpdated: "2026.04",
    version: "v1.8",
    tags: ["邮件", "商务", "职场"],
    featured: false,
    trending: false,
    beginner: true,
    promptOnline: `你是商务写作专家。请撰写一封商务邮件：

【邮件目的】：{{邮件目的}}
【收件人关系】：{{收件人关系}}
【核心内容】：{{核心内容}}

包含主题行、称呼、正文（目的→内容→行动）、落款。直接输出完整邮件。`,
    promptLocal: `[系统指令] 你是商务邮件专家。
[输入] 目的：{purpose} 收件人：{recipient} 内容：{content}
[输出] Subject: [主题行] + 完整邮件`,
    variables: [
      { name: "邮件目的", placeholder: "例如：项目进度汇报、会议邀请", required: true },
      { name: "收件人关系", placeholder: "例如：上级领导、客户、同事", required: true },
      { name: "核心内容", placeholder: "例如：本周项目进展顺利，预计下周完成", required: true },
    ],
    beforeAfter: {
      input: "目的：向领导汇报项目进度\n收件人：直属上级\n内容：完成用户系统开发，下周开始测试",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `Subject: 【项目进度】用户系统开发完成，下周进入测试阶段

尊敬的领导：

您好！现就本周项目进展向您汇报：

本周已完成用户系统的核心开发工作，包括注册、登录、权限管理等模块。经初步自测，各功能运行稳定。

下周计划进入系统测试阶段，预计测试周期为一周。

此致
敬礼`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "措辞最得体", useCase: "正式商务邮件", audience: "需要高质量邮件的职场人" },
      { name: "Qwen 3.6", strengths: "中文自然、速度快", useCase: "日常邮件", audience: "需要快速写邮件的职场人" },
    ],
    usageStepsOnline: ["复制 Prompt", "填入邮件信息", "获取完整邮件", "调整后发送"],
    usageStepsLocal: ["安装中文模型", "复制本地版 Prompt", "填入信息后运行"],
    likes: 432,
  },
  {
    id: "api-generator",
    title: "RESTful API 代码生成器（全栈版 v2.3）",
    subtitle: "描述API需求，自动生成完整接口代码。",
    description: "快速生成符合RESTful规范的API代码，支持多种后端框架。",
    category: "编程与技术任务",
    categorySlug: "coding",
    difficulty: "进阶",
    rating: 4.8,
    usageCount: 1234,
    lastUpdated: "2026.04",
    version: "v2.3",
    tags: ["API", "后端", "RESTful"],
    featured: false,
    trending: true,
    beginner: false,
    promptOnline: `你是全栈开发专家。请根据需求生成API代码：

【功能描述】：{{功能描述}}
【技术栈】：{{技术栈}}
【数据库】：{{数据库}}

输出：API设计文档（端点、参数、响应格式）→ 完整代码（路由、控制器、验证、错误处理）→ 测试用例`,
    promptLocal: `[系统指令] 你是后端开发专家，生成RESTful API代码。
[输入] 功能：{feature} 技术栈：{stack} 数据库：{database}
[输出] 1.API设计 2.完整代码 3.测试用例`,
    variables: [
      { name: "功能描述", placeholder: "例如：用户注册登录系统", required: true },
      { name: "技术栈", placeholder: "例如：Node.js + Express", required: true },
      { name: "数据库", placeholder: "例如：PostgreSQL、MongoDB", required: false },
    ],
    beforeAfter: {
      input: "功能：用户注册和登录API\n技术栈：Node.js + Express\n数据库：PostgreSQL",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `## API端点

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |

## 代码实现

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await db.query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
    [email, hashedPassword, name]
  );
  const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: result.rows[0], token });
});`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "代码质量高、架构设计强", useCase: "复杂API设计", audience: "专业后端开发者" },
      { name: "Grok 4.20", strengths: "快速生成", useCase: "快速原型", audience: "需要快速实现的开发者" },
    ],
    usageStepsOnline: ["复制 Prompt", "描述API需求", "获取代码", "调整后使用"],
    usageStepsLocal: ["安装代码模型", "复制本地版 Prompt", "描述需求后运行"],
    likes: 345,
  },
  {
    id: "structured-thinking",
    title: "结构化思考与决策分析器（深度版 v1.6）",
    subtitle: "将复杂问题分解为清晰的结构化框架，辅助理性决策。",
    description: "帮助用户将模糊问题转化为结构化思考框架。",
    category: "思考与工作流",
    categorySlug: "thinking",
    difficulty: "进阶",
    rating: 4.9,
    usageCount: 987,
    lastUpdated: "2026.03",
    version: "v1.6",
    tags: ["思考", "决策", "分析"],
    featured: false,
    trending: false,
    beginner: false,
    promptOnline: `你是管理顾问和思维教练。请分析以下问题：

【问题/决策】：{{问题描述}}
【背景信息】：{{背景信息}}
【约束条件】：{{约束条件}}
【期望目标】：{{期望目标}}

使用以下框架：
📊 问题定义 → 🔍 根因分析（5 Whys）→ 📋 方案矩阵（成本/效果/风险/时间）→ 🎯 推荐方案 → 📈 行动计划`,
    promptLocal: `[系统指令] 你是结构化思考专家。
[输入] 问题：{problem} 背景：{background} 约束：{constraints} 目标：{goal}
[输出] 1.问题定义 2.根因分析 3.方案矩阵 4.推荐方案 5.行动计划`,
    variables: [
      { name: "问题描述", placeholder: "例如：团队效率低下、产品转化率不高", required: true },
      { name: "背景信息", placeholder: "例如：15人研发团队，2周迭代", required: false },
      { name: "约束条件", placeholder: "例如：不能增加人手", required: false },
      { name: "期望目标", placeholder: "例如：降低50%的线上Bug率", required: true },
    ],
    beforeAfter: {
      input: "问题：团队代码质量不高，Bug率持续上升\n背景：15人研发团队，2周迭代\n约束：不能增加人手\n目标：降低50%线上Bug率",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `📊 问题定义
核心问题：代码质量控制体系不完善

🔍 根因分析
1. Bug多？→ 代码审查不充分
2. 审查不充分？→ 没有强制CR流程
3. 没有流程？→ 快速扩张，流程滞后
根本原因：缺乏质量文化和自动化保障

📋 方案矩阵
| 方案 | 成本 | 效果 | 风险 | 总分 |
|------|------|------|------|------|
| A. 强制CR+自动化测试 | 中 | 高 | 低 | 8.5 |
| B. 引入AI代码审查 | 低 | 中 | 低 | 7.0 |
| C. 增加QA团队 | 高 | 高 | 中 | 6.5 |

🎯 推荐：A+B组合
1. 第1周：ESLint + Prettier
2. 第2周：强制CR流程
3. 第3周：AI辅助审查
4. 第4周：复盘优化`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "逻辑推理强", useCase: "复杂决策分析", audience: "管理者、决策者" },
      { name: "Grok 4.20", strengths: "创意视角", useCase: "创新方案", audience: "需要创新思路的用户" },
    ],
    usageStepsOnline: ["复制 Prompt", "描述问题", "获取分析", "制定方案"],
    usageStepsLocal: ["安装推理模型", "复制本地版 Prompt", "描述问题后运行"],
    likes: 289,
  },
  {
    id: "xiaohongshu-title",
    title: "小红书爆款标题生成器（高点击率版 v1.9）",
    subtitle: "输入主题关键词，批量生成高点击率小红书标题。",
    description: "基于大量爆款标题模式，生成高点击率标题。",
    category: "语言与内容生产",
    categorySlug: "content",
    difficulty: "新手友好",
    rating: 4.7,
    usageCount: 2567,
    lastUpdated: "2026.04",
    version: "v1.9",
    tags: ["小红书", "标题", "点击率"],
    featured: false,
    trending: true,
    beginner: true,
    promptOnline: `你是小红书爆款标题专家。根据以下信息生成10个高点击率标题：

【主题/关键词】：{{主题}}
【内容类型】：{{内容类型}}

规则：包含emoji、使用数字、制造好奇心、突出利益点、20字以内、口语化。
直接输出10个标题，每个一行。`,
    promptLocal: `[系统指令] 你是小红书标题专家。
[输入] 主题：{topic} 类型：{type}
[输出] 10个标题，每行一个，含emoji`,
    variables: [
      { name: "主题", placeholder: "例如：护肤、穿搭、减肥", required: true },
      { name: "内容类型", placeholder: "例如：教程、测评、经验分享", required: false },
    ],
    beforeAfter: {
      input: "主题：极简护肤\n类型：经验分享",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `1. 🧴 极简护肤3年｜皮肤反而变好了的5个真相
2. 💰 学生党护肤｜月均50元搞定全套护肤
3. ✨ 后悔没早知道！精简护肤的3个核心原则
4. 🔥 护肤做减法后，我的烂脸居然好了
5. 📦 从15瓶到3瓶｜我的极简护肤之路
6. 💡 大学生必看｜便宜又好用的护肤方案
7. 🌟 极简护肤100天｜素颜也能自信出门
8. 🧪 踩过无数坑后，我只留下这3瓶
9. 📝 护肤小白必看｜少花钱多办事的秘诀
10. 🏆 极简护肤挑战｜30天后皮肤状态惊人`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "创意丰富", useCase: "高质量标题", audience: "追求创意的创作者" },
      { name: "Qwen 3.6", strengths: "中文理解好、速度快", useCase: "批量生成", audience: "需要快速出标题的用户" },
    ],
    usageStepsOnline: ["复制 Prompt", "填入主题", "获取10个标题", "选择使用"],
    usageStepsLocal: ["安装中文模型", "复制本地版 Prompt", "填入主题后运行"],
    likes: 567,
  },
  {
    id: "bug-fixer",
    title: "智能Bug修复助手（快速定位版 v2.1）",
    subtitle: "描述Bug现象或粘贴错误信息，快速获得定位思路和修复方案。",
    description: "帮助开发者快速定位和修复Bug。",
    category: "编程与技术任务",
    categorySlug: "coding",
    difficulty: "进阶",
    rating: 4.8,
    usageCount: 1678,
    lastUpdated: "2026.04",
    version: "v2.1",
    tags: ["Bug修复", "调试", "错误分析"],
    featured: false,
    trending: false,
    beginner: false,
    promptOnline: `你是调试专家。请分析以下Bug：

【技术栈】：{{技术栈}}
【Bug描述】：{{Bug描述}}
【错误信息】：{{错误信息}}
【相关代码】：{{相关代码}}

输出：🔍 错误解读 → 🎯 定位思路 → ✅ 修复方案 → 🛡️ 预防措施`,
    promptLocal: `[系统指令] 你是调试专家。
[输入] 技术栈：{stack} Bug：{description} 错误：{error} 代码：{code}
[输出] 1.错误解读 2.定位思路 3.修复方案 4.预防措施`,
    variables: [
      { name: "技术栈", placeholder: "例如：React + TypeScript", required: true },
      { name: "Bug描述", placeholder: "例如：页面白屏、接口报错", required: true },
      { name: "错误信息", placeholder: "粘贴错误信息", required: false },
      { name: "相关代码", placeholder: "粘贴相关代码", required: false },
    ],
    beforeAfter: {
      input: "技术栈：React + TypeScript\nBug：页面白屏\n错误：Cannot read properties of undefined (reading 'map')\n代码：const items = data.items.map(item => ...)",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `🔍 错误解读
data.items 是 undefined，可能是API返回数据结构不符或数据未加载完成。

🎯 定位思路
1. 检查API返回值
2. 检查组件渲染时机
3. 检查状态初始值

✅ 修复方案
// 方案1：可选链 + 默认值
const items = data?.items?.map(item => ...) ?? [];

// 方案2：加载状态
if (loading) return <Loading />;
if (!data?.items) return <Empty />;

🛡️ 预防措施
- TypeScript定义完整数据类型
- 使用可选链处理可能为undefined的属性`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "代码理解深入", useCase: "复杂Bug定位", audience: "遇到疑难Bug的开发者" },
      { name: "Grok 4.20", strengths: "快速响应", useCase: "快速修复", audience: "需要快速解决的开发者" },
    ],
    usageStepsOnline: ["复制 Prompt", "描述Bug", "粘贴错误和代码", "获取修复方案"],
    usageStepsLocal: ["安装代码模型", "复制本地版 Prompt", "描述Bug后运行"],
    likes: 432,
  },
  {
    id: "research-assistant",
    title: "深度研究助手（学术级 v1.4）",
    subtitle: "输入研究主题，获得结构化的深度分析报告。",
    description: "帮助用户进行深度研究，生成结构化报告。",
    category: "思考与工作流",
    categorySlug: "thinking",
    difficulty: "高级",
    rating: 4.9,
    usageCount: 765,
    lastUpdated: "2026.03",
    version: "v1.4",
    tags: ["研究", "分析", "报告"],
    featured: false,
    trending: false,
    beginner: false,
    promptOnline: `你是研究分析师。请对以下主题进行深度研究：

【研究主题】：{{研究主题}}
【研究目的】：{{研究目的}}
【关注重点】：{{关注重点}}

输出结构：
📋 研究摘要 → 🔍 研究背景 → 📊 现状分析 → 📈 趋势洞察 → 💡 核心发现 → 🎯 结论与建议`,
    promptLocal: `[系统指令] 你是研究分析师。
[输入] 主题：{topic} 目的：{purpose} 重点：{focus}
[输出] 1.摘要 2.背景 3.现状 4.趋势 5.发现 6.结论`,
    variables: [
      { name: "研究主题", placeholder: "例如：2026年AI行业趋势", required: true },
      { name: "研究目的", placeholder: "例如：为投资决策提供参考", required: false },
      { name: "关注重点", placeholder: "例如：市场规模、技术趋势", required: false },
    ],
    beforeAfter: {
      input: "研究主题：2026年中国AI大模型行业现状\n目的：了解行业格局\n重点：市场规模、主要玩家",
      outputs: [{
        model: "Claude Opus 4.7",
        text: `📋 研究摘要
2026年中国AI大模型市场进入成熟期，市场规模预计突破500亿元。多模态、Agent、端侧部署成为三大趋势。

📊 现状分析
- 2025年市场规模约380亿元，2026年预计520亿元
- 第一梯队：百度文心、阿里通义、字节豆包
- 通用大模型竞争白热化，垂直领域成为新增长点

📈 趋势洞察
1. 多模态融合 — 文本、图像、视频统一理解
2. Agent生态爆发 — 从问答到复杂任务执行
3. 端侧部署普及 — 手机PC本地运行大模型

🎯 建议
- 避开通用大模型赛道
- 选择有壁垒的垂直领域
- 重视Agent和工作流能力`,
      }],
    },
    recommendedModels: [
      { name: "Claude Opus 4.7", strengths: "分析深入、逻辑严密", useCase: "深度研究报告", audience: "需要专业分析的用户" },
      { name: "Grok 4.20", strengths: "信息量大、视角独特", useCase: "快速调研", audience: "需要快速了解行业的用户" },
    ],
    usageStepsOnline: ["复制 Prompt", "描述研究主题", "获取研究报告"],
    usageStepsLocal: ["安装知识量大的模型", "复制本地版 Prompt", "描述主题后运行"],
    likes: 234,
  },
];

export const testimonials: Testimonial[] = [
  { id: "1", name: "小林", role: "小红书博主 · 5万粉丝", avatar: "XL", content: "用小红书笔记生成器之后，创作效率提升了3倍！关键是生成的内容真的不像AI写的。", rating: 5 },
  { id: "2", name: "张工", role: "全栈开发工程师", avatar: "ZG", content: "代码审查工具太实用了，帮我发现了好几个潜在的安全漏洞。每次提交前都会用它过一遍。", rating: 5 },
  { id: "3", name: "王经理", role: "产品经理", avatar: "WJ", content: "周报生成器救了我！以前写周报要花1小时，现在5分钟搞定，结构比自己写的清晰多了。", rating: 5 },
  { id: "4", name: "李同学", role: "大四学生", avatar: "LX", content: "作为AI新手，这个平台的模板真的很友好。复制粘贴就能用，不用学复杂的Prompt技巧。", rating: 4 },
  { id: "5", name: "陈老师", role: "高中英语教师", avatar: "CL", content: "翻译工具的去机翻味功能很厉害，翻译出来的中文非常自然。", rating: 5 },
  { id: "6", name: "赵总", role: "创业公司CEO", avatar: "ZZ", content: "结构化思考工具帮我理清了很多复杂的业务问题，做决策前都会先用它分析一下。", rating: 5 },
];

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}
export function getSkillsByCategory(slug: string): Skill[] {
  return skills.filter((s) => s.categorySlug === slug);
}
export function getTrendingSkills(): Skill[] {
  return skills.filter((s) => s.trending);
}
export function getNewestSkills(): Skill[] {
  return [...skills].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 6);
}
export function getBeginnerSkills(): Skill[] {
  return skills.filter((s) => s.beginner);
}
export function getFeaturedSkills(): Skill[] {
  return skills.filter((s) => s.featured);
}
export function searchSkills(query: string): Skill[] {
  const q = query.toLowerCase();
  return skills.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
  );
}

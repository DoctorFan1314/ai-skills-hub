"use client";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">隐私政策</h1>

      <div className="glass-card p-8 space-y-6 text-[#8b949e] leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. 信息收集</h2>
          <p>我们可能收集以下信息：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong className="text-white">账号信息</strong>：注册时提供的用户名、邮箱地址</li>
            <li><strong className="text-white">使用数据</strong>：页面访问、模板使用次数等匿名统计数据</li>
            <li><strong className="text-white">设备信息</strong>：浏览器类型、操作系统、屏幕分辨率等</li>
            <li><strong className="text-white">Cookie</strong>：用于维持登录状态和偏好设置</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. 信息使用</h2>
          <p>我们收集的信息仅用于：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>提供和维护本平台服务</li>
            <li>改善用户体验和模板质量</li>
            <li>发送服务相关通知（如模板更新）</li>
            <li>防范滥用和安全风险</li>
          </ul>
          <p className="mt-3">
            我们<strong className="text-white">不会</strong>将你的个人信息出售给第三方。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. 信息存储与安全</h2>
          <p>
            用户数据通过 Supabase（PostgreSQL）存储，采用行业标准的加密和安全措施。
            我们会尽合理努力保护你的个人信息，但无法保证绝对的安全性。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. 第三方服务</h2>
          <p>本平台使用以下第三方服务：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong className="text-white">Vercel</strong> — 网站托管和部署</li>
            <li><strong className="text-white">Supabase</strong> — 数据库和身份认证</li>
            <li><strong className="text-white">Google Analytics</strong>（如有）— 匿名访问统计</li>
          </ul>
          <p className="mt-3">这些第三方服务有各自的隐私政策，我们建议你了解其数据处理方式。</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. 用户权利</h2>
          <p>你有权：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>访问、修改或删除你的个人信息</li>
            <li>导出你的数据</li>
            <li>注销账号（将删除所有关联数据）</li>
            <li>选择退出非必要的数据收集</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Cookie 政策</h2>
          <p>
            本平台使用 Cookie 维持登录状态和记录用户偏好。你可以在浏览器设置中禁用 Cookie，
            但可能影响部分功能的正常使用。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. 未成年人保护</h2>
          <p>
            本平台不面向 14 岁以下未成年人提供服务。如果我们发现已收集了未成年人的个人信息，
            将及时删除相关数据。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. 政策更新</h2>
          <p>
            我们可能会不时更新本隐私政策。重大变更将通过网站公告或邮件通知用户。
            继续使用本平台即视为接受更新后的政策。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">9. 联系我们</h2>
          <p>如对本隐私政策有任何疑问，请联系我们：</p>
          <p className="mt-2 text-[#00d4ff]">contact@aiskillshub.com</p>
        </section>

        <p className="text-sm text-[#8b949e]/60 pt-4 border-t border-white/10">
          最后更新：2026 年 4 月
        </p>
      </div>
    </div>
  );
}

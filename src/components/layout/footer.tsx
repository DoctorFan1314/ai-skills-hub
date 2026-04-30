import Link from "next/link";

const footerLinks = {
  产品: [
    { label: "技能市场", href: "/skills" },
    { label: "分类浏览", href: "/categories" },
    { label: "新手指南", href: "/guide" },
    { label: "提交模板", href: "/submit" },
  ],
  支持: [
    { label: "帮助中心", href: "/guide" },
    { label: "反馈建议", href: "/submit" },
  ],
  关于: [
    { label: "关于我们", href: "#" },
    { label: "使用条款", href: "#" },
    { label: "隐私政策", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black/40 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                <span className="text-sm font-bold text-[#00d4ff]">AI</span>
              </div>
              <span className="text-lg font-semibold text-white">AI Skills Hub</span>
            </div>
            <p className="text-sm text-[#8b949e] leading-relaxed">
              高质量LLM技能模板，复制即用，去AI味。把强大AI真正变成你的生产力武器。
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-medium text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#8b949e] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#8b949e]">© 2026 AI Skills Hub. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
            <span>适配平台：</span>
            <span>ChatGPT</span><span>·</span>
            <span>Claude</span><span>·</span>
            <span>Grok</span><span>·</span>
            <span>DeepSeek</span><span>·</span>
            <span>Qwen</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

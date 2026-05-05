import Link from "next/link";
import { NewsletterForm } from "@/components/shared/newsletter-form";

interface FooterLink {
  label: string;
  href: string;
  disabled?: boolean;
}

const footerLinks: Record<string, FooterLink[]> = {
  产品: [
    { label: "技能市场", href: "/skills" },
    { label: "分类浏览", href: "/categories" },
    { label: "排行榜", href: "/trending" },
    { label: "标签云", href: "/tags" },
    { label: "提交模板", href: "/submit" },
  ],
  支持: [
    { label: "新手指南", href: "/guide" },
    { label: "帮助中心", href: "/guide" },
    { label: "反馈建议", href: "/submit" },
  ],
  关于: [
    { label: "使用条款", href: "#", disabled: true },
    { label: "隐私政策", href: "#", disabled: true },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-sm font-bold text-primary">AI</span>
              </div>
              <span className="text-lg font-semibold text-foreground">AI Skills Hub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              高质量LLM技能模板，复制即用，去AI味。把强大AI真正变成你的生产力武器。
            </p>
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">订阅更新</h3>
              <NewsletterForm />
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.disabled ? (
                      <span className="text-sm text-muted-foreground/40 cursor-default">{link.label}</span>
                    ) : (
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 AI Skills Hub. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>适配平台：</span>
            <span>ChatGPT</span><span>·</span>
            <span>Claude</span><span>·</span>
            <span>Grok</span><span>·</span>
            <span>DeepSeek</span><span>·</span>
            <span>Qwen</span>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground/40 text-center leading-relaxed">
          ChatGPT、Claude、Grok、DeepSeek、Qwen 等为各自公司的注册商标，本平台与其无隶属关系。
        </p>
      </div>
    </footer>
  );
}

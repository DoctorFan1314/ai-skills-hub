"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/i18n-context";

export function Footer() {
  const { t, lang } = useI18n();

  const footerSections = [
    { id: "product", title: lang === "zh" ? "产品" : "Product", links: [
      { label: lang === "zh" ? "模型市场" : "Models", href: "/models", disabled: false },
      { label: lang === "zh" ? "API 文档" : "API Docs", href: "/docs", disabled: false },
      { label: lang === "zh" ? "控制台" : "Dashboard", href: "/dashboard", disabled: false },
      { label: lang === "zh" ? "定价" : "Pricing", href: "/models", disabled: false },
    ]},
    { id: "features", title: lang === "zh" ? "功能" : "Features", links: [
      { label: lang === "zh" ? "统一接口" : "Unified API", href: "/docs", disabled: false },
      { label: lang === "zh" ? "智能路由" : "Smart Routing", href: "/docs", disabled: false },
      { label: lang === "zh" ? "用量计费" : "Usage & Billing", href: "/dashboard/usage", disabled: false },
      { label: lang === "zh" ? "多格式兼容" : "Multi-Protocol", href: "/docs", disabled: false },
    ]},
    { id: "resources", title: t.footer.resources, links: [
      { label: lang === "zh" ? "Agent 技能" : "Agent Skills", href: "/skills", disabled: false },
      { label: lang === "zh" ? "Prompt 模板" : "Prompt Templates", href: "/prompts", disabled: false },
      { label: lang === "zh" ? "分类浏览" : "Categories", href: "/categories", disabled: false },
      { label: lang === "zh" ? "新手指南" : "Guide", href: "/guide", disabled: false },
    ]},
    { id: "community", title: t.footer.community, links: [
      { label: t.footer.github, href: "#", disabled: true },
      { label: t.footer.discord, href: "#", disabled: true },
      { label: t.footer.twitter, href: "#", disabled: true },
    ]},
  ];

  return (
    <footer className="border-t border-border bg-background/60 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-sm font-bold text-primary">O</span>
              </div>
              <span className="text-lg font-semibold text-foreground">OortAPI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {t.footer.description}
            </p>
          </div>
          {footerSections.map((section) => (
            <nav key={section.id} aria-label={section.title}>
              <h3 className="text-sm font-medium text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.disabled ? (
                      <span className="text-sm text-muted-foreground/50 cursor-not-allowed" aria-disabled="true">{link.label} <span className="text-[10px]">({t.footer.comingSoon || "Coming soon"})</span></span>
                    ) : (
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{t.footer.platforms}:</span>
            <span>OpenAI</span><span>·</span>
            <span>Anthropic</span><span>·</span>
            <span>Google</span><span>·</span>
            <span>DeepSeek</span><span>·</span>
            <span>Qwen</span>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground/40 text-center leading-relaxed">
          {t.footer.trademarkDisclaimer}
        </p>
      </div>
    </footer>
  );
}

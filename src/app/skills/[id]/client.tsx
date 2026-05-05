"use client";

import { useState } from "react";
import Link from "next/link";
import { getAgentSkillById } from "@/lib/mock-agent-skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Terminal, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-muted-foreground hover:text-foreground"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="relative my-4">
            <div className="flex items-center justify-between bg-secondary/80 border border-border border-b-0 rounded-t-lg px-4 py-2">
              <span className="text-xs text-muted-foreground font-mono">{codeLang || "code"}</span>
              <CopyButton text={codeLines.join("\n")} />
            </div>
            <pre className="bg-secondary border border-border rounded-b-lg p-4 overflow-x-auto">
              <code className="text-sm text-muted-foreground font-mono whitespace-pre">{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-3">{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-3 flex items-center gap-2"><Terminal className="h-4 w-4 text-primary" />{line.slice(3)}</h2>);
    } else if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-2 py-1 text-sm">
            <span className="text-primary shrink-0">•</span>
            <span><strong className="text-foreground">{match[1]}</strong> <span className="text-muted-foreground">— {match[2]}</span></span>
          </div>
        );
      } else {
        const boldMatch = line.match(/^- \*\*(.+?)\*\*(.*)$/);
        if (boldMatch) {
          elements.push(
            <div key={i} className="flex gap-2 py-1 text-sm">
              <span className="text-primary shrink-0">•</span>
              <span><strong className="text-foreground">{boldMatch[1]}</strong><span className="text-muted-foreground">{boldMatch[2]}</span></span>
            </div>
          );
        } else {
          elements.push(<div key={i} className="flex gap-2 py-1 text-sm text-muted-foreground"><span className="text-primary shrink-0">•</span>{line.slice(2)}</div>);
        }
      }
    } else if (line.startsWith("- ")) {
      elements.push(<div key={i} className="flex gap-2 py-1 text-sm text-muted-foreground"><span className="text-primary shrink-0">•</span>{line.slice(2)}</div>);
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(<div key={i} className="py-1 text-sm text-muted-foreground">{line}</div>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>);
    }
  }

  return <div>{elements}</div>;
}

export default function AgentSkillDetailClient({ id }: { id: string }) {
  const skill = getAgentSkillById(id);
  const { t } = useI18n();
  const [showAllTriggers, setShowAllTriggers] = useState(false);

  if (!skill) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">{t.agentSkills.notFound}</p>
        <Link href="/skills" className="text-primary mt-4 inline-block hover:underline">{t.agentSkills.backToList}</Link>
      </div>
    );
  }

  const displayTriggers = showAllTriggers ? skill.triggers : skill.triggers.slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />{t.agentSkills.backToList}
      </Link>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs bg-purple-400/10 text-purple-400 border-purple-400/20 border">
            Agent 技能
          </Badge>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <Zap className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{skill.name}</h1>
        </div>
      </div>

      {/* Triggers */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.agentSkills.triggerExamples}</h2>
        <div className="flex flex-wrap gap-2">
          {displayTriggers.map((trigger) => (
            <span key={trigger} className="px-3 py-1.5 text-sm rounded-lg bg-secondary border border-border text-muted-foreground">
              {trigger}
            </span>
          ))}
        </div>
        {skill.triggers.length > 10 && (
          <button
            onClick={() => setShowAllTriggers(!showAllTriggers)}
            className="flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
          >
            {showAllTriggers ? <><ChevronUp className="h-3 w-3" />收起</> : <><ChevronDown className="h-3 w-3" />查看全部 {skill.triggers.length} 个触发词</>}
          </button>
        )}
      </div>

      {/* Description (Markdown) */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.agentSkills.description}</h2>
        <MarkdownRenderer content={skill.description} />
      </div>
    </div>
  );
}

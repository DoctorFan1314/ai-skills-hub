"use client";

import { useState } from "react";
import Link from "next/link";
import { getAgentSkillById } from "@/lib/mock-agent-skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Zap, Download, Star, Copy, Check, ChevronDown, ChevronUp,
  Terminal, FileCode, Play, BookOpen, Clock, Scale, Tag
} from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import md from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";

SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", md);

const codeTheme: Record<string, React.CSSProperties> = {
  "hljs": { background: "#0d1117", color: "#e6edf3", padding: "1rem", borderRadius: "0 0 0.5rem 0.5rem", overflow: "auto" },
  "hljs-keyword": { color: "#ff7b72" },
  "hljs-string": { color: "#a5d6ff" },
  "hljs-number": { color: "#79c0ff" },
  "hljs-built_in": { color: "#ffa657" },
  "hljs-comment": { color: "#8b949e" },
  "hljs-title": { color: "#d2a8ff" },
  "hljs-attr": { color: "#79c0ff" },
  "hljs-params": { color: "#e6edf3" },
};

function CopyButton({ text, label, copiedLabel }: { text: string; label?: string; copiedLabel?: string }) {
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
      {copied ? (
        <><Check className="h-3 w-3 mr-1" />{copiedLabel || "Copied"}</>
      ) : (
        <><Copy className="h-3 w-3 mr-1" />{label || "Copy"}</>
      )}
    </Button>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

function getLang(filename: string): string {
  if (filename.endsWith(".ts") || filename.endsWith(".tsx")) return "typescript";
  if (filename.endsWith(".json")) return "json";
  if (filename.endsWith(".md")) return "markdown";
  return "text";
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
            <div className="flex items-center justify-between bg-[#161b22] border border-border border-b-0 rounded-t-lg px-4 py-2">
              <span className="text-xs text-muted-foreground font-mono">{codeLang || "code"}</span>
              <CopyButton text={codeLines.join("\n")} />
            </div>
            <SyntaxHighlighter language={codeLang || "text"} style={codeTheme} customStyle={{ margin: 0, fontSize: "0.875rem" }}>
              {codeLines.join("\n")}
            </SyntaxHighlighter>
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

function PreviewTab({ skill }: { skill: NonNullable<ReturnType<typeof getAgentSkillById>> }) {
  const [input, setInput] = useState(skill.demoInput);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  function runPreview() {
    setRunning(true);
    setOutput("");
    const text = skill.demoOutput;
    let idx = 0;
    const interval = setInterval(() => {
      idx += Math.floor(Math.random() * 3) + 1;
      if (idx >= text.length) {
        setOutput(text);
        setRunning(false);
        clearInterval(interval);
      } else {
        setOutput(text.slice(0, idx));
      }
    }, 20);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Input</label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            placeholder="Type a command..."
          />
          <Button onClick={runPreview} disabled={running} className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
            <Play className="h-4 w-4 mr-1.5" />
            {running ? "Running..." : "Run"}
          </Button>
        </div>
      </div>
      {output && (
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Output</label>
          <SyntaxHighlighter language="text" style={codeTheme} customStyle={{ margin: 0, fontSize: "0.875rem", borderRadius: "0.5rem" }}>
            {output}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}

export default function AgentSkillDetailClient({ id }: { id: string }) {
  const skill = getAgentSkillById(id);
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"overview" | "readme" | "files" | "preview">("overview");
  const [activeFile, setActiveFile] = useState<string>("");
  const [showAllTriggers, setShowAllTriggers] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  if (!skill) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">{t.agentSkills.notFound}</p>
        <Link href="/skills" className="text-primary mt-4 inline-block hover:underline">{t.agentSkills.backToList}</Link>
      </div>
    );
  }

  const fileNames = Object.keys(skill.files);
  const currentFile = activeFile || fileNames[0] || "";
  const displayTriggers = showAllTriggers ? skill.triggers : skill.triggers.slice(0, 10);

  const tabs = [
    { key: "overview" as const, label: t.agentSkills.overview, icon: BookOpen },
    { key: "readme" as const, label: t.agentSkills.readme, icon: FileCode },
    { key: "files" as const, label: t.agentSkills.files, icon: Terminal },
    { key: "preview" as const, label: t.agentSkills.preview, icon: Play },
  ];

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
          {skill.authorBadge && (
            <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20 border">
              {skill.authorBadge}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">v{skill.version}</span>
        </div>

        <div className="flex items-start gap-4 mb-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-2xl">
            {skill.avatar || skill.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{skill.title}</h1>
            <p className="text-muted-foreground">{skill.author} · {skill.collection}</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5"><Download className="h-4 w-4" />{formatNumber(skill.downloads)} {t.agentSkills.downloads}</span>
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4" />{formatNumber(skill.stars)} {t.agentSkills.stars}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{skill.lastUpdated}</span>
          <span className="flex items-center gap-1.5"><Scale className="h-4 w-4" />{skill.license}</span>
          <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" />{skill.category}</span>
        </div>

        {/* Install command */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0d1117] border border-border cursor-pointer hover:border-primary/30 transition-colors group"
          onClick={() => {
            navigator.clipboard.writeText(skill.installCommand);
            setCopiedInstall(true);
            setTimeout(() => setCopiedInstall(false), 2000);
          }}
        >
          <Terminal className="h-4 w-4 text-muted-foreground shrink-0" />
          <code className="text-sm text-foreground font-mono flex-1">{skill.installCommand}</code>
          {copiedInstall ? (
            <span className="text-xs text-green-400 flex items-center gap-1"><Check className="h-3.5 w-3.5" />{t.agentSkills.installCopied}</span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="h-3.5 w-3.5" />{t.common.copy}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-colors ${
              activeTab === key
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">{t.agentSkills.description}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
          </div>

          <div className="glass-card p-6">
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

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "readme" && (
        <div className="glass-card p-6">
          <MarkdownRenderer content={skill.readme} />
        </div>
      )}

      {activeTab === "files" && (
        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-border">
            <div className="w-56 shrink-0 border-r border-border bg-secondary/50 p-2 hidden sm:block">
              <p className="text-xs text-muted-foreground font-medium px-2 py-1.5 mb-1">{t.agentSkills.fileTree}</p>
              {fileNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setActiveFile(name)}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors ${
                    currentFile === name
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{name}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-border">
                <span className="text-xs text-muted-foreground font-mono">
                  {fileNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => setActiveFile(name)}
                      className={`mr-3 sm:hidden ${currentFile === name ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {name}
                    </button>
                  ))}
                  <span className="hidden sm:inline">{currentFile}</span>
                </span>
                <CopyButton text={skill.files[currentFile] || ""} />
              </div>
              {currentFile && skill.files[currentFile] && (
                <SyntaxHighlighter
                  language={getLang(currentFile)}
                  style={codeTheme}
                  customStyle={{ margin: 0, fontSize: "0.875rem", borderRadius: 0, maxHeight: "500px" }}
                >
                  {skill.files[currentFile]}
                </SyntaxHighlighter>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            {t.agentSkills.tryItOut}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t.agentSkills.tryPlaceholder}
          </p>
          <PreviewTab skill={skill} />
        </div>
      )}
    </div>
  );
}

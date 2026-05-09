"use client";

import { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import md from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import html from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import rust from "react-syntax-highlighter/dist/esm/languages/hljs/rust";

SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", md);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("html", html);
SyntaxHighlighter.registerLanguage("xml", html);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);

const darkTheme: Record<string, React.CSSProperties> = {
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

const lightTheme: Record<string, React.CSSProperties> = {
  "hljs": { background: "#f6f8fa", color: "#24292f", padding: "1rem", borderRadius: "0 0 0.5rem 0.5rem", overflow: "auto" },
  "hljs-keyword": { color: "#cf222e" },
  "hljs-string": { color: "#0a3069" },
  "hljs-number": { color: "#0550ae" },
  "hljs-built_in": { color: "#953800" },
  "hljs-comment": { color: "#6e7781" },
  "hljs-title": { color: "#8250df" },
  "hljs-attr": { color: "#0550ae" },
  "hljs-params": { color: "#24292f" },
};

export default function LazySyntaxHighlighter({ code, language }: { code: string; language: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const codeTheme = isDark ? darkTheme : lightTheme;

  return (
    <SyntaxHighlighter language={language || "text"} style={codeTheme} customStyle={{ margin: 0, fontSize: "0.875rem" }}>
      {code}
    </SyntaxHighlighter>
  );
}

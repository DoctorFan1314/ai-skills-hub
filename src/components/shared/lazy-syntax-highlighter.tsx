"use client";

import { useState } from "react";
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

export default function LazySyntaxHighlighter({ code, language }: { code: string; language: string }) {
  return (
    <SyntaxHighlighter language={language || "text"} style={codeTheme} customStyle={{ margin: 0, fontSize: "0.875rem" }}>
      {code}
    </SyntaxHighlighter>
  );
}

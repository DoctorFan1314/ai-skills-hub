import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API 文档 — OortAPI",
  description: "OortAPI 统一 AI API 中继平台接口文档",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

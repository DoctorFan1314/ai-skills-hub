import type { Metadata } from "next";
import GuideClient from "./client";

export const metadata: Metadata = {
  title: "新手指南 — AI Skills Hub",
  description: "3 分钟上手 Agent 技能与 Prompt 模板，让 AI 真正为你工作",
};

export default function GuidePage() {
  return <GuideClient />;
}

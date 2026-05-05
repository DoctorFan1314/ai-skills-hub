import type { Metadata } from "next";
import SkillsClient from "./client";

export const metadata: Metadata = {
  title: "Agent 技能市场 — AI Skills Hub",
  description: "发现可执行动作的 AI Agent 技能，连接 13+ 平台",
};

export default function SkillsPage() {
  return <SkillsClient />;
}

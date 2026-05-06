import type { Metadata } from "next";
import SubmitClient from "./client";

export const metadata: Metadata = {
  title: "提交模板 — AI Skills Hub",
  description: "分享你的优质 Prompt 模板。如需提交 Agent 技能，请前往技能市场页面使用「新建 Skill」功能。",
};

export default function SubmitPage() {
  return <SubmitClient />;
}

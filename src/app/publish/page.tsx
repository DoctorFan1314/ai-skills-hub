import type { Metadata } from "next";
import PublishClient from "./client";

export const metadata: Metadata = {
  title: "发布技能 — AI Skills Hub",
  description: "将你的 Agent 技能分享给社区",
};

export default function PublishPage() {
  return <PublishClient />;
}

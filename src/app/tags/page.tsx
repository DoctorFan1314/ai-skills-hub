import type { Metadata } from "next";
import TagsClient from "./client";

export const metadata: Metadata = {
  title: "标签云 — AI Skills Hub",
  description: "按标签浏览所有 AI 技能模板",
};

export default function TagsPage() {
  return <TagsClient />;
}

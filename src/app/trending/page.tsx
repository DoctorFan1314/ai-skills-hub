import type { Metadata } from "next";
import TrendingClient from "./client";

export const metadata: Metadata = {
  title: "排行榜 — AI Skills Hub",
  description: "发现社区中最热门、最新、编辑精选的 AI 技能模板",
};

export default function TrendingPage() {
  return <TrendingClient />;
}

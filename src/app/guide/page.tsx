import type { Metadata } from "next";
import GuideClient from "./client";

export const metadata: Metadata = {
  title: "新手指南 — OortAPI",
  description: "3 分钟快速上手 OortAPI，开始使用 AI 中转服务",
};

export default function GuidePage() {
  return <GuideClient />;
}

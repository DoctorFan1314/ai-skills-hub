import type { Metadata } from "next";
import SubmitStatusClient from "./client";

export const metadata: Metadata = {
  title: "提交状态 — AI Skills Hub",
  description: "查看你的模板提交历史和审核状态",
};

export default function SubmitStatusPage() {
  return <SubmitStatusClient />;
}

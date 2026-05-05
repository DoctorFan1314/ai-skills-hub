import type { Metadata } from "next";
import ProfileClient from "./client";

export const metadata: Metadata = {
  title: "个人中心 — AI Skills Hub",
  description: "管理你的个人资料、收藏、点赞、提交和使用历史",
};

export default function ProfilePage() {
  return <ProfileClient />;
}

import type { Metadata } from "next";
import AdminClient from "./client";

export const metadata: Metadata = {
  title: "管理后台 — AI Skills Hub",
  description: "管理员控制面板",
};

export default function AdminPage() {
  return <AdminClient />;
}

import type { Metadata } from "next";
import AdminClient from "./client";

export const metadata: Metadata = {
  title: "Admin Panel — AI Skills Hub",
  description: "Administrator control panel",
};

export default function AdminPage() {
  return <AdminClient />;
}

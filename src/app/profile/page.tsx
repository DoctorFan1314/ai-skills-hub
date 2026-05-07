import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileClient from "./client";

export const metadata: Metadata = {
  title: "Profile — AI Skills Hub",
  description: "Manage your profile, favorites, likes, submissions and activity history",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-12 lg:px-8 animate-pulse"><div className="h-8 w-48 bg-secondary rounded mb-6" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-secondary rounded-lg" />)}</div><div className="h-96 bg-secondary rounded-lg" /></div>}>
      <ProfileClient />
    </Suspense>
  );
}

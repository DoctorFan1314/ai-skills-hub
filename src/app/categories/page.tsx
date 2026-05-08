import type { Metadata } from "next";
import CategoriesClient from "./client";

export const metadata: Metadata = {
  title: "Categories — AI Skills Hub",
  description: "Browse AI templates and skills by category. Find the best tools for content, coding, data, and more.",
  openGraph: {
    title: "Categories — AI Skills Hub",
    description: "Browse AI templates and skills by category.",
    url: "https://ai-skills-hub.vercel.app/categories",
    type: "website",
  },
  twitter: { card: "summary", title: "Categories — AI Skills Hub" },
  alternates: { canonical: "https://ai-skills-hub.vercel.app/categories" },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}

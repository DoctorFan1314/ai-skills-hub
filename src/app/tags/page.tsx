import type { Metadata } from "next";
import TagsClient from "./client";

export const metadata: Metadata = {
  title: "Tag Cloud — AI Skills Hub",
  description: "Browse all AI skill templates by tags",
};

export default function TagsPage() {
  return <TagsClient />;
}

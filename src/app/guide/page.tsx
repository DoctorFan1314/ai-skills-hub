import type { Metadata } from "next";
import GuideClient from "./client";

export const metadata: Metadata = {
  title: "Guide — AI Skills Hub",
  description: "Get started with Agent Skills and Prompt Templates in 3 minutes and let AI work for you",
};

export default function GuidePage() {
  return <GuideClient />;
}

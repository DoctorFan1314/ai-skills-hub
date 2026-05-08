import type { Metadata } from "next";
import SubmitClient from "./client";

export const metadata: Metadata = {
  title: "Submit Template — AI Skills Hub",
  description: "Share your quality Prompt templates. To submit Agent Skills, use the 'New Skill' feature on the skills marketplace page.",
};

export default function SubmitPage() {
  return <SubmitClient />;
}

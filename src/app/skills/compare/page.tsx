import type { Metadata } from "next";
import CompareClient from "./client";

export const metadata: Metadata = {
  title: "Compare Skills — AI Skills Hub",
  description: "Compare two Agent Skills side by side to find the best one for your needs.",
  robots: { index: false },
};

export default function ComparePage() {
  return <CompareClient />;
}

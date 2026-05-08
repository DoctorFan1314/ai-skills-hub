import type { Metadata } from "next";
import TrendingClient from "./client";

export const metadata: Metadata = {
  title: "Trending — AI Skills Hub",
  description: "Discover the hottest, newest, and editor-picked AI skill templates in the community",
};

export default function TrendingPage() {
  return <TrendingClient />;
}

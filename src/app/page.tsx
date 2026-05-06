"use client";

import { Hero } from "@/components/home/hero";
import { FeaturedSection } from "@/components/home/featured-section";
import { CategoryCards } from "@/components/home/category-cards";
import { Testimonials } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedSection />
      <CategoryCards />
      <Testimonials />
    </>
  );
}

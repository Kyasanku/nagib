import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AnimationCard from "@/components/AnimationCard";
import { getAnimations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Animations",
  description: "Short animations and motion studies — hand-drawn, frame by frame.",
};

export default async function AnimationsPage() {
  const animations = await getAnimations();

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <PageHeader
        eyebrow="Drawings that move"
        title="Animations"
        subtitle="Short loops, motion studies and works-in-progress. The newest, and slowest, part of the practice."
      />
      <div className="mx-auto mt-12 grid max-w-[1400px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {animations.map((a) => (
          <AnimationCard key={a.id} animation={a} />
        ))}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getAnimationBySlug, getAnimations } from "@/lib/data";
import VideoPlayer from "@/components/VideoPlayer";
import AnimationCard from "@/components/AnimationCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getAnimationBySlug(slug);
  if (!a) return { title: "Animation not found" };
  return { title: a.title, description: a.description ?? undefined };
}

export default async function AnimationWatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const animation = await getAnimationBySlug(slug);
  if (!animation) notFound();

  const all = await getAnimations();
  const more = all.filter((a) => a.id !== animation.id).slice(0, 3);

  return (
    <div className="px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/animations"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-ivory"
        >
          <ArrowLeft size={16} /> All animations
        </Link>

        <VideoPlayer
          src={animation.video_url}
          poster={animation.thumbnail_url}
          title={animation.title}
        />

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl text-ivory md:text-5xl">
              {animation.title}
            </h1>
            <p className="mt-4 leading-relaxed text-ivory-muted">
              {animation.description}
            </p>
          </div>
          <div className="flex gap-6 rounded-2xl border border-black/[0.05] bg-ink-800/50 px-6 py-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-ivory-dim">Runtime</p>
              <p className="mt-1 text-ivory">{animation.duration ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-ivory-dim">Year</p>
              <p className="mt-1 text-ivory">
                {new Date(animation.created_at).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {more.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl text-ivory">Keep watching</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <AnimationCard key={a.id} animation={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

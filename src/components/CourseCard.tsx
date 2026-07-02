import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Layers } from "lucide-react";
import type { Course } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CourseCard({ course }: { course: Course }) {
  const lessonCount = course.lessons?.length ?? 0;
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-ink-800 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-cinematic"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail_url}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 90vw, 32vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute inset-0 grid place-items-center text-white/90">
          <PlayCircle size={44} className="opacity-90 transition-transform duration-500 group-hover:scale-110" />
        </span>
        {course.level && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-ivory">
            {course.level}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-ivory">{course.title}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-ivory-muted">{course.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-ivory-dim">
            <Layers size={13} /> {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
          </span>
          <span className="font-mono text-sm text-gold-deep">
            {formatPrice(course.price, course.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}

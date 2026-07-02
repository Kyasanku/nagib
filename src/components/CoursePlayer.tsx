"use client";

import { useState } from "react";
import { Play, Check, Lock } from "lucide-react";
import type { Course, CourseLesson } from "@/lib/types";
import VideoPlayer from "./VideoPlayer";

// Full player shown to enrolled students. `locked` gates non-preview lessons
// for the preview (not-enrolled) view.
export default function CoursePlayer({
  course,
  locked = false,
}: {
  course: Course;
  locked?: boolean;
}) {
  const lessons = course.lessons ?? [];
  const firstPlayable =
    lessons.find((l) => !locked || l.is_preview) ?? lessons[0];
  const [active, setActive] = useState<CourseLesson | undefined>(firstPlayable);

  const canPlay = (l: CourseLesson) => !locked || l.is_preview;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div>
        {active && canPlay(active) ? (
          <VideoPlayer src={active.video_url} poster={course.thumbnail_url} title={active.title} />
        ) : (
          <div className="grid aspect-video place-items-center rounded-3xl border border-black/[0.06] bg-ink-800 text-center">
            <div className="px-6">
              <Lock className="mx-auto text-ivory-dim" />
              <p className="mt-3 font-display text-xl text-ivory">This lesson is locked</p>
              <p className="mt-1 text-sm text-ivory-dim">Enrol to unlock every lesson.</p>
            </div>
          </div>
        )}
        {active && (
          <div className="mt-5">
            <h2 className="font-display text-2xl text-ivory">{active.title}</h2>
            {active.description && (
              <p className="mt-2 leading-relaxed text-ivory-muted">{active.description}</p>
            )}
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-black/[0.06] bg-ink-800 p-3">
        <p className="px-2 py-2 font-mono text-xs uppercase tracking-widest text-ivory-dim">
          {lessons.length} lessons
        </p>
        <ol className="space-y-1">
          {lessons.map((l, i) => {
            const isActive = active?.id === l.id;
            const playable = canPlay(l);
            return (
              <li key={l.id}>
                <button
                  onClick={() => playable && setActive(l)}
                  disabled={!playable}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    isActive ? "bg-gold/10" : "hover:bg-black/[0.04]"
                  } ${!playable ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  <span
                    className={`grid h-8 w-8 flex-none place-items-center rounded-full text-xs ${
                      isActive ? "bg-gold text-white" : "bg-black/[0.05] text-ivory-muted"
                    }`}
                  >
                    {playable ? (isActive ? <Play size={13} fill="currentColor" /> : i + 1) : <Lock size={12} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ivory">{l.title}</span>
                    <span className="block text-xs text-ivory-dim">
                      {l.is_preview && locked ? "Free preview" : l.duration ?? ""}
                    </span>
                  </span>
                  {l.is_preview && locked && <Check size={14} className="text-emerald-600" />}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}

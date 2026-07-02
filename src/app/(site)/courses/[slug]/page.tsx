import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { getCourseBySlug, findEnrollment } from "@/lib/data";
import CoursePlayer from "@/components/CoursePlayer";
import CourseBuyBox from "@/components/CourseBuyBox";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return { title: course.title, description: course.description ?? undefined };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const { slug } = await params;
  const { e } = await searchParams;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const enrolled = e ? await findEnrollment(course.id, e) : false;
  const lessons = course.lessons ?? [];
  const totalPreview = lessons.filter((l) => l.is_preview).length;

  return (
    <div className="px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/courses"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-ivory"
        >
          <ArrowLeft size={16} /> All courses
        </Link>

        {enrolled ? (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="chip border-emerald-600/20 bg-emerald-500/10 text-emerald-700">
                <Check size={13} /> Enrolled
              </span>
              <h1 className="font-display text-3xl text-ivory md:text-4xl">{course.title}</h1>
            </div>
            <CoursePlayer course={course} />
          </>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            {/* Overview + preview */}
            <div>
              {course.level && <p className="eyebrow">{course.level}</p>}
              <h1 className="mt-3 font-display text-4xl leading-tight text-ivory md:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 leading-relaxed text-ivory-muted">{course.description}</p>

              <div className="mt-8">
                <CoursePlayer course={course} locked />
              </div>
            </div>

            {/* Enrol card */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] border border-black/[0.06] bg-ink-800 p-6 shadow-cinematic">
                <h2 className="font-display text-2xl text-ivory">Enrol in this course</h2>
                <p className="mb-5 mt-1 text-sm text-ivory-dim">
                  {lessons.length} lessons
                  {totalPreview > 0 && ` · ${totalPreview} free to preview`} · lifetime access.
                </p>
                <CourseBuyBox course={course} />
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ivory-dim">
                <Clock size={13} /> Watch at your own pace, on any device.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

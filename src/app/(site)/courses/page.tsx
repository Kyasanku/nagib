import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CourseCard from "@/components/CourseCard";
import { getCourses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Courses",
  description: "Learn to paint, draw and design — self-paced video courses from the studio.",
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <PageHeader
        eyebrow="Learn in the studio"
        title="Courses"
        subtitle="Self-paced video courses on painting, drawing and character design. Buy once, watch forever."
      />

      {courses.length === 0 ? (
        <div className="mx-auto mt-12 grid max-w-xl place-items-center rounded-2xl border border-dashed border-black/10 py-24 text-center">
          <p className="font-display text-2xl text-ivory">Courses are coming soon</p>
          <p className="mt-2 text-sm text-ivory-dim">Check back shortly — the first lessons are in the works.</p>
        </div>
      ) : (
        <div className="mx-auto mt-12 grid max-w-[1400px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}

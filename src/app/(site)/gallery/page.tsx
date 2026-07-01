import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GalleryGrid from "@/components/GalleryGrid";
import { getArtworks, getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse the full body of work — paintings, illustrations, character art and sketches.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [artworks, categories] = await Promise.all([
    getArtworks(),
    getCategories(),
  ]);

  return (
    <div className="px-5 pb-24 pt-32 md:px-10">
      <PageHeader
        eyebrow="The full collection"
        title="Gallery"
        subtitle="Every piece, in one place. Filter by discipline or availability and step closer to the work."
      />
      <div className="mt-12">
        <GalleryGrid
          artworks={artworks}
          categories={categories}
          initialCategory={params.category}
        />
      </div>
    </div>
  );
}

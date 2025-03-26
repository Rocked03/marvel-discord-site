import type { GalleryEntry } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatGalleryEntryTitle } from ".";
import { defaultMetadata } from "@/lib/metadata";

export interface GalleryPageProps {
  searchParams: { slide?: string };
}

interface GalleryPageBaseProps extends GalleryPageProps {
  galleryEntries: GalleryEntry[];
}

// Server-side Metadata Generation
export async function generateMetadataBase({
  searchParams,
  galleryEntries,
}: GalleryPageBaseProps): Promise<Metadata> {
  const slideTitle = searchParams.slide;

  if (!slideTitle) {
    return {
      title: "Marvel Discord Gallery",
      description: "Explore the gallery archive of the Marvel Discord.",
    };
  }

  const entry = galleryEntries.find(
    (entry) => formatGalleryEntryTitle(entry.title) === slideTitle
  );

  if (!entry) return notFound(); // Handle case where slide doesn't exist

  return {
    ...defaultMetadata,
    title: `${entry.title} - Gallery`,
    description: entry.description || "View this gallery entry.",
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${entry.title} - Gallery`,
      description: entry.description || "View this gallery entry.",
      siteName: "Marvel Discord - Gallery",
      images:
        entry.imageUrls.length > 0 ? [{ url: entry.imageUrls[0] }] : undefined,
    },
  };
}

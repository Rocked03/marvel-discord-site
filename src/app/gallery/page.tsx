import { generateMetadataBase } from "@/utils/gallery";
import GalleryPage from "./gallery-page";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  return await generateMetadataBase({ searchParams, galleryEntries: [] });
}

export default function Gallery() {
  <GalleryPage />;
}

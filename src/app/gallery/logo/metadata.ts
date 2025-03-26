import {
  type GalleryPageProps,
  generateMetadataBase,
} from "@/components/gallery";
import { galleryEntries } from "./entries";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: GalleryPageProps): Promise<Metadata> {
  return await generateMetadataBase({ searchParams, galleryEntries });
}

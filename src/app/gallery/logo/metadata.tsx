import {
  type GalleryPageProps,
  generateMetadataBase,
} from "@/components/gallery";
import { galleryEntries } from "./entries";

export async function generateMetadata({ searchParams }: GalleryPageProps) {
  return await generateMetadataBase({ searchParams, galleryEntries });
}

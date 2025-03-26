import type { Metadata } from "next";
import Gallery from "../gallery";
import { galleryEntries } from "./entries";
import { generateMetadataBase } from "@/utils/gallery/gallery-metadata";
import { GalleryType } from "@/utils/gallery";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  return await generateMetadataBase({ searchParams, galleryEntries });
}

export default function LogoGalleryPage() {
  return (
    <Gallery galleryType={GalleryType.Logo} galleryEntries={galleryEntries} />
  );
}

"use client";

import { GalleryPage } from "@/components/gallery";
import type React from "react";
import type { GalleryType } from "@/utils/gallery";
import type { GalleryEntry } from "@/types";

export default function Gallery({
  galleryType,
  galleryEntries,
}: {
  galleryType: GalleryType;
  galleryEntries: GalleryEntry[];
}) {
  return (
    <GalleryPage galleryEntries={galleryEntries} galleryType={galleryType} />
  );
}

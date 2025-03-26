"use client";

import {
  GalleryPage,
  type GalleryPageProps,
  generateMetadataBase,
} from "@/components/gallery";
import { GalleryType } from "@/components/gallery/gallery-page";
import type React from "react";
import { galleryEntries } from "./entries";

export default function LogoGalleryPage() {
  return (
    <GalleryPage
      galleryEntries={galleryEntries}
      galleryType={GalleryType.Logo}
    />
  );
}

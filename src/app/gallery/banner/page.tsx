"use client";

import { GalleryPage } from "@/components/gallery";
import { GalleryType } from "@/components/gallery/gallery-page";
import type { GalleryEntry } from "@/types";
import type React from "react";

// Ordered by date
const galleryEntries: GalleryEntry[] = [
  {
    title: "Black Panther: Wakanda Forever",
    description:
      "Aanimated banner for the Black Panther: Wakanda Forever film.",
    imageUrls: [
      "/img/gallery/banner/Wakanda Forever 3840x2190.gif",
      "/img/gallery/banner/Wakanda Forever.png",
      "/img/gallery/logo/Wakanda Forever.png",
    ],
    date: new Date("2022-11-11"),
  },
];

export default function BannerGalleryPage() {
  return (
    <GalleryPage
      galleryEntries={galleryEntries}
      galleryType={GalleryType.Banner}
    />
  );
}

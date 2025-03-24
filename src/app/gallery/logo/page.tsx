"use client";

import { GalleryPage } from "@/components/gallery";
import { GalleryType } from "@/components/gallery/gallery-page";
import type { GalleryEntry } from "@/types";
import type React from "react";

// Ordered by date
const galleryEntries: GalleryEntry[] = [
  {
    title: "Eternals",
    description:
      "Made to coincide with the release of Marvel Studios' Eternals.",
    imageUrls: ["/img/gallery/logo/Eternals.png"],
    date: new Date("2021-11-05"),
    creator: "Rocked03",
  },
  {
    title: "Marvel Rivals",
    description:
      "Animated logo and HD wallpaper to coincide with the release of Marvel Rivals.",
    imageUrls: [
      "/img/gallery/logo/Rivals.gif",
      "/img/gallery/logo/Rivals.png",
      "/img/gallery/wallpaper/Marvel Rivals.png",
      "/img/gallery/wallpaper/Marvel Rivals rivals icon.png",
    ],
    previewImageIndex: 1,
    date: new Date("2024-12-06"),
    creator: "Rocked03",
  },
];

export default function LogoGalleryPage() {
  return (
    <GalleryPage
      galleryEntries={galleryEntries}
      galleryType={GalleryType.Logo}
    />
  );
}

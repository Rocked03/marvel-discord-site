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
    title: "Ms. Marvel",
    description:
      "Series of animated logos and banner for the D+ series Ms. Marvel.",
    imageUrls: [
      "/img/gallery/logo/Ms Marvel.gif",
      "/img/gallery/logo/Ms Marvel Kamala 1 sticker.gif",
      "/img/gallery/logo/Ms Marvel Kamala 2 sticker.gif",
      "/img/gallery/logo/Ms Marvel Carol 1 sticker.gif",
      "/img/gallery/logo/Ms Marvel Carol 2 sticker.gif",
      "/img/gallery/logo/Ms Marvel Red Dagger.gif",
      "/img/gallery/logo/Ms Marvel Pencil.gif",
      "/img/gallery/logo/Ms Marvel POW sticker.gif",
      "/img/gallery/banner/Ms Marvel.png",
      "/img/gallery/banner/Ms Marvel w stickers.png",
    ],
    date: new Date("2022-06-08"),
    creator: "Rocked03",
  },
  {
    title: "Black Panther: Wakanda Forever",
    description:
      "Logo and animated banner for the Black Panther: Wakanda Forever film.",
    imageUrls: [
      "/img/gallery/logo/Wakanda Forever.png",
      "/img/gallery/banner/Wakanda Forever 3840x2190.gif",
      "/img/gallery/banner/Wakanda Forever.png",
    ],
    date: new Date("2022-11-11"),
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

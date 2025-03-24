"use client";

import { GalleryPage } from "@/components/gallery";
import { GalleryType } from "@/components/gallery/gallery-page";
import type { GalleryEntry } from "@/types";
import type React from "react";

// Ordered by date
const galleryEntries: GalleryEntry[] = [
  {
    title: "Marvel Discord",
    description: "Marvel Discord general banner.",
    imageUrls: [
      "/img/gallery/banner/Banner centred text.png",
      "/img/gallery/banner/Banner new.png",
      "/img/gallery/banner/Minimal.png",
      "/img/gallery/logo/Base logo 2.png",
      "/img/gallery/logo/Logo with full icon.png",
      "/img/gallery/logo/Base logo.png",
    ],
    date: new Date("2017-02-16"),
    creator: "Rocked03",
  },
  {
    title: "Hawkeye",
    description:
      "Banners and logos for the Hawkeye series. Includes art by David Aja.",
    imageUrls: [
      "/img/gallery/banner/Hawkeye light.png",
      "/img/gallery/banner/Hawkeye dark.png",
      "/img/gallery/logo/Hawkeye (2).png",
      "/img/gallery/logo/Hawkeye.png",
    ],
    date: new Date("2021-11-24"),
    creator: "Rocked03",
  },
  {
    title: "Ms. Marvel",
    description:
      "Banner and series of animated logos for the Ms. Marvel series.",
    imageUrls: [
      "/img/gallery/banner/Ms Marvel w stickers.png",
      "/img/gallery/banner/Ms Marvel.png",
      "/img/gallery/logo/Ms Marvel.gif",
      "/img/gallery/logo/Ms Marvel Kamala 1 sticker.gif",
      "/img/gallery/logo/Ms Marvel Kamala 2 sticker.gif",
      "/img/gallery/logo/Ms Marvel Carol 1 sticker.gif",
      "/img/gallery/logo/Ms Marvel Carol 2 sticker.gif",
      "/img/gallery/logo/Ms Marvel Red Dagger.gif",
      "/img/gallery/logo/Ms Marvel Pencil.gif",
      "/img/gallery/logo/Ms Marvel POW sticker.gif",
    ],
    date: new Date("2022-06-08"),
    creator: "Rocked03",
  },
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
    creator: "Rocked03",
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

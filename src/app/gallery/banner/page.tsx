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
    title: "Marvel Comics",
    description: "Various banners themed with monthly comics.",
    imageUrls: [
      "/img/gallery/banner/X-Men.png",
      "/img/gallery/banner/Jan 2020.png",
      "/img/gallery/banner/Mar 2020.png",
      "/img/gallery/banner/Apr 2020.png",
      "/img/gallery/banner/Dec 2020.png",
      "/img/gallery/banner/Feb 2021.png",
      "/img/gallery/banner/Mar 2021.png",
      "/img/gallery/banner/Apr 2021.png",
    ],
    date: new Date("2020-01-01"),
    creator: "Rocked03",
  },
  {
    title: "Pride Month 2021",
    description: "Banners for Pride Month in 2021.",
    imageUrls: [
      "/img/gallery/banner/Pride 1.png",
      "/img/gallery/banner/Pride 2.png",
    ],
    date: new Date("2021-06-01"),
    creator: "Rocked03",
  },
  {
    title: "Hellfire Gala 2021",
    description:
      "Banners and logos for the 2021 Hellfire Gala event in the comics",
    imageUrls: [
      "/img/gallery/banner/Hellfire Gala 3.png",
      "/img/gallery/banner/Hellfire Gala 2.png",
      "/img/gallery/banner/Hellfire Gala.png",
      "/img/gallery/logo/Hellfire Gala 4.png",
      "/img/gallery/logo/Hellfire Gala 3.png",
      "/img/gallery/logo/Hellfire Gala 2.png",
      "/img/gallery/logo/Hellfire Gala 1.png",
    ],
    date: new Date("2021-06-02"),
    creator: "Rocked03",
  },
  {
    title: "Independence Day 2021",
    description: "Banner for Independence Day in 2021.",
    imageUrls: ["/img/gallery/banner/July 4 2021.png"],
    date: new Date("2021-07-04"),
    creator: "Rocked03",
  },
  {
    title: "Black Widow",
    description: "Banner and logo for the Black Widow film.",
    imageUrls: [
      "/img/gallery/banner/Black Widow.png",
      "/img/gallery/logo/Black Widow.png",
      "/img/gallery/logo/BW and Loki.gif",
    ],
    date: new Date("2021-07-09"),
    creator: "Rocked03",
  },
  {
    title: "What If...? S1",
    description:
      "Banner and series of logos for season 1 of the What If...? series.",
    imageUrls: [
      "/img/gallery/banner/What If.png",
      "/img/gallery/logo/What If.png",
      "/img/gallery/logo/What If Captain Carter.png",
      "/img/gallery/logo/What If T'Challa Star Lord.png",
      "/img/gallery/logo/What If Fury.png",
      "/img/gallery/logo/What If Doctor Strange.png",
      "/img/gallery/logo/What If Zombies.png",
      "/img/gallery/logo/What If Killmonger.png",
      "/img/gallery/logo/What If Thor.png",
      "/img/gallery/logo/What If Avengers.png",
    ],
    date: new Date("2021-08-11"),
    creator: "Rocked03",
  },
  {
    title: "Shang-Chi and the Legend of the Ten Rings",
    description:
      "Banner for the Shang-Chi and the Legend of the Ten Rings film.",
    imageUrls: [
      "/img/gallery/banner/Shang-Chi.png",
      "/img/gallery/banner/Shang-Chi white bg.png",
    ],
    date: new Date("2021-09-03"),
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
    description: "Animated banner for the Black Panther: Wakanda Forever film.",
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

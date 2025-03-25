"use client";

import { GalleryPage } from "@/components/gallery";
import { GalleryType } from "@/components/gallery/gallery-page";
import type { GalleryEntry } from "@/types";
import type React from "react";

// Ordered by date
const galleryEntries: GalleryEntry[] = [
  {
    title: "Pride Month 2024",
    description:
      "HD wallpaper celebrating Pride Month in 2024, featuring many of Marvel's LGBTQ+ characters.",
    imageUrls: [
      "/img/gallery/wallpaper/Pride 2024.png",
      "/img/gallery/logo/Pride 2024.png",
    ],
    date: new Date("2024-06-01"),
    creator: "Rocked03",
  },
  {
    title: "Deadpool & Wolverine",
    description:
      "HD wallpaper featuring Deadpool and Wolverine in comics and the 2024 film, alongside familiar comic faces from Wade and Logan's world.",
    imageUrls: [
      "/img/gallery/wallpaper/Deadpool & Wolverine.png",
      "/img/gallery/logo/Deadpool & Wolverine.gif",
      "/img/gallery/logo/Deadpool & Wolverine.png",
    ],
    date: new Date("2024-07-26"),
    creator: "Rocked03",
  },
  {
    title: "Venom: The Last Dance",
    description:
      "HD wallpaper featuring the many symbiotes of Marvel Comics, alongside Venom from The Last Dance.",
    imageUrls: [
      "/img/gallery/wallpaper/Venom The Last Dance.png",
      "/img/gallery/logo/Venom 3.png",
    ],
    date: new Date("2024-10-25"),
    creator: "Rocked03",
  },
  {
    title: "Marvel Rivals",
    description:
      "HD wallpaper featuring all 33 heroes Marvel Rivals available on launch.",
    imageUrls: [
      "/img/gallery/wallpaper/Marvel Rivals.png",
      "/img/gallery/wallpaper/Marvel Rivals rivals icon.png",
      "/img/gallery/logo/Rivals.gif",
      "/img/gallery/logo/Rivals.png",
    ],
    date: new Date("2024-12-06"),
    creator: "Rocked03",
  },
  {
    title: "2024 in Review",
    description:
      "HD wallpaper collage featuring many Marvel highlights from 2024.",
    imageUrls: ["/img/gallery/wallpaper/2024 Banner.png"],
    date: new Date("2024-12-31"),
    creator: "Rocked03",
  },
];

export default function WallpaperGalleryPage() {
  return (
    <GalleryPage
      galleryEntries={galleryEntries}
      galleryType={GalleryType.Wallpaper}
    />
  );
}

"use client";

import { GalleryPage } from "@/components/gallery";
import { GalleryType } from "@/components/gallery/gallery-page";
import type { GalleryEntry } from "@/types";
import type React from "react";

// Ordered by date
const galleryEntries: GalleryEntry[] = [
  {
    title: "Marvel Discord",
    description: "Base logo for the Marvel Discord server.",
    imageUrls: [
      "/img/gallery/logo/Logo with full icon.png",
      "/img/gallery/logo/Base logo.png",
      "/img/gallery/logo/Base logo 2.png",
    ],
    date: new Date("2017-02-16"),
    creator: "Rocked03",
  },
  {
    title: "Marvel Discord Moderation",
    description: "Various logos used for the Marvel Discord server.",
    imageUrls: [
      "/img/gallery/logo/Mailbox 2.png",
      "/img/gallery/logo/Mod server.png",
      "/img/gallery/logo/Hub.png",
      "/img/gallery/logo/Mailbox Halloween.png",
      "/img/gallery/logo/Mod server Halloween.png",
      "/img/gallery/logo/Hub Halloween.png",
    ],
    date: new Date("2017-02-17"),
    creator: "Rocked03",
  },
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
      "Series of animated logos and banner for the Ms. Marvel series.",
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
    title: "Across the Spider-Verse",
    description: "Selection of logos for the Across the Spider-Verse film.",
    imageUrls: [
      "/img/gallery/logo/Across the Spider-Verse 3.png",
      "/img/gallery/logo/Across the Spider-Verse 2.png",
      "/img/gallery/logo/Across the Spider-Verse 1.png",
    ],
    date: new Date("2023-06-02"),
    creator: "Krazkat",
  },
  {
    title: "Secret Invasion",
    description:
      "Animated logo and HD wallpaper for the Secret Invasion series.",
    imageUrls: [
      "/img/gallery/logo/Secret Invasion 2.jpg",
      "/img/gallery/logo/Secret Invasion 1.jpg",
    ],
    date: new Date("2023-06-21"),
    creator: "Krazkat",
  },
  {
    title: "Loki S2",
    description: "Logo for season 2 of the Loki series.",
    imageUrls: [
      "/img/gallery/logo/Loki S2 greyed.png",
      "/img/gallery/logo/Loki S2.png",
    ],
    date: new Date("2023-10-05"),
    creator: "Rocked03",
  },
  {
    title: "The Marvels",
    description: "Animated logo for the The Marvels film.",
    imageUrls: ["/img/gallery/logo/The Marvels.gif"],
    date: new Date("2023-11-10"),
    creator: "Rocked03",
  },
  {
    title: "What If...? S2",
    description: "Logo for season 2 of the What If...? series.",
    imageUrls: ["/img/gallery/logo/What If Christmas.png"],
    date: new Date("2023-12-15"),
    creator: "Rocked03",
  },
  {
    title: "Madame Web",
    description: "Logo for the Madame Web film.",
    imageUrls: [
      "/img/gallery/logo/Madame Web.png",
      "/img/gallery/logo/Madame Web alt.png",
    ],
    date: new Date("2024-02-14"),
    creator: "Rocked03",
  },
  {
    title: "X-Men '97 S1",
    description: "Logo for season 1 of the X-Men '97 series.",
    imageUrls: ["/img/gallery/logo/X-Men 97.png"],
    date: new Date("2024-03-20"),
    creator: "Rocked03",
  },
  {
    title: "Pride Month 2024",
    description: "Logo and wallpaper for the Pride Month 2024 event.",
    imageUrls: [
      "/img/gallery/logo/Pride 2024.png",
      "/img/gallery/wallpaper/Pride 2024.png",
    ],
    date: new Date("2024-06-01"),
    creator: "Rocked03",
  },
  {
    title: "Deadpool & Wolverine",
    description:
      "Animated logo and wallpaper for the Deadpool & Wolverine film.",
    imageUrls: [
      "/img/gallery/logo/Deadpool & Wolverine.gif",
      "/img/gallery/logo/Deadpool & Wolverine.png",
      "/img/gallery/wallpaper/Deadpool & Wolverine.png",
    ],
    date: new Date("2024-07-26"),
    creator: "Rocked03",
  },
  {
    title: "Venom: The Last Dance",
    description: "Logo and wallpaper for the Venom: The Last Dance film.",
    imageUrls: [
      "/img/gallery/logo/Venom 3.png",
      "/img/gallery/wallpaper/Venom The Last Dance.png",
    ],
    date: new Date("2024-10-25"),
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
  {
    title: "Agatha All Along",
    description: "Logo for the Agatha All Along series.",
    imageUrls: ["/img/gallery/logo/Agatha All Along.png"],
    date: new Date("2024-09-18"),
    creator: "Rocked03",
  },
  {
    title: "Captain America: Brave New World",
    description: "Animated logo for the Captain America: Brave New World film.",
    imageUrls: ["/img/gallery/logo/Cap Brave New World.gif"],
    date: new Date("2025-02-13"),
    creator: "Rocked03",
  },
  {
    title: "Daredevil: Born Again",
    description: "Logo for the Daredevil: Born Again series.",
    imageUrls: ["/img/gallery/logo/Daredevil Born Again.png"],
    date: new Date("2025-03-04"),
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

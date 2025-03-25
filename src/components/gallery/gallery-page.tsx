import type { GalleryEntry } from "@/types";
import { ContentWrapper, LinkButton } from "..";
import Carousel from "./carousel";
import Image from "next/image";
import styled from "styled-components";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export enum GalleryType {
  Logo = "Logo",
  Banner = "Banner",
  Wallpaper = "Wallpaper",
}

interface GalleryTypeTextInterface {
  title: string;
  descriptor: string;
}

const galleryTypeText: Record<GalleryType, GalleryTypeTextInterface> = {
  [GalleryType.Logo]: {
    title: "Logo Gallery",
    descriptor: "Logos",
  },
  [GalleryType.Banner]: {
    title: "Banner Gallery",
    descriptor: "Banners",
  },
  [GalleryType.Wallpaper]: {
    title: "Wallpaper Gallery",
    descriptor: "Wallpapers",
  },
};

const GalleryContentWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 400;
  font-stretch: expanded;
`;

const GalleryTypeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const GalleryTypeButton = styled(LinkButton)`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

interface GalleryPageProps {
  galleryEntries: GalleryEntry[];
  galleryType: GalleryType;
}

export default function GalleryPage({
  galleryEntries,
  galleryType,
}: GalleryPageProps) {
  return (
    <ContentWrapper>
      <GalleryContentWrapper>
        <GalleryTypeButtons>
          <GalleryTypeButton
            $isActive={galleryType === GalleryType.Logo}
            href="../logo"
          >
            <Image
              src="/img/icons/logo.svg"
              alt="Logo icon"
              width={24}
              height={24}
            />
            Logos
          </GalleryTypeButton>
          <GalleryTypeButton
            $isActive={galleryType === GalleryType.Banner}
            href="../banner"
          >
            <Image
              src="/img/icons/banner.svg"
              alt="Banner icon"
              width={24}
              height={24}
            />
            Banners
          </GalleryTypeButton>
          <GalleryTypeButton
            $isActive={galleryType === GalleryType.Wallpaper}
            href="../wallpaper"
          >
            <Image
              src="/img/icons/wallpaper.svg"
              alt="Wallpaper icon"
              width={24}
              height={24}
            />
            Wallpapers
          </GalleryTypeButton>
        </GalleryTypeButtons>
        <Carousel galleryEntries={galleryEntries} />
      </GalleryContentWrapper>
    </ContentWrapper>
  );
}

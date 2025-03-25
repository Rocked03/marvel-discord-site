import type { GalleryEntry } from "@/types";
import { ContentWrapper, LinkButton } from "..";
import Carousel from "./carousel";
import Image from "next/image";
import styled from "styled-components";
import { Suspense } from "react";

export enum GalleryType {
  Logo = "Logo",
  Banner = "Banner",
  Wallpaper = "Wallpaper",
}

interface GalleryTypeTextInterface {
  descriptor: string;
  iconUrl: string;
  path: string;
}

const galleryTypeText: Record<GalleryType, GalleryTypeTextInterface> = {
  [GalleryType.Logo]: {
    descriptor: "Logos",
    iconUrl: "/img/icons/logo.svg",
    path: "../logo",
  },
  [GalleryType.Banner]: {
    descriptor: "Banners",
    iconUrl: "/img/icons/banner.svg",
    path: "../banner",
  },
  [GalleryType.Wallpaper]: {
    descriptor: "Wallpapers",
    iconUrl: "/img/icons/wallpaper.svg",
    path: "../wallpaper",
  },
};

const GalleryContentWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GalleryTypeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  border-radius: 0.5rem;

  @media (max-width: 768px) {
    background-color: rgba(var(--foreground-rgb), 0.1);
    gap: 0rem;
  }
`;

const GalleryTypeButtonStyle = styled(LinkButton)<{ $isActiveParent: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.2rem;

  @media (max-width: 768px) {
    span {
      display: ${({ $isActiveParent }) => ($isActiveParent ? "block" : "none")};
    }
  }
`;

function GalleryTypeButton({
  galleryType,
  currentGalleryType,
}: {
  galleryType: GalleryType;
  currentGalleryType: GalleryType;
}) {
  return (
    <GalleryTypeButtonStyle
      href={galleryTypeText[galleryType].path}
      $isActive={galleryType === currentGalleryType}
      $isActiveParent={galleryType === currentGalleryType}
    >
      <Image
        src={galleryTypeText[galleryType].iconUrl}
        alt={`${galleryType} icon`}
        width={24}
        height={24}
      />
      <span>{galleryTypeText[galleryType].descriptor}</span>
    </GalleryTypeButtonStyle>
  );
}

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
          {Object.values(GalleryType).map((type) => (
            <GalleryTypeButton
              key={type}
              galleryType={type}
              currentGalleryType={galleryType}
            />
          ))}
        </GalleryTypeButtons>
        <Suspense>
          <Carousel galleryEntries={galleryEntries} />
        </Suspense>
      </GalleryContentWrapper>
    </ContentWrapper>
  );
}

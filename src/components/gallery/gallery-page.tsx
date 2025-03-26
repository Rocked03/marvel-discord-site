import type { GalleryEntry } from "@/types";
import { ContentWrapper, LinkButton } from "..";
import Carousel from "./carousel";
import styled from "styled-components";
import { Suspense } from "react";

import { Banner, Logo, Wallpaper } from "@/img/icons/icons";
import { GalleryType } from "@/utils/gallery";

interface GalleryTypeTextInterface {
  descriptor: string;
  icon: React.JSX.Element;
  path: string;
}

const galleryTypeText: Record<GalleryType, GalleryTypeTextInterface> = {
  [GalleryType.Logo]: {
    descriptor: "Logos",
    icon: <Logo />,
    path: "../logo",
  },
  [GalleryType.Banner]: {
    descriptor: "Banners",
    icon: <Banner />,
    path: "../banner",
  },
  [GalleryType.Wallpaper]: {
    descriptor: "Wallpapers",
    icon: <Wallpaper />,
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

const GalleryTypeButtonStyle = styled(LinkButton)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.2rem;

  background-color: ${({ $isActive }) =>
    $isActive ? "var(--highlight)" : "transparent"};
  color: ${({ $isActive }) =>
    $isActive ? "var(--highlight-foreground)" : "var(--foreground)"};
  stroke: ${({ $isActive }) =>
    $isActive ? "var(--highlight-foreground)" : "var(--foreground)"};

  svg path {
    stroke: inherit;
  }

  &:hover {
    ${({ $isActive }) =>
      $isActive && "background-color: rgba(var(--highlight-rgb), 0.6)"};
  }

  @media (max-width: 768px) {
    span {
      display: ${({ $isActive }) => ($isActive ? "block" : "none")};
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
    >
      {galleryTypeText[galleryType].icon}
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

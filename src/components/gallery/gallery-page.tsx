import type { GalleryEntry } from "@/types";
import { Button, ContentWrapper, LinkButton } from "..";
import Carousel from "./carousel";
import styled from "styled-components";
import { Image } from "lucide-react";

export enum GalleryType {
  Logo = "Logo",
  Banner = "Banner",
  Wallpaper = "Wallpaper",
}

const GalleryContentWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 400;
  font-stretch: expanded;
`;

const GalleryTypeButtons = styled.div`
  display: flex;
  background-color: rgba(var(--foreground-rgb), 0.1);
  border-radius: 0.5rem;
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
        <Title>{galleryType.toString()} Gallery</Title>
        <GalleryTypeButtons>
          <LinkButton
            isActive={galleryType === GalleryType.Logo}
            href="../logo"
          >
            <Image />
          </LinkButton>
          <LinkButton
            isActive={galleryType === GalleryType.Banner}
            href="../banner"
          >
            <Image />
          </LinkButton>
          <LinkButton
            isActive={galleryType === GalleryType.Wallpaper}
            href="../wallpaper"
          >
            <Image />
          </LinkButton>
        </GalleryTypeButtons>
        <Carousel galleryEntries={galleryEntries} />
      </GalleryContentWrapper>
    </ContentWrapper>
  );
}

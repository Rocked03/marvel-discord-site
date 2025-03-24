import type { GalleryEntry } from "@/types";
import { ContentWrapper, LinkButton } from "..";
import Carousel from "./carousel";
import styled from "styled-components";
import { Image } from "lucide-react";
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
  background-color: rgba(var(--foreground-rgb), 0.1);
  border-radius: 0.5rem;
  gap: 0.1rem;
`;

const TippyStyled = styled(Tippy)`
  font-family: var(--font-family);
  font-weight: 300;
`;

function TabButton({
  galleryType,
  currentGalleryType,
  href,
  children,
}: {
  galleryType: GalleryType;
  currentGalleryType: GalleryType;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <TippyStyled
      content={<span>{galleryTypeText[galleryType].descriptor}</span>}
      interactive={true}
      interactiveBorder={20}
      delay={100}
      arrow={true}
    >
      <LinkButton isActive={galleryType === currentGalleryType} href={href}>
        {children}
      </LinkButton>
    </TippyStyled>
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
        <TitleWrapper>
          <Title>{galleryTypeText[galleryType].title}</Title>
          <GalleryTypeButtons>
            <TabButton
              galleryType={GalleryType.Logo}
              currentGalleryType={galleryType}
              href="../logo"
            >
              <Image />
            </TabButton>
            <TabButton
              galleryType={GalleryType.Banner}
              currentGalleryType={galleryType}
              href="../banner"
            >
              <Image />
            </TabButton>
            <TabButton
              galleryType={GalleryType.Wallpaper}
              currentGalleryType={galleryType}
              href="../wallpaper"
            >
              <Image />
            </TabButton>
          </GalleryTypeButtons>
        </TitleWrapper>
        <Carousel galleryEntries={galleryEntries} />
      </GalleryContentWrapper>
    </ContentWrapper>
  );
}

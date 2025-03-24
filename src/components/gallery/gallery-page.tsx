import type { GalleryEntry } from "@/types";
import { ContentWrapper } from "..";
import Carousel from "./carousel";
import styled from "styled-components";

const GalleryContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

export default function GalleryPage({
  galleryEntries,
}: {
  galleryEntries: GalleryEntry[];
}) {
  return (
    <ContentWrapper>
      <GalleryContentWrapper>
        <Carousel galleryEntries={galleryEntries} />
      </GalleryContentWrapper>
    </ContentWrapper>
  );
}

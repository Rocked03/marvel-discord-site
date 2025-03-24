"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import styled from "styled-components";
import Image from "next/image";
import type { GalleryEntry } from "@/types";

const EmblaWrapper = styled.div`
  overflow: hidden;
  border-radius: 1rem;
`;

const EmblaContainer = styled.div`
  display: flex;
  gap: 3rem;
`;

const EmblaSlide = styled.div`
  flex: 0 0 40%;
  max-width: 100%;
  transition: opacity 0.3s ease;

  &:not(.is-snapped) {
    opacity: 0.16;
  }
`;

const EmblaImage = styled(Image)`
  border-radius: 1rem;
  display: block;
  height: auto;
  object-fit: contain;
  width: 100%;
`;

interface CarouselProps {
  galleryEntries: GalleryEntry[];
}

export default function Carousel({ galleryEntries }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel(
    {
      align: "center",
      dragFree: false,
      loop: false,
      containScroll: false,
    },
    [ClassNames()]
  );

  return (
    <EmblaWrapper ref={emblaRef}>
      <EmblaContainer>
        {galleryEntries.map((entry) => (
          <EmblaSlide key={entry.title}>
            <EmblaImage
              src={entry.imageUrls[0]}
              alt={entry.title}
              width={1000}
              height={1000}
            />
          </EmblaSlide>
        ))}
      </EmblaContainer>
    </EmblaWrapper>
  );
}

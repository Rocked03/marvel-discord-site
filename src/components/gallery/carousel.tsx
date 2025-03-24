"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import styled from "styled-components";
import Image from "next/image";
import type { GalleryEntry } from "@/types";
import { formatDate } from "@/utils";

const GalleryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const EntryDetails = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-width: 30rem;
  text-align: center;
`;

const EntryTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  font-stretch: expanded;
`;

const EntrySubtext = styled.p`
  font-size: 0.9rem;
  font-weight: 300;
`;

const EntryDescription = styled.p`
  font-size: 1rem;
`;

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
`;

const EmblaImage = styled(Image)`
  border-radius: 1rem;
  display: block;
  height: auto;
  object-fit: contain;
  width: 100%;
`;

const MainEmblaContainer = styled(EmblaContainer)``;

const MainEmblaSlide = styled(EmblaSlide)`
  &:not(.is-snapped) {
    opacity: 0.16;
  }
`;

const MainEmblaImage = styled(EmblaImage)``;

const AdditionalEmblaContainer = styled(EmblaContainer)`
  gap: 1rem;
`;

const AdditionalEmblaSlide = styled(EmblaSlide)`
  flex: 0 0 auto;
  max-height: 20rem;
`;

const AdditionalEmblaImage = styled(EmblaImage)`
  max-height: 15rem;
`;

interface CarouselProps {
  galleryEntries: GalleryEntry[];
}

export default function Carousel({ galleryEntries }: CarouselProps) {
  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel(
    {
      align: "center",
      dragFree: false,
      loop: false,
      containScroll: false,
    },
    [ClassNames()]
  );

  const [additionalEmblaRef] = useEmblaCarousel(
    {
      align: "center",
      dragFree: false,
      loop: false,
      containScroll: false,
    },
    [ClassNames()]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedEntry = galleryEntries[selectedIndex];
  const entryAdditionalImages = selectedEntry.imageUrls.slice(1);

  useEffect(() => {
    if (!mainEmblaApi) return;

    const onSelect = () => {
      setSelectedIndex(mainEmblaApi.selectedScrollSnap());
    };

    mainEmblaApi.on("select", onSelect);
    onSelect();

    return () => {
      mainEmblaApi.off("select", onSelect);
    };
  }, [mainEmblaApi]);

  return (
    <GalleryWrapper>
      <EmblaWrapper ref={mainEmblaRef}>
        <MainEmblaContainer>
          {galleryEntries.map((entry) => (
            <MainEmblaSlide key={entry.title}>
              <MainEmblaImage
                src={entry.imageUrls[0]}
                alt={entry.title}
                width={1000}
                height={1000}
              />
            </MainEmblaSlide>
          ))}
        </MainEmblaContainer>
      </EmblaWrapper>
      <EntryDetails>
        <EntryTitle>{selectedEntry.title}</EntryTitle>
        {selectedEntry.date || selectedEntry.creator ? (
          <EntrySubtext>
            {[
              selectedEntry.date && formatDate(selectedEntry.date),
              selectedEntry.creator && `Made by ${selectedEntry.creator}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </EntrySubtext>
        ) : null}
        {selectedEntry.description && (
          <EntryDescription>{selectedEntry.description}</EntryDescription>
        )}
      </EntryDetails>
      {entryAdditionalImages.length > 0 && (
        <EmblaWrapper ref={additionalEmblaRef}>
          <AdditionalEmblaContainer>
            {entryAdditionalImages.map((entry) => (
              <AdditionalEmblaSlide key={entry}>
                <AdditionalEmblaImage
                  src={entry}
                  alt={selectedEntry.title}
                  width={1000}
                  height={1000}
                />
              </AdditionalEmblaSlide>
            ))}
          </AdditionalEmblaContainer>
        </EmblaWrapper>
      )}
    </GalleryWrapper>
  );
}

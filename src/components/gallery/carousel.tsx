"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import styled from "styled-components";
import Image from "next/image";

import type { GalleryEntry } from "@/types";
import { formatDate } from "@/utils";
import { Download, ExternalLink } from "lucide-react";

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
  width: 100%;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
`;

const AdditionalEmblaImage = styled(EmblaImage)`
  max-height: 15rem;
`;

const ImageButtons = styled.div<{ $isVisible: boolean }>`
  display: flex;
  gap: 0.5rem;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? "auto" : "none")};
  transition: opacity 0.2s ease;
`;

const ImageButton = styled.a`
  align-items: center;
  border-radius: 0.5rem;
  color: var(--foreground);
  cursor: pointer;
  display: flex;
  height: 2rem;
  justify-content: center;
  transition: background-color 0.2s ease;
  width: 4rem;

  &:hover {
    background-color: rgba(var(--foreground-rgb), 0.3);
  }
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

  const [additionalEmblaRef, additionalEmblaApi] = useEmblaCarousel(
    {
      align: "center",
      dragFree: false,
      loop: false,
      containScroll: false,
    },
    [ClassNames()]
  );

  const [mainSelectedIndex, setMainSelectedIndex] = useState(0);
  const [additionalSelectedIndex, setAdditionalSelectedIndex] = useState(0);
  const selectedEntry = galleryEntries[mainSelectedIndex];

  useEffect(() => {
    if (!mainEmblaApi) return;

    const onSelect = () => {
      setMainSelectedIndex(mainEmblaApi.selectedScrollSnap());
    };

    mainEmblaApi.on("select", onSelect);
    onSelect();

    return () => {
      mainEmblaApi.off("select", onSelect);
    };
  }, [mainEmblaApi]);

  useEffect(() => {
    if (!additionalEmblaApi) return;

    const onSelect = () => {
      setAdditionalSelectedIndex(additionalEmblaApi.selectedScrollSnap());
    };

    additionalEmblaApi.on("select", onSelect);
    onSelect();

    return () => {
      additionalEmblaApi.off("select", onSelect);
    };
  }, [additionalEmblaApi]);

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
      {
        <EmblaWrapper ref={additionalEmblaRef}>
          <AdditionalEmblaContainer>
            {selectedEntry.imageUrls.map((entry, index) => (
              <AdditionalEmblaSlide key={entry}>
                <AdditionalEmblaImage
                  src={entry}
                  alt={selectedEntry.title}
                  width={1000}
                  height={1000}
                />
                <ImageButtons $isVisible={index === additionalSelectedIndex}>
                  <ImageButton href={entry} target="_blank" download>
                    <Download />
                  </ImageButton>
                  <ImageButton href={entry} target="_blank">
                    <ExternalLink />
                  </ImageButton>
                </ImageButtons>
              </AdditionalEmblaSlide>
            ))}
          </AdditionalEmblaContainer>
        </EmblaWrapper>
      }
    </GalleryWrapper>
  );
}

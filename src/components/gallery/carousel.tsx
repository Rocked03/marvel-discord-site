"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import styled from "styled-components";

import type { GalleryEntry } from "@/types";
import { formatDate } from "@/utils";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { EmblaContainer, EmblaSlide, EmblaImage, EmblaWrapper } from "./embla";
import { Button, LinkButton } from "../button";

const GalleryWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100%;
`;

const EntryDetails = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  width: 30rem;

  @media (max-width: 768px) {
    max-width: calc(100vw - 2rem);
  }
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

const GalleryDetails = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    .slide-button {
      display: none;
    }
  }
`;

const ThumbEmblaContainer = styled(EmblaContainer)`
  gap: 0.6rem;
`;

const ThumbEmblaSlide = styled(EmblaSlide)`
  flex: 0 0 auto;
  max-width: 8%;

  &:not(.is-snapped) {
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    max-width: min(80%);
  }
`;

const ThumbEmblaImage = styled(EmblaImage)`
  max-height: 30rem;

  @media (max-width: 768px) {
    max-height: 20rem;
  }
`;

const MainEmblaContainer = styled(EmblaContainer)`
  gap: 1rem;
`;

const MainEmblaSlide = styled(EmblaSlide)`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  max-width: 80%;
`;

const MainEmblaImage = styled(EmblaImage)`
  max-height: 30rem;

  @media (max-width: 768px) {
    max-height: 10rem;
  }
`;

const ImageButtons = styled.div<{ $isVisible: boolean }>`
  display: flex;
  gap: 0.5rem;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? "auto" : "none")};
  transition: opacity 0.2s ease;
`;

interface CarouselProps {
  galleryEntries: GalleryEntry[];
}

export default function Carousel({ galleryEntries }: CarouselProps) {
  galleryEntries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const [thumbEmblaRef, thumbEmblaApi] = useEmblaCarousel(
    {
      align: "center",
      dragFree: false,
      loop: false,
      containScroll: false,
    },
    [ClassNames()]
  );

  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel(
    {
      align: "center",
      dragFree: false,
      loop: false,
      containScroll: false,
    },
    [ClassNames()]
  );

  const [thumbSelectedIndex, setThumbSelectedIndex] = useState(0);
  const [mainSelectedIndex, setMainSelectedIndex] = useState(0);
  const selectedEntry = galleryEntries[thumbSelectedIndex];

  useEffect(() => {
    if (!thumbEmblaApi) return;

    const onSelect = () => {
      setThumbSelectedIndex(thumbEmblaApi.selectedScrollSnap());
    };

    thumbEmblaApi.on("select", onSelect);
    onSelect();

    return () => {
      thumbEmblaApi.off("select", onSelect);
    };
  }, [thumbEmblaApi]);

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
    if (!thumbEmblaApi) return;

    const onThumbSelect = () => {
      setThumbSelectedIndex(thumbEmblaApi.selectedScrollSnap());
      setMainSelectedIndex(0);
      mainEmblaApi?.scrollTo(0, true);
    };

    thumbEmblaApi.on("select", onThumbSelect);
    onThumbSelect();

    return () => {
      thumbEmblaApi.off("select", onThumbSelect);
    };
  }, [thumbEmblaApi, mainEmblaApi]);

  return (
    <GalleryWrapper>
      <EmblaWrapper ref={thumbEmblaRef}>
        <ThumbEmblaContainer>
          {galleryEntries.map((entry, index) => (
            <ThumbEmblaSlide key={entry.title}>
              <button
                type="button"
                onClick={() => {
                  thumbEmblaApi?.scrollTo(index);
                  mainEmblaApi?.scrollTo(0);
                }}
              >
                <ThumbEmblaImage
                  src={entry.imageUrls[entry.previewImageIndex ?? 0]}
                  alt={entry.title}
                  width={1000}
                  height={1000}
                  unoptimized={entry.imageUrls[0].endsWith(".gif")}
                />
              </button>
            </ThumbEmblaSlide>
          ))}
        </ThumbEmblaContainer>
      </EmblaWrapper>

      <EmblaWrapper ref={mainEmblaRef}>
        <MainEmblaContainer>
          {selectedEntry.imageUrls.map((entry, index) => (
            <MainEmblaSlide key={entry}>
              <MainEmblaImage
                src={entry}
                alt={selectedEntry.title}
                width={1000}
                height={1000}
                unoptimized={entry.endsWith(".gif")}
              />
              <ImageButtons $isVisible={index === mainSelectedIndex}>
                <LinkButton href={entry} target="_blank" download>
                  <Download />
                </LinkButton>
                <LinkButton href={entry} target="_blank">
                  <ExternalLink />
                </LinkButton>
              </ImageButtons>
            </MainEmblaSlide>
          ))}
        </MainEmblaContainer>
      </EmblaWrapper>

      <GalleryDetails>
        <Button
          onClick={() => thumbEmblaApi?.scrollPrev()}
          className={"slide-button"}
        >
          <ChevronLeft />
        </Button>

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

        <Button
          onClick={() => thumbEmblaApi?.scrollNext()}
          className={"slide-button"}
        >
          <ChevronRight />
        </Button>
      </GalleryDetails>
    </GalleryWrapper>
  );
}

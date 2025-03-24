import styled from "styled-components";
import Image from "next/image";

export const EmblaWrapper = styled.div`
  overflow: hidden;
  border-radius: 1rem;
  width: 100%;
`;

export const EmblaContainer = styled.div`
  display: flex;
  gap: 3rem;
`;

export const EmblaSlide = styled.div`
  flex: 0 0 40%;
  max-width: 100%;
  transition: opacity 0.3s ease;
`;

export const EmblaImage = styled(Image)`
  border-radius: 1rem;
  display: block;
  height: auto;
  object-fit: contain;
  width: 100%;
`;

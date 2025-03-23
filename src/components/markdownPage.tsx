import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote/rsc";
import styled from "styled-components";
import Link from "next/link";
import { ContentWrapper } from "@/components";
import config from "@/app/config/config";

const TextWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const Header = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  font-stretch: expanded;
`;

const Subheader = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  font-variation-settings: "slnt" -10;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  gap: 1rem;

  ol,
  ul {
    padding-inline-start: 2rem;
    line-height: 1.5;
  }
`;

const LinkStyled = styled(Link)`
  color: var(--highlight);

  &:hover {
    text-decoration: underline;
  }
`;

const mdxComponents = {
  h1: Header,
  h2: Subheader,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <TextContent as="p" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <TextContent as="ol" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <TextContent as="ul" {...props} />
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <LinkStyled
      href={
        href === "POST_OFFICE_LINK"
          ? config.postOfficeInviteUrl || "#"
          : href || "#"
      }
    >
      {children}
    </LinkStyled>
  ),
};

export default function MarkdownPage({ markdown }: { markdown: string }) {
  return (
    <ContentWrapper>
      <TextWrapper>
        <MDXRemote source={markdown} components={mdxComponents} />
      </TextWrapper>
    </ContentWrapper>
  );
}

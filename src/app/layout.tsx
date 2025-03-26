import type { Metadata, Viewport } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { defaultMetadata, defaultViewport } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}

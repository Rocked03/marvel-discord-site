import {
	type GalleryPageProps,
	generateMetadataBase,
} from "@/components/gallery";
import { galleryEntries } from "./entries";
import type { Metadata } from "next";

export async function generateMetadata({
	searchParams,
}: GalleryPageProps): Promise<Metadata> {
	if (galleryEntries.length > 0) {
		return {
			title: "aaaaaaMarvel Discord",
			description:
				"Taaaahe largest community-run server for everything Marvel.",
			openGraph: {
				title: "Maaaaaarvel Discord",
				description:
					"The aaaaaalargest community-run server for everything Marvel.",
				siteName: "Marvaaaaaaaaael Discord",
			},
			icons: {
				icon: [{ url: "/img/gallery/logo/Logo with full icon.png" }],
			},
		};
	}
	return await generateMetadataBase({ searchParams, galleryEntries });
}

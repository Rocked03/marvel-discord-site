import type { GalleryEntry } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defaultMetadata } from "@/lib/metadata";
import { formatGalleryEntryTitle, relativeImagePathToAbsolute } from "@/utils";

export interface GalleryPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface GalleryPageBaseProps extends GalleryPageProps {
	galleryEntries: GalleryEntry[];
}

// Server-side Metadata Generation
export async function generateMetadataBase({
	searchParams,
	galleryEntries,
}: GalleryPageBaseProps): Promise<Metadata> {
	const metadata: Metadata = {
		...defaultMetadata,
		title: "Marvel Discord Gallery",
		description: "Explore the gallery archive of the Marvel Discord.",
		openGraph: {
			...defaultMetadata.openGraph,
			title: "Marvel Discord Gallery",
			description: "Explore the gallery archive of the Marvel Discord.",
		},
	};

	const resolvedSearchParams = await searchParams;
	const slideTitle = resolvedSearchParams.slide;

	if (!slideTitle) {
		return metadata;
	}

	const entry = galleryEntries.find(
		(entry) => formatGalleryEntryTitle(entry.title) === slideTitle,
	);

	if (!entry) return notFound(); // Handle case where slide doesn't exist

	return {
		...metadata,
		title: `${entry.title} - Gallery`,
		description: entry.description || "View this gallery entry.",
		openGraph: {
			type: "article",
			title: `${entry.title} - Gallery`,
			description: entry.description || "View this gallery entry.",
			images:
				entry.imageUrls.length > 0
					? relativeImagePathToAbsolute(entry.imageUrls[0])
					: undefined,
		},
	};
}

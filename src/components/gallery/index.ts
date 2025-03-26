export { default as GalleryPage } from "./gallery-page";
export { generateMetadataBase } from "./metadata";
export type { GalleryPageProps } from "./metadata";

export function formatGalleryEntryTitle(title: string) {
	return title
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.replace(/ /g, "-")
		.toLowerCase();
}

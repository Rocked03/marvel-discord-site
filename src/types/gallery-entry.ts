export default interface GalleryEntry {
	title: string;
	description?: string;

	// First image is the main image
	imageUrls: string[];
	// If defined, the index of the image to show in the preview (data saving for gifs, etc)
	previewImageIndex?: number;

	date?: Date;
	creator?: string;
}

import config from "@/app/config/config";
import type { Tag } from "@jocasta-polls-api";

export const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(date);
};

export function formatGalleryEntryTitle(title: string) {
	return title
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.replace(/ /g, "-")
		.toLowerCase();
}

export function relativeImagePathToAbsolute(relativePath: string): string {
	return `${config.publicBaseUrl}${relativePath}`;
}

export function intToColorHex(int: number): string {
	const hex = int.toString(16).padStart(6, "0");
	return `#${hex}`;
}

export function getContrastColorFromInt(color: number): string {
	const r = (color >> 16) & 0xff;
	const g = (color >> 8) & 0xff;
	const b = color & 0xff;

	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	return brightness > 128 ? "#000000" : "#ffffff";
}

export function getTagColors(tag?: Tag) {
	if (!tag) {
		return { backgroundColor: undefined, textColor: undefined };
	}

	const tagColor = tag.colour ? tag.colour : null;
	const backgroundColor = tagColor ? intToColorHex(tagColor) : "var(--red-9)";
	const textColor = tagColor ? getContrastColorFromInt(tagColor) : undefined;
	return { backgroundColor, textColor };
}

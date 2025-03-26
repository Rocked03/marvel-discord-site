import { relativeImagePathToAbsolute } from "@/utils";
import type { Metadata, Viewport } from "next";

export const defaultMetadata: Metadata = {
	title: "Marvel Discord",
	description: "The largest community-run server for everything Marvel.",
	openGraph: {
		type: "website",
		title: "Marvel Discord",
		description: "The largest community-run server for everything Marvel.",
		siteName: "Marvel Discord",
		images: [
			relativeImagePathToAbsolute("/img/gallery/logo/Logo with full icon.png"),
		],
	},
};

export const defaultViewport: Viewport = {
	themeColor: "#ea2328",
};

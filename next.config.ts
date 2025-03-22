import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	trailingSlash: true,

	compiler: {
		styledComponents: true,
	},
};

export default nextConfig;

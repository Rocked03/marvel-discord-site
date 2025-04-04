import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	trailingSlash: true,

	compiler: {
		styledComponents: true,
	},

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
};

export default nextConfig;

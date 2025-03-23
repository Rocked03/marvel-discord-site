import fs from "node:fs";
import path from "node:path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function markdownHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { file } = req.query;

	if (!file || typeof file !== "string") {
		return res
			.status(400)
			.json({ error: "Missing or invalid 'file' query parameter" });
	}

	const filePath = path.join(process.cwd(), "content", `${file}.md`);

	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: "Markdown file not found" });
	}

	const markdownContent = fs.readFileSync(filePath, "utf8");
	res.status(200).json({ content: markdownContent });
}

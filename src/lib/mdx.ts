import fs from "node:fs";
import path from "node:path";
import { serialize } from "next-mdx-remote/serialize";

export async function getMarkdownSource(fileName: string) {
	const filePath = path.join(process.cwd(), "content", `${fileName}.md`);
	const markdownContent = fs.readFileSync(filePath, "utf8");
	return await serialize(markdownContent);
}

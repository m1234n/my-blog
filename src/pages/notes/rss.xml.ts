import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { siteConfig } from "@/site.config";
import { withBase } from "@/utils/path";

export const GET = async () => {
	const notes = await getCollection("note");

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: new URL(import.meta.env.BASE_URL, import.meta.env.SITE).href,
		items: notes.map((note) => ({
			title: note.data.title,
			pubDate: note.data.publishDate,
			link: withBase(`/notes/${note.id}/`),
		})),
	});
};

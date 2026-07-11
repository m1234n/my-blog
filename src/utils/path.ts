const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * 给站点内路径加上 Astro `base` 前缀。
 * dev 下 BASE 为空字符串，构建时（base: "/my-blog"）为 "/my-blog"。
 * 若传入完整 URL（http/https 开头）则原样返回，避免误伤外部链接。
 * @param path 以 `/` 开头的站点内路径，如 `/posts/foo/`
 */
export function withBase(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return `${BASE}${path}`;
}

export { BASE };

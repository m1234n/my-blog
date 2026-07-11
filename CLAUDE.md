## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Development Notes

### Content layer 缓存坑

删除或移动 `content/` 下的内容后，build 可能报 `ImageNotFound: Could not find requested image`，即使该图片确实已不存在。根因是 Astro content layer 的持久化缓存 `node_modules/.astro/data-store.json` 仍引用着已删内容的图片。清掉这个缓存即可：

```bash
rm -rf node_modules/.astro .astro
```

每次删/改 content 后若 build 报奇怪的图片找不到错误，先清这个缓存再 build。

### 从思源笔记导入文章

用全局 skill `siyuan-to-blog` 把思源笔记文档导出到 `content/posts/` 或 `content/notes/`：

```bash
python ~/.claude/skills/siyuan-to-blog/scripts/export.py post <文档ID或标题>
python ~/.claude/skills/siyuan-to-blog/scripts/export.py note <文档ID或标题>
```

思源工作区默认在 `D:/思源`。tags 自动提取依赖思源文档块的 `tags` 自定义属性（存在 `blocks.ial`，非 `attributes` 表）；description 思源没有，导出后需手填。

技术文档默认导出到 **post**（有 tags/updatedDate/图片支持）。note 仅用于很短的随手记（无 tags、单文件、不能带图片），技术文档几乎都走 post。slug 用英文避免中文 URL。

导出后默认自动 `git commit` + `git push`，commit 信息形如 `新增/更新文章: <标题>`，只提交本次导出的文件。用 `--no-commit` 跳过。

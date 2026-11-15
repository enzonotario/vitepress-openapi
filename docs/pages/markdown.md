---
outline: 2
---

# Markdown & llms.txt

`vitepress-openapi` can generate **plain Markdown** from your OpenAPI spec at build time. Use it for:

- **Static, searchable pages**: plain `.md` files that VitePress renders like any other page, indexed by local search or Algolia, with almost no JavaScript.
- **LLMs and AI agents**: one `.md` file per operation, plus [`llms.txt`](https://llmstxt.org) and `llms-full.txt`.

Each operation includes its endpoint, description, servers, authorization, parameters, request body and responses (schemas and examples), and code samples (cURL by default).

::: tip Tradeoff
Generated pages are static Markdown: there is no interactive playground, no schema/JSON toggles and no theme customizations. If you need those, use [`OAOperation`](/pages/by-operation) or [`OASpec`](/pages/by-spec) pages instead (or in addition).
:::

## Demo

This site generates both outputs from its <a href="/openapi.json" target="_self">example spec</a> on every build:

- <a href="/markdown-demo/">Rendered pages</a>, grouped by tag, with frontmatter (static VitePress pages).
- Raw files for AI agents: <a href="/markdown-demo/llms.txt" target="_self">llms.txt</a>, <a href="/markdown-demo/llms-full.txt" target="_self">llms-full.txt</a> and an operation such as <a href="/markdown-demo/createArtist.md" target="_self">createArtist.md</a>.

## CLI

```bash
npx vitepress-openapi generate docs/public/openapi.json --out docs/api --link-prefix /api/
```

`<spec>` can be a local JSON/YAML file or a URL.

| Option                   | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `-o, --out <dir>`        | Output directory (required).                                                       |
| `--group-by <mode>`      | `operation` (default): one file per operation. `tag`: one file per tag.            |
| `--link-prefix <prefix>` | Prefix of the links in `llms.txt` (default `/`). Can be an absolute URL.           |
| `--openapi-url <url>`    | URL of the OpenAPI document, linked from every page.                               |
| `--code-samples <langs>` | Comma-separated languages: `curl`, `javascript`, `php`, `python` (default `curl`). |
| `--no-code-samples`      | Do not include code samples.                                                       |
| `--base-url <url>`       | Base URL used in code samples (default: the first server).                         |
| `--no-llms`              | Do not generate `llms.txt` and `llms-full.txt`.                                    |
| `--no-frontmatter`       | Do not add VitePress frontmatter.                                                  |
| `--clean`                | Remove the output directory before writing.                                        |

The output looks like this:

```
/docs/api
├── index.md          # API info and links to every operation, grouped by tag
├── getPet.md         # one file per operation (or per tag with --group-by tag)
├── createPet.md
├── llms.txt          # index for AI agents (https://llmstxt.org)
└── llms-full.txt     # every operation in a single file
```

Operation ids are sanitized to build file names (e.g. `pets/get` becomes `pets-get.md`). Operations without `operationId` use the same fallback as the rest of the library (`{method}-{path}`).

## From the VitePress config

`generateMarkdown` does the same as the CLI, so you can run it every time VitePress starts or builds:

```ts
// .vitepress/config.mts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { generateMarkdown } from 'vitepress-openapi'

await generateMarkdown({
  specPath: fileURLToPath(new URL('../public/openapi.json', import.meta.url)),
  outDir: fileURLToPath(new URL('../api', import.meta.url)),
  clean: true,
  llms: false,
})

export default defineConfig({
  // ...
})
```

Use `spec` (object or JSON/YAML string), `specPath` or `specUrl` to load the document. The remaining options match the CLI ones in camelCase (`groupBy`, `linkPrefix`, `openapiUrl`, `codeSamples`, `baseUrl`, `llms`, `frontmatter`, `clean`).

To keep the files in memory (e.g. for a custom plugin), use `generateMarkdownFiles(spec, options)`, which returns `{ path, content }[]` without touching the file system. To render a single operation, use `operationToMarkdown(openapi, operationId, options)`, where `openapi` is the instance returned by `useOpenapi({ spec })`.

Links in descriptions that use the [operation links](/customizations/operation-links) syntax (`[](/operations/getPet)`) point to the generated files.

## Grouping

- `--group-by operation` (default): one page per operation, titled with the operation summary.
- `--group-by tag`: one page per tag with all its operations. Operations with several tags are included in each of them.

Both modes generate `index.md` with links grouped by tag.

## llms.txt for AI agents

VitePress turns `.md` files into HTML pages and does not serve `.txt` files from your docs folder. To expose the raw files to AI agents, generate them into `public` without frontmatter, so they are served as they are:

```bash
npx vitepress-openapi generate docs/public/openapi.json \
  --out docs/public/api \
  --no-frontmatter \
  --link-prefix https://example.com/api/ \
  --openapi-url https://example.com/openapi.json
```

Agents can then read `https://example.com/api/llms.txt`, follow its links to each operation `.md`, or load everything at once from `llms-full.txt`. You can run the generator twice (once into `docs/api` for pages, once into `docs/public/api` for agents) to get both.

::: info
With frontmatter enabled, the content is wrapped in a `::: v-pre` container, so double curly braces in your descriptions are not interpreted by Vue.
:::

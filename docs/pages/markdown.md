---
outline: 2
---

# Markdown & llms.txt

`vitepress-openapi` can generate **plain Markdown** from your OpenAPI spec at build time. Use it for:

- **LLMs and AI agents**: a `.md` file next to each operation page (e.g. `/operations/getPet.md` for `/operations/getPet.html`), plus [`llms.txt`](https://llmstxt.org) and `llms-full.txt`. This is the recommended setup for sites: see [Next to your pages](#next-to-your-pages).
- **Static, searchable pages**: plain `.md` files in your repo that VitePress renders like any other page, indexed by local search or Algolia, with almost no JavaScript. See [CLI](#cli).

Each operation includes its endpoint, description, servers, authorization, parameters, request body and responses (schemas and examples), and code samples (cURL by default).

::: tip Tradeoff
Generated pages are static Markdown: there is no interactive playground, no schema/JSON toggles and no theme customizations. If you need those, use [`OAOperation`](/pages/by-operation) or [`OASpec`](/pages/by-spec) pages instead (or in addition).
:::

## Demo

This site writes the Markdown of every example operation page next to its HTML, from its <a href="/openapi.json" target="_self">example spec</a>:

- [Get all artists](/example/operations/getAllArtists) (page) and <a href="/example/operations/getAllArtists.md" target="_self">getAllArtists.md</a> (Markdown).
- <a href="/example/one-page.md" target="_self">one-page.md</a>: the whole spec, for the [one-page example](/example/one-page).
- <a href="/example/introduction.md" target="_self">introduction.md</a>: the API overview, for the [introduction example](/example/introduction).
- <a href="/example/tags/Artists.md" target="_self">Artists.md</a>: every operation of a tag, for the [Artists tag page](/example/tags/Artists).
- <a href="/tests/response-statuses.md" target="_self">response-statuses.md</a>: a page rendering its own spec, for the [Response Statuses test page](/tests/response-statuses).
- <a href="/llms.txt" target="_self">llms.txt</a> and <a href="/llms-full.txt" target="_self">llms-full.txt</a>.

## Next to your pages

If your site has [operation pages](/pages/by-operation), `generateLlmsFiles` writes `{route}.md` next to each built page, and `llmsDevServer` serves the same files in dev. Share the options between both:

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress'
import { generateLlmsFiles, llmsDevServer } from 'vitepress-openapi'
import spec from '../public/openapi.json' with { type: 'json' }

const llms = {
  spec,
  operationRoute: 'operations/{operationId}', // route of your [operationId].md pages
  specRoutes: ['reference'], // optional: pages rendering the whole spec (OASpec)
  introductionRoute: 'introduction', // optional: API overview page
  tagRoute: 'tags/{tag}', // optional: route of your [tag].md pages
  openapiUrl: '/openapi.json',
}

export default defineConfig({
  async buildEnd(siteConfig) {
    await generateLlmsFiles(siteConfig, llms)
  },
  vite: {
    plugins: [llmsDevServer(llms)],
  },
})
```

| Option              | Description                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec`              | OpenAPI document (object or JSON/YAML string). Or use `specPath` / `specUrl`.                                                                                  |
| `operationRoute`    | Route of the operation pages, relative to the site root, with an `{operationId}` placeholder.                                                                  |
| `specRoutes`        | Routes of pages rendering the whole spec: they get every operation in one file.                                                                                |
| `introductionRoute` | Route of an overview page: title, version, description, servers, authentication and operations by tag, linked to their pages.                                  |
| `tagRoute`          | Route of the tag pages, with a `{tag}` placeholder. Each gets the tag description and all its operations.                                                      |
| `tagParam`          | Value of `{tag}` for a tag name. Defaults to the name as is, like `usePaths().getTags()` in a `[tag].paths.js` file. Set it if your paths file slugifies tags. |
| `extension`         | `md` (default) or `txt`.                                                                                                                                       |
| `llmsTxt`           | Write `llms.txt` and `llms-full.txt` at the site root (default `true`).                                                                                        |
| `openapiUrl`        | URL of the OpenAPI document, linked from every file.                                                                                                           |
| `codeSamples`       | Languages of the code samples (default `['curl']`), or `false`. `baseUrl` sets the base URL used in them.                                                      |

Files are only written for routes that exist as pages, and links (in `llms.txt` and between operations) include the site `base`. `llms.txt` links the overview first and each tag page at the top of its section. The files have no frontmatter: they are served as they are.

### Each page with its own spec

Pages that render their own spec (e.g. `<OASpec :spec="..." />` with the spec in route params) are covered by `resolvePage`. It is called for every built page with its `route` and dynamic route `params`, and returns what the page renders, or `undefined` to skip it:

```ts
const llms = [
  { spec, operationRoute: 'operations/{operationId}' },
  {
    title: 'Examples', // section heading in llms.txt
    resolvePage: ({ route, params }) => route.startsWith('examples/')
      ? { specUrl: params.specUrl }
      : undefined,
  },
]
```

| Returned field                  | Description                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `spec` / `specPath` / `specUrl` | The page's spec. Defaults to the entry's spec. URLs are fetched once; a failed fetch skips the page with a warning. |
| `mode`                          | `'spec'` (default, every operation), `'operation'`, `'introduction'` or `'tag'`.                                    |
| `operationId` / `tag`           | For the `'operation'` and `'tag'` modes.                                                                            |

Operation links inside these files are plain text, since the page's spec has no operation pages. Pass an array of options objects, each with its own spec, to `generateLlmsFiles` and `llmsDevServer`:

- One `llms.txt` and one `llms-full.txt` are written. `extension` and `llmsTxt` are read from the first entry.
- `llms.txt` starts with the first entry that has `operationRoute`. Other entries add a `## Section`: their operations, or the pages of `resolvePage` (titled with each spec's `info.title`).
- `llms-full.txt` only contains the specs of entries with `operationRoute`. Pages of `resolvePage` are linked from `llms.txt`, not copied, to keep it small.

In dev, the requested route is matched to a page and its params from VitePress' resolved dynamic routes.

::: tip vitepress-plugin-llms
[vitepress-plugin-llms](https://github.com/okineadev/vitepress-plugin-llms) copies the Markdown source of each page, which for operation pages is just `<OAOperation />`. You can use both: `buildEnd` runs after Vite plugins, so these files overwrite theirs on operation routes. In dev, register `llmsDevServer` **before** `llmstxt()` in `vite.plugins`. To keep its `llms.txt` instead, set `llmsTxt: false`.
:::

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

For a site, prefer [Next to your pages](#next-to-your-pages). With the CLI, note that VitePress turns `.md` files into HTML pages and does not serve `.txt` files from your docs folder. To expose the raw files to AI agents, generate them into `public` without frontmatter, so they are served as they are:

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

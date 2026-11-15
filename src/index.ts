import type { GenerateMarkdownOptions } from './node/generate'
import type { LlmsFilesOptions, LlmsSiteConfig } from './node/llms'
import { createOpenApiSpec } from './lib/spec/createOpenApiSpec'

export {
  getGlobalOpenapi,
  injectOpenapi,
  useOpenapi,
} from './composables/useOpenapi'
export { usePaths } from './composables/usePaths'
export { useSidebar } from './composables/useSidebar'
export { httpVerbs, literalTypes } from './lib/constants'
export { generateMarkdownFiles, type GenerateMarkdownFilesOptions, type MarkdownFile } from './lib/markdown/generateMarkdown'
export { markdownToPlainText, type MarkdownToPlainTextOptions } from './lib/markdown/markdownToPlainText'
export { operationToMarkdown, type OperationToMarkdownOptions } from './lib/markdown/operationToMarkdown'
export { createOpenApiSpec, type OpenApiSpecInstance } from './lib/spec/createOpenApiSpec'
export { minifyHtml } from './lib/utils/minifyHtml'
export { parseSpec } from './lib/utils/parseSpec'
export type { GenerateMarkdownOptions } from './node/generate'
export type { LlmsFilesOptions, LlmsSiteConfig } from './node/llms'
export { llmsDevServer } from './node/llmsPlugin'

/**
 * @deprecated Use `createOpenApiSpec` instead.
 */
export const OpenApi: typeof createOpenApiSpec = createOpenApiSpec

/**
 * Generates Markdown files from an OpenAPI document and writes them to `outDir` (Node only).
 * Loaded lazily, so importing this entry does not load `node:fs` until it is called.
 */
export async function generateMarkdown(options: GenerateMarkdownOptions): Promise<string[]> {
  const { generateMarkdown } = await import('./node/generate')
  return generateMarkdown(options)
}

/**
 * Writes the Markdown of each built operation page next to its HTML (`{route}.md` or `.txt`),
 * plus `llms.txt` and `llms-full.txt`. Call it from VitePress `buildEnd` (Node only, loaded lazily).
 */
export async function generateLlmsFiles(siteConfig: LlmsSiteConfig, options: LlmsFilesOptions): Promise<string[]> {
  const { generateLlmsFiles } = await import('./node/llms')
  return generateLlmsFiles(siteConfig, options)
}

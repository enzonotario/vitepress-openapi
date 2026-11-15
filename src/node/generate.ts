import type { GenerateMarkdownFilesOptions } from '../lib/markdown/generateMarkdown'
import type { OpenAPIDocument } from '../types'
import { generateMarkdownFiles } from '../lib/markdown/generateMarkdown'
import { parseSpec } from '../lib/utils/parseSpec'

// The package root entry is also bundled for the browser (e.g. `useSidebar` in a theme
// component). Non-literal specifiers keep bundlers from resolving Node built-ins there.
function importNodeModule(specifier: string): Promise<any> {
  return import(/* @vite-ignore */ specifier)
}

async function loadNodeModules() {
  const [fs, path, process] = await Promise.all([
    importNodeModule('node:fs/promises') as Promise<typeof import('node:fs/promises')>,
    importNodeModule('node:path') as Promise<typeof import('node:path')>,
    importNodeModule('node:process').then(module => module.default) as Promise<typeof import('node:process')>,
  ])
  return { fs, path, process }
}

export interface GenerateMarkdownOptions extends GenerateMarkdownFilesOptions {
  /** OpenAPI document (object, or JSON/YAML string). */
  spec?: OpenAPIDocument | string
  /** Path to a local JSON/YAML OpenAPI document. */
  specPath?: string
  /** URL of a JSON/YAML OpenAPI document. */
  specUrl?: string
  /** Output directory. Created if missing. */
  outDir: string
  /**
   * Remove the output directory before writing.
   * @default false
   */
  clean?: boolean
}

/**
 * Loads an OpenAPI document, generates Markdown files (see `generateMarkdownFiles`)
 * and writes them to `outDir`. Returns the absolute paths of the written files.
 */
export async function generateMarkdown(options: GenerateMarkdownOptions): Promise<string[]> {
  const { spec, specPath, specUrl, outDir, clean = false, ...generateOptions } = options

  if (!outDir) {
    throw new Error('[vitepress-openapi] `outDir` is required.')
  }

  const { fs, path, process } = await loadNodeModules()
  const { dirname, isAbsolute, relative, resolve } = path

  const document = await loadSpec({ spec, specPath, specUrl }, fs.readFile, resolve)
  const files = await generateMarkdownFiles(document, generateOptions)
  const root = resolve(outDir)

  if (clean) {
    assertSafeToClean(root, process.cwd(), path)
    await fs.rm(root, { recursive: true, force: true })
  }

  const written: string[] = []
  for (const file of files) {
    const target = resolve(root, file.path)
    const relativePath = relative(root, target)
    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
      throw new Error(`[vitepress-openapi] Refusing to write outside of outDir: ${file.path}`)
    }
    await fs.mkdir(dirname(target), { recursive: true })
    await fs.writeFile(target, file.content, 'utf-8')
    written.push(target)
  }

  return written
}

async function loadSpec(
  { spec, specPath, specUrl }: Pick<GenerateMarkdownOptions, 'spec' | 'specPath' | 'specUrl'>,
  readFile: (path: string, encoding: 'utf-8') => Promise<string>,
  resolve: (path: string) => string,
): Promise<OpenAPIDocument> {
  if (spec) {
    return parseSpec(spec)
  }

  if (specPath) {
    return parseSpec(await readFile(resolve(specPath), 'utf-8'))
  }

  if (specUrl) {
    const response = await fetch(specUrl)
    if (!response.ok) {
      throw new Error(`[vitepress-openapi] Could not fetch ${specUrl}: ${response.status} ${response.statusText}`)
    }
    return parseSpec(await response.text())
  }

  throw new Error('[vitepress-openapi] One of `spec`, `specPath` or `specUrl` is required.')
}

/**
 * Guards `clean` against wiping the file system root, the working directory or one of its parents.
 */
function assertSafeToClean(dir: string, cwd: string, { isAbsolute, parse, relative }: typeof import('node:path')): void {
  const fromDir = relative(dir, cwd)
  const isCwdOrParent = fromDir === '' || (!fromDir.startsWith('..') && !isAbsolute(fromDir))
  if (dir === parse(dir).root || isCwdOrParent) {
    throw new Error(`[vitepress-openapi] Refusing to clean ${dir}: use a dedicated output directory.`)
  }
}

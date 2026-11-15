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
  const { basename, dirname, join, resolve } = path

  const document = await loadSpec({ spec, specPath, specUrl }, fs.readFile, resolve)
  const files = await generateMarkdownFiles(document, generateOptions)
  const root = resolve(outDir)

  if (clean) {
    // Compare canonical paths, so a symlink can't point `clean` at cwd or one of its parents.
    const canonicalRoot = await canonicalPath(root, fs, path)
    assertSafeToClean(canonicalRoot, await fs.realpath(process.cwd()), path)
    await fs.rm(canonicalRoot, { recursive: true, force: true })
  }

  await fs.mkdir(root, { recursive: true })
  const realRoot = await fs.realpath(root)

  const written: string[] = []
  for (const file of files) {
    const target = resolve(root, file.path)
    if (!isInside(root, target, path)) {
      throw new Error(`[vitepress-openapi] Refusing to write outside of outDir: ${file.path}`)
    }

    // Don't follow symlinks: parent directories must resolve inside outDir, and the file itself can't be a link.
    await fs.mkdir(dirname(target), { recursive: true })
    const realParent = await fs.realpath(dirname(target))
    if (!isInside(realRoot, realParent, path)) {
      throw new Error(`[vitepress-openapi] Refusing to write through a symlink outside of outDir: ${file.path}`)
    }
    const realTarget = join(realParent, basename(target))
    const stats = await fs.lstat(realTarget).catch(() => null)
    if (stats?.isSymbolicLink()) {
      throw new Error(`[vitepress-openapi] Refusing to overwrite a symlink: ${file.path}`)
    }

    await fs.writeFile(realTarget, file.content, 'utf-8')
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
 * Whether `child` is `parent` or inside it. Only `..` or `../…` count as upward,
 * so a directory named `..project` is still inside.
 */
function isInside(parent: string, child: string, { isAbsolute, relative, sep }: typeof import('node:path')): boolean {
  const fromParent = relative(parent, child)
  const isUpward = fromParent === '..' || fromParent.startsWith(`..${sep}`)
  return !isUpward && !isAbsolute(fromParent)
}

/**
 * `realpath` of `target`, or of its nearest existing ancestor joined with the missing segments.
 */
async function canonicalPath(
  target: string,
  fs: typeof import('node:fs/promises'),
  { basename, dirname, join }: typeof import('node:path'),
): Promise<string> {
  const missing: string[] = []
  let current = target
  while (true) {
    try {
      return join(await fs.realpath(current), ...missing)
    }
    catch (error) {
      const parent = dirname(current)
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || parent === current) {
        throw error
      }
      missing.unshift(basename(current))
      current = parent
    }
  }
}

/**
 * Guards `clean` against wiping the file system root, the working directory or one of its parents.
 * Both paths must be canonical.
 */
function assertSafeToClean(dir: string, cwd: string, path: typeof import('node:path')): void {
  if (dir === path.parse(dir).root || isInside(dir, cwd, path)) {
    throw new Error(`[vitepress-openapi] Refusing to clean ${dir}: use a dedicated output directory.`)
  }
}

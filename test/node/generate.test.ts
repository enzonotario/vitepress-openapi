import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runCli } from '../../src/node/cli'
import { generateMarkdown } from '../../src/node/generate'

const spec = {
  openapi: '3.0.0',
  info: { title: 'Writer API', version: '1.0.0' },
  paths: {
    '/users/{id}': {
      get: {
        operationId: 'users/get',
        summary: 'Get user',
        tags: ['Users'],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
}

let dir: string

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'vitepress-openapi-md-'))
})

afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
  vi.restoreAllMocks()
})

describe('generateMarkdown', () => {
  it('writes the generated files from a spec object', async () => {
    const outDir = join(dir, 'nested', 'api')
    const written = await generateMarkdown({ spec, outDir, codeSamples: false })

    expect(written.map(path => path.slice(outDir.length + 1))).toEqual(['users-get.md', 'index.md', 'llms.txt', 'llms-full.txt'])
    expect(readFileSync(join(outDir, 'users-get.md'), 'utf-8')).toContain('# Get user')
  })

  it('loads JSON and YAML spec files', async () => {
    const jsonPath = join(dir, 'openapi.json')
    writeFileSync(jsonPath, JSON.stringify(spec))
    await generateMarkdown({ specPath: jsonPath, outDir: join(dir, 'json'), codeSamples: false, llms: false })
    expect(existsSync(join(dir, 'json', 'users-get.md'))).toBe(true)

    const yamlPath = join(dir, 'openapi.yaml')
    writeFileSync(yamlPath, 'openapi: 3.0.0\ninfo:\n  title: YAML\n  version: 1.0.0\npaths:\n  /ping:\n    get:\n      operationId: ping\n      responses:\n        \'200\':\n          description: pong\n')
    await generateMarkdown({ specPath: yamlPath, outDir: join(dir, 'yaml'), codeSamples: false })
    expect(readFileSync(join(dir, 'yaml', 'llms.txt'), 'utf-8')).toContain('# YAML')
  })

  it('cleans the output directory only when asked', async () => {
    const outDir = join(dir, 'out')
    await generateMarkdown({ spec, outDir, codeSamples: false })
    writeFileSync(join(outDir, 'stale.md'), 'stale')

    await generateMarkdown({ spec, outDir, codeSamples: false })
    expect(existsSync(join(outDir, 'stale.md'))).toBe(true)

    await generateMarkdown({ spec, outDir, codeSamples: false, clean: true })
    expect(existsSync(join(outDir, 'stale.md'))).toBe(false)
    expect(existsSync(join(outDir, 'index.md'))).toBe(true)
  })

  it('refuses to clean the working directory', async () => {
    await expect(generateMarkdown({ spec, outDir: process.cwd(), clean: true })).rejects.toThrow('Refusing to clean')
  })

  it('requires a spec source', async () => {
    await expect(generateMarkdown({ outDir: dir })).rejects.toThrow('is required')
  })
})

describe('runCli', () => {
  it('generates files from a spec path', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const specPath = join(dir, 'openapi.json')
    writeFileSync(specPath, JSON.stringify(spec))
    const outDir = join(dir, 'cli')

    const code = await runCli(['generate', specPath, '--out', outDir, '--group-by', 'tag', '--no-llms', '--no-frontmatter', '--no-code-samples'])

    expect(code).toBe(0)
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Generated 2 files'))
    expect(readFileSync(join(outDir, 'users.md'), 'utf-8').startsWith('# Users\n\n## Get user')).toBe(true)
    expect(existsSync(join(outDir, 'llms.txt'))).toBe(false)
  })

  it('prints help', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    expect(await runCli(['--help'])).toBe(0)
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Usage: vitepress-openapi generate'))
  })

  it('fails on invalid arguments', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await runCli(['generate', 'openapi.json'])).toBe(1)
    expect(await runCli(['generate', 'openapi.json', '--out', dir, '--group-by', 'path'])).toBe(1)
    expect(await runCli(['build'])).toBe(1)
    expect(await runCli(['generate', '--unknown'])).toBe(1)
  })
})

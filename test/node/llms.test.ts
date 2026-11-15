import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLlmsDevMiddleware, generateLlmsFiles, getPageRoutes } from '../../src/node/llms'

const spec = {
  openapi: '3.0.0',
  info: { title: 'Pets API', version: '1.0.0' },
  paths: {
    '/pets': { get: { operationId: 'listPets', summary: 'List pets', tags: ['Pets'], responses: { 200: { description: 'OK' } } } },
    '/hidden': { get: { operationId: 'hidden', summary: 'Hidden', tags: ['Pets'], responses: { 200: { description: 'OK' } } } },
  },
}

let dir: string

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'vitepress-openapi-llms-'))
})

afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
})

describe('getPageRoutes', () => {
  it('applies rewrites and strips extensions', () => {
    const routes = getPageRoutes({
      outDir: dir,
      pages: ['index.md', 'operations/[operationId].md', 'src/guide.md'],
      rewrites: { map: { 'src/guide.md': 'guide.md' } },
    })
    expect([...routes!]).toEqual(['index', 'operations/[operationId]', 'guide'])
  })

  it('returns undefined without pages', () => {
    expect(getPageRoutes({ outDir: dir })).toBeUndefined()
  })
})

describe('generateLlmsFiles', () => {
  it('writes files next to the pages listed in the site config', async () => {
    const written = await generateLlmsFiles(
      { outDir: dir, pages: ['ops/listPets.md', 'one-page.md'], site: { base: '/docs/' } },
      { spec, operationRoute: 'ops/{operationId}', specRoutes: ['one-page'], codeSamples: false },
    )

    expect(written.map(path => path.slice(dir.length + 1))).toEqual(['ops/listPets.md', 'one-page.md', 'llms.txt', 'llms-full.txt'])
    expect(readFileSync(join(dir, 'ops/listPets.md'), 'utf-8').startsWith('# List pets')).toBe(true)
    expect(existsSync(join(dir, 'ops/hidden.md'))).toBe(false)
    expect(readFileSync(join(dir, 'llms.txt'), 'utf-8')).toContain('- [List pets](/docs/ops/listPets.md)')
  })

  it('falls back to built HTML files without a page list, and loads specPath', async () => {
    mkdirSync(join(dir, 'ops'))
    writeFileSync(join(dir, 'ops/hidden.html'), '<html></html>')
    const specPath = join(dir, 'openapi.json')
    writeFileSync(specPath, JSON.stringify(spec))

    await generateLlmsFiles({ outDir: dir }, { specPath, operationRoute: 'ops/{operationId}', extension: 'txt', llmsTxt: false, codeSamples: false })

    expect(readFileSync(join(dir, 'ops/hidden.txt'), 'utf-8').startsWith('# Hidden')).toBe(true)
    expect(existsSync(join(dir, 'ops/listPets.txt'))).toBe(false)
    expect(existsSync(join(dir, 'llms.txt'))).toBe(false)
  })

  it('does not write through symlinks', async () => {
    const outside = join(dir, 'outside')
    const outDir = join(dir, 'dist')
    mkdirSync(outside)
    mkdirSync(outDir)
    symlinkSync(outside, join(outDir, 'ops'))

    await expect(generateLlmsFiles(
      { outDir, pages: ['ops/listPets.md'] },
      { spec, operationRoute: 'ops/{operationId}', codeSamples: false },
    )).rejects.toThrow('Refusing to write through a symlink')
    expect(existsSync(join(outside, 'listPets.md'))).toBe(false)

    const target = join(dir, 'secret.txt')
    writeFileSync(target, 'secret')
    rmSync(join(outDir, 'ops'))
    symlinkSync(target, join(outDir, 'llms.txt'))
    await expect(generateLlmsFiles({ outDir, pages: [] }, { spec, operationRoute: 'ops/{operationId}', codeSamples: false }))
      .rejects
      .toThrow('Refusing to overwrite a symlink')
    expect(readFileSync(target, 'utf-8')).toBe('secret')
  })
})

describe('createLlmsDevMiddleware', () => {
  function call(middleware: ReturnType<typeof createLlmsDevMiddleware>, url: string, method = 'GET') {
    const res = { statusCode: 0, headers: {} as Record<string, string>, body: undefined as string | undefined, setHeader(name: string, value: string) {
      this.headers[name] = value
    }, end(body?: string) {
      this.body = body
    } }
    const next = vi.fn()
    return middleware({ url, method }, res, next).then(() => ({ res, next }))
  }

  const siteConfig = { outDir: dir, pages: ['ops/listPets.md'], site: { base: '/docs/' } }
  const middleware = createLlmsDevMiddleware({ spec, operationRoute: 'ops/{operationId}', codeSamples: false }, () => siteConfig)

  it('serves operation files and llms.txt', async () => {
    const operation = await call(middleware, '/docs/ops/listPets.md')
    expect(operation.res.statusCode).toBe(200)
    expect(operation.res.headers['Content-Type']).toBe('text/markdown; charset=utf-8')
    expect(operation.res.body!.startsWith('# List pets')).toBe(true)

    const llms = await call(middleware, '/docs/llms.txt')
    expect(llms.res.headers['Content-Type']).toBe('text/plain; charset=utf-8')
    expect(llms.res.body).toContain('(/docs/ops/listPets.md)')
  })

  it('passes other requests through', async () => {
    expect((await call(middleware, '/docs/ops/hidden.md')).next).toHaveBeenCalled()
    expect((await call(middleware, '/docs/ops/listPets.html')).next).toHaveBeenCalled()
    expect((await call(middleware, '/docs/ops/listPets.md', 'POST')).next).toHaveBeenCalled()
  })
})

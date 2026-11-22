// Builds a VitePress site against the packed tarball, installed from outside the workspace.
// The workspace link makes Vite process vitepress-openapi as source, which hides SSR issues of the published
// package (e.g. imports that only exist in VitePress' client entry). Here it is an external dependency, as for users.
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const dir = mkdtempSync(join(tmpdir(), 'vitepress-openapi-packed-'))

function run(cmd, args, cwd) {
  execFileSync(cmd, args, { cwd, stdio: 'inherit' })
}

try {
  run('pnpm', ['pack', '--pack-destination', dir], root)
  const tarball = join(dir, `vitepress-openapi-${pkg.version}.tgz`)

  cpSync(join(root, 'e2e/packed/docs'), join(dir, 'docs'), { recursive: true })
  cpSync(join(root, 'docs/public/openapi.json'), join(dir, 'docs/openapi.json'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'packed', private: true, type: 'module' }))

  run('npm', ['install', '--no-audit', '--no-fund', `vitepress@${pkg.devDependencies.vitepress}`, `vue@${pkg.devDependencies.vue}`, tarball], dir)
  run('npx', ['vitepress', 'build', 'docs'], dir)

  const html = readFileSync(join(dir, 'docs/.vitepress/dist/index.html'), 'utf8')
  if (!html.includes('getAllArtists')) {
    throw new Error('The built page does not include the getAllArtists operation.')
  }
  console.log('Packed build OK.')
}
catch (error) {
  console.error(error)
  process.exitCode = 1
}
finally {
  rmSync(dir, { recursive: true, force: true })
}

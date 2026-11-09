// Builds dist/standalone.css: inlines the VitePress `@import`s of src/standalone.css,
// so apps that use the components without VitePress do not need it installed.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const RE_VITEPRESS_IMPORT = /^@import '(vitepress\/[^']+)';$/gm

const { version } = require('vitepress/package.json')

const source = readFileSync('src/standalone.css', 'utf8')

const css = source.replace(RE_VITEPRESS_IMPORT, (_, specifier) =>
  `/* ${specifier} (VitePress ${version}, MIT) */\n${readFileSync(require.resolve(specifier), 'utf8').trim()}\n`)

if (css.includes('@import \'vitepress/')) {
  throw new Error('standalone.css: some VitePress imports were not inlined.')
}

writeFileSync('dist/standalone.css', css)

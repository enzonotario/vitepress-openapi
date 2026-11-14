// Gives every published workspace package the version of the root package (vitepress-openapi),
// so v-openapi is always released with the same version. Run by .github/workflows/release.yml.
import { readFileSync, writeFileSync } from 'node:fs'

const PACKAGES = ['packages/v-openapi/package.json']

const { version } = JSON.parse(readFileSync('package.json', 'utf8'))

for (const file of PACKAGES) {
  const source = readFileSync(file, 'utf8')
  const pkg = JSON.parse(source)
  if (pkg.version !== version) {
    pkg.version = version
    writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
    console.log(`${pkg.name}: ${version}`)
  }
}

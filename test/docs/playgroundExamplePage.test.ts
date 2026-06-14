import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('docs example playground page', () => {
  it('renders the custom sidebar with markdown-safe component syntax', () => {
    const page = readFileSync(resolve('docs/example/playground.md'), 'utf8')

    expect(page).toContain('<template #sidebar="{ openapi }">')
    expect(page).toContain('<OAPlaygroundSidebar v-bind:openapi="openapi"></OAPlaygroundSidebar>')
    expect(page).not.toContain('<OAPlaygroundSidebar :openapi="openapi" />')
  })
})

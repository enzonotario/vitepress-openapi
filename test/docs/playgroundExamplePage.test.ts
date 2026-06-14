import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('docs example playground page', () => {
  it('renders the playground with a custom sidebar slot so mobile behavior is visible locally', () => {
    const page = readFileSync(resolve('docs/example/playground.md'), 'utf8')

    expect(page).toContain('<template #sidebar="{ openapi')
    expect(page).toContain('<OAPlaygroundSidebar :openapi="openapi" />')
  })
})

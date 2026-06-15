import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('docs example custom playground sidebar page', () => {
  it('uses the original spec and configures a custom playground sidebar without the spec selector', () => {
    const page = readFileSync(resolve('docs/example/playground-custom-sidebar.md'), 'utf8')

    expect(page).toContain('import { useSidebar } from \'vitepress-openapi\'')
    expect(page).toContain('import { useTheme } from \'vitepress-openapi/client\'')
    expect(page).toContain('import spec from \'../public/openapi.json\' with { type: \'json\' }')
    expect(page).toContain('useTheme({')
    expect(page).toContain('playground: {')
    expect(page).toContain('sidebar: [')
    expect(page).toContain("tag: 'Artists'")
    expect(page).toContain("tag: 'Authentication'")
    expect(page).not.toContain("tag: 'users'")
    expect(page).not.toContain("tag: 'pets'")
    expect(page).toContain('<OASpecPlayground :spec="spec" />')
    expect(page).not.toContain('usePlaygroundSpecSelection')
    expect(page).not.toContain('selectedSpecUrl')
  })
})

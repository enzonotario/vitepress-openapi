import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createPlaygroundCustomSidebarExampleSidebarItems } from '../../docs/docs-sidebar-config'

describe('docs example custom playground sidebar page', () => {
  it('uses the original spec and relies on the docs sidebar config for the custom playground sidebar', () => {
    const page = readFileSync(resolve('docs/example/playground-custom-sidebar.md'), 'utf8')
    const sidebarItems = createPlaygroundCustomSidebarExampleSidebarItems()

    expect(page).toContain('import spec from \'../public/openapi.json\' with { type: \'json\' }')
    expect(page).toContain('<OASpecPlayground :spec="spec" />')
    expect(page).not.toContain('usePlaygroundSpecSelection')
    expect(page).not.toContain('selectedSpecUrl')
    expect(page).not.toContain('useTheme')
    expect(page).not.toContain('sidebar: false')
    expect(page).not.toContain('layout: page')

    expect(sidebarItems.some(item => item.text === 'Rock Artists')).toBe(true)
    expect(sidebarItems.some(item => item.text === 'Auth')).toBe(true)
    expect(JSON.stringify(sidebarItems)).toContain('createUser')
    expect(JSON.stringify(sidebarItems)).toContain('loginUser')
  })
})

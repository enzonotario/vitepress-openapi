import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  createDocsSidebar,
  createPlaygroundCustomSidebarExampleSidebarItems,
  createPlaygroundExampleSidebarItems,
} from '../../docs/docs-sidebar-config'

describe('docs example playground page', () => {
  it('renders the playground without a custom sidebar slot', () => {
    const page = readFileSync(resolve('docs/example/playground.md'), 'utf8')

    expect(page).toContain('usePlaygroundSpecSelection')
    expect(page).toContain('<OASpecPlayground :spec-url="selectedSpecUrl"')
    expect(page).not.toContain('#sidebar')
    expect(page).not.toContain('sidebar: false')
    expect(page).not.toContain('layout: page')
  })
})

describe('docs playground sidebar configs', () => {
  it('includes playground operations directly in the Playground Example group', () => {
    const sidebar = createDocsSidebar()
    const playgroundGroup = sidebar.find(item => item.text === 'Playground Example')

    expect(playgroundGroup?.items?.some(item => item.text === 'Artists')).toBe(true)
    expect(playgroundGroup?.items?.some(item => item.text === 'Authentication')).toBe(true)
    expect(playgroundGroup?.items?.some(item => item.text === 'Playground')).toBe(false)
    expect(createPlaygroundExampleSidebarItems()[0]?.items?.[0]?.link).toMatch(/^\/example\/playground#/)
  })

  it('includes the custom sidebar operations directly in the Playground Custom Sidebar Example group', () => {
    const sidebar = createDocsSidebar()
    const playgroundGroup = sidebar.find(item => item.text === 'Playground Custom Sidebar Example')

    expect(playgroundGroup?.items).toEqual(createPlaygroundCustomSidebarExampleSidebarItems())
    expect(playgroundGroup?.items?.some(item => item.text === 'Rock Artists')).toBe(true)
    expect(playgroundGroup?.items?.some(item => item.text === 'Auth')).toBe(true)
    expect(playgroundGroup?.items?.some(item => item.text === 'Playground Custom Sidebar')).toBe(false)
  })

  it('keeps the Example group without playground links', () => {
    const sidebar = createDocsSidebar()
    const exampleGroup = sidebar.find(item => item.text === 'Example')

    expect(exampleGroup?.items?.some(item => item.text === 'Playground')).toBe(false)
    expect(exampleGroup?.items?.some(item => item.text === 'Playground Custom Sidebar')).toBe(false)
  })

  it('renders playground sections as collapsible groups on the default sidebar', () => {
    const sidebar = createDocsSidebar()
    const playgroundGroup = sidebar.find(item => item.text === 'Playground Example')
    const customSidebarGroup = sidebar.find(item => item.text === 'Playground Custom Sidebar Example')

    expect(playgroundGroup?.items?.length).toBeGreaterThan(1)
    expect(playgroundGroup?.link).toBeUndefined()
    expect(playgroundGroup?.collapsed).toBe(true)
    expect(customSidebarGroup?.items?.length).toBeGreaterThan(1)
    expect(customSidebarGroup?.link).toBeUndefined()
    expect(customSidebarGroup?.collapsed).toBe(true)
  })

  it('injects custom sidebar operations directly under their groups', () => {
    const customSidebarItems = createPlaygroundCustomSidebarExampleSidebarItems()

    expect(customSidebarItems).toHaveLength(2)
    expect(customSidebarItems[0]?.text).toBe('Rock Artists')
    expect(customSidebarItems[0]?.items?.some(item => item.link?.includes('#getAllArtists'))).toBe(true)
    expect(customSidebarItems[1]?.text).toBe('Auth')
    expect(customSidebarItems[1]?.items?.some(item => item.link?.includes('#createUser'))).toBe(true)
  })

  it('uses a custom sidebar item template for the custom sidebar example group', () => {
    const customSidebarItems = createPlaygroundCustomSidebarExampleSidebarItems()
    const firstItemText = customSidebarItems[0]?.items?.[0]?.text

    expect(firstItemText).toContain('grid-template-columns: 1fr auto')
    expect(firstItemText).toContain('Get all artists')
    expect(firstItemText).toMatch(/OAMethodBadge--get.*GET|GET.*OAMethodBadge--get/s)
  })
})

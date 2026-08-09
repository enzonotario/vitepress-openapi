import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { buildPlaygroundSandboxSidebar } from '../../docs/.vitepress/theme/lib/playgroundSandboxSidebar'
import spec from '../../docs/public/openapi.json'

function createSandboxSidebarOptions(overrides: Partial<{
  playgroundSidebarItemsType: 'default' | 'itemsByPaths' | 'itemsByTags' | 'custom'
  playgroundSidebarUseCustomTemplate: boolean
  playgroundSidebarItemsDepth: number
  playgroundSidebarItemsCollapsible: boolean
}> = {}) {
  return {
    playgroundSidebarItemsType: ref(overrides.playgroundSidebarItemsType ?? 'default'),
    playgroundSidebarUseCustomTemplate: ref(overrides.playgroundSidebarUseCustomTemplate ?? false),
    playgroundSidebarItemsDepth: ref(overrides.playgroundSidebarItemsDepth ?? 6),
    playgroundSidebarItemsCollapsible: ref(overrides.playgroundSidebarItemsCollapsible ?? true),
  }
}

describe('playgroundSandboxSidebar', () => {
  it('returns null for the default sidebar without a custom template', () => {
    expect(buildPlaygroundSandboxSidebar(spec, createSandboxSidebarOptions())).toBeNull()
  })

  it('builds the custom playground sidebar groups', () => {
    const sidebar = buildPlaygroundSandboxSidebar(spec, createSandboxSidebarOptions({
      playgroundSidebarItemsType: 'custom',
    }))

    expect(sidebar?.map(item => item.text)).toEqual(['Rock Artists', 'Auth'])
    expect(sidebar?.[0]?.items?.some(item => item.link === '#getAllArtists')).toBe(true)
  })

  it('applies the custom item template when enabled', () => {
    const sidebar = buildPlaygroundSandboxSidebar(spec, createSandboxSidebarOptions({
      playgroundSidebarItemsType: 'custom',
      playgroundSidebarUseCustomTemplate: true,
    }))

    expect(sidebar?.[0]?.items?.[0]?.text).toContain('grid-template-columns: 1fr auto')
    expect(sidebar?.[0]?.items?.[0]?.text).toContain('Get all artists')
  })

  it('builds grouped sidebar items for the default mode with a custom template', () => {
    const sidebar = buildPlaygroundSandboxSidebar(spec, createSandboxSidebarOptions({
      playgroundSidebarItemsType: 'default',
      playgroundSidebarUseCustomTemplate: true,
    }))

    expect(sidebar?.some(item => item.text === 'Artists')).toBe(true)
    expect(sidebar?.[0]?.items?.[0]?.text).toContain('OAMethodBadge--get')
  })
})

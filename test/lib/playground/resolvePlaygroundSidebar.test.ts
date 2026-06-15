import type { DefaultTheme } from 'vitepress'
import { describe, expect, it } from 'vitest'
import { resolvePlaygroundSidebar } from '../../../src/lib/playground/resolvePlaygroundSidebar'

describe('resolvePlaygroundSidebar', () => {
  it('returns array sidebars unchanged', () => {
    const sidebar: DefaultTheme.Sidebar = [
      {
        text: 'Overview',
        link: '/overview',
      },
    ]

    expect(resolvePlaygroundSidebar(sidebar, '/playground')).toEqual(sidebar)
  })

  it('resolves the most specific matching sidebar prefix', () => {
    const sidebar: DefaultTheme.Sidebar = {
      '/': [
        {
          text: 'Root',
          link: '/root',
        },
      ],
      '/example/': [
        {
          text: 'Example',
          link: '/example',
        },
      ],
      '/example/nested/': [
        {
          text: 'Nested',
          link: '/nested',
        },
      ],
    }

    expect(resolvePlaygroundSidebar(sidebar, '/example/nested/playground')).toEqual([
      {
        text: 'Nested',
        link: '/nested',
      },
    ])
  })

  it('applies the configured base when using object sidebar entries', () => {
    const sidebar: DefaultTheme.Sidebar = {
      '/example/': {
        base: '/example',
        items: [
          {
            text: 'Playground',
            link: '/playground',
          },
        ],
      },
    }

    expect(resolvePlaygroundSidebar(sidebar, '/example/playground')).toEqual([
      {
        text: 'Playground',
        link: '/example/playground',
      },
    ])
  })
})

import type { DefaultTheme } from 'vitepress'
import { minifyHtml, useSidebar } from 'vitepress-openapi'
import { examplesPages, testsPages } from './pages'
import spec from './public/openapi.json'

const sidebar = useSidebar({
  spec,
})

function createPlaygroundCustomSidebarItemTemplate({
  method,
  path,
  title,
}: {
  method: string
  path: string
  title?: string
}) {
  const operation = spec.paths[path]?.[method as keyof typeof spec.paths[string]]
  const displayText = title || (operation ? operation.summary : path)

  return minifyHtml(`
    <span class="OASidebarItem group/oaOperationLink" style="display: grid; grid-template-columns: 1fr auto;">
      <span class="text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${displayText}</span>
      <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>
    </span>
  `)
}

function createPlaygroundExampleGroup(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem {
  return {
    text: 'Playground Example',
    collapsed: true,
    items,
  }
}

function createPlaygroundCustomSidebarExampleGroup(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem {
  return {
    text: 'Playground Custom Sidebar Example',
    collapsed: true,
    items,
  }
}

export function createPlaygroundExampleSidebarItems(): DefaultTheme.SidebarItem[] {
  return sidebar.generateSidebarGroups({
    linkPrefix: '/example/playground#',
  })
}

export function createPlaygroundCustomSidebarExampleSidebarItems(): DefaultTheme.SidebarItem[] {
  return [
    sidebar.generateSidebarGroup({
      tag: 'Artists',
      text: 'Rock Artists',
      linkPrefix: '/example/playground-custom-sidebar#',
      sidebarItemTemplate: createPlaygroundCustomSidebarItemTemplate,
    }),
    sidebar.generateSidebarGroup({
      tag: 'Authentication',
      text: 'Auth',
      linkPrefix: '/example/playground-custom-sidebar#',
      sidebarItemTemplate: createPlaygroundCustomSidebarItemTemplate,
    }),
  ]
}

export function createDocsSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Getting Started',
      link: '/guide/getting-started',
    },
    {
      text: 'Pages',
      items: [
        {
          items: [
            {
              text: 'By Operation',
              link: '/pages/by-operation',
            },
            {
              text: 'By Spec',
              link: '/pages/by-spec',
            },
            {
              text: 'By Tag',
              link: '/pages/by-tag',
            },
            {
              text: 'Introduction',
              link: '/pages/introduction',
            },
            {
              text: 'Playground',
              link: '/pages/playground',
            },
          ],
        },
      ],
    },
    {
      text: 'Sidebar',
      items: [
        {
          items: [
            {
              text: 'Sidebar Items',
              link: '/sidebar/sidebar-items',
            },
            {
              text: 'Sidebar Examples',
              link: '/sidebar-examples/',
              target: '_blank',
            },
          ],
        },
      ],
    },
    {
      text: 'Components',
      items: [
        {
          items: [
            {
              text: 'Overview',
              link: '/components/',
            },
            {
              text: 'OASpec',
              link: '/components/oa-spec',
            },
            {
              text: 'OASpecPlayground',
              link: '/components/oa-spec-playground',
            },
            {
              text: 'OAOperation',
              link: '/components/oa-operation',
            },
          ],
        },
      ],
    },
    {
      text: 'Composables',
      items: [
        {
          items: [
            {
              text: 'useTheme',
              link: '/composables/useTheme',
            },
            {
              text: 'usePlayground',
              link: '/composables/usePlayground',
            },
          ],
        },
      ],
    },
    {
      text: 'Utilities',
      items: [
        {
          items: [
            {
              text: 'minifyHtml',
              link: '/utils/minifyHtml',
            },
          ],
        },
      ],
    },
    {
      text: 'Customizations',
      items: [
        {
          items: [
            {
              text: 'General',
              items: [
                {
                  items: [
                    {
                      text: 'i18n',
                      link: '/customizations/i18n',
                    },
                    {
                      text: 'Branding',
                      link: '/customizations/branding',
                    },
                  ],
                },
              ],
            },
            {
              text: 'Operation',
              items: [
                {
                  items: [
                    {
                      text: 'Custom Slots',
                      link: '/customizations/custom-slots',
                    },
                    {
                      text: 'Operation Badges',
                      link: '/customizations/operation-badges',
                    },
                    {
                      text: 'Code Samples',
                      link: '/customizations/code-samples',
                    },
                    {
                      text: 'Operation tags slot',
                      link: '/customizations/operation-tags-slot',
                    },
                    {
                      text: 'Custom Server',
                      link: '/customizations/custom-server',
                    },
                    {
                      text: 'Operation Links',
                      link: '/customizations/operation-links',
                    },
                  ],
                },
              ],
            },
            {
              text: 'Spec',
              items: [
                {
                  items: [
                    {
                      text: 'Multiple Specs',
                      link: '/customizations/multiple-specs',
                    },
                  ],
                },
              ],
            },
            {
              text: 'Playground',
              items: [
                {
                  items: [
                    {
                      text: 'Examples',
                      link: '/customizations/playground-examples',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      text: 'Example',
      collapsed: true,
      items: [
        {
          text: 'Introduction',
          link: '/example/introduction',
        },
        ...sidebar.generateSidebarGroups({
          linkPrefix: '/example/operations/',
        }),
        {
          text: 'One Page',
          link: '/example/one-page',
        },
      ],
    },
    createPlaygroundExampleGroup(createPlaygroundExampleSidebarItems()),
    createPlaygroundCustomSidebarExampleGroup(createPlaygroundCustomSidebarExampleSidebarItems()),
    {
      text: 'Tests',
      collapsed: true,
      items: [
        ...testsPages.map(page => ({
          text: page.label,
          link: `/tests/${page.slug}`,
        })),
      ],
    },
    {
      text: 'Remote Examples',
      collapsed: true,
      items: [
        ...examplesPages.map(page => ({
          text: page.label,
          link: `/examples/${page.slug}`,
        })),
      ],
    },
  ]
}

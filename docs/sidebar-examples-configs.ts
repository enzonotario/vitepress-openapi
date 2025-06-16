import jsBeautify from 'js-beautify'
import { useSidebar } from 'vitepress-openapi'
import spec from './public/openapi.json'

const sidebar = useSidebar({
  spec,
})

export const examples = ([
  {
    slug: 'operationsByTags',
    label: 'Operations Grouped By Tags',
    config: () => {
      return [
        {
          text: 'Operations',
          items: sidebar.generateSidebarGroups({
            linkPrefix: '/sidebar-examples/operationsByTags/',
          }),
        },
        {
          text: 'Collapsible items',
          items: sidebar.generateSidebarGroups({
            linkPrefix: '/sidebar-examples/operationsByTags/',
          }).map(group => ({
            ...group,
            collapsed: true,
          })),
        },
      ]
    },
  },
  {
    slug: 'itemsByTags',
    label: 'Items By Tags',
    config: () => {
      return sidebar.itemsByTags({
        linkPrefix: '/sidebar-examples/itemsByTags/',
      })
    },
  },
  {
    slug: 'itemsByPaths',
    label: 'Items By Paths',
    config: () => {
      return sidebar.itemsByPaths({
        linkPrefix: '/sidebar-examples/itemsByPaths/',
      })
    },
  },
  {
    slug: 'sidebarItemTemplate',
    label: 'Custom Item Template',
    config: () => {
      return sidebar.generateSidebarGroups({
        linkPrefix: '#',
        sidebarItemTemplate: (method, path) => {
          const operation = spec.paths[path]?.[method]

          return `<div class="OASidebarItem group/oaOperationLink" style="display: grid; grid-template-columns: 1fr auto;">
        <span class="text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${operation ? operation.summary : path}</span>
        <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>
      </div>`
        },
      })
    },
  },
  {
    slug: 'sidebarGroupTemplate',
    label: 'Custom Group Template',
    config: () => {
      return sidebar.itemsByPaths({
        linkPrefix: '#',
        sidebarGroupTemplate: (path, _) => {
          return `<span>${path}</span>`
        },
      })
    },
  },
]).map((example) => {
  const match = example.config.toString().match(/return (.*);/s)

  if (!match) {
    return {
      ...example,
      code: '',
    }
  }

  const code = match[1]

  const template = `
export default defineConfig({
  lang: 'en-US',
  title: 'VitePress OpenAPI',
  description: 'Generate VitePress API Docs from OpenAPI specifications',
  themeConfig: {
    sidebar: ${code.replace('openapi_default', 'spec')},
  },
})`

  return {
    ...example,
    code: jsBeautify(template, {
      indent_size: 2,
    }),
  }
})

export const sidebarExamplesConfigs = {
  ...examples.reduce((acc, example) => {
    acc[`/sidebar-examples/${example.slug}`] = [
      {
        items: [
          {
            text: '<- Sidebar Examples',
            link: '/sidebar-examples',
          },
        ],
      },
      ...example.config(),
    ]
    return acc
  }, {}),
  '/sidebar-examples': [
    {
      text: 'Sidebar Examples',
      items: [
        ...examples.map(example => ({
          text: example.label,
          link: `/sidebar-examples/${example.slug}`,
        })),
      ],
    },
  ],
}

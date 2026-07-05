import type { DefaultTheme } from 'vitepress'
import type { SandboxData } from '../sandboxData'
import type { useTheme } from 'vitepress-openapi/client'
import { minifyHtml, useSidebar } from 'vitepress-openapi'

type ThemeConfig = ReturnType<typeof useTheme>

function createPlaygroundCustomSidebarItemTemplate(spec: Record<string, any>) {
  return ({
    method,
    path,
    title,
  }: {
    method: string
    path: string
    title?: string
  }) => {
    const operation = spec.paths?.[path]?.[method as keyof typeof spec.paths[string]]
    const displayText = title || (operation ? operation.summary : path)

    return minifyHtml(`
      <span class="OASidebarItem group/oaOperationLink" style="display: grid; grid-template-columns: 1fr auto;">
        <span class="text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${displayText}</span>
        <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>
      </span>
    `)
  }
}

export function buildPlaygroundSandboxSidebar(
  spec: Record<string, any>,
  sandboxData: Pick<SandboxData, 'playgroundSidebarItemsType' | 'playgroundSidebarUseCustomTemplate' | 'playgroundSidebarItemsDepth' | 'playgroundSidebarItemsCollapsible'>,
): DefaultTheme.SidebarItem[] | null {
  if (!spec?.paths) {
    return null
  }

  const sidebar = useSidebar({ spec })
  const template = sandboxData.playgroundSidebarUseCustomTemplate.value
    ? createPlaygroundCustomSidebarItemTemplate(spec)
    : undefined
  const templateOptions = template ? { sidebarItemTemplate: template } : {}

  switch (sandboxData.playgroundSidebarItemsType.value) {
    case 'itemsByTags':
      return sidebar.itemsByTags({
        linkPrefix: '#',
        ...templateOptions,
      })

    case 'itemsByPaths':
      return sidebar.itemsByPaths({
        linkPrefix: '#',
        depth: sandboxData.playgroundSidebarItemsDepth.value,
        collapsible: sandboxData.playgroundSidebarItemsCollapsible.value,
        ...templateOptions,
      })

    case 'custom':
      return [
        sidebar.generateSidebarGroup({
          tag: 'Artists',
          text: 'Rock Artists',
          linkPrefix: '#',
          ...templateOptions,
        }),
        sidebar.generateSidebarGroup({
          tag: 'Authentication',
          text: 'Auth',
          linkPrefix: '#',
          ...templateOptions,
        }),
      ]

    case 'default':
      return template
        ? sidebar.generateSidebarGroups({
            linkPrefix: '#',
            ...templateOptions,
          })
        : null

    default:
      return null
  }
}

export function applyPlaygroundSandboxSidebar(
  sandboxData: SandboxData,
  themeConfig: ThemeConfig,
) {
  if (sandboxData.previewComponent.value !== 'Playground') {
    themeConfig.setPlaygroundSidebar(null)
    return
  }

  const sidebar = buildPlaygroundSandboxSidebar(sandboxData.spec.value, sandboxData)
  themeConfig.setPlaygroundSidebar(sidebar)
}

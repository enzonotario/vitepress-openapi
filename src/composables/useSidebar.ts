import { useOpenapi, httpVerbs } from 'vitepress-theme-openapi'

export function useSidebar({ spec } = { spec: null }) {
  const openapi = useOpenapi({ spec })

  function generateSidebarItem(method: string, path: string) {
    const operation = openapi?.spec?.paths?.[path]?.[method]
    if (!operation) {
      return null
    }

    const { operationId, summary } = operation
    const sidebarTitle = operation['x-sidebar-title'] || summary || `${method.toUpperCase()} ${path}`

    return {
      text: `<span class="SidebarItem">
        <span class="SidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>
        <span class="SidebarItem-text">${sidebarTitle}</span>
      </span>`,
      link: `/operations/${operationId}`,
    };
  }

  function generateSidebarGroup(tag: string | string[], text?: string) {
    if (!openapi?.spec?.paths) {
      return []
    }

    const includeTags = Array.isArray(tag) ? tag : [tag]

    const sidebarGroupElements = Object.keys(openapi.spec.paths)
        .flatMap((path) => {
          return httpVerbs
              .map((method) => {
                const operation = openapi.spec.paths[path][method]
                if (operation && includeTags.every(tag => operation.tags?.includes(tag))) {
                  return generateSidebarItem(method, path)
                }
                return null
              })
              .filter(Boolean)
        })

    return {
      text: text || includeTags.join(', '),
      items: sidebarGroupElements,
    }
  }

  function generateSidebarGroups() {
    if (!openapi?.spec?.paths) {
      return []
    }

    return openapi.getTags().map((tag) => generateSidebarGroup(tag, tag))
  }

  return {
    generateSidebarItem,
    generateSidebarGroup,
    generateSidebarGroups,
  }
}

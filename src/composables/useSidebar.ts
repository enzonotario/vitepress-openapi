import { useOpenapi, httpVerbs } from 'vitepress-theme-openapi'

export function useSidebar({ spec } = { spec: null }) {
  const openapi = useOpenapi({ spec })

  function generateSidebarItem(method: string, path: string) {
    const operation = openapi?.rawSpec?.paths?.[path]?.[method]
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
    if (!openapi?.rawSpec?.paths) {
      return []
    }

    const includeTags = Array.isArray(tag) ? tag : [tag]

    const sidebarGroupElements = Object.keys(openapi.rawSpec.paths)
        .flatMap((path) => {
          return httpVerbs
              .map((method) => {
                const operation = openapi.rawSpec.paths[path][method]
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
    if (!openapi?.rawSpec?.paths) {
      return []
    }

    return getTags().map((tag) => generateSidebarGroup(tag, tag))
  }

  function getTags(): string[] {
    if (!openapi?.rawSpec?.paths) {
      return []
    }

    return Object.values(openapi?.rawSpec?.paths).reduce((tags, path: any) => {
      for (const verb of httpVerbs) {
        if (path[verb]?.tags) {
          path[verb].tags.forEach((tag: string) => {
            if (!tags.includes(tag)) {
              tags.push(tag)
            }
          })
        }
      }
      return tags
    }, [])
  }

  return {
    generateSidebarItem,
    generateSidebarGroup,
    generateSidebarGroups,
  }
}

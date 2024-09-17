import { OpenApi, httpVerbs, useOpenapi } from 'vitepress-theme-openapi'

export function useSidebar({ spec } = { spec: null }) {
  const openapi = OpenApi({ spec: spec || useOpenapi().json })

  function sidebarItemTemplate(method: string, title: string) {
    return `<span class="OASidebarItem">
        <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>
        <span class="OASidebarItem-text">${title}</span>
      </span>`
  }

  function generateSidebarItem(method: string, path: string) {
    const operation = openapi.getPaths()?.[path]?.[method]
    if (!operation) {
      return null
    }

    const { operationId, summary } = operation
    const sidebarTitle = operation['x-sidebar-title'] || summary || `${method.toUpperCase()} ${path}`

    return {
      text: sidebarItemTemplate(method, sidebarTitle),
      link: `/operations/${operationId}`,
    }
  }

  function generateSidebarGroup(tag: string | string[], text?: string, addedOperations = new Set()) {
    if (!openapi.getPaths()) {
      return []
    }

    const includeTags = Array.isArray(tag) ? tag : [tag]

    const sidebarGroupElements = Object.keys(openapi.getPaths())
      .flatMap((path) => {
        return httpVerbs
          .map((method) => {
            const operation = openapi.getPaths()[path][method]
            if (operation && !addedOperations.has(operation.operationId) && (includeTags.length === 0 || includeTags.every(tag => operation.tags?.includes(tag)))) {
              addedOperations.add(operation.operationId)
              return generateSidebarItem(method, path)
            }
            return null
          })
          .filter(Boolean)
      })

    return {
      text: text !== undefined ? text : includeTags.join(', ') || '',
      items: sidebarGroupElements,
    }
  }

  function generateSidebarGroups() {
    if (!openapi.getPaths()) {
      return []
    }

    const tags = getTags()
    const addedOperations = new Set()
    const groups = tags.map(tag => generateSidebarGroup(tag, tag, addedOperations))

    // Add a group for operations without tags
    const noTagGroup = generateSidebarGroup([], '', addedOperations)
    if (noTagGroup.items.length > 0) {
      groups.push(noTagGroup)
    }

    return groups
  }

  function getTags(): string[] {
    if (!openapi.getPaths()) {
      return []
    }

    return Object.values(openapi.getPaths()).reduce((tags, path: any) => {
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
    sidebarItemTemplate,
    generateSidebarItem,
    generateSidebarGroup,
    generateSidebarGroups,
    getTags,
  }
}

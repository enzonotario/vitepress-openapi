import { useOpenapi } from './useOpenapi'

const METHOD_GET = 'get'

export function useSidebar({ spec } = {}) {
  const openapi = useOpenapi()

  if (spec) {
    openapi.setSpec(spec)
  }

  function generateSidebarItem(method, path) {
    if (!openapi?.spec?.paths?.[path]?.[method]) {
      return null
    }

    const { operationId, summary } = openapi.spec.paths[path].get

    const sidebarTitle = openapi.spec.paths[path].get['x-sidebar-title'] || summary

    return {
      text: `<span class="SidebarItem">
    <span class="SidebarItem-badge">${method.toUpperCase()}</span>
    <span class="SidebarItem-text">${sidebarTitle}</span>
    </span>`,
      link: `/operations/${operationId}`,
    }
  }

  function generateSidebarGroup(tag: string | string[], text?: string) {
    if (!openapi?.spec?.paths) {
      return []
    }

    const includeTags = Array.isArray(tag) ? tag : [tag]

    const sidebarGroupElements = Object.keys(openapi.spec.paths)
      .filter((path) => {
        const { tags } = openapi.spec.paths[path][METHOD_GET]

        return includeTags.every(tag => tags.includes(tag))
      })
      .map((path) => {
        return generateSidebarItem(METHOD_GET, path)
      })

    return {
      text,
      items: sidebarGroupElements,
    }
  }

  function generateSidebarGroups() {
    if (!openapi?.spec?.paths) {
      return []
    }

    return openapi.getTags().map((tag) => {
      return generateSidebarGroup(tag, tag)
    })
  }

  return {
    generateSidebarItem,
    generateSidebarGroup,
    generateSidebarGroups,
  }
}

import { useOpenapi } from './useOpenapi'

const METHOD_GET = 'get'

export function useSidebar() {
  const openapi = useOpenapi()

  function generateSidebarItem(method, path) {
    const { operationId, summary } = openapi.json.paths[path].get

    const sidebarTitle = openapi.json.paths[path].get['x-sidebar-title'] || summary

    return {
      text: `<span class="SidebarItem">
    <span class="SidebarItem-badge">${method.toUpperCase()}</span>
    <span class="SidebarItem-text">${sidebarTitle}</span>
    </span>`,
      link: `/operations/${operationId}`,
    }
  }

  function generateSidebarGroup(tag: string, text?: string) {
    const sidebarGroupElements = Object.keys(openapi.json.paths)
      .filter((path) => {
        const { tags } = openapi.json.paths[path][METHOD_GET]
        return tags?.includes(tag)
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

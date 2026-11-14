import type { OASidebarItem, SidebarItem } from '../../composables/useSidebar'

export function cleanSidebarItems(result: (OASidebarItem[] | OASidebarItem)): SidebarItem[] | SidebarItem {
  if (Array.isArray(result)) {
    return result.map(cleanSidebarItems) as SidebarItem[]
  }

  if (typeof result === 'object') {
    return {
      text: result.text,
      ...(result.collapsed === undefined ? {} : { collapsed: result.collapsed }),
      ...(result.link ? { link: result.link } : {}),
      ...(result.items ? { items: cleanSidebarItems(result.items) } : {}),
    } as SidebarItem
  }

  return result
}

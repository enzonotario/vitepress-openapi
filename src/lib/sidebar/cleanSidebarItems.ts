import type { DefaultTheme } from 'vitepress'
import type { OASidebarItem } from '../../composables/useSidebar'

export function cleanSidebarItems(result: (OASidebarItem[] | OASidebarItem)): DefaultTheme.SidebarItem[] | DefaultTheme.SidebarItem {
  if (Array.isArray(result)) {
    return result.map(cleanSidebarItems) as DefaultTheme.SidebarItem[]
  }

  if (typeof result === 'object') {
    return {
      text: result.text,
      ...(result.collapsed === undefined ? {} : { collapsed: result.collapsed }),
      ...(result.link ? { link: result.link } : {}),
      ...(result.items ? { items: cleanSidebarItems(result.items) } : {}),
    } as DefaultTheme.SidebarItem
  }

  return result
}

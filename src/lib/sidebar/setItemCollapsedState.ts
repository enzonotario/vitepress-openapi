import type { OASidebarItem } from '../../composables/useSidebar'

export function setItemCollapsedState(items: OASidebarItem[]): OASidebarItem[] {
  return items.map((item) => {
    if (item.items) {
      item.collapsed = !item.items.length

      if (item.items.some((item: OASidebarItem) => 'items' in item)) {
        item.items = setItemCollapsedState(item.items as OASidebarItem[])
      }
    }

    return item
  })
}

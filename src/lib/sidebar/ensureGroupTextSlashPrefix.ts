import type { OASidebarItem } from '../../composables/useSidebar'

/**
 * Ensures that all group text starts with a slash for consistent path-like formatting.
 */
export function ensureGroupTextSlashPrefix(items: OASidebarItem[]): OASidebarItem[] {
  return items.map((item: OASidebarItem) => {
    if (item.items) {
      item.items = ensureGroupTextSlashPrefix(item.items)

      item.text = item.text?.startsWith('/') ? item.text : `/${item.text}`
    } else if (item.text && !item.isOperation && !item.text.startsWith('/') && !item.text.includes('<span')) {
      item.text = `/${item.text}`
    }

    return item
  })
}

import type { OASidebarItem } from '../../composables/useSidebar'

export function flatSidebarItems(items: OASidebarItem[], flattenedItems: Record<string, OASidebarItem>, maxDepth: number, currentDepth: number = 1, parentText = ''): OASidebarItem[] {
  return moveFlattenedItemsToParent(generateFlattenedItems(items, flattenedItems, maxDepth, currentDepth, parentText))
}

function generateFlattenedItems(items: OASidebarItem[], flattenedItems: Record<string, OASidebarItem>, maxDepth: number, currentDepth: number, parentText = ''): OASidebarItem[] {
  return items.map((item) => {
    if (item.items) {
      const basePath = parentText + item.text

      if (currentDepth + 1 > maxDepth) {
        item.flattenedItems = Object.keys(flattenedItems)
          .filter(path => path.startsWith(basePath))
          .map((path) => {
            const item = flattenedItems[path]

            return {
              ...item,
              items: item.items?.filter((i: OASidebarItem) => i.isOperation),
            } as OASidebarItem
          })
      } else {
        item.items = generateFlattenedItems(item.items, flattenedItems, maxDepth, currentDepth + 1, basePath)
      }
    }

    return item
  })
}

function moveFlattenedItemsToParent(items: OASidebarItem[], parentText: string = ''): OASidebarItem[] {
  const result: OASidebarItem[] = []

  items.forEach((item) => {
    if (item.flattenedItems) {
      result.push(...item.flattenedItems.map((flattenedItem) => {
        if (flattenedItem.items && item.text !== flattenedItem.text) {
          const basePath = parentText + item.text

          const remainingPath = flattenedItem.path?.replace(basePath, '')

          flattenedItem.text = (item.text || '') + remainingPath
        }

        return flattenedItem
      }))
    } else {
      result.push(item)
    }

    if (item.items) {
      item.items = moveFlattenedItemsToParent(item.items, parentText + item.text)
    }
  })

  return result
}

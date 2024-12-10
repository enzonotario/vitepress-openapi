import type { OASidebarItem } from '../../composables/useSidebar'

/**
 * Recursively merges sidebar groups by combining groups that have only one child
 * and no direct operation links.
 */
export function mergeAdjacentGroups(items: OASidebarItem[]): OASidebarItem[] {
  if (!Array.isArray(items)) {
    return items
  }

  return items.reduce<OASidebarItem[]>((mergedGroups, currentGroup) => {
    // If group has no items, return it as-is.
    if (!currentGroup.items?.length) {
      return [...mergedGroups, currentGroup]
    }

    // Check if the group can be merged (single child, no direct operation links).
    const canMergeGroup
        = currentGroup.items.length === 1
        && !currentGroup.items.some(item => 'link' in item)

    if (canMergeGroup) {
      const childGroup = currentGroup.items[0] as OASidebarItem

      // Recursively process the child group.
      const processedChildGroup = mergeAdjacentGroups([childGroup])[0]

      // Update the child group with merged information.
      processedChildGroup.text = constructMergedGroupText(currentGroup.text as string, processedChildGroup.text as string)
      processedChildGroup.path = processedChildGroup.path || currentGroup.path

      return [...mergedGroups, processedChildGroup]
    }

    // Recursively process nested groups.
    currentGroup.items = mergeAdjacentGroups(currentGroup.items as OASidebarItem[])

    return [...mergedGroups, currentGroup]
  }, [])
}

/**
 * Constructs a merged group text by combining parent and child group texts.
 */
function constructMergedGroupText(parentGroupText: string, childGroupText: string): string {
  // Ensure child text starts with a slash for consistent path-like formatting.
  const formattedChildText = childGroupText.startsWith('/')
    ? childGroupText
    : `/${childGroupText}`

  return parentGroupText + formattedChildText
}

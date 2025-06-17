import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OASidebarItem, SidebarGroupTemplateFn, SidebarItemTemplateFn } from '../../composables/useSidebar'
import { httpVerbs } from '../../index'
import { ensureGroupTextSlashPrefix } from './ensureGroupTextSlashPrefix'
import { flatSidebarItems } from './flatSidebarItems'
import { mergeAdjacentGroups } from './mergeAdjacentGroups'
import { setItemCollapsedState } from './setItemCollapsedState'

export function generateSidebarItemsByPaths({
  paths,
  startsWith = '',
  collapsible = true,
  itemLinkPrefix = '',
  depth = 6,
  sidebarItemTemplate,
  sidebarGroupTemplate,
}: {
  paths: OpenAPIV3.PathsObject
  startsWith?: string
  collapsible?: boolean
  itemLinkPrefix?: string
  depth?: number
  sidebarItemTemplate?: SidebarItemTemplateFn
  sidebarGroupTemplate?: SidebarGroupTemplateFn
} = {
  paths: {},
}): OASidebarItem[] {
  let sidebarItems: OASidebarItem[] = []

  const flattenedSidebarItems: Record<string, OASidebarItem> = {}

  Object.keys(paths)
    .filter(path => path.startsWith(startsWith))
    .forEach((path) => {
      const segments = path.split('/').filter(Boolean)
      let currentGroups = sidebarItems

      segments.forEach((segment, index) => {
        const isLastSegment = index === segments.length - 1
        const fullPath = `/${segments.slice(0, index + 1).join('/')}`

        const group = findOrCreateGroup(currentGroups, segment, fullPath)

        if (isLastSegment) {
          const operationsItems = httpVerbs
            .map((method) => {
              const operation = paths[path] ? paths[path][method] : null

              if (!operation) {
                return null
              }

              return {
                text: sidebarItemTemplate ? sidebarItemTemplate({ method: method as OpenAPIV3.HttpMethods, path: fullPath, title: operation.summary }) : `[${method.toUpperCase()}] ${operation.summary}`,
                link: `${itemLinkPrefix}${operation.operationId}`,
                method,
                path: fullPath,
                isOperation: true,
                operation,
              } as OASidebarItem
            })
            .filter((item): item is OASidebarItem => item !== null)

          group.items = group.items || []
          group.items.push(...operationsItems)

          flattenedSidebarItems[fullPath] = group
        }

        // Move to the next level of hierarchy.
        currentGroups = group.items as OASidebarItem[]
      })
    })

  sidebarItems = mergeAdjacentGroups(sidebarItems)

  sidebarItems = ensureGroupTextSlashPrefix(sidebarItems)

  if (collapsible) {
    sidebarItems = setItemCollapsedState(sidebarItems)
  }

  sidebarItems = flatSidebarItems(sidebarItems, flattenedSidebarItems, depth)

  if (sidebarGroupTemplate) {
    sidebarItems = applySidebarGroupTemplate(sidebarItems, sidebarGroupTemplate)
  }

  return sidebarItems
}

/**
 * Find or create a group in the current hierarchy.
 */
function findOrCreateGroup(
  currentGroups: OASidebarItem[],
  segment: string,
  fullPath: string,
): OASidebarItem {
  let group = currentGroups.find(
    g => g.text === segment && g.path === fullPath,
  ) as OASidebarItem | undefined

  if (!group) {
    group = {
      text: segment,
      path: fullPath,
      items: [],
    }
    currentGroups.push(group)
  }

  return group
}

function applySidebarGroupTemplate(
  sidebarItems: OASidebarItem[],
  sidebarGroupTemplate: SidebarGroupTemplateFn,
  currentDepth: number = 1,
): OASidebarItem[] {
  return sidebarItems.map((item) => {
    if (item.text && item.path && item.items && item.items.length) {
      item.text = sidebarGroupTemplate({ path: item.path, depth: currentDepth })
    }

    if (item.items) {
      item.items = applySidebarGroupTemplate(item.items as OASidebarItem[], sidebarGroupTemplate, currentDepth + 1)
    }

    return item
  })
}

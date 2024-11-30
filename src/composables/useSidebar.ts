import type { OpenAPI, OpenAPIV3 } from '@scalar/openapi-types'
import { OpenApi } from '../lib/OpenApi'
import { httpVerbs } from '../index'
import { prepareOpenAPI } from '../lib/prepareOpenAPI'
import { useOpenapi } from './useOpenapi'
import { useTheme } from './useTheme'

type MethodAliases = Record<string, string>

interface SidebarConfig {
  spec?: OpenAPI.Document | null
  linkPrefix?: string
  tagLinkPrefix?: string
  defaultTag?: string
  methodAliases?: MethodAliases
}

interface SidebarGroupConfig {
  tag: string | string[]
  text?: string
  linkPrefix?: string
  addedOperations?: Set<string>
}

interface SidebarGroupsConfig {
  tags?: string[] | null
  linkPrefix?: string | null
}

interface SidebarItem {
  text: string
  link: string
}

interface SidebarGroup {
  text: string
  items: SidebarItem[]
}

interface OpenAPIOperation extends OpenAPIV3.OperationObject {
  'x-sidebar-title'?: string
  'operationId': string
}

const DEFAULT_CONFIG: Required<Omit<SidebarConfig, 'methodAliases' | 'spec'>> = {
  linkPrefix: '/operations/',
  tagLinkPrefix: '/tags/',
  defaultTag: 'Default',
} as const

export function useSidebar({
  spec,
  linkPrefix = DEFAULT_CONFIG.linkPrefix,
  tagLinkPrefix = DEFAULT_CONFIG.tagLinkPrefix,
  defaultTag = DEFAULT_CONFIG.defaultTag,
  methodAliases,
}: SidebarConfig = {}) {
  useTheme({
    spec: {
      defaultTag,
    },
  })

  const apiSpec = spec || useOpenapi().json

  const openapi = OpenApi({
    spec: apiSpec,
    transformedSpec: prepareOpenAPI(apiSpec),
  })

  function sidebarItemTemplate(method: OpenAPIV3.HttpMethods, title: string): string {
    const resolvedMethod = methodAliases?.[method] || method.toUpperCase()

    return `<span class="OASidebarItem group/oaSidebarItem">
        <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${resolvedMethod}</span>
        <span class="OASidebarItem-text text">${title}</span>
      </span>`
  }

  function generateSidebarItem(
    method: OpenAPIV3.HttpMethods,
    path: string,
    itemLinkPrefix: string = linkPrefix,
  ): SidebarItem | null {
    const operation = openapi.getPaths()?.[path]?.[method] as OpenAPIOperation | undefined

    if (!operation) {
      return null
    }

    const { operationId, summary } = operation
    const sidebarTitle = operation['x-sidebar-title'] || summary || `${method.toUpperCase()} ${path}`

    return {
      text: sidebarItemTemplate(method, sidebarTitle),
      link: `${itemLinkPrefix}${operationId}`,
    }
  }

  function generateSidebarGroup({
    tag,
    text = '',
    linkPrefix: groupLinkPrefix = linkPrefix,
    addedOperations = new Set<string>(),
  }: SidebarGroupConfig): SidebarGroup {
    const paths = openapi.getPaths()

    if (!paths) {
      return {
        text: '',
        items: [],
      }
    }

    const includeTags = Array.isArray(tag) ? tag : [tag]

    const items = Object.entries(paths)
      .flatMap(([path, pathObject]) =>
        httpVerbs
          .map((method) => {
            const operation = pathObject?.[method] as OpenAPIOperation | undefined

            if (!operation || addedOperations.has(operation.operationId)) {
              return null
            }

            const shouldInclude = includeTags.length === 0
              || includeTags.every(tag => operation.tags?.includes(tag))

            if (shouldInclude) {
              addedOperations.add(operation.operationId)
              return generateSidebarItem(method as OpenAPIV3.HttpMethods, path, groupLinkPrefix)
            }

            return null
          })
          .filter((item): item is SidebarItem => item !== null),
      )

    return {
      text: text || includeTags.join(', '),
      items,
    }
  }

  function generateSidebarGroups({
    tags = openapi.getOperationsTags(),
    linkPrefix: groupsLinkPrefix = linkPrefix,
  }: SidebarGroupsConfig = {}): SidebarGroup[] {
    if (!openapi.getPaths()) {
      return []
    }

    const addedOperations = new Set<string>()

    const taggedGroups = (tags ?? []).map(tag =>
      generateSidebarGroup({
        tag,
        text: tag,
        linkPrefix: groupsLinkPrefix || tagLinkPrefix,
        addedOperations,
      }),
    )

    const untaggedGroup = generateSidebarGroup({
      tag: [],
      text: '',
      linkPrefix: groupsLinkPrefix || tagLinkPrefix,
      addedOperations,
    })

    return untaggedGroup.items.length > 0
      ? [...taggedGroups, untaggedGroup]
      : taggedGroups
  }

  function itemsByTags({
    tags = openapi.getFilteredTags().map((tag: OpenAPIV3.TagObject) => tag.name || ''),
    linkPrefix: tagsLinkPrefix = tagLinkPrefix,
  }: SidebarGroupsConfig = {}): SidebarItem[] {
    if (!openapi.getPaths() || !tags) {
      return []
    }

    return tags.map(tag => ({
      text: tag,
      link: `${tagsLinkPrefix}${tag}`,
    }))
  }

  return {
    sidebarItemTemplate,
    generateSidebarItem,
    generateSidebarGroup,
    generateSidebarGroups,
    itemsByTags,
    // TODO: Add `itemsByOperations` function
  }
}
